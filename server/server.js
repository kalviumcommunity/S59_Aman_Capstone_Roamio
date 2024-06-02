import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/user.route.js";
import postRoutes from "./routes/post.route.js";
import { connectDB, isConnected } from "./db.js";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
const port = process.env.PORT;

connectDB();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

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
