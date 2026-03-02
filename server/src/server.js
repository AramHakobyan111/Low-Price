import "dotenv/config";
import app from "./app.js";
import { connectDB } from "./config/db.js";
import { seedAdmin } from "./seed/admin.js";

const PORT = process.env.PORT || 5000;

async function bootstrap() {
  await connectDB(process.env.MONGO_URI);
  await seedAdmin(); // ստեղծում ենք 1 admin, եթե չկա
  app.listen(PORT, () => console.log(`✅ API running on http://localhost:${PORT}`));
}

bootstrap().catch((e) => {
  console.error("❌ Server failed:", e);
  process.exit(1);
});