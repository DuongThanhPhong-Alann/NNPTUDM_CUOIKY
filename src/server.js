require("dotenv").config();

const http = require("http");
const { createApp } = require("./app");
const { connectMongo } = require("./db/connect");
const { initSocket } = require("./socket");

async function main() {
  await connectMongo();

  const app = createApp();
  const server = http.createServer(app);
  initSocket(server);
  const port = Number(process.env.PORT || 3000);

  server.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`[server] listening on http://localhost:${port}`);
  });
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error("[server] failed to start:", err);
  process.exitCode = 1;
});
