import { addDoc, collection, doc, getDoc, getDocs, query, setDoc, where } from "firebase/firestore";
import { db, firestoreServerTimestamp } from "@/lib/firebase.js";
import { generatePaymentReference } from "@/lib/checkout.js";
import { isPermissionDeniedError, logFirestorePermissionFailure } from "@/lib/customer-profile.js";

function parseGiftCardScanValue(value) {
  return String(value || "").trim().replace(/^CAYA_GIFT_CARD:/i, "").toUpperCase();
}

function buildManualPaymentRequestUrl({ amount, customerName = "", email, reference, settings }) {
  const template = String(settings?.paymentGatewayUrl || "").trim();
  if (!template) return "";

  const params = {
    amount: Number(amount || 0).toFixed(2),
    currency: "TTD",
    customer_name: customerName || email,
    email,
    order_id: reference,
    reference
  };

  if (template.includes("{")) {
    return template
      .replace("{amount}", encodeURIComponent(params.amount))
      .replace("{email}", encodeURIComponent(params.email))
      .replace("{reference}", encodeURIComponent(params.reference))
      .replace("{order_id}", encodeURIComponent(params.order_id))
      .replace("{name}", encodeURIComponent(params.customer_name))
      .replace("{customer_name}", encodeURIComponent(params.customer_name));
  }

  const url = new URL(template);
  Object.entries(params).forEach(([key, value]) => {
    if (value) url.searchParams.set(key, value);
  });
  return url.toString();
}

function permissionSafe(action, operation, fallbackValue = null) {
  return operation().catch((error) => {
    if (isPermissionDeniedError(error)) {
      logFirestorePermissionFailure(action, error);
      return fallbackValue;
    }

    throw error;
  });
}

export function redeemCustomerGiftCard({ code, profile, user }) {
  const normalizedCode = parseGiftCardScanValue(code);
  if (!user?.uid || !user?.email) {
    return Promise.reject(new Error("Please sign in first."));
  }
  if (!normalizedCode) {
    return Promise.reject(new Error("Enter a gift card code first."));
  }

  const directDocRef = doc(db, "giftCards", normalizedCode);

  return permissionSafe("customer gift card direct lookup", () => getDoc(directDocRef)).then((directDoc) => {
    if (directDoc?.exists()) {
      return directDoc;
    }

    return permissionSafe(
      "customer gift card query lookup",
      () => getDocs(query(collection(db, "giftCards"), where("giftCardCode", "==", normalizedCode))),
      null
    ).then((snapshot) => (snapshot && !snapshot.empty ? snapshot.docs[0] : null));
  }).then((giftCardDoc) => {
    if (!giftCardDoc?.exists?.() && !giftCardDoc?.id) {
      throw new Error("Gift card invalid, unpaid, inactive, or already redeemed.");
    }

    const giftCard = giftCardDoc.data() || {};
    const amount = Number(giftCard.balance || giftCard.amount || 0);
    if (!amount || String(giftCard.status || "").toLowerCase() !== "active" || giftCard.redeemed) {
      throw new Error("Gift card invalid, unpaid, inactive, or already redeemed.");
    }

    const nextStoreCredit = Number(profile?.storeCredit || 0) + amount;

    return setDoc(
      doc(db, "users", user.uid),
      {
        email: String(user.email || "").trim().toLowerCase(),
        storeCredit: nextStoreCredit
      },
      { merge: true }
    )
      .then(() =>
        setDoc(
          doc(db, "giftCards", giftCardDoc.id),
          {
            balance: 0,
            redeemed: true,
            redeemedAt: firestoreServerTimestamp(),
            redeemedBy: String(user.email || "").trim().toLowerCase(),
            status: "redeemed"
          },
          { merge: true }
        )
      )
      .then(() => ({
        amount,
        nextStoreCredit
      }));
  });
}

export function requestCustomerGiftCardPurchase({ amount, profile, recipientName, settings, user }) {
  const numericAmount = Number(amount || 0);
  if (!user?.uid || !user?.email) {
    return Promise.reject(new Error("Please sign in first."));
  }
  if (!numericAmount || numericAmount <= 0) {
    return Promise.reject(new Error("Enter gift card amount."));
  }

  const normalizedEmail = String(user.email || "").trim().toLowerCase();
  const giftCardId = doc(collection(db, "giftCards")).id;
  const paymentReference = generatePaymentReference();
  const customerName = String(recipientName || profile?.fullName || normalizedEmail).trim();

  const giftCardRecord = {
    amount: numericAmount,
    balance: 0,
    createdAt: firestoreServerTimestamp(),
    customerEmail: normalizedEmail,
    customerName,
    giftCardCode: "",
    giftCardId,
    paymentMethod: "online",
    paymentReference,
    paymentStatus: "Pending",
    purchaseDate: firestoreServerTimestamp(),
    qrCode: "",
    qrData: "",
    recipientName: customerName,
    redeemed: false,
    redeemedAt: null,
    redeemedBy: "",
    status: "pending"
  };

  const manualPaymentUrl = buildManualPaymentRequestUrl({
    amount: numericAmount,
    customerName,
    email: normalizedEmail,
    reference: paymentReference,
    settings
  });

  return Promise.all([
    setDoc(doc(db, "giftCards", giftCardId), giftCardRecord),
    setDoc(
      doc(db, "giftCardRequests", giftCardId),
      {
        amount: numericAmount,
        createdAt: firestoreServerTimestamp(),
        customerEmail: normalizedEmail,
        giftCardId,
        paymentReference,
        paymentStatus: "Pending",
        recipient: customerName,
        status: "Pending Payment"
      },
      { merge: true }
    ),
    setDoc(
      doc(db, "paymentRequests", paymentReference),
      {
        createdAt: firestoreServerTimestamp(),
        currency: "TTD",
        customerEmail: normalizedEmail,
        gatewayName: "Manual Payment",
        giftCardId,
        paymentMethod: "online",
        paymentReference,
        status: "Pending",
        total: numericAmount,
        type: "gift_card"
      },
      { merge: true }
    )
  ]).then(() => ({
    manualPaymentUrl,
    paymentReference
  }));
}

export function buildReferralWhatsappUrl({ expiryText, referralCode }) {
  const cleanCode = String(referralCode || "").trim();
  if (!cleanCode) return "";

  const text = `Refer a friend and when they spend $25 or more, you unlock a FREE 1-scoop ice cream on us. My Caya Scoops N Smile referral code is ${cleanCode}. ${String(expiryText || "").trim()}`.trim();
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}

export function buildFavoriteTreatWhatsappUrl(favoriteFlavors) {
  const favorite = String(favoriteFlavors || "").trim() || "Caya Scoops N Smile";
  return `https://wa.me/?text=${encodeURIComponent(`My favorite Caya treat is: ${favorite}`)}`;
}
