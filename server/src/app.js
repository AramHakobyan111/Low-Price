import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import productRoutes from "./routes/products.routes.js";
import uploadRoutes from "./routes/upload.routes.js";

const app = express();

app.use(cors());           // թույլ է տալիս React-ից request անել
app.use(express.json());   // թույլ է տալիս JSON body կարդալ

app.get("/api/health", (req, res) => res.json({ ok: true }));

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/upload", uploadRoutes);

export default app;