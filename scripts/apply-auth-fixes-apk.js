const fs = require("fs");
const path = require("path");

const files = [
  "customer-apk.html",
  "cloudflare-pages/customer-apk.html"
];

function replaceRegexOrThrow(source, regex, replacement, label, file) {
  if (!regex.test(source)) {
    throw new Error(`Could not find ${label} in ${file}`);
  }
  return source.replace(regex, replacement);
}

const replacements = [
  {
    label: "getStaffRole block",
    regex: /async function getStaffRole\(email\) \{[\s\S]*?\r?\n\}\r?\n(?=\r?\nasync function getCashierDisplayName)/,
    replacement: `async function getStaffRole(email) {
  const normalizedEmail = (email || "").toLowerCase();
  if (!normalizedEmail) return "";
  try {
    const doc = await db.collection("staffRoles").doc(normalizedEmail).get();
    if (doc.exists) return doc.data().role || "";
    const snapshot = await db.collection("staffRoles").where("email", "==", normalizedEmail).limit(1).get();
    return snapshot.empty ? "" : (snapshot.docs[0].data().role || "");
  } catch (err) {
    if (String(err?.code || "").includes("permission-denied")) {
      return "";
    }
    throw err;
  }
}

function normalizeStaffRoleValue(role = "") {
  return String(role || "").trim().toLowerCase();
}

function isCashierStaffRole(role = "") {
  return normalizeStaffRoleValue(role) === "cashier";
}

function isAdminStaffRole(role = "") {
  return ["owner", "admin", "manager"].includes(normalizeStaffRoleValue(role));
}

async function getStaffClaimsProfile(user) {
  if (!user) return null;
  try {
    const tokenResult = await user.getIdTokenResult();
    const claims = tokenResult?.claims || {};
    const claimedRole = claims.staffRole || claims.role || "";
    if (!isCashierStaffRole(claimedRole) && !isAdminStaffRole(claimedRole)) {
      return null;
    }
    const email = String(claims.email || user.email || "").toLowerCase();
    const displayName = claims.displayName || user.displayName || email || "Staff";
    return {
      staffDocId: claims.staffDocId || "",
      email,
      displayName,
      firstName: getFirstName(displayName),
      loginId: claims.loginId || "",
      role: claimedRole || "Cashier",
      firebaseUid: user.uid || ""
    };
  } catch (err) {
    console.log("Staff claims unavailable:", err);
    return null;
  }
}`
  },
  {
    label: "getCashierDisplayName block",
    regex: /async function getCashierDisplayName\(user\) \{[\s\S]*?\r?\n\}\r?\n(?=\r?\nasync function getCashierProfile)/,
    replacement: `async function getCashierDisplayName(user) {
  const email = user.email.toLowerCase();
  try {
    const staffDoc = await db.collection("staffRoles").doc(email).get();
    if (staffDoc.exists && staffDoc.data().displayName) return staffDoc.data().displayName;
    const staffSnapshot = await db.collection("staffRoles").where("email", "==", email).limit(1).get();
    if (!staffSnapshot.empty && staffSnapshot.docs[0].data().displayName) {
      return staffSnapshot.docs[0].data().displayName;
    }
  } catch (err) {
    if (!String(err?.code || "").includes("permission-denied")) {
      throw err;
    }
  }

  const userDoc = await db.collection("users").doc(user.uid).get();
  if (userDoc.exists && userDoc.data().fullName) return userDoc.data().fullName;

  const userSnapshot = await db.collection("users").where("email", "==", email).get();
  if (!userSnapshot.empty && userSnapshot.docs[0].data().fullName) {
    return userSnapshot.docs[0].data().fullName;
  }

  return email;
}`
  },
  {
    label: "getCashierProfile block",
    regex: /async function getCashierProfile\(user\) \{[\s\S]*?\r?\n\}\r?\n(?=\r?\nasync function cashierIdLogin)/,
    replacement: `async function getCashierProfile(user) {
  const email = user.email.toLowerCase();
  const claimsProfile = await getStaffClaimsProfile(user);
  let staffDocId = claimsProfile?.staffDocId || "";
  let staffData = {};

  try {
    let staffDoc = null;
    if (staffDocId) {
      staffDoc = await db.collection("staffRoles").doc(staffDocId).get();
    }
    if (!staffDoc || !staffDoc.exists) {
      staffDoc = await db.collection("staffRoles").doc(email).get();
      if (staffDoc.exists) staffDocId = staffDoc.id;
    }
    if ((!staffDoc || !staffDoc.exists) && email) {
      const snapshot = await db.collection("staffRoles").where("email", "==", email).limit(1).get();
      if (!snapshot.empty) {
        staffDoc = snapshot.docs[0];
        staffDocId = staffDoc.id;
      }
    }
    staffData = staffDoc?.exists ? staffDoc.data() : {};
  } catch (err) {
    if (!String(err?.code || "").includes("permission-denied")) {
      throw err;
    }
  }

  const displayName = staffData.displayName || await getCashierDisplayName(user);
  let loginId = staffData.loginId || claimsProfile?.loginId || "";

  if (!loginId && staffDocId) {
    loginId = generateStaffLoginId(displayName, email);
    await db.collection("staffRoles").doc(staffDocId).set({ loginId, displayName, email }, { merge: true });
  }

  return {
    staffDocId,
    email,
    displayName,
    firstName: getFirstName(displayName),
    loginId
  };
}`
  },
  {
    label: "cashier login block",
    regex: /async function cashierIdLogin\(\) \{[\s\S]*?\r?\n\}\r?\n(?=\r?\nasync function adminIdLogin)/,
    replacement: `async function cashierIdLogin() {
  if (isCustomerOnlyAndroidApp()) {
    alert("Cashier access is not available in the Play Store customer app.");
    return;
  }
  const loginId = document.getElementById("cashierLoginIdInput").value.trim().toUpperCase();
  const password = document.getElementById("cashierLoginPassword").value;
  const msg = document.getElementById("cashierLoginMsg");

  if (!loginId || !password) {
    msg.innerText = "Enter cashier Login ID and password.";
    return;
  }

  try {
    const profile = await verifyStaffPortalLogin(loginId, password, "cashier");
    cashierSession = {
      staffDocId: profile.staffDocId || "",
      email: profile.email || "",
      displayName: profile.displayName || loginId,
      firstName: profile.firstName || getFirstName(profile.displayName || loginId),
      loginId: profile.loginId || loginId,
      role: profile.role || "Cashier",
      firebaseUid: profile.firebaseUid || "",
      customToken: profile.customToken || ""
    };
  } catch (error) {
    msg.innerText = error.message || "Cashier login is unavailable right now.";
    return;
  }

  currentCashierSessionLogId = await recordCashierLogin(cashierSession);
  cashierSession.sessionLogId = currentCashierSessionLogId;
  currentCashierName = cashierSession.displayName;
  currentCashierFirstName = cashierSession.firstName;
  currentCashierLoginId = cashierSession.loginId;
  document.getElementById("cashierLoginPassword").value = "";
  msg.innerText = "";
  await logCashierActivity("Login", { sessionLogId: currentCashierSessionLogId });

  if (!cashierSession.customToken) {
    await showCashierDashboard(null, "Cashier", cashierSession);
    return;
  }

  try {
    await auth.signInWithCustomToken(cashierSession.customToken);
  } catch (error) {
    console.error("[Caya APK] Cashier custom-token login failed:", error);
    await showCashierDashboard(null, "Cashier", cashierSession);
  }
}`
  },
  {
    label: "admin login block",
    regex: /async function adminIdLogin\(\) \{[\s\S]*?\r?\n\}\r?\n(?=\r?\nfunction requestStaffPasswordReset)/,
    replacement: `async function adminIdLogin() {
  if (isCustomerOnlyAndroidApp()) {
    alert("Admin access is not available in the Play Store customer app.");
    return;
  }
  const loginId = document.getElementById("adminLoginIdInput").value.trim().toUpperCase();
  const password = document.getElementById("adminLoginPassword").value;
  const msg = document.getElementById("adminLoginMsg");

  if (!loginId || !password) {
    msg.innerText = "Enter admin Login ID and password.";
    return;
  }

  try {
    const profile = await verifyStaffPortalLogin(loginId, password, "admin");
    adminSession = {
      staffDocId: profile.staffDocId || "",
      email: profile.email || "",
      displayName: profile.displayName || loginId,
      firstName: profile.firstName || getFirstName(profile.displayName || loginId),
      loginId: profile.loginId || loginId,
      role: profile.role || "Owner",
      firebaseUid: profile.firebaseUid || "",
      customToken: profile.customToken || ""
    };
  } catch (error) {
    msg.innerText = error.message || "Admin login is unavailable right now.";
    return;
  }

  document.getElementById("adminLoginPassword").value = "";
  msg.innerText = "";

  if (!adminSession.customToken) {
    await showAdminDashboard(null, adminSession);
    return;
  }

  try {
    await auth.signInWithCustomToken(adminSession.customToken);
  } catch (error) {
    console.error("[Caya APK] Admin custom-token login failed:", error);
    await showAdminDashboard(null, adminSession);
  }
}`
  },
  {
    label: "verifyStaffPortalLogin fetch block",
    regex: /  const response = await fetch\(STAFF_PORTAL_LOGIN_ENDPOINT, \{[\s\S]*?  \}\);\r?\n/,
    replacement: `  let response;
  try {
    response = await fetch(STAFF_PORTAL_LOGIN_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ loginId, password, role })
    });
  } catch (error) {
    console.error("[Caya APK] Staff portal login request failed:", error);
    throw new Error("Staff login could not reach the server. Please refresh and try again.");
  }
`
  },
  {
    label: "getPortalMode block",
    regex: /function getPortalMode\(\) \{[\s\S]*?\r?\n\}\r?\n(?=\r?\nfunction isCustomerOnlyAndroidApp)/,
    replacement: `function getPortalMode() {
  const params = new URLSearchParams(window.location.search);
  const forcedPortal = String(params.get("portal") || "").toLowerCase();
  if (forcedPortal === "pos" || forcedPortal === "admin") return "pos";
  if (forcedPortal === "customer" || forcedPortal === "customerapp") return "customer";
  const host = window.location.hostname.toLowerCase();
  if (host.startsWith("pos.") || host.startsWith("admin.")) return "pos";
  if (host.startsWith("app.")) return "customer";
  return "public";
}`
  },
  {
    label: "login cashier role check",
    regex: /    if \(staffRole === "Cashier"\) \{\r?\n      await showCashierDashboard\(user, staffRole\);\r?\n      return;\r?\n    \}\r?\n/,
    replacement: `    if (isCashierStaffRole(staffRole)) {
      await showCashierDashboard(user, staffRole);
      return;
    }
`
  },
  {
    label: "showCashierDashboard profile line",
    regex: /  const cashierProfile = profileOverride \|\| await getCashierProfile\(user\);\r?\n/,
    replacement: `  const cashierProfile = profileOverride || await getStaffClaimsProfile(user) || await getCashierProfile(user);
`
  },
  {
    label: "showAdminDashboard declaration",
    regex: /function showAdminDashboard\(user, profileOverride = null\) \{\r?\n/,
    replacement: `async function showAdminDashboard(user, profileOverride = null) {
`
  },
  {
    label: "showAdminDashboard profile line",
    regex: /  const profile = profileOverride \|\| \{\r?\n/,
    replacement: `  const profile = profileOverride || await getStaffClaimsProfile(user) || {
`
  },
  {
    label: "auth state restore block",
    regex: /    if \(!user\) \{\r?\n      await loadBusinessSettings\(\);\r?\n      return;\r?\n    \}\r?\n\r?\n    if \(isAdminEmail\(user\.email\)\) \{\r?\n/,
    replacement: `    if (!user) {
      await loadBusinessSettings();
      return;
    }

    const activeStaffSession = getActiveStaffSession?.();
    if (activeStaffSession?.type === "admin") {
      await showAdminDashboard(user, activeStaffSession.profile);
      return;
    }
    if (activeStaffSession?.type === "cashier") {
      await showCashierDashboard(user, activeStaffSession.profile.role || "Cashier", activeStaffSession.profile);
      return;
    }

    const staffClaimsProfile = await getStaffClaimsProfile(user);
    if (staffClaimsProfile && isAdminStaffRole(staffClaimsProfile.role)) {
      await showAdminDashboard(user, staffClaimsProfile);
      return;
    }
    if (staffClaimsProfile && isCashierStaffRole(staffClaimsProfile.role)) {
      await showCashierDashboard(user, staffClaimsProfile.role || "Cashier", staffClaimsProfile);
      return;
    }

    if (isAdminEmail(user.email)) {
`
  }
];

for (const relativePath of files) {
  const fullPath = path.join(process.cwd(), relativePath);
  let source = fs.readFileSync(fullPath, "latin1");
  for (const replacement of replacements) {
    source = replaceRegexOrThrow(
      source,
      replacement.regex,
      replacement.replacement,
      replacement.label,
      relativePath
    );
  }
  source = source.replace(
    "    const activeStaffSession = getActiveStaffSession?.();",
    "    const activeStaffSession = typeof getActiveStaffSession === \"function\" ? getActiveStaffSession() : null;"
  );
  fs.writeFileSync(fullPath, source, "latin1");
  console.log(`Updated ${relativePath}`);
}
