const path = require("path");
const { createServer } = require("http");
const next = require("next");

const port = process.env.PORT || 3000;
const dev = false;
const app = next({ dev, dir: __dirname });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer((req, res) => {
    handle(req, res);
  });

  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on ${port}`);
  });

  process.on("SIGTERM", () => {
    console.log("SIGTERM received, exiting");
    server.close(() => process.exit(0));
  });

  process.on("SIGINT", () => {
    server.close(() => process.exit(0));
  });
});
