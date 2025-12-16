import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: String,
    lastName: String,
    email: { type: String, unique: true },
    password: String,
    phone: String,
    avatarUrl: String,
    isEmailVerified: Boolean,
    lastSeenAt: Date,
  },
  { timestamps: true }
);

export const UserModel = mongoose.model("User", userSchema);
