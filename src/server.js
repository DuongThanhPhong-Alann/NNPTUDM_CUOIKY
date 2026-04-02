require("dotenv").config();

const { createApp } = require("./app");
const { connectMongo } = require("./db/connect");

async function main() {
  await connectMongo();

  const app = createApp();
  const port = Number(process.env.PORT || 3000);

  app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`[server] listening on http://localhost:${port}`);
  });
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error("[server] failed to start:", err);
  process.exitCode = 1;
});

