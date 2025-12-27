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

    async execute (dto:RegisterUserDTO):Promise<void>{
        const existingUser =  await this.userRepository.findByEmail(dto.email)
        if(existingUser){
            throw new Error("User already exists")
        }
        const hashedPassword = await this.passwordService.hash(dto.password)
        
        await this.sendEmailOtpUseCase.execute({
            firstName:dto.firstName,
            lastName:dto.lastName,
            email:dto.email,
            phone:dto.phone,
            password:hashedPassword,
        })
    }
}