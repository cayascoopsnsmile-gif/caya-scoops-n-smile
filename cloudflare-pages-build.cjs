const fs = require("fs");
const path = require("path");

const root = __dirname;
const sourceDir = path.join(root, "caya-react", "dist");
const outDir = path.join(root, "cf-pages-dist");

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function removeDir(dirPath) {
  fs.rmSync(dirPath, { recursive: true, force: true });
}

function copyFile(relativePath, sourceBase = root) {
  const source = path.join(sourceBase, relativePath);
  const target = path.join(outDir, relativePath);

  if (!fs.existsSync(source)) {
    return;
  }

  ensureDir(path.dirname(target));
  fs.copyFileSync(source, target);
}

function copyDir(relativePath, sourceBase = root) {
  const source = path.join(sourceBase, relativePath);
  const target = path.join(outDir, relativePath);

  if (!fs.existsSync(source)) {
    return;
  }

  fs.cpSync(source, target, { recursive: true, force: true });
}

removeDir(outDir);
ensureDir(outDir);

copyFile("index.html", sourceDir);
copyFile("_headers");
copyFile("_redirects");

copyDir("assets", sourceDir);

console.log(`Cloudflare Pages bundle created in ${outDir}`);
