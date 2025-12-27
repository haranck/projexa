
import { OtpEntity } from "../../../../domain/entities/IOtpEntity";
import { IOtpRepository } from "../../../../domain/interfaces/repositories/IOtpRepository";
import { OtpModel } from "../models/OtpModel";
import { OtpMapper } from "../../../mappers/OtpMapper";

export class OtpRepository implements IOtpRepository {

  async create(otp: OtpEntity): Promise<void> {
    await OtpModel.create({
      userId: otp.userId,
      code: otp.code,
      expiresAt: otp.expiresAt,
      isUsed: otp.isUsed,
      createdAt: otp.createdAt,
    });
  }

  async findValidOtp(email: string, code: string): Promise<OtpEntity | null> {
    const doc = await OtpModel.findOne({
      userId:email,
      code,
      isUsed: false,
      expiresAt: { $gt: new Date() },
    }).sort({ createdAt: -1 });

    if (!doc) return null;

    return OtpMapper.toEntity(doc);
  }

  async markAsUsed(otpId: string): Promise<void> {
    await OtpModel.findByIdAndUpdate(otpId, { isUsed: true });
  }

  async invalidateAll(email:string):Promise<void> {
    await OtpModel.updateMany(
      {email,isUsed:false},
      {isUsed:true}
    )
  }
}
