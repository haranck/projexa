import dotenv from "dotenv";
dotenv.config();

import { env } from './config/envValidation'
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./presentation/routes/auth.routes";
import { connectMongoDB } from "./infrastructure/database/mongo/mongoConnection";

const app = express();

app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

app.use("/api/auth", authRoutes);

const startServer = async () => {
  await connectMongoDB();

  app.listen(env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
  });
};

startServer();
