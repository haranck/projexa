import { IUserEntity } from "../../domain/entities/IUserEntity";
import { UserDocument } from "../database/mongo/models/UserModel";

export class UserMapper {
  static toEntity(doc: UserDocument): IUserEntity {
    return {
      _id: doc._id.toString(),
      firstName: doc.firstName,
      lastName: doc.lastName,
      email: doc.email,
      phone: doc.phone,
      password: doc.password,
      avatarUrl: doc.avatarUrl,
      isBlocked: doc.isBlocked,
      isEmailVerified: doc.isEmailVerified,
      onboardingCompleted: doc.onboardingCompleted,
      lastSeenAt: doc.lastSeenAt,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }
}
