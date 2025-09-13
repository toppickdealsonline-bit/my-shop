import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import productsRouter from "./routes/products.js";

dotenv.config();
const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL || "*" }));
app.use(express.json());

app.use("/api/products", productsRouter);

app.get("/", (req, res) => res.send("Backend API running"));
const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Server listening on ${port}`));
