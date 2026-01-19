import { injectable ,inject} from "tsyringe";
import { IUnblockUserUseCase } from "../../interface/admin/IUnblockUserUseCase";
import { IUserRepository } from "../../../domain/interfaces/repositories/IUserRepository";

@injectable()
export class UnblockUserUseCase implements IUnblockUserUseCase{
    constructor(
        @inject('IUserRepository') private _userRepository:IUserRepository
    ){}
    async execute(userId: string): Promise<void> {
        await this._userRepository.unblockUser(userId)
    }
}