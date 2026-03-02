import bcrypt from "bcryptjs";
import User from "../models/User.js";

export async function seedAdmin() {
  const email = "admin@lowprice.com";
  const exists = await User.findOne({ email });

  if (exists) return;

  const passwordHash = await bcrypt.hash("Admin1234", 10);

  await User.create({
    name: "Admin",
    email,
    passwordHash,
    role: "admin",
  });

  console.log("✅ Seeded admin: admin@lowprice.com / Admin1234");
}