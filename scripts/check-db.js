require("dotenv").config();

const mongoose = require("mongoose");
const { connectMongo } = require("../src/db/connect");

async function main() {
  const connection = await connectMongo();

  const { host, name, readyState } = connection;
  console.log("[mongo] connected:", { host, name, readyState });

  const ping = await connection.db.admin().ping();
  console.log("[mongo] ping:", ping);

  const collections = await connection.db.listCollections().toArray();
  console.log(
    "[mongo] collections:",
    collections.map((c) => c.name),
  );

  await mongoose.disconnect();
  console.log("[mongo] disconnected");
}

main().catch(async (err) => {
  console.error("[mongo] connection failed:", err.message);
  try {
    await mongoose.disconnect();
  } catch {
    // ignore
  }
  process.exitCode = 1;
});

