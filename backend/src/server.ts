import 'reflect-metadata'

import { env } from './config/envValidation'
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./presentation/routes/auth.routes";
import adminRoutes from "./presentation/routes/admin/admin.routes";
import userRoutes from "./presentation/routes/user/user.routes";
import workspaceRoutes from "./presentation/routes/workspace/workspace.routes";
import stripeRoutes from "./presentation/routes/stripe.routes";
import projectRoutes from "./presentation/routes/project/project.routes";
import sprintRoutes from "./presentation/routes/sprint/sprint.routes";
import notificationRoutes from "./presentation/routes/notification/notification.routes";
import chatRoutes from "./presentation/routes/chat/chat.routes";
import { connectMongoDB } from "./infrastructure/database/mongo/mongoConnection";
import { initSocket } from './presentation/webSocket/server/socketServer';
import http from 'http'
import { activityResetScheduler } from './presentation/DI/resolver';

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
app.use(env.PROJECT_API_PREFIX, projectRoutes);
app.use(env.SPRINT_API_PREFIX, sprintRoutes);
app.use(env.NOTIFICATION_API_PREFIX, notificationRoutes);
app.use(env.CHAT_API_PREFIX, chatRoutes);

const startServer = async () => {
  await connectMongoDB();
  activityResetScheduler.initialize();
  const server = http.createServer(app);
  initSocket(server)
  server.listen(env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
  });
};

startServer();