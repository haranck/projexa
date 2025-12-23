import { IUserRepository } from "../../../domain/interfaces/repositories/IUserRepository";
import { IPasswordService } from "../../../domain/interfaces/services/IPasswordService";
import { RegisterUserDTO } from "../../dtos/auth/requestDTOs/RegisterUserDTO";
import { IUserEntity } from "../../../domain/entities/IUserEntity";
import { SendEmailOtpUsecase } from "./SendEmailOtpUseCase";

export class RegisterUserUseCase {
    constructor(
        private userRepository:IUserRepository,
        private passwordService:IPasswordService,
        private sendEmailOtpUseCase:SendEmailOtpUsecase
    ){}

    async execute (dto:RegisterUserDTO):Promise<IUserEntity>{
        const existingUser =  await this.userRepository.findByEmail(dto.email)
        if(existingUser){
            throw new Error("User already exists")
        }
        const hashedPassword = await this.passwordService.hash(dto.password)

        const user:IUserEntity = {
            firstName:dto.firstName,
            lastName:dto.lastName,
            email:dto.email,
            password:hashedPassword,
            phone:dto.phone,
            isEmailVerified:false,
            createdAt:new Date(),
            updatedAt:new Date(),
        }

        const createdUser = await this.userRepository.create(user)
        await this.sendEmailOtpUseCase.execute(createdUser.id!,createdUser.email)
        return createdUser
    }
}