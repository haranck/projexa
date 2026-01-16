import { injectable ,inject} from "tsyringe";
import { IBlockUserUseCase } from "../../interface/admin/IBlockUserUseCase";
import { IUserRepository } from "../../../domain/interfaces/repositories/IUserRepository";

@injectable()
export class BlockUserUseCase implements IBlockUserUseCase {
    constructor(
        @inject('IUserRepository') private userRepository: IUserRepository
    ){}
    async execute(userId: string): Promise<void> {
        await this.userRepository.blockUser(userId)
    }
}
