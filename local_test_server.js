const http = require("http");
const fs = require("fs");
const path = require("path");

const root = __dirname;
const appFile = "caya_scoops_n_smile_full_luxury_payment_v2.html";
const port = Number(process.env.PORT || 8080);

const contentTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml"
};

const server = http.createServer((req, res) => {
  let requestPath = decodeURIComponent((req.url || "/").split("?")[0]);
  if (requestPath === "/") requestPath = "/" + appFile;

  const filePath = path.normalize(path.join(root, requestPath));
  if (!filePath.startsWith(root)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end("Not found");
      return;
    }

    res.writeHead(200, {
      "Content-Type": contentTypes[path.extname(filePath).toLowerCase()] || "application/octet-stream"
    });
    res.end(data);
  });
});

server.listen(port, "0.0.0.0", () => {
  console.log(`Caya app test server running at http://0.0.0.0:${port}/`);
});
