import mongoose,{Document,Types} from "mongoose";

export interface OtpDocument extends Document {
  userId: Types.ObjectId;
  code: string;
  expiresAt: Date;
  isUsed: boolean;
  createdAt: Date;
}

const otpSchema = new mongoose.Schema({
  userId: String,
  code: String,
  expiresAt: {
    type:Date,
    expires:60
  },
  isUsed: Boolean,
}, { timestamps: true });

export const OtpModel = mongoose.model<OtpDocument>("Otp", otpSchema);
