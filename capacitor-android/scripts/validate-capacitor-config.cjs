const fs = require("fs");
const path = require("path");

const rootDir = path.resolve(__dirname, "..");
const mainConfigPath = path.join(rootDir, "capacitor.config.json");
const generatedConfigPath = path.join(rootDir, "android", "app", "src", "main", "assets", "capacitor.config.json");

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function writeJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(value, null, 2) + "\n", "utf8");
}

function getUrl(config) {
  return String(config?.server?.url || "").trim();
}

function main() {
  if (!fs.existsSync(mainConfigPath)) {
    console.warn("[Capacitor config check] Main capacitor.config.json was not found.");
    process.exit(0);
  }

  const mainConfig = readJson(mainConfigPath);
  const mainUrl = getUrl(mainConfig);

  if (!mainUrl) {
    console.warn("[Capacitor config check] Main capacitor.config.json has no server.url.");
    process.exit(0);
  }

  let generatedConfig = null;
  if (fs.existsSync(generatedConfigPath)) {
    generatedConfig = readJson(generatedConfigPath);
  }

  const generatedUrl = getUrl(generatedConfig || {});
  if (generatedUrl !== mainUrl) {
    console.warn(`[Capacitor config check] WARNING: generated assets config did not match main config.\n  main:      ${mainUrl}\n  generated: ${generatedUrl || "(missing)"}`);
    writeJson(generatedConfigPath, mainConfig);
    console.warn("[Capacitor config check] Generated assets config was updated from the main capacitor.config.json source of truth.");
  } else {
    console.log(`[Capacitor config check] Assets config matches main config: ${mainUrl}`);
  }
}

main();
