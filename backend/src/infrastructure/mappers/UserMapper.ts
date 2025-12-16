import { UserEntity } from "../../domain/entities/UserEntity";
import { Document, Types } from "mongoose";

export const mapUserDocToEntity = (doc: any): UserEntity => {
  return {
    _id: doc._id.toString(),
    firstName: doc.firstName,
    lastName: doc.lastName,
    email: doc.email,
    phone: doc.phone,
    password: doc.password,
    avatarUrl: doc.avatarUrl,
    isEmailVerified: doc.isEmailVerified,
    lastSeenAt: doc.lastSeenAt,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
};
