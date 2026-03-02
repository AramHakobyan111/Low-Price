import { Router } from "express";
import Product from "../models/Product.js";
import { requireAuth } from "../middleware/auth.js";
import { requireAdmin } from "../middleware/admin.js";

const router = Router();

/**
 * GET /api/products
 * query: q, sort, category
 */
router.get("/", async (req, res) => {
  try {
    const { q, sort, category } = req.query;

    const filter = {};

    if (q) filter.name = { $regex: q, $options: "i" };
    if (category) filter.category = category;

    let query = Product.find(filter);

    if (sort === "price_asc") query = query.sort({ price: 1 });
    else if (sort === "price_desc") query = query.sort({ price: -1 });
    else query = query.sort({ createdAt: -1 }); // new default

    const items = await query.limit(200);
    res.json(items);
  } catch (e) {
    console.error("GET PRODUCTS ERROR:", e);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * GET /api/products/:id
 */
router.get("/:id", async (req, res) => {
  try {
    const item = await Product.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Not found" });
    res.json(item);
  } catch (e) {
    res.status(400).json({ message: "Invalid id" });
  }
});

/**
 * POST /api/products (admin)
 */
router.post("/", requireAuth, requireAdmin, async (req, res) => {
  try {
    const { name, price, stock, image, category, description } = req.body;

    if (!name || price === undefined) {
      return res.status(400).json({ message: "Name and price are required" });
    }

    const product = await Product.create({
      name,
      price: Number(price),
      stock: Number(stock ?? 0),
      image: image || "",
      category: category || "",
      description: description || "",
    });

    res.status(201).json(product);
  } catch (e) {
    console.error("CREATE PRODUCT ERROR:", e);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * PUT /api/products/:id (admin)
 */
router.put("/:id", requireAuth, requireAdmin, async (req, res) => {
  try {
    const { name, price, stock, image, category, description } = req.body;

    const updates = {
      ...(name !== undefined ? { name } : {}),
      ...(price !== undefined ? { price: Number(price) } : {}),
      ...(stock !== undefined ? { stock: Number(stock) } : {}),
      ...(image !== undefined ? { image } : {}),
      ...(category !== undefined ? { category } : {}),
      ...(description !== undefined ? { description } : {}), // ✅ NEW
    };

    const updated = await Product.findByIdAndUpdate(req.params.id, updates, {
      new: true,
    });

    if (!updated) return res.status(404).json({ message: "Not found" });
    res.json(updated);
  } catch (e) {
    console.error("UPDATE PRODUCT ERROR:", e);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * DELETE /api/products/:id (admin)
 */
router.delete("/:id", requireAuth, requireAdmin, async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Not found" });
    res.json({ ok: true });
  } catch (e) {
    console.error("DELETE PRODUCT ERROR:", e);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;