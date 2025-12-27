import { IUserEntity } from "../../entities/IUserEntity";

export interface IUserRepository {
  findByEmail(email: string): Promise<IUserEntity | null>;
  createUser(user: IUserEntity): Promise<IUserEntity>;
  // markEmailVerified(userId:string):Promise<void>  
  updatePassword(userId:string,hashedPassword:string):Promise<void>
}
