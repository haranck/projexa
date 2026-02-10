import { IUserRepository } from "../../../../domain/interfaces/repositories/IUserRepository";
import { IUserEntity } from "../../../../domain/entities/IUserEntity";
import { UserModel } from "../models/UserModel";
import { UserDocument } from "../models/UserModel";
import { UserMapper } from "../../../mappers/UserMapper";
import { BaseRepo } from "./base/BaseRepo";
import { USER_ERRORS } from "../../../../domain/constants/errorMessages";
import { GetUsersRequestDTO } from "../../../../application/dtos/admin/requestDTOs/GetUsersRequestDTO";
import { GetUsersResponseDTO } from "../../../../application/dtos/admin/responseDTOs/GetUsersResponseDTO";
import { injectable } from "tsyringe";

@injectable()
export class UserRepository extends BaseRepo<IUserEntity> implements IUserRepository {
  constructor() {
    super(UserModel);
  }

  async findByEmail(email: string): Promise<IUserEntity | null> {
    const doc = await UserModel.findOne({ email });
    if (!doc) return null;
    return UserMapper.toEntity(doc as UserDocument);
  }

  async findById(id: string): Promise<IUserEntity | null> {
    const doc = await super.findById(id);
    if (!doc) return null;
    return UserMapper.toEntity(doc as UserDocument);
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
      onboardingCompleted: user.onboardingCompleted || false,
      isBlocked: user.isBlocked,
      lastSeenAt: user.lastSeenAt,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    } as IUserEntity);

    const createdDoc = await super.findById(id);
    if (!createdDoc) throw new Error(USER_ERRORS.USER_CREATION_FAILED);
    return UserMapper.toEntity(createdDoc as unknown as UserDocument);
  }

  async updatePassword(userId: string, hashedPassword: string): Promise<void> {
    await super.update({
      password: hashedPassword,
      updatedAt: new Date(),
    }, userId);
  }

  async blockUser(userId: string): Promise<void> {
    await super.update({
      isBlocked: true,
      updatedAt: new Date(),
    }, userId);
  }

  async unblockUser(userId: string): Promise<void> {
    await super.update({
      isBlocked: false,
      updatedAt: new Date(),
    }, userId);
  }

  async findAllUsers(dto: GetUsersRequestDTO): Promise<GetUsersResponseDTO> {
    const skip = (dto.page - 1) * dto.limit;
    const filter = dto.search ? {
      $or: [
        { firstName: { $regex: dto.search, $options: "i" } },
        { lastName: { $regex: dto.search, $options: "i" } },
        { email: { $regex: dto.search, $options: "i" } },
        { phone: { $regex: dto.search, $options: "i" } },
      ],
    } : {};
    const docs = await UserModel.find(filter).skip(skip).limit(dto.limit).sort({ createdAt: -1 });
    const totalDocs = await UserModel.countDocuments(filter);
    const data = docs.map((doc) => UserMapper.toEntity(doc));
    const totalPages = Math.ceil(totalDocs / dto.limit);
    return {
      data,
      meta: {
        totalDocs,
        totalPages,
        page: dto.page,
        limit: dto.limit,
      },
    };
  }
}
