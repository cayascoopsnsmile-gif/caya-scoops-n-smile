import { doc, getDoc, setDoc } from "firebase/firestore";
import { db, firestoreServerTimestamp } from "@/lib/firebase.js";

export function validatePasswordRules(password) {
  const rules = [];
  if (!/[A-Z]/.test(password)) rules.push("one uppercase letter");
  if (!/[a-z]/.test(password)) rules.push("one lowercase letter");
  if (!/[0-9]/.test(password)) rules.push("one number");
  if (!/[^A-Za-z0-9]/.test(password)) rules.push("one special character");
  if (String(password || "").length < 8) rules.push("at least 8 characters");
  return rules;
}

export function getFriendlyAuthErrorMessage(err, mode = "login") {
  const code = String(err?.code || "").toLowerCase();
  if (
    code.includes("invalid-credential") ||
    code.includes("invalid-login-credentials") ||
    code.includes("wrong-password") ||
    code.includes("user-not-found")
  ) {
    return mode === "signup"
      ? "We couldn't create the account with those details. Please check the email and try again."
      : "That email or password doesn't match a customer login. If this customer was only added in Admin, use Sign Up first with the same email to create the login password.";
  }
  if (code.includes("email-already-in-use")) return "That email already has a login account. Please sign in instead.";
  if (code.includes("invalid-email")) return "Please enter a valid email address.";
  if (code.includes("weak-password")) return "Please choose a stronger password.";
  if (code.includes("too-many-requests")) return "Too many login attempts right now. Please wait a moment and try again.";
  return err?.message || "Something went wrong. Please try again.";
}

export function isPermissionDeniedError(err) {
  return String(err?.code || "").toLowerCase().includes("permission-denied");
}

export function logFirestorePermissionFailure(action, err) {
  console.warn(`[Caya React] Firestore permission denied during ${action}:`, err);
}

export function getReferralCode(email) {
  return `CAYA-${String(email || "SMILE").split("@")[0].replace(/[^a-zA-Z0-9]/g, "").slice(0, 6).toUpperCase()}`;
}

export function getDatePlusDays(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function buildDefaultCustomerProfile(email, referralCodeUsed = "") {
  const normalizedEmail = String(email || "").trim().toLowerCase();
  return {
    allergyNotes: "",
    fullName: "",
    dateOfBirth: "",
    phoneNumber: "",
    address: "",
    email: normalizedEmail,
    favoriteFlavors: "",
    referralCode: getReferralCode(normalizedEmail),
    referralCodeExpiresAt: getDatePlusDays(14),
    referralCodeUsed: referralCodeUsed || "",
    notifyEmail: true,
    notifyWhatsapp: true,
    points: 10,
    loyaltyId: "",
    profileComplete: false,
    storeCredit: 0,
    birthdayRewardRedeemedYear: "",
    createdAt: firestoreServerTimestamp(),
    manualCustomer: false
  };
}

export function buildCustomerProfileWritePayload(profileData = {}) {
  const email = String(profileData.email || "").trim().toLowerCase();
  return {
    email,
    allergyNotes: String(profileData.allergyNotes || ""),
    fullName: String(profileData.fullName || ""),
    dateOfBirth: String(profileData.dateOfBirth || ""),
    phoneNumber: String(profileData.phoneNumber || ""),
    address: String(profileData.address || ""),
    favoriteFlavors: String(profileData.favoriteFlavors || ""),
    loyaltyId: String(profileData.loyaltyId || ""),
    notifyEmail: Boolean(profileData.notifyEmail),
    notifyWhatsapp: Boolean(profileData.notifyWhatsapp),
    referralCodeUsed: String(profileData.referralCodeUsed || ""),
    profileComplete: Boolean(profileData.profileComplete),
    storeCredit: Number(profileData.storeCredit || 0)
  };
}

export async function readCustomerProfileDoc(userId, fallbackData = null, action = "customer profile read") {
  const profileRef = doc(db, "users", userId);
  const profileDoc = await getDoc(profileRef).catch((err) => {
    if (isPermissionDeniedError(err)) {
      logFirestorePermissionFailure(action, err);
      return null;
    }
    throw err;
  });

  if (!profileDoc) return fallbackData;
  return profileDoc.exists() ? profileDoc.data() : fallbackData;
}

export async function writeCustomerProfileDoc(userId, profileData, action = "customer profile write") {
  const safeProfileData = buildCustomerProfileWritePayload(profileData);
  if (!safeProfileData.email) return false;

  return setDoc(doc(db, "users", userId), safeProfileData, { merge: true })
    .then(() => true)
    .catch((err) => {
      if (isPermissionDeniedError(err)) {
        logFirestorePermissionFailure(action, err);
        return false;
      }
      throw err;
    });
}

export async function runOptionalFirestoreAction(action, operation, fallbackValue = false) {
  return operation().catch((err) => {
    if (isPermissionDeniedError(err)) {
      logFirestorePermissionFailure(action, err);
      return fallbackValue;
    }
    throw err;
  });
}
