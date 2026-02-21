import { IOtpEntity } from "../../domain/entities/IOtpEntity";
import { ERROR_MESSAGES } from '../../domain/constants/errorMessages'
import { OtpDocument } from "../database/mongo/models/OtpModel";

export class OtpMapper {
  static toEntity(doc: OtpDocument): IOtpEntity {
    if (!doc) {
      throw new Error(ERROR_MESSAGES.INVALID_OTP);
    }

    return {
      _id: doc._id.toString(),
      userId: doc.userId.toString(),
      code: doc.code,
      expiresAt: doc.expiresAt,
      isUsed: doc.isUsed,
      createdAt: doc.createdAt,
    };
  }
}
