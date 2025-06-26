import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import protectedRoutes from "./routes/protected.js";
import { authenticateToken } from "./middlewares/auth.js";

dotenv.config();

const port = process.env.PORT || 3000;
const app = express();

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

app.use("/api/auth", authRoutes);

app.use("/api/protected", authenticateToken, protectedRoutes);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
