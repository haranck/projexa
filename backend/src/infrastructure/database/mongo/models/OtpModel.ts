import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  userId: String,
  code: String,
  expiresAt: Date,
  isUsed: Boolean,
}, { timestamps: true });

export const OtpModel = mongoose.model("Otp", otpSchema);
