import { inject, injectable } from "tsyringe";
import { IVerifyPasswordUseCase } from "../../interface/user/IVerifyPasswordUseCase";
import { IUserRepository } from "../../../domain/interfaces/repositories/IUserRepository";
import { VerifyPasswordDTO } from "../../dtos/user/requestDTOs/VerifyPasswordDTO";
import { USER_ERRORS } from "../../../domain/constants/errorMessages";
import { IPasswordService } from "../../../domain/interfaces/services/IPasswordService";

@injectable()
export class VerifyPasswordUseCase implements IVerifyPasswordUseCase {
    constructor(
        @inject("IUserRepository") private readonly userRepository: IUserRepository,
        @inject('IPasswordService') private passwordService: IPasswordService,
    ) { }
    async execute(dto: VerifyPasswordDTO): Promise<void> {
        const user = await this.userRepository.findById(dto.userId)
        if (!user) {
            throw new Error(USER_ERRORS.USER_NOT_FOUND)
        }
        const isPasswordValid = await this.passwordService.compare(dto.password,user.password)
        if(!isPasswordValid){
            throw new Error(USER_ERRORS.INVALID_PASSWORD)
        }
        return  
    }
} 