import { OtpEntity } from "../../domain/entities/OtpEntity";

export class OtpMapper {
  static toEntity(doc: any): OtpEntity {
    if (!doc) {
      throw new Error("Cannot map null OTP document");
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
