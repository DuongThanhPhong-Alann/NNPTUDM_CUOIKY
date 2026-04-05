require("dotenv").config();

const mongoose = require("mongoose");
const { connectMongo } = require("../src/db/connect");
const schemas = require("../src/schemas");

async function main() {
  const connection = await connectMongo();

  const modelList = Object.entries(schemas);

  for (const [name, model] of modelList) {
    await model.createCollection();
    await model.syncIndexes().catch(() => undefined);
    console.log("[mongo] ensured collection for", name, "=>", model.collection.name);
  }

  const collections = await connection.db.listCollections().toArray();
  console.log(
    "[mongo] collections:",
    collections.map((c) => c.name),
  );

  await mongoose.disconnect();
  console.log("[mongo] disconnected");
}

main().catch(async (err) => {
  console.error("[mongo] init failed:", err.message);
  try {
    await mongoose.disconnect();
  } catch {
    // ignore
  }
  process.exitCode = 1;
});
