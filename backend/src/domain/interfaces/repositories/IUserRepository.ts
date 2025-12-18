import { UserEntity } from "../../entities/UserEntity";

export interface IUserRepository {
  findByEmail(email: string): Promise<UserEntity | null>;
  create(user: UserEntity): Promise<UserEntity>;
  markEmailVerified(userId:string):Promise<void>
}
