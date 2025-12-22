import { UserEntity } from "../../entities/IUserEntity";

export interface IUserRepository {
  findByEmail(email: string): Promise<UserEntity | null>;
  create(user: UserEntity): Promise<UserEntity>;
  markEmailVerified(userId:string):Promise<void>
}
