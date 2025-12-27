import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  userId: String,
  code: String,
  expiresAt: {
    type:Date,
    expires:60
  },
  isUsed: Boolean,
}, { timestamps: true });

export const OtpModel = mongoose.model("Otp", otpSchema);
