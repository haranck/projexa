import { IUserRepository } from "../../../../domain/interfaces/repositories/IUserRepository";
import { UserEntity } from "../../../../domain/entities/UserEntity";
import { UserModel } from "../models/UserModel";
import { mapUserDocToEntity } from "../../../mappers/UserMapper";

export class UserRepository implements IUserRepository {

    async findByEmail(email: string): Promise<UserEntity | null> {
        const doc = await UserModel.findOne({email})
        if(!doc)return null
        return mapUserDocToEntity(doc)
    }

    async create(user: UserEntity): Promise<UserEntity> {
        const created = await UserModel.create(user)
        return mapUserDocToEntity(created)
    }
}



