import { inject, injectable } from "tsyringe";
import { IUserRepository } from "../../../domain/interfaces/repositories/IUserRepository";
import { IPasswordService } from "../../../domain/interfaces/services/IPasswordService";
import { RegisterUserDTO } from "../../dtos/auth/requestDTOs/RegisterUserDTO";
import { SendEmailOtpUsecase } from "./SendEmailOtpUseCase";
import { USER_ERRORS } from "../../../domain/constants/errorMessages";
import { IRegisterUserService } from "../../services/IRegisterUserService";

@injectable()
export class RegisterUserUseCase implements IRegisterUserService{
    constructor(
        @inject('IUserRepository') private userRepository: IUserRepository,
        @inject('IPasswordService') private passwordService: IPasswordService,
        @inject('SendEmailOtpUsecase') private sendEmailOtpUseCase: SendEmailOtpUsecase
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