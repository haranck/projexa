import { inject, injectable } from "tsyringe";
import { IUserRepository } from "../../../domain/interfaces/repositories/IUserRepository";
import { IPasswordService } from "../../../domain/interfaces/services/IPasswordService";
import { RegisterUserDTO } from "../../dtos/auth/requestDTOs/RegisterUserDTO";
import { ISendEmailOtpUseCase } from "../../services/ISendEmailOtpUseCase";
import { USER_ERRORS } from "../../../domain/constants/errorMessages";
import { IRegisterUserUseCase } from "../../services/IRegisterUserUseCase";

@injectable()
export class RegisterUserUseCase implements IRegisterUserUseCase {
    constructor(
        @inject('IUserRepository') private userRepository: IUserRepository,
        @inject('IPasswordService') private passwordService: IPasswordService,
        @inject('ISendEmailOtpUseCase') private sendEmailOtpUseCase: ISendEmailOtpUseCase
    ) { }

    async execute(dto: RegisterUserDTO): Promise<void> {
        const existingUser = await this.userRepository.findByEmail(dto.email)
        if (existingUser) {
            throw new Error(USER_ERRORS.USER_ALREADY_EXISTS)
        }
        const hashedPassword = await this.passwordService.hash(dto.password)

        await this.sendEmailOtpUseCase.execute({
            firstName: dto.firstName,
            lastName: dto.lastName,
            email: dto.email,
            phone: dto.phone,
            password: hashedPassword,
        })
    }
}