import { Router } from "express";
import mongoose from "mongoose";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

// CREATE ORDER
router.post("/", requireAuth, async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const {
      items,
      totalAmount,
      paymentIntentId,
      customerEmail,
      customerName,
      customerPhone,
      shippingAddress,
      shippingCity,
    } = req.body;

    if (!items?.length || !totalAmount || !paymentIntentId) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "Missing order data" });
    }

    const existing = await Order.findOne({ paymentIntentId }).session(session);
    if (existing) {
      await session.abortTransaction();
      session.endSession();
      return res.status(409).json({ message: "Order already exists" });
    }

    // stock check + decrement
    for (const item of items) {
      const product = await Product.findById(item.productId).session(session);

      if (!product) {
        await session.abortTransaction();
        session.endSession();
        return res.status(404).json({ message: `Product not found: ${item.name}` });
      }

      if ((product.stock ?? 0) < item.qty) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({
          message: `${product.name} ապրանքի stock-ը բավարար չէ`,
        });
      }

      product.stock = (product.stock ?? 0) - item.qty;
      await product.save({ session });
    }

    const [order] = await Order.create(
      [
        {
          userId: req.user.sub,
          items,
          totalAmount,
          paymentIntentId,
          paymentStatus: "paid",
          customerEmail: customerEmail || "",
          customerName: customerName || "",
          customerPhone: customerPhone || "",
          shippingAddress: shippingAddress || "",
          shippingCity: shippingCity || "",
        },
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    res.status(201).json(order);
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    console.error("Create order error:", err);
    res.status(500).json({ message: "Order creation failed" });
  }
});

// ADMIN - ALL ORDERS
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error("Fetch orders error:", err);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
});

// USER - MY ORDERS
router.get("/my", requireAuth, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.sub }).sort({
      createdAt: -1,
    });

    res.json(orders);
  } catch (err) {
    console.error("Fetch my orders error:", err);
    res.status(500).json({ message: "Failed to fetch my orders" });
  }
});

// USER - MY ORDER DETAILS
router.get("/my/:id", requireAuth, async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      userId: req.user.sub,
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (err) {
    console.error("Fetch my order details error:", err);
    res.status(500).json({ message: "Failed to fetch order" });
  }
});

// ADMIN - ORDER DETAILS
router.get("/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (err) {
    console.error("Fetch order details error:", err);
    res.status(500).json({ message: "Failed to fetch order" });
  }
});

// ADMIN - CHANGE STATUS
router.put("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    const allowedStatuses = ["new", "processing", "shipped", "delivered"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const updated = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(updated);
  } catch (err) {
    console.error("Update order status error:", err);
    res.status(500).json({ message: "Failed to update order status" });
  }
});

export default router;