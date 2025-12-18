import { IUserRepository } from "../../../../domain/interfaces/repositories/IUserRepository";
import { UserEntity } from "../../../../domain/entities/UserEntity";
import { UserModel } from "../models/UserModel";
import { UserMapper } from "../../../mappers/UserMapper";

export class UserRepository implements IUserRepository {
  async findByEmail(email: string): Promise<UserEntity | null> {
    const doc = await UserModel.findOne({ email });
    if (!doc) return null;
    return UserMapper.toEntity(doc);

  }

  async create(user: UserEntity): Promise<UserEntity> {
    const created = await UserModel.create({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: user.password,
      phone: user.phone,
      avatarUrl: user.avatarUrl,
      isEmailVerified: user.isEmailVerified,
      lastSeenAt: user.lastSeenAt,
    });
    return UserMapper.toEntity(created);

  }

  async markEmailVerified(userId: string): Promise<void> {
      await UserModel.findByIdAndUpdate(userId,{isEmailVerified:true})
  }
}
