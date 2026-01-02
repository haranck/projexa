import { OtpEntity } from "../../domain/entities/IOtpEntity";
import { ERROR_MESSAGES } from '../../domain/constants/errorMessages'

export class OtpMapper {
  static toEntity(doc: any): OtpEntity {
    if (!doc) {
      throw new Error(ERROR_MESSAGES.INVALID_OTP);
    }

    return {
      id: doc._id.toString(),
      userId: doc.userId,
      code: doc.code,
      expiresAt: doc.expiresAt,
      isUsed: doc.isUsed,
      createdAt: doc.createdAt,
    };
  }
}
