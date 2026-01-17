import { IUserEntity } from "../../entities/IUserEntity";
import { GetUsersRequestDTO } from "../../../application/dtos/admin/requestDTOs/GetUsersRequestDTO";
import { GetUsersResponseDTO } from "../../../application/dtos/admin/responseDTOs/GetUsersResponseDTO";

export interface IUserRepository {
  findByEmail(email: string): Promise<IUserEntity | null>;
  findById(id: string): Promise<IUserEntity | null>;
  createUser(user: IUserEntity): Promise<IUserEntity>;
  updatePassword(userId: string, hashedPassword: string): Promise<void>;
  blockUser(userId: string): Promise<void>;
  unblockUser(userId: string): Promise<void>;
  findAllUsers(dto: GetUsersRequestDTO): Promise<GetUsersResponseDTO>;
  update(user: Partial<IUserEntity>, id: string): Promise<void>;
}
