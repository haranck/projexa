import { IOtpEntity } from "../../../../domain/entities/IOtpEntity";
import { IOtpRepository } from "../../../../domain/interfaces/repositories/IOtpRepository";
import { OtpModel } from "../models/OtpModel";
import { OtpMapper } from "../../../mappers/OtpMapper";
import { BaseRepo } from "./base/BaseRepo";
import { Model } from "mongoose";
import { injectable } from "tsyringe";

@injectable()
export class OtpRepository extends BaseRepo<IOtpEntity> implements IOtpRepository {
  constructor() {
    super(OtpModel as unknown as Model<IOtpEntity>)
  }
  async createOtp(otp: IOtpEntity): Promise<void> {
    await super.create({
      _id: otp._id,
      userId: otp.userId,
      code: otp.code,
      expiresAt: otp.expiresAt,
      isUsed: otp.isUsed,
      createdAt: otp.createdAt,
    });
  }

  async findValidOtp(email: string, code: string): Promise<IOtpEntity | null> {
    const doc = await OtpModel.findOne({
      userId: email,
      code,
      isUsed: false, 
      expiresAt: { $gt: new Date() },
    }).sort({ createdAt: -1 });

    if (!doc) return null;

    return OtpMapper.toEntity(doc);
  }

  async markAsUsed(otpId: string): Promise<void> {
    await super.update({ isUsed: true }, otpId);
  }

  async invalidateAll(email: string): Promise<void> {
    await OtpModel.updateMany(
      { email, isUsed: false },
      { isUsed: true }
    )
  }
}
