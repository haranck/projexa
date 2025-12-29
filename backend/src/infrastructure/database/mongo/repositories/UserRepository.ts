import { IUserRepository } from "../../../../domain/interfaces/repositories/IUserRepository";
import { IUserEntity } from "../../../../domain/entities/IUserEntity";
import { UserModel } from "../models/UserModel";
import { UserMapper } from "../../../mappers/UserMapper";
import { BaseRepo } from "./base/BaseRepo";

export class UserRepository
  extends BaseRepo<IUserEntity>
  implements IUserRepository
{
  constructor() {
    super(UserModel);
  }

  async findByEmail(email: string): Promise<IUserEntity | null> {
    const doc = await UserModel.findOne({ email });
    if (!doc) return null;
    return UserMapper.toEntity(doc);
  }

  async createUser(user: IUserEntity): Promise<IUserEntity> {
    const id = await super.create({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: user.password,
      phone: user.phone,
      avatarUrl: user.avatarUrl,
      isEmailVerified: user.isEmailVerified,
      lastSeenAt: user.lastSeenAt,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    } as IUserEntity);

    const createdDoc = await super.findById(id);
    if (!createdDoc) throw new Error("User creation failed");

    return createdDoc;
  }

  async updatePassword(userId: string, hashedPassword: string): Promise<void> {
    await UserModel.findByIdAndUpdate(userId, {
      password: hashedPassword,
      updatedAt: new Date(),
    });
  }
}
