import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase.js";
import { isPermissionDeniedError, logFirestorePermissionFailure } from "@/lib/customer-profile.js";

const ANNOUNCEMENT_ICON_MAP = {
  promo: "Sparkles",
  flavor: "IceCream",
  rewards: "Gift",
  general: "Bell"
};

function normalizeAnnouncement(docSnapshot) {
  const data = docSnapshot.data() || {};
  return {
    id: docSnapshot.id,
    body: String(data.body || ""),
    createdAt: data.createdAt || null,
    title: String(data.title || ""),
    type: String(data.type || "General"),
    typeKey: ANNOUNCEMENT_ICON_MAP[String(data.type || "general").trim().toLowerCase()] || ANNOUNCEMENT_ICON_MAP.general
  };
}

export function loadCustomerAnnouncements() {
  return getDocs(collection(db, "announcements"))
    .then((snapshot) => {
      const expiryCutoff = Date.now() - (7 * 24 * 60 * 60 * 1000);
      return snapshot.docs
        .map(normalizeAnnouncement)
        .filter((item) => {
          const createdAtMs = item.createdAt?.seconds ? item.createdAt.seconds * 1000 : 0;
          return !createdAtMs || createdAtMs >= expiryCutoff;
        })
        .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
    })
    .catch((error) => {
      if (isPermissionDeniedError(error)) {
        logFirestorePermissionFailure("customer announcements load", error);
        return [];
      }

      throw error;
    });
}

export function buildCustomerNotifications(profile = {}, wallet = {}) {
  const notifications = [];
  const points = Number(profile.points || 0);
  const tier = String(profile.tier || "").trim();
  const referralCode = String(profile.referralCode || "").trim();
  const birthdayRewardCode = String(profile.birthdayRewardCode || "").trim();
  const storeCredit = Number(wallet.storeCredit || 0);

  if (tier) {
    notifications.push({
      id: "tier",
      title: `${tier} status active`,
      description: "Your customer tier perks are ready for your next order."
    });
  }

  if (points >= 60) {
    notifications.push({
      id: "points",
      title: "Reward ready to redeem",
      description: points >= 100 ? "You have enough points for a free 2 Scoop Cone." : "You have enough points for a free 1 Scoop Cone."
    });
  }

  if (birthdayRewardCode) {
    notifications.push({
      id: "birthday",
      title: "Birthday reward available",
      description: `Code: ${birthdayRewardCode}`
    });
  }

  if (storeCredit > 0) {
    notifications.push({
      id: "credit",
      title: "Store credit waiting",
      description: "Use your available store credit during checkout or support-assisted orders."
    });
  }

  if (referralCode) {
    notifications.push({
      id: "referral",
      title: "Referral code active",
      description: `${referralCode} is ready to share with a friend.`
    });
  }

  if (!notifications.length) {
    notifications.push({
      id: "welcome",
      title: "No new alerts yet",
      description: "Fresh updates, reward unlocks, and order notices will appear here."
    });
  }

  return notifications;
}
