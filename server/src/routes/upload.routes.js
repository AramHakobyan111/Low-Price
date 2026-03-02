import { Router } from "express";
import multer from "multer";
import cloudinary from "../config/cloudinary.js";
import { requireAuth } from "../middleware/auth.js";
import { requireAdmin } from "../middleware/admin.js";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/", requireAuth, requireAdmin, upload.single("image"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file" });

    const base64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;

    const result = await cloudinary.uploader.upload(base64, {
      folder: "lowprice",
    });

    return res.json({ url: result.secure_url });
  } catch (e) {
    console.error("UPLOAD ERROR:", e?.message || e);
    return res.status(500).json({ message: "Upload error" });
  }
});

export default router;