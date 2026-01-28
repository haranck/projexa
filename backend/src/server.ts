import 'reflect-metadata'
import dotenv from "dotenv";
dotenv.config();

import { env } from './config/envValidation'
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./presentation/routes/auth.routes";
import adminRoutes from "./presentation/routes/admin/admin.routes";
import userRoutes from "./presentation/routes/user/user.routes";
import workspaceRoutes from "./presentation/routes/workspace/workspace.routes";
import stripeRoutes from "./presentation/routes/stripe.routes";
import { connectMongoDB } from "./infrastructure/database/mongo/mongoConnection";

const app = express();

app.use(cookieParser());

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

app.use(env.STRIPE_API_PREFIX, stripeRoutes);

app.use(express.json());

app.use(env.AUTH_API_PREFIX, authRoutes);
app.use(env.ADMIN_API_PREFIX, adminRoutes);
app.use(env.USER_API_PREFIX, userRoutes);
app.use(env.WORKSPACE_API_PREFIX, workspaceRoutes);

const startServer = async () => {
  await connectMongoDB();

  app.listen(env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
  });
};

startServer();
