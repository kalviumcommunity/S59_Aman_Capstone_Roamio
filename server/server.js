import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./userRoutes.js";
import postRoutes from "./postRoutes.js";
import { connectDB, isConnected } from "./db.js";

dotenv.config();

const app = express();
const port = process.env.PORT;

connectDB();

app.use(cors());
app.use(express.json());

app.listen(port, () => {
  console.log(`🚀 Server is running at http://localhost:${port}/`);
  if (isConnected()) {
    console.log("📦 MongoDB Connected with Server, Successfully!");
  }
});

app.get("/", (req, res) => {
  res.send("🚀 Server started successfully");
});

app.use("/users", userRoutes);
app.use("/posts", postRoutes);
