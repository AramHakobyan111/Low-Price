import "dotenv/config";
import app from "./app.js";
import { connectDB } from "./config/db.js";
import { seedAdmin } from "./seed/admin.js";

const PORT = process.env.PORT || 5050;

async function bootstrap() {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is missing in server/.env");
  }

  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is missing in server/.env");
  }

  await connectDB(process.env.MONGO_URI);
  await seedAdmin();

  app.listen(PORT, () => {
    console.log(`✅ API running on http://localhost:${PORT}`);
  });
}

bootstrap().catch((e) => {
  console.error("❌ Server failed:", e);
  process.exit(1);
});