import express from "express";
import cors from "cors";
import dotenv from 'dotenv'
import authRoutes from "./presentation/routes/auth.routes";
import { connectMongoDB } from "./infrastructure/database/mongo/mongoConnection";

dotenv.config()

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

const startServer = async () => {
  await connectMongoDB();   

  app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
  });
};

startServer();

