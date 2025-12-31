import { IUserEntity } from "../../entities/IUserEntity";

export interface IUserRepository {
  findByEmail(email: string): Promise<IUserEntity | null>;
  findById(id: string): Promise<IUserEntity | null>;
  createUser(user: IUserEntity): Promise<IUserEntity>;
  updatePassword(userId: string, hashedPassword: string): Promise<void>;
}
