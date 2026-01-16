import { IUserRepository } from "../../../../domain/interfaces/repositories/IUserRepository";
import { IUserEntity } from "../../../../domain/entities/IUserEntity";
import { UserModel } from "../models/UserModel";
import { UserMapper } from "../../../mappers/UserMapper";
import { BaseRepo } from "./base/BaseRepo";
import { USER_ERRORS } from "../../../../domain/constants/errorMessages";

export class UserRepository
  extends BaseRepo<IUserEntity>
  implements IUserRepository {
  constructor() {
    super(UserModel);
  }

  async findByEmail(email: string): Promise<IUserEntity | null> {
    const doc = await UserModel.findOne({ email });
    if (!doc) return null;
    return UserMapper.toEntity(doc);
  }

  async findById(id: string): Promise<IUserEntity | null> {
    return super.findById(id);
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
      isBlocked: user.isBlocked,
      lastSeenAt: user.lastSeenAt,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    } as IUserEntity);

    const createdDoc = await super.findById(id);
    if (!createdDoc) throw new Error(USER_ERRORS.USER_CREATION_FAILED);
    return createdDoc;
  }

  async updatePassword(userId: string, hashedPassword: string): Promise<void> {
    await UserModel.findByIdAndUpdate(userId, {
      password: hashedPassword,
      updatedAt: new Date(),
    });
  }
  async blockUser(userId: string): Promise<void> {
    await UserModel.findByIdAndUpdate(userId, {
      isBlocked: true,
      updatedAt: new Date(),
    });
  }
  async unblockUser(userId: string): Promise<void> {
    await UserModel.findByIdAndUpdate(userId, {
      isBlocked: false,
      updatedAt: new Date(),
    });
  }
}
