const fs = require("fs");
const path = require("path");

const files = [
  "index.html",
  "customer-apk.html",
  "cloudflare-pages/index.html",
  "cloudflare-pages/customer-apk.html"
];

function replaceOrThrow(source, search, replacement, label, file) {
  if (!source.includes(search)) {
    throw new Error(`Could not find ${label} in ${file}`);
  }
  return source.replace(search, replacement);
}

function replaceRegexOrThrow(source, regex, replacement, label, file) {
  if (!regex.test(source)) {
    throw new Error(`Could not find ${label} in ${file}`);
  }
  return source.replace(regex, replacement);
}

const getStaffRoleOld = `async function getStaffRole(email) {
  const normalizedEmail = (email || "").toLowerCase();
  if (!normalizedEmail) return "";
  try {
    const doc = await db.collection("staffRoles").doc(normalizedEmail).get();
    return doc.exists ? (doc.data().role || "") : "";
  } catch (err) {
    if (String(err?.code || "").includes("permission-denied")) {
      return "";
    }
    throw err;
  }
}
`;

const getStaffRoleNew = `async function getStaffRole(email) {
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
}
`;

const getCashierDisplayNameOld = `async function getCashierDisplayName(user) {
  const email = user.email.toLowerCase();
  const staffDoc = await db.collection("staffRoles").doc(email).get();
  if (staffDoc.exists && staffDoc.data().displayName) return staffDoc.data().displayName;

  const userDoc = await db.collection("users").doc(user.uid).get();
  if (userDoc.exists && userDoc.data().fullName) return userDoc.data().fullName;

  const userSnapshot = await db.collection("users").where("email", "==", email).get();
  if (!userSnapshot.empty && userSnapshot.docs[0].data().fullName) {
    return userSnapshot.docs[0].data().fullName;
  }

  return email;
}
`;

const getCashierDisplayNameNew = `async function getCashierDisplayName(user) {
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
}
`;

const getCashierProfileOld = `async function getCashierProfile(user) {
  const email = user.email.toLowerCase();
  const staffDoc = await db.collection("staffRoles").doc(email).get();
  const staffData = staffDoc.exists ? staffDoc.data() : {};
  const displayName = staffData.displayName || await getCashierDisplayName(user);
  let loginId = staffData.loginId || "";

  if (!loginId) {
    loginId = generateStaffLoginId(displayName, email);
    await db.collection("staffRoles").doc(email).set({ loginId, displayName, email }, { merge: true });
  }

  return {
    displayName,
    firstName: getFirstName(displayName),
    loginId
  };
}
`;

const getCashierProfileNew = `async function getCashierProfile(user) {
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
}
`;

const staffFetchOld = `  const response = await fetch(STAFF_PORTAL_LOGIN_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ loginId, password, role })
  });
`;

const staffFetchNew = `  let response;
  try {
    response = await fetch(STAFF_PORTAL_LOGIN_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ loginId, password, role })
    });
  } catch (error) {
    console.error("[Caya] Staff portal login request failed:", error);
    throw new Error("Staff login could not reach the server. Please refresh and try again.");
  }
`;

const staffFetchApkNew = `  let response;
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
`;

const cashierTokenOld = `  await auth.signInWithCustomToken(cashierSession.customToken);
`;

const cashierTokenNew = `  try {
    await auth.signInWithCustomToken(cashierSession.customToken);
  } catch (error) {
    console.error("[Caya] Cashier custom-token login failed:", error);
    cashierSession = null;
    currentCashierSessionLogId = "";
    msg.innerText = "Cashier login could not finish. Please refresh and try again.";
  }
`;

const cashierTokenApkNew = `  try {
    await auth.signInWithCustomToken(cashierSession.customToken);
  } catch (error) {
    console.error("[Caya APK] Cashier custom-token login failed:", error);
    cashierSession = null;
    currentCashierSessionLogId = "";
    msg.innerText = "Cashier login could not finish. Please refresh and try again.";
  }
`;

const adminTokenOld = `  await auth.signInWithCustomToken(adminSession.customToken);
`;

const adminTokenNew = `  try {
    await auth.signInWithCustomToken(adminSession.customToken);
  } catch (error) {
    console.error("[Caya] Admin custom-token login failed:", error);
    adminSession = null;
    msg.innerText = "Admin login could not finish. Please refresh and try again.";
  }
`;

const adminTokenApkNew = `  try {
    await auth.signInWithCustomToken(adminSession.customToken);
  } catch (error) {
    console.error("[Caya APK] Admin custom-token login failed:", error);
    adminSession = null;
    msg.innerText = "Admin login could not finish. Please refresh and try again.";
  }
`;

const portalModeOld = `function getPortalMode() {
  const params = new URLSearchParams(window.location.search);
  const forcedPortal = String(params.get("portal") || "").toLowerCase();
  if (forcedPortal === "pos") return "pos";
  if (forcedPortal === "customer" || forcedPortal === "customerapp") return "customer";
  const host = window.location.hostname.toLowerCase();
  if (host.startsWith("pos.")) return "pos";
  if (host.startsWith("app.")) return "customer";
  return "public";
}
`;

const portalModeNew = `function getPortalMode() {
  const params = new URLSearchParams(window.location.search);
  const forcedPortal = String(params.get("portal") || "").toLowerCase();
  if (forcedPortal === "pos" || forcedPortal === "admin") return "pos";
  if (forcedPortal === "customer" || forcedPortal === "customerapp") return "customer";
  const host = window.location.hostname.toLowerCase();
  if (host.startsWith("pos.") || host.startsWith("admin.")) return "pos";
  if (host.startsWith("app.")) return "customer";
  return "public";
}
`;

const cashierRoleCheckOld = `    if (staffRole === "Cashier") {
      await showCashierDashboard(user, staffRole);
      return;
    }
`;

const cashierRoleCheckNew = `    if (isCashierStaffRole(staffRole)) {
      await showCashierDashboard(user, staffRole);
      return;
    }
`;

const showCashierDashboardOld = `  const cashierProfile = profileOverride || await getCashierProfile(user);
`;

const showCashierDashboardNew = `  const cashierProfile = profileOverride || await getStaffClaimsProfile(user) || await getCashierProfile(user);
`;

const showAdminDeclOld = `function showAdminDashboard(user, profileOverride = null) {
`;

const showAdminDeclNew = `async function showAdminDashboard(user, profileOverride = null) {
`;

const showAdminProfileOld = `  const profile = profileOverride || {
`;

const showAdminProfileNew = `  const profile = profileOverride || await getStaffClaimsProfile(user) || {
`;

const authStateChunkOld = `    const activeStaffSession = getActiveStaffSession();
    if (activeStaffSession?.type === "admin") {
      await showAdminDashboard(user, activeStaffSession.profile);
      return;
    }
    if (activeStaffSession?.type === "cashier") {
      await showCashierDashboard(user, activeStaffSession.profile.role || "Cashier", activeStaffSession.profile);
      return;
    }

    if (isAdminEmail(user.email)) {
`;

const authStateChunkNew = `    const activeStaffSession = getActiveStaffSession();
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
`;

const authStateNoSessionOld = `    if (isAdminEmail(user.email)) {
      await showAdminDashboard(user);
      return;
    }

    const staffRole = await getStaffRole(user.email);
    if (staffRole === "Cashier") {
      await showCashierDashboard(user, staffRole);
      return;
    }
`;

const authStateNoSessionNew = `    if (isAdminEmail(user.email)) {
      await showAdminDashboard(user);
      return;
    }

    const staffRole = await getStaffRole(user.email);
    if (isCashierStaffRole(staffRole)) {
      await showCashierDashboard(user, staffRole);
      return;
    }
`;

for (const relativePath of files) {
  const fullPath = path.join(process.cwd(), relativePath);
  let source = fs.readFileSync(fullPath, "latin1");
  const isApk = relativePath.toLowerCase().includes("customer-apk");

  source = replaceRegexOrThrow(
    source,
    /async function getStaffRole\(email\) \{[\s\S]*?\r?\n\}\r?\n(?=\r?\nasync function getCashierDisplayName)/,
    getStaffRoleNew.trimEnd(),
    "getStaffRole block",
    relativePath
  );
  source = replaceRegexOrThrow(
    source,
    /async function getCashierDisplayName\(user\) \{[\s\S]*?\r?\n\}\r?\n(?=\r?\nasync function getCashierProfile)/,
    getCashierDisplayNameNew.trimEnd(),
    "getCashierDisplayName block",
    relativePath
  );
  source = replaceRegexOrThrow(
    source,
    /async function getCashierProfile\(user\) \{[\s\S]*?\r?\n\}\r?\n(?=\r?\nasync function cashierIdLogin)/,
    getCashierProfileNew.trimEnd(),
    "getCashierProfile block",
    relativePath
  );
  source = replaceRegexOrThrow(
    source,
    /  const response = await fetch\(STAFF_PORTAL_LOGIN_ENDPOINT, \{[\s\S]*?  \}\);\r?\n/,
    isApk ? staffFetchApkNew : staffFetchNew,
    "verifyStaffPortalLogin fetch block",
    relativePath
  );
  source = replaceRegexOrThrow(
    source,
    /  await auth\.signInWithCustomToken\(cashierSession\.customToken\);\r?\n/,
    isApk ? cashierTokenApkNew : cashierTokenNew,
    "cashier custom token call",
    relativePath
  );
  source = replaceRegexOrThrow(
    source,
    /  await auth\.signInWithCustomToken\(adminSession\.customToken\);\r?\n/,
    isApk ? adminTokenApkNew : adminTokenNew,
    "admin custom token call",
    relativePath
  );
  source = replaceRegexOrThrow(
    source,
    /function getPortalMode\(\) \{[\s\S]*?\r?\n\}\r?\n(?=\r?\nfunction isCustomerOnlyAndroidApp)/,
    portalModeNew.trimEnd(),
    "getPortalMode block",
    relativePath
  );
  source = replaceRegexOrThrow(
    source,
    /    if \(staffRole === "Cashier"\) \{\r?\n      await showCashierDashboard\(user, staffRole\);\r?\n      return;\r?\n    \}\r?\n/,
    cashierRoleCheckNew,
    "cashier role check",
    relativePath
  );
  source = replaceRegexOrThrow(
    source,
    /  const cashierProfile = profileOverride \|\| await getCashierProfile\(user\);\r?\n/,
    showCashierDashboardNew,
    "showCashierDashboard profile line",
    relativePath
  );
  source = replaceRegexOrThrow(
    source,
    /function showAdminDashboard\(user, profileOverride = null\) \{\r?\n/,
    showAdminDeclNew,
    "showAdminDashboard declaration",
    relativePath
  );
  source = replaceRegexOrThrow(
    source,
    /  const profile = profileOverride \|\| \{\r?\n/,
    showAdminProfileNew,
    "showAdminDashboard profile line",
    relativePath
  );

  if (source.includes("const activeStaffSession = getActiveStaffSession();")) {
    source = replaceRegexOrThrow(
      source,
      /    const activeStaffSession = getActiveStaffSession\(\);[\s\S]*?    if \(isAdminEmail\(user\.email\)\) \{\r?\n/,
      authStateChunkNew,
      "auth state active session block",
      relativePath
    );
  } else {
    source = replaceRegexOrThrow(
      source,
      /    if \(!user\) \{\r?\n      await loadBusinessSettings\(\);\r?\n      return;\r?\n    \}\r?\n\r?\n    if \(isAdminEmail\(user\.email\)\) \{\r?\n/,
      `    if (!user) {
      await loadBusinessSettings();
      return;
    }

    const activeStaffSession = getActiveStaffSession();
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
`,
      "auth state injected staff restore block",
      relativePath
    );
  }

  fs.writeFileSync(fullPath, source, "latin1");
  console.log(`Updated ${relativePath}`);
}
