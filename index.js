import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";

import authRoutes from "./routes/auth.js";
import protectedRoutes from "./routes/protected.js";
import { authenticateToken } from "./middlewares/auth.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5138;

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

app.use("/api/auth", authRoutes);
app.use("/api/protected", authenticateToken, protectedRoutes);

app.listen(port, "0.0.0.0", () => {
  console.log(`🚀 Express HTTP server running at http://10.230.62.81:${port}`);
});
