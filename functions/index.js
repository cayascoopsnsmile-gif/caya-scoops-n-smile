const crypto = require("crypto");
const admin = require("firebase-admin");
const { logger } = require("firebase-functions");
const { onRequest } = require("firebase-functions/v2/https");
const { onSchedule } = require("firebase-functions/v2/scheduler");

admin.initializeApp();

const db = admin.firestore();

const EMAILJS_PUBLIC_KEY = process.env.EMAILJS_PUBLIC_KEY || "PosF-q5b8IUp134rY";
const EMAILJS_SERVICE_ID = process.env.EMAILJS_SERVICE_ID || "service_cu0hh29";
const EMAILJS_BIRTHDAY_TEMPLATE_ID = process.env.EMAILJS_BIRTHDAY_TEMPLATE_ID || "birthday_reward";
const EMAILJS_LOW_STOCK_TEMPLATE_ID = process.env.EMAILJS_LOW_STOCK_TEMPLATE_ID || "low_stock_alert";
const EMAILJS_OWNER_SUMMARY_TEMPLATE_ID = process.env.EMAILJS_OWNER_SUMMARY_TEMPLATE_ID || "owner_daily_summary";
const EMAILJS_REPLY_TO = process.env.EMAILJS_REPLY_TO || "cayascoopsnsmile@gmail.com";
const BUSINESS_PHONE = process.env.BUSINESS_PHONE || "1 (868) 784-4920";
const BUSINESS_EMAIL = process.env.BUSINESS_EMAIL || "cayascoopsnsmile@gmail.com";
const OWNER_EMAIL = process.env.OWNER_EMAIL || "cayascoopsnsmile@gmail.com";
const REWARD_VALID_DAYS = 7;
const TIME_ZONE = "America/Port_of_Spain";
const WIPAY_ACCOUNT_NUMBER = process.env.WIPAY_ACCOUNT_NUMBER || "";
const WIPAY_API_KEY = process.env.WIPAY_API_KEY || "";
const WIPAY_COUNTRY_CODE = process.env.WIPAY_COUNTRY_CODE || "TT";
const WIPAY_CURRENCY = process.env.WIPAY_CURRENCY || "TTD";
const WIPAY_ENVIRONMENT = process.env.WIPAY_ENVIRONMENT || "live";
const WIPAY_FEE_STRUCTURE = process.env.WIPAY_FEE_STRUCTURE || "merchant_absorb";
const WIPAY_ORIGIN = process.env.WIPAY_ORIGIN || "cayascoopsnsmile";
const WIPAY_REQUEST_URL = process.env.WIPAY_REQUEST_URL || "https://tt.wipayfinancial.com/plugins/payments/request";
const WIPAY_ALLOWED_ORIGIN = process.env.WIPAY_ALLOWED_ORIGIN || "https://cayascoopsnsmile.com";
const DEFAULT_ALLOWED_ORIGINS = [
  "https://cayascoopsnsmile.com",
  "https://www.cayascoopsnsmile.com",
  "https://app.cayascoopsnsmile.com",
  "https://pos.cayascoopsnsmile.com",
  "https://admin.cayascoopsnsmile.com",
  "https://caya-scoops-n-smile.pages.dev",
  "https://caya-scoops-n-smile-5026d.web.app",
  "https://caya-scoops-n-smile-5026d.firebaseapp.com"
];
const ALLOWED_CORS_ORIGINS = Array.from(
  new Set(
    [WIPAY_ALLOWED_ORIGIN]
      .concat(String(process.env.ALLOWED_CORS_ORIGINS || "").split(","))
      .concat(DEFAULT_ALLOWED_ORIGINS)
      .map((value) => String(value || "").trim())
      .filter(Boolean)
  )
);
const FIREBASE_ADMIN_SERVICE_ACCOUNT =
  process.env.FIREBASE_ADMIN_SERVICE_ACCOUNT ||
  "firebase-adminsdk-fbsvc@caya-scoops-n-smile-5026d.iam.gserviceaccount.com";
const REFERRAL_REWARD_TYPE = "free_1_scoop_ice_cream";
const REFERRAL_REWARD_OPTIONS = [
  "Free 2 Scoops",
  "Free Chiller",
  "Free Fruit Ice",
  "Free Bubble Tea"
];
const REFERRAL_MINIMUM_SPEND = 25;
const REFERRAL_REWARD_EXPIRY_DAYS = 14;

function getDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function addDays(date, days) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function formatMoney(value) {
  return `$${Number(value || 0).toFixed(2)}`;
}

function originMatchesAllowedOrigin(origin, allowedOrigin) {
  if (!origin || !allowedOrigin) return false;
  try {
    const originUrl = new URL(origin);
    const allowedUrl = new URL(allowedOrigin);
    return originUrl.origin === allowedUrl.origin;
  } catch (error) {
    return false;
  }
}

function getAllowedCorsOrigin(req) {
  const origin = req.get("origin") || "";
  if (!origin || origin === "null") return "null";
  if (ALLOWED_CORS_ORIGINS.some((allowedOrigin) => originMatchesAllowedOrigin(origin, allowedOrigin))) return origin;
  if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(origin)) return origin;
  return WIPAY_ALLOWED_ORIGIN;
}

function setCorsHeaders(req, res) {
  res.set("Access-Control-Allow-Origin", getAllowedCorsOrigin(req));
  res.set("Vary", "Origin");
  res.set("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.set("Access-Control-Allow-Headers", "Content-Type");
}

function handleOptions(req, res) {
  setCorsHeaders(req, res);
  if (req.method === "OPTIONS") {
    res.status(204).send("");
    return true;
  }
  return false;
}

function parseJsonMaybe(value, fallback = {}) {
  if (!value) return fallback;
  if (typeof value === "object") return value;
  try {
    return JSON.parse(value);
  } catch (err) {
    return fallback;
  }
}

function sanitizeWipayOrderId(value) {
  return String(value || "")
    .replace(/[^A-Za-z0-9_-]/g, "")
    .slice(0, 48);
}

function getExpectedWipayHash(transactionId, total) {
  return crypto
    .createHash("md5")
    .update(`${transactionId}${Number(total || 0).toFixed(2)}${WIPAY_API_KEY}`)
    .digest("hex");
}

function getSha256Hex(value) {
  return crypto.createHash("sha256").update(String(value || "")).digest("hex");
}

function getSafeWipayResponseUrl(rawValue) {
  const fallback = `${String(WIPAY_ALLOWED_ORIGIN || "https://cayascoopsnsmile.com").replace(/\/+$/, "")}/`;
  const candidate = String(rawValue || "").trim() || fallback;
  try {
    const parsed = new URL(candidate);
    if (!/^https?:$/i.test(parsed.protocol)) return fallback;
    return `${parsed.origin}/`;
  } catch (error) {
    return fallback;
  }
}

async function getPointsRate() {
  const settingsDoc = await db.collection("settings").doc("business").get().catch(() => null);
  if (settingsDoc?.exists) {
    return Number(settingsDoc.data().pointsRate || 5);
  }
  return 5;
}

function isPaidPaymentStatus(status) {
  const normalized = String(status || "").toLowerCase();
  return normalized === "paid" || normalized === "confirmed";
}

function isSuccessfulPaidCompletedOrder(orderData = {}) {
  const paymentStatus = String(orderData.paymentStatus || "");
  return orderData.status === "Completed" && (isPaidPaymentStatus(paymentStatus) || paymentStatus === "Not Required");
}

function getReferralRewardDocId(referrerEmail, referredEmail) {
  return `${String(referrerEmail || "").toLowerCase()}_${String(referredEmail || "").toLowerCase()}_${REFERRAL_REWARD_TYPE}`
    .replace(/[^a-z0-9_]/g, "_");
}

async function getCustomerEmailProfile(customerEmail) {
  const email = String(customerEmail || "").toLowerCase();
  if (!email) return { email: "", name: "Caya Customer" };

  const [userSnapshot, customerSnapshot] = await Promise.all([
    db.collection("users").where("email", "==", email).limit(1).get().catch(() => null),
    db.collection("customers").where("email", "==", email).limit(1).get().catch(() => null)
  ]);

  const userData = userSnapshot && !userSnapshot.empty ? userSnapshot.docs[0].data() : null;
  const customerData = customerSnapshot && !customerSnapshot.empty ? customerSnapshot.docs[0].data() : null;
  const data = userData || customerData || {};

  return {
    email,
    name: data.fullName || data.name || email
  };
}

async function sendReferralRewardEmailIfConfigured(customerEmail, relatedCustomerEmail, orderTotal, expiryDate) {
  if (!EMAILJS_PUBLIC_KEY || !EMAILJS_SERVICE_ID || !process.env.EMAILJS_REFERRAL_REWARD_TEMPLATE_ID) {
    return false;
  }

  const customer = await getCustomerEmailProfile(customerEmail);
  await sendEmailJsTemplate(process.env.EMAILJS_REFERRAL_REWARD_TEMPLATE_ID, {
    customer_name: customer.name,
    to_email: customer.email,
    reward_name: "FREE 1-scoop ice cream",
    referral_message: "Refer a friend and when they spend $25 or more, you unlock a FREE 1-scoop ice cream on us.",
    qualifying_spend: formatMoney(orderTotal),
    expiry_date: getDateKey(expiryDate),
    related_customer_email: relatedCustomerEmail || ""
  });
  return true;
}

async function createReferralReward(customerEmail, reason, referralLinkId, relatedCustomerEmail, rewardRole, orderTotal, expiryDate) {
  const rewardDocId = getReferralRewardDocId(customerEmail, relatedCustomerEmail);
  const rewardDoc = await db.collection("referralRewards").doc(rewardDocId).get();
  if (rewardDoc.exists) return false;

  await db.collection("referralRewards").doc(rewardDocId).set({
    customerEmail: String(customerEmail || "").toLowerCase(),
    relatedCustomerEmail: String(relatedCustomerEmail || "").toLowerCase(),
    referralLinkId,
    rewardRole,
    rewardType: REFERRAL_REWARD_TYPE,
    rewardName: "FREE 1-scoop ice cream",
    reason,
    options: REFERRAL_REWARD_OPTIONS,
    selectedReward: "",
    status: "Available",
    minimumSpend: REFERRAL_MINIMUM_SPEND,
    qualifyingSpend: Number(orderTotal || 0),
    expiryDate: admin.firestore.Timestamp.fromDate(expiryDate),
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  });
  return true;
}

async function unlockReferralRewardsAfterSpend(customerEmail, orderTotal, qualifyingOrder = {}) {
  const email = String(customerEmail || "").toLowerCase();
  const total = Number(orderTotal || 0);
  if (!email || total < REFERRAL_MINIMUM_SPEND) return;
  if (!isSuccessfulPaidCompletedOrder(qualifyingOrder)) return;

  const snapshot = await db.collection("referralLinks").where("referredEmail", "==", email).get();
  for (const doc of snapshot.docs) {
    const link = doc.data();
    if (link.status === "Rewards Available" || link.status === "Rewards Redeemed") continue;
    if (link.status === "Rewards Email Sending" || link.status === "Expired - No Reward") continue;
    if (Number(link.minimumSpend || REFERRAL_MINIMUM_SPEND) > total) continue;

    await db.collection("referralLinks").doc(doc.id).update({
      status: "Rewards Email Sending",
      qualifyingSpend: total,
      qualifiedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    const rewardExpiryDate = addDays(new Date(), REFERRAL_REWARD_EXPIRY_DAYS);
    let emailSent = false;
    let emailError = "";
    try {
      emailSent = await sendReferralRewardEmailIfConfigured(link.referrerEmail, email, total, rewardExpiryDate);
    } catch (err) {
      emailError = err.message || String(err);
    }

    const rewardCreated = await createReferralReward(
      link.referrerEmail,
      `Referral reward unlocked after ${(link.referredName || email)} spent ${formatMoney(total)}`,
      doc.id,
      email,
      "Referrer",
      total,
      rewardExpiryDate
    );

    await db.collection("referralLinks").doc(doc.id).update({
      status: "Rewards Available",
      qualifyingSpend: total,
      rewardName: "Free 1 Scoop Waffle Cone",
      rewardType: REFERRAL_REWARD_TYPE,
      rewardCreated,
      rewardCustomerEmail: link.referrerEmail,
      qualifyingOrderReference: qualifyingOrder.paymentReference || qualifyingOrder.receiptNumber || "",
      referralRewardEmailSent: emailSent,
      referralRewardEmailError: emailError,
      referralRewardEmailSentAt: emailSent ? admin.firestore.FieldValue.serverTimestamp() : null,
      qualifiedAt: admin.firestore.FieldValue.serverTimestamp()
    });
  }
}

async function markSalesOrderPaymentVerified(paymentReference, transactionId, wipayResponse = {}) {
  const salesSnapshot = await db.collection("sales").where("paymentReference", "==", paymentReference).get();
  if (salesSnapshot.empty) {
    throw new Error("Order not found for payment reference.");
  }

  const batch = db.batch();
  let summaryDoc = null;
  salesSnapshot.forEach(doc => {
    const data = doc.data();
    if (data.product === "Checkout Total") summaryDoc = doc;
    batch.set(doc.ref, {
      paymentStatus: "Confirmed",
      transactionId,
      paidAt: admin.firestore.FieldValue.serverTimestamp(),
      paymentReviewedAt: admin.firestore.FieldValue.serverTimestamp(),
      paymentReviewedBy: "WiPay Verified",
      wipayStatus: wipayResponse.status || "success",
      wipayMessage: wipayResponse.message || "",
      wipayResponse: wipayResponse
    }, { merge: true });
  });
  await batch.commit();

  const paymentRequestRef = db.collection("paymentRequests").doc(paymentReference);
  await paymentRequestRef.set({
    paymentStatus: "Confirmed",
    status: "Paid",
    transactionId,
    verifiedAt: admin.firestore.FieldValue.serverTimestamp(),
    verifiedBy: "WiPay Hosted API",
    wipayResponse
  }, { merge: true });

  if (summaryDoc?.exists) {
    const summary = summaryDoc.data();
    if (!summary.pointsIssued && summary.customerEmail) {
      const pointsRate = await getPointsRate();
      const pointsToIssue = Number(summary.pendingPoints || Math.floor(Number(summary.amount || summary.orderTotal || 0) / pointsRate));
      const userSnapshot = await db.collection("users").where("email", "==", String(summary.customerEmail).toLowerCase()).get();
      for (const userDoc of userSnapshot.docs) {
        const userData = userDoc.data();
        const updatedPoints = Number(userData.points || 0) + pointsToIssue;
        await userDoc.ref.set({ points: updatedPoints }, { merge: true });
        await db.collection("customers").doc(userDoc.id).set({
          name: userData.fullName || userData.name || userData.email,
          email: String(userData.email || "").toLowerCase(),
          points: updatedPoints
        }, { merge: true });
      }
      await summaryDoc.ref.set({ pointsIssued: true, earnedPoints: pointsToIssue }, { merge: true });
    }

    await unlockReferralRewardsAfterSpend(
      summary.customerEmail,
      Number(summary.orderTotal || summary.amount || 0),
      { ...summary, status: "Completed", paymentStatus: "Confirmed" }
    );
  }
}

async function markSalesOrderPaymentFailed(paymentReference, wipayResponse = {}) {
  const salesSnapshot = await db.collection("sales").where("paymentReference", "==", paymentReference).get();
  const batch = db.batch();
  salesSnapshot.forEach(doc => {
    batch.set(doc.ref, {
      paymentStatus: "Failed",
      paymentReviewedAt: admin.firestore.FieldValue.serverTimestamp(),
      paymentReviewedBy: "WiPay Verified",
      wipayStatus: wipayResponse.status || "failed",
      wipayMessage: wipayResponse.message || "",
      wipayResponse
    }, { merge: true });
  });
  await batch.commit();
  await db.collection("paymentRequests").doc(paymentReference).set({
    paymentStatus: "Failed",
    status: "Payment Failed",
    verifiedAt: admin.firestore.FieldValue.serverTimestamp(),
    verifiedBy: "WiPay Hosted API",
    wipayResponse
  }, { merge: true });
}

function createBirthdayRewardCode(date = new Date()) {
  const year = date.getFullYear();
  const suffix = crypto.randomBytes(4).toString("hex").toUpperCase();
  return `CAYA-BDAY-${year}-${suffix}`;
}

function buildQrCodeUrl(value) {
  return `https://quickchart.io/qr?size=260&text=${encodeURIComponent(value)}`;
}

function getMonthDay(value) {
  if (!value) return "";

  if (typeof value.toDate === "function") {
    const date = value.toDate();
    return `${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  }

  const text = String(value).trim();
  const isoMatch = text.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (isoMatch) return `${isoMatch[2]}-${isoMatch[3]}`;

  const date = new Date(text);
  if (Number.isNaN(date.getTime())) return "";
  return `${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function getCustomerName(customer) {
  return customer.name || customer.fullName || customer.email || "Caya Customer";
}

function getCustomerDob(customer) {
  return customer.dob || customer.dateOfBirth || "";
}

async function sendEmailJsTemplate(templateId, templateParams) {
  if (!EMAILJS_PUBLIC_KEY || !EMAILJS_SERVICE_ID || !templateId) {
    throw new Error("EmailJS configuration is missing.");
  }

  const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      service_id: EMAILJS_SERVICE_ID,
      template_id: templateId,
      user_id: EMAILJS_PUBLIC_KEY,
      template_params: templateParams
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`EmailJS send failed: ${response.status} ${errorText}`);
  }
}

function alreadySentThisYear(customer, year) {
  if (Number(customer.birthdayRewardYear || customer.birthdaySentYear || 0) === year) return true;
  return customer.birthdaySent === true && Number(customer.birthdayRewardYear || 0) === year;
}

async function sendBirthdayEmail({ customerName, toEmail, expiryDate, rewardTitle, rewardMessage, qrCode }) {
  await sendEmailJsTemplate(EMAILJS_BIRTHDAY_TEMPLATE_ID, {
    customer_name: customerName,
    to_email: toEmail,
    reward_title: rewardTitle,
    reward_message: rewardMessage,
    expiry_date: getDateKey(expiryDate),
    qr_code: qrCode,
    business_name: "Caya Scoops N Smile",
    business_phone: BUSINESS_PHONE,
    business_email: BUSINESS_EMAIL,
    from_name: "Caya Scoops N Smile",
    reply_to: EMAILJS_REPLY_TO
  });
}

async function getCollectionCount(collectionName) {
  const snapshot = await db.collection(collectionName).get();
  return snapshot.size;
}

async function getDailySalesMetrics(dateKey) {
  const salesSnapshot = await db.collection("sales").where("saleDateKey", "==", dateKey).get();
  const menuSnapshot = await db.collection("menu").get();
  const voidSnapshot = await db.collection("voidRequests").get();

  const orderKeys = new Set();
  let totalSales = 0;
  let cashSales = 0;
  let onlineSales = 0;
  let refunds = 0;
  let pointsIssued = 0;
  const productCounts = {};
  const lowStock = [];
  let pendingVoids = 0;

  salesSnapshot.forEach(doc => {
    const sale = doc.data();
    const orderKey = sale.paymentReference || sale.receiptNumber || doc.id;
    if (sale.product === "Checkout Total") {
      orderKeys.add(orderKey);
      const amount = Number(sale.amount || sale.orderTotal || 0);
      if (sale.status === "Voided" || sale.paymentStatus === "Refunded") refunds += amount;
      else if (sale.paymentMethod === "online") onlineSales += amount;
      else cashSales += amount;
      pointsIssued += Number(sale.earnedPoints || 0);
    } else if (sale.product && !String(sale.product).startsWith("Extra Topping -")) {
      productCounts[sale.product] = (productCounts[sale.product] || 0) + 1;
    }
  });

  menuSnapshot.forEach(doc => {
    const item = doc.data();
    if (!item.isArchived && Number(item.stock ?? 0) <= 5) {
      lowStock.push(`${item.name || doc.id}: ${Number(item.stock ?? 0)}`);
    }
  });

  voidSnapshot.forEach(doc => {
    const row = doc.data();
    if (row.saleDateKey === dateKey && row.status === "Requested") pendingVoids++;
  });

  totalSales = cashSales + onlineSales;
  const bestProduct = Object.entries(productCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A";

  return {
    dateKey,
    totalSales,
    cashSales,
    onlineSales,
    refunds,
    orderCount: orderKeys.size,
    pointsIssued,
    bestProduct,
    lowStock,
    pendingVoids
  };
}

async function getLowStockItems(threshold = 5) {
  const snapshot = await db.collection("menu").get();
  const items = [];
  snapshot.forEach(doc => {
    const item = { id: doc.id, ...doc.data() };
    if (!item.isArchived && Number(item.stock ?? 0) <= threshold) items.push(item);
  });
  return items;
}

async function getExistingBirthdayReward({ customerId, customerEmail, year }) {
  if (customerId) {
    const byCustomerId = await db.collection("rewards")
      .where("rewardType", "==", "birthday")
      .where("customerId", "==", customerId)
      .where("rewardYear", "==", year)
      .limit(1)
      .get();
    if (!byCustomerId.empty) {
      return byCustomerId.docs[0];
    }
  }

  if (customerEmail) {
    const byEmail = await db.collection("rewards")
      .where("rewardType", "==", "birthday")
      .where("customerEmail", "==", customerEmail)
      .where("rewardYear", "==", year)
      .limit(1)
      .get();
    if (!byEmail.empty) {
      return byEmail.docs[0];
    }
  }

  return null;
}

async function createOrReuseBirthdayReward({ userDoc, customer, now, expiryDate, year }) {
  const customerEmail = String(customer.email || "").toLowerCase();
  const existingDoc = await getExistingBirthdayReward({
    customerId: userDoc.id,
    customerEmail,
    year
  });

  if (existingDoc) {
    return {
      id: existingDoc.id,
      ...existingDoc.data()
    };
  }

  const rewardId = db.collection("rewards").doc().id;
  const rewardCode = createBirthdayRewardCode(now);
  const reward = {
    rewardId,
    customerId: userDoc.id,
    customerName: getCustomerName(customer),
    customerEmail,
    rewardType: "birthday",
    rewardTitle: "Free Birthday Item",
    qrCodeValue: rewardCode,
    qrCodeImage: buildQrCodeUrl(rewardCode),
    issuedAt: admin.firestore.Timestamp.fromDate(now),
    expiresAt: admin.firestore.Timestamp.fromDate(expiryDate),
    status: "active",
    redeemedAt: null,
    redeemedBy: "",
    rewardYear: year,
    emailSent: false,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  };

  await db.collection("rewards").doc(rewardId).set(reward);
  return reward;
}

async function markBirthdayRewardSent({ userDoc, customer, now, expiryDate, year, reward }) {
  const email = String(customer.email || "").toLowerCase();
  const name = getCustomerName(customer);
  const dob = getCustomerDob(customer);
  const payload = {
    name,
    email,
    dob,
    birthdaySent: true,
    birthdaySentYear: year,
    birthdayRewardYear: year,
    birthdayRewardDate: admin.firestore.Timestamp.fromDate(now),
    birthdayRewardExpiry: admin.firestore.Timestamp.fromDate(expiryDate),
    birthdayRewardStatus: "Active",
    birthdayRewardName: "1 FREE item of your choice",
    birthdayRewardValidDays: REWARD_VALID_DAYS,
    birthdayRewardId: reward.rewardId || reward.id || "",
    birthdayRewardCode: reward.qrCodeValue || "",
    birthdayRewardQrCodeValue: reward.qrCodeValue || "",
    birthdayRewardQrCodeImage: reward.qrCodeImage || "",
    birthdayRewardUpdatedAt: admin.firestore.FieldValue.serverTimestamp()
  };

  await userDoc.ref.set(payload, { merge: true });
  await db.collection("customers").doc(userDoc.id).set(payload, { merge: true });
  await db.collection("rewards").doc(reward.rewardId || reward.id).set({
    customerId: userDoc.id,
    customerName: name,
    customerEmail: email,
    emailSent: true,
    emailSentAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    status: "active"
  }, { merge: true });
}

async function markBirthdayRewardError({ userDoc, customer, error, year, reward }) {
  const email = String(customer.email || "").toLowerCase();
  const payload = {
    email,
    birthdayRewardYear: year,
    birthdayRewardStatus: "Email Error",
    birthdayRewardError: error.message || String(error),
    birthdayRewardErrorAt: admin.firestore.FieldValue.serverTimestamp()
  };

  await userDoc.ref.set(payload, { merge: true });
  await db.collection("customers").doc(userDoc.id).set(payload, { merge: true });
  if (reward?.rewardId || reward?.id) {
    await db.collection("rewards").doc(reward.rewardId || reward.id).set({
      customerId: userDoc.id,
      customerEmail: email,
      emailSent: false,
      emailError: error.message || String(error),
      emailErrorAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });
  }
}

async function getBirthdayCustomerDocs() {
  const [usersSnapshot, customersSnapshot] = await Promise.all([
    db.collection("users").get(),
    db.collection("customers").get()
  ]);
  const seen = new Set();
  const docs = [];

  for (const doc of [...usersSnapshot.docs, ...customersSnapshot.docs]) {
    const data = doc.data();
    const email = String(data.email || "").toLowerCase();
    const key = email || `${doc.ref.parent.id}/${doc.id}`;
    if (seen.has(key)) continue;
    seen.add(key);
    docs.push(doc);
  }

  return docs;
}

exports.createWipayHostedPayment = onRequest(
  {
    region: "us-central1",
    memory: "256MiB",
    timeoutSeconds: 120
  },
  async (req, res) => {
    if (handleOptions(req, res)) return;
    setCorsHeaders(req, res);

    if (req.method !== "POST") {
      res.status(405).json({ ok: false, message: "Method not allowed." });
      return;
    }

    if (!WIPAY_ACCOUNT_NUMBER || !WIPAY_API_KEY) {
      res.status(500).json({ ok: false, message: "WiPay backend secrets are not configured." });
      return;
    }

    const body = parseJsonMaybe(req.body, req.body || {});
    const orderId = sanitizeWipayOrderId(body.orderId || body.paymentReference);
    const orderTotal = Number(body.orderTotal || 0);
    const customerName = String(body.customerName || "").trim();
    const customerEmail = String(body.customerEmail || "").trim().toLowerCase();
    const customerPhone = String(body.customerPhone || "").trim();
    const responseUrl = getSafeWipayResponseUrl(body.responseUrl);

    if (!orderId || !orderTotal || orderTotal < 1 || !customerEmail || !responseUrl) {
      res.status(400).json({ ok: false, message: "Missing required payment fields." });
      return;
    }

    const paymentRequestDoc = await db.collection("paymentRequests").doc(orderId).get();
    if (!paymentRequestDoc.exists) {
      res.status(404).json({ ok: false, message: "Payment request not found." });
      return;
    }

    const payload = new URLSearchParams({
      account_number: WIPAY_ACCOUNT_NUMBER,
      avs: "0",
      country_code: WIPAY_COUNTRY_CODE,
      currency: WIPAY_CURRENCY,
      environment: WIPAY_ENVIRONMENT,
      fee_structure: WIPAY_FEE_STRUCTURE,
      method: "credit_card",
      order_id: orderId,
      origin: WIPAY_ORIGIN,
      response_url: responseUrl,
      total: orderTotal.toFixed(2),
      email: customerEmail,
      phone: customerPhone,
      name: customerName || customerEmail
    });

    try {
      const response = await fetch(WIPAY_REQUEST_URL, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: payload.toString()
      });

      const text = await response.text();
      let data = {};
      try {
        data = JSON.parse(text);
      } catch (err) {
        data = { raw: text };
      }

      if (!response.ok || !data.url) {
        logger.error("WiPay hosted payment request failed.", {
          status: response.status,
          body: data
        });
        await db.collection("paymentRequests").doc(orderId).set({
          paymentStatus: "Failed",
          status: "Hosted Payment Request Failed",
          hostedPaymentRequestedAt: admin.firestore.FieldValue.serverTimestamp(),
          hostedPaymentError: data.message || text || "WiPay request failed",
          hostedPaymentResponseUrl: responseUrl
        }, { merge: true });
        res.status(502).json({
          ok: false,
          message: data.message || "WiPay did not return a hosted payment URL."
        });
        return;
      }

      await db.collection("paymentRequests").doc(orderId).set({
        paymentMethod: "wipay_hosted",
        paymentStatus: "Pending",
        status: "Redirected to WiPay",
        hostedPaymentUrl: data.url,
        hostedPaymentTransactionId: data.transaction_id || "",
        hostedPaymentRequestedAt: admin.firestore.FieldValue.serverTimestamp(),
        responseUrl,
        hostedPaymentResponseUrl: responseUrl
      }, { merge: true });

      res.json({
        ok: true,
        paymentUrl: data.url,
        transactionId: data.transaction_id || "",
        message: data.message || "Hosted payment URL created."
      });
    } catch (error) {
      logger.error("WiPay hosted payment request exception.", {
        error: error.message || String(error),
        orderId
      });
      res.status(500).json({ ok: false, message: error.message || "Failed to create hosted payment." });
    }
  }
);

exports.verifyWipayHostedPayment = onRequest(
  {
    region: "us-central1",
    memory: "256MiB",
    timeoutSeconds: 120
  },
  async (req, res) => {
    if (handleOptions(req, res)) return;
    setCorsHeaders(req, res);

    if (!["POST", "GET"].includes(req.method)) {
      res.status(405).json({ ok: false, message: "Method not allowed." });
      return;
    }

    if (!WIPAY_API_KEY) {
      res.status(500).json({ ok: false, message: "WiPay API key is not configured on the backend." });
      return;
    }

    const params = {
      ...parseJsonMaybe(req.body, req.body || {}),
      ...req.query
    };
    const orderId = sanitizeWipayOrderId(params.order_id || params.orderId || params.paymentReference);
    const transactionId = String(params.transaction_id || params.transactionId || "").trim();
    const status = String(params.status || "").trim().toLowerCase();
    const hash = String(params.hash || "").trim().toLowerCase();
    const message = String(params.message || params.msg || "").trim();

    if (!orderId) {
      res.status(400).json({ ok: false, message: "Missing order_id." });
      return;
    }

    const paymentRequestDoc = await db.collection("paymentRequests").doc(orderId).get();
    if (!paymentRequestDoc.exists) {
      res.status(404).json({ ok: false, message: "Payment request not found." });
      return;
    }

    const paymentRequest = paymentRequestDoc.data() || {};
    const expectedHash = transactionId ? getExpectedWipayHash(transactionId, paymentRequest.orderTotal || paymentRequest.total || 0) : "";
    const success = status === "success" && !!transactionId && !!hash && hash === expectedHash;

    await db.collection("paymentRequests").doc(orderId).set({
      verificationCheckedAt: admin.firestore.FieldValue.serverTimestamp(),
      verificationStatus: success ? "verified" : "failed",
      verificationMessage: message,
      wipayResponse: params
    }, { merge: true });

    if (success) {
      await markSalesOrderPaymentVerified(orderId, transactionId, params);
      res.json({
        ok: true,
        verified: true,
        orderId,
        transactionId,
        status: "paid",
        message: message || "Payment verified successfully."
      });
      return;
    }

    await markSalesOrderPaymentFailed(orderId, params);
    res.status(200).json({
      ok: true,
      verified: false,
      orderId,
      transactionId,
      status: "failed",
      message: message || "Payment was not verified."
    });
  }
);

exports.staffPortalLogin = onRequest(
  {
    region: "us-central1",
    memory: "256MiB",
    timeoutSeconds: 60,
    serviceAccount: FIREBASE_ADMIN_SERVICE_ACCOUNT
  },
  async (req, res) => {
    if (handleOptions(req, res)) return;
    setCorsHeaders(req, res);

    if (req.method !== "POST") {
      res.status(405).json({ ok: false, message: "Method not allowed." });
      return;
    }

    try {
      const body = parseJsonMaybe(req.body, req.body || {});
      const loginId = String(body.loginId || "").trim().toUpperCase();
      const password = String(body.password || "");
      const requestedRole = String(body.role || "").trim().toLowerCase();

      if (!loginId || !password || !requestedRole) {
        res.status(400).json({
          ok: false,
          code: "missing_fields",
          message: "Login ID, password, and role are required."
        });
        return;
      }

      const snapshot = await db.collection("staffRoles")
        .where("loginId", "==", loginId)
        .limit(1)
        .get();

      if (snapshot.empty) {
        res.status(404).json({
          ok: false,
          code: "not_found",
          message: `${requestedRole === "cashier" ? "Cashier" : "Admin"} Login ID not found.`
        });
        return;
      }

      const doc = snapshot.docs[0];
      const staff = doc.data() || {};
      const staffRole = String(staff.role || "").trim();
      const normalizedStaffRole = staffRole.toLowerCase();
      const isCashierRole = normalizedStaffRole === "cashier";
      const isAdminRole = ["owner", "manager", "admin"].includes(normalizedStaffRole);

      if ((requestedRole === "cashier" && !isCashierRole) || (requestedRole === "admin" && !isAdminRole)) {
        res.status(403).json({
          ok: false,
          code: "wrong_role",
          message: requestedRole === "cashier"
            ? "This Login ID is not assigned to a cashier profile."
            : "This Login ID is not assigned to an admin role."
        });
        return;
      }

      if (staff.active === false) {
        res.status(403).json({
          ok: false,
          code: "inactive",
          message: "This staff profile is inactive."
        });
        return;
      }

      const enteredHash = getSha256Hex(password);
      if (!staff.passwordHash || staff.passwordHash !== enteredHash) {
        res.status(401).json({
          ok: false,
          code: "bad_password",
          message: `Incorrect ${requestedRole === "cashier" ? "cashier" : "admin"} password.`
        });
        return;
      }

      await doc.ref.set({
        lastPortalLoginAt: admin.firestore.FieldValue.serverTimestamp(),
        lastPortalLoginRole: requestedRole,
        loginId
      }, { merge: true });

      const roleClaim = isCashierRole
        ? "cashier"
        : normalizedStaffRole === "owner"
          ? "owner"
          : "admin";
      const staffUid = `staff_${String(doc.id || loginId).replace(/[^a-zA-Z0-9_-]/g, "_")}`;
      const customToken = await admin.auth().createCustomToken(staffUid, {
        role: roleClaim,
        email: String(staff.email || "").toLowerCase(),
        loginId,
        staffDocId: doc.id,
        staffRole: staffRole || (requestedRole === "cashier" ? "Cashier" : "Admin")
      });

      res.json({
        ok: true,
        profile: {
          staffDocId: doc.id,
          email: String(staff.email || "").toLowerCase(),
          displayName: staff.displayName || loginId,
          firstName: String(staff.displayName || loginId).trim().split(/\s+/)[0] || loginId,
          loginId,
          role: staffRole || (requestedRole === "cashier" ? "Cashier" : "Admin"),
          firebaseUid: staffUid,
          customToken
        }
      });
    } catch (error) {
      logger.error("staffPortalLogin failed", error);
      res.status(500).json({
        ok: false,
        code: "server_error",
        message: "Staff login is unavailable right now."
      });
    }
  }
);

exports.sendDailyBirthdayRewards = onSchedule(
  {
    schedule: "0 9 * * *",
    timeZone: TIME_ZONE,
    region: "us-central1",
    memory: "256MiB",
    timeoutSeconds: 540
  },
  async () => {
    const now = new Date();
    const year = now.getFullYear();
    const todayMonthDay = `${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
    const expiryDate = addDays(now, REWARD_VALID_DAYS);

    logger.info("Birthday reward automation started.", {
      todayMonthDay,
      year,
      timeZone: TIME_ZONE
    });

    const customerDocs = await getBirthdayCustomerDocs();
    let checked = 0;
    let sent = 0;
    let skipped = 0;
    let errors = 0;

    for (const userDoc of customerDocs) {
      checked++;
      const customer = userDoc.data();
      const email = String(customer.email || "").toLowerCase();
      const dob = getCustomerDob(customer);

      if (!email || !dob) {
        skipped++;
        continue;
      }

      if (getMonthDay(dob) !== todayMonthDay) {
        skipped++;
        continue;
      }

      if (alreadySentThisYear(customer, year)) {
        skipped++;
        logger.info("Birthday email already sent this year, skipping.", { email, year });
        continue;
      }

      try {
        const reward = await createOrReuseBirthdayReward({
          userDoc,
          customer: { ...customer, email },
          now,
          expiryDate,
          year
        });
        const rewardMessage =
          `Happy Birthday ${getCustomerName(customer)}! You have received 1 FREE item of your choice from Caya Scoops N Smile. ` +
          `Your reward is valid for ${REWARD_VALID_DAYS} days. Present the QR code in this email or use reward code ${reward.qrCodeValue} when redeeming.`;
        await sendBirthdayEmail({
          customerName: getCustomerName(customer),
          toEmail: email,
          expiryDate,
          rewardTitle: "Free Birthday Item",
          rewardMessage,
          qrCode: reward.qrCodeImage || buildQrCodeUrl(reward.qrCodeValue)
        });
        await markBirthdayRewardSent({
          userDoc,
          customer: { ...customer, email },
          now,
          expiryDate,
          year,
          reward
        });
        sent++;
        logger.info("Birthday reward email sent.", { email, year, expiryDate: getDateKey(expiryDate) });
      } catch (error) {
        errors++;
        logger.error("Birthday reward email failed.", { email, error: error.message || String(error) });
        const reward = await createOrReuseBirthdayReward({
          userDoc,
          customer: { ...customer, email },
          now,
          expiryDate,
          year
        });
        await markBirthdayRewardError({
          userDoc,
          customer: { ...customer, email },
          error,
          year,
          reward
        });
      }
    }

    logger.info("Birthday reward automation finished.", {
      checked,
      sent,
      skipped,
      errors
    });
  }
);

exports.sendDailyLowStockAlert = onSchedule(
  {
    schedule: "30 8 * * *",
    timeZone: TIME_ZONE,
    region: "us-central1",
    memory: "256MiB",
    timeoutSeconds: 300
  },
  async () => {
    const todayKey = getDateKey(new Date());
    const threshold = Number(process.env.LOW_STOCK_THRESHOLD || 5);
    const logRef = db.collection("lowStockAlertLogs").doc(`${todayKey}_scheduled_${threshold}`);
    const existingLog = await logRef.get();
    if (existingLog.exists && existingLog.data().emailSent === true) {
      logger.info("Scheduled low stock alert already sent.", { todayKey, threshold });
      return;
    }

    const items = await getLowStockItems(threshold);
    await logRef.set({
      threshold,
      itemCount: items.length,
      items: items.map(item => ({ name: item.name || item.id, stock: Number(item.stock ?? 0) })),
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      source: "scheduled-function"
    }, { merge: true });

    if (!items.length) {
      logger.info("No low stock items found.", { todayKey, threshold });
      return;
    }

    try {
      await sendEmailJsTemplate(EMAILJS_LOW_STOCK_TEMPLATE_ID, {
        to_email: OWNER_EMAIL,
        business_name: "Caya Scoops N Smile",
        threshold: String(threshold),
        item_count: String(items.length),
        low_stock_items: items.map(item => `${item.name || item.id}: ${Number(item.stock ?? 0)}`).join("\n"),
        reply_to: EMAILJS_REPLY_TO
      });
      await logRef.set({
        emailSent: true,
        emailSentAt: admin.firestore.FieldValue.serverTimestamp()
      }, { merge: true });
      logger.info("Scheduled low stock email sent.", { itemCount: items.length });
    } catch (error) {
      await logRef.set({
        emailSent: false,
        error: error.message || String(error),
        errorAt: admin.firestore.FieldValue.serverTimestamp()
      }, { merge: true });
      logger.error("Scheduled low stock email failed.", { error: error.message || String(error) });
    }
  }
);

exports.createDailyBackupSnapshot = onSchedule(
  {
    schedule: "0 2 * * *",
    timeZone: TIME_ZONE,
    region: "us-central1",
    memory: "256MiB",
    timeoutSeconds: 300
  },
  async () => {
    const todayKey = getDateKey(new Date());
    const collections = [
      "users",
      "customers",
      "sales",
      "menu",
      "promos",
      "redemptions",
      "referralLinks",
      "referralRewards",
      "shiftCloseouts",
      "voidRequests",
      "restocks",
      "inventoryAdjustments"
    ];
    const counts = {};
    for (const collectionName of collections) {
      counts[collectionName] = await getCollectionCount(collectionName).catch(error => ({
        error: error.message || String(error)
      }));
    }

    await db.collection("backupLogs").doc(todayKey).set({
      dateKey: todayKey,
      counts,
      status: "Snapshot Created",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      note: "Scheduled backup snapshot records collection counts. Use manual admin backup for full JSON export."
    }, { merge: true });
    logger.info("Daily backup snapshot created.", { todayKey, counts });
  }
);

exports.sendOwnerDailySummary = onSchedule(
  {
    schedule: "0 21 * * *",
    timeZone: TIME_ZONE,
    region: "us-central1",
    memory: "256MiB",
    timeoutSeconds: 300
  },
  async () => {
    const todayKey = getDateKey(new Date());
    const metrics = await getDailySalesMetrics(todayKey);
    const summary =
`Daily Owner Summary
Date: ${todayKey}

Total Sales: $${metrics.totalSales.toFixed(2)}
Cash Sales: $${metrics.cashSales.toFixed(2)}
Online Sales: $${metrics.onlineSales.toFixed(2)}
Refunds/Voids: $${metrics.refunds.toFixed(2)}
Orders: ${metrics.orderCount}
Points Issued: ${metrics.pointsIssued}
Best-Selling Item: ${metrics.bestProduct}
Pending Void Requests: ${metrics.pendingVoids}

Low Stock:
${metrics.lowStock.length ? metrics.lowStock.join("\n") : "No low stock items."}`;

    const logRef = db.collection("ownerSummaryLogs").doc(todayKey);
    try {
      await sendEmailJsTemplate(EMAILJS_OWNER_SUMMARY_TEMPLATE_ID, {
        to_email: OWNER_EMAIL,
        business_name: "Caya Scoops N Smile",
        report_date: todayKey,
        total_sales: `$${metrics.totalSales.toFixed(2)}`,
        cash_sales: `$${metrics.cashSales.toFixed(2)}`,
        online_sales: `$${metrics.onlineSales.toFixed(2)}`,
        refunds: `$${metrics.refunds.toFixed(2)}`,
        order_count: String(metrics.orderCount),
        points_issued: String(metrics.pointsIssued),
        best_product: metrics.bestProduct,
        pending_voids: String(metrics.pendingVoids),
        low_stock_items: metrics.lowStock.length ? metrics.lowStock.join("\n") : "No low stock items.",
        summary,
        reply_to: EMAILJS_REPLY_TO
      });
      await logRef.set({
        ...metrics,
        summary,
        emailSent: true,
        emailSentAt: admin.firestore.FieldValue.serverTimestamp()
      }, { merge: true });
      logger.info("Owner daily summary sent.", { todayKey });
    } catch (error) {
      await logRef.set({
        ...metrics,
        summary,
        emailSent: false,
        error: error.message || String(error),
        errorAt: admin.firestore.FieldValue.serverTimestamp()
      }, { merge: true });
      logger.error("Owner daily summary failed.", { todayKey, error: error.message || String(error) });
    }
  }
);
