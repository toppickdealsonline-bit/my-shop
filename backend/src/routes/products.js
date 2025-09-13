import express from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = express.Router();

// GET /api/products
router.get("/", async (req, res) => {
  try {
    const items = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// GET /api/products/slug/:slug
router.get("/slug/:slug", async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: { slug: req.params.slug },
    });
    if (!product) return res.status(404).json({ error: "Not found" });
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// POST /api/products
router.post("/", async (req, res) => {
  try {
    const created = await prisma.product.create({ data: req.body });
    res.status(201).json(created);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// PUT /api/products/:id
router.put("/:id", async (req, res) => {
  try {
    const updated = await prisma.product.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// DELETE /api/products/:id
router.delete("/:id", async (req, res) => {
  try {
    await prisma.product.delete({ where: { id: req.params.id } });
    res.status(204).end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
