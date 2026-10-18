const path = require("path");
const fs = require("fs");

const standaloneServer = path.join(__dirname, ".next", "standalone", "server.js");

if (fs.existsSync(standaloneServer)) {
  // Use Next.js optimized standalone server
  require(standaloneServer);
} else {
  // Standard Next.js server launcher for cPanel Node.js Selector
  const { createServer } = require("http");
  const next = require("next");

  const port = parseInt(process.env.PORT, 10) || 3000;
  const dev = process.env.NODE_ENV !== "production";
  const app = next({ dev });
  const handle = app.getRequestHandler();

  app.prepare().then(() => {
    createServer((req, res) => {
      handle(req, res);
    }).listen(port, (err) => {
      if (err) throw err;
      console.log(`> Ready on http://localhost:${port}`);
    });
  });
}
