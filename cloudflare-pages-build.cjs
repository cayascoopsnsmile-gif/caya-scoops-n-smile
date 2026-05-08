const fs = require("fs");
const path = require("path");

const root = __dirname;
const outDir = path.join(root, "cf-pages-dist");

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function removeDir(dirPath) {
  fs.rmSync(dirPath, { recursive: true, force: true });
}

function copyFile(relativePath) {
  const source = path.join(root, relativePath);
  const target = path.join(outDir, relativePath);

  if (!fs.existsSync(source)) {
    return;
  }

  ensureDir(path.dirname(target));
  fs.copyFileSync(source, target);
}

function copyDir(relativePath) {
  const source = path.join(root, relativePath);
  const target = path.join(outDir, relativePath);

  if (!fs.existsSync(source)) {
    return;
  }

  fs.cpSync(source, target, { recursive: true, force: true });
}

removeDir(outDir);
ensureDir(outDir);

[
  "index.html",
  "customer-apk.html",
  "_headers",
  "_redirects",
].forEach(copyFile);

[
  "assets",
].forEach(copyDir);

console.log(`Cloudflare Pages bundle created in ${outDir}`);
