import express from "express";
import cors from "cors";
import authRoutes from "./presentation/routes/auth.routes";
import { connectMongoDB } from "./infrastructure/database/mongo/mongoConnection";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

const PORT = 4000;

const startServer = async () => {
  await connectMongoDB();   

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
