import { IAdminLoginUseCase } from "../../interface/admin/IAdminLoginUseCase";
import { AdminLoginDTO } from "../../dtos/admin/requestDTOs/AdminLoginDTO";
import { ERROR_MESSAGES } from "../../../domain/constants/errorMessages";
import { HTTP_STATUS } from "../../../domain/constants/httpStatus";
import { IJwtService } from "../../../domain/interfaces/services/IJwtService";
import { inject, injectable } from "tsyringe";
import { AdminLoginResponseDTO } from "../../dtos/admin/responseDTOs/AdminLoginResponseDTO";

@injectable()
export class AdminLoginUseCase implements IAdminLoginUseCase {
    constructor(
        @inject('IJwtService') private jwtService: IJwtService
    ) { }

    async execute(dto: AdminLoginDTO): Promise<AdminLoginResponseDTO> {
        const { email, password } = dto;
        if (email !== process.env.ADMIN_EMAIL || password !== process.env.ADMIN_PASSWORD) {
            throw { statusCode: HTTP_STATUS.UNAUTHORIZED,message: ERROR_MESSAGES.INVALID_CREDENTIALS };
        }

        const payload = {
            userId:'ADMIN',
            email:process.env.ADMIN_EMAIL
        }

        const accessToken = this.jwtService.signAccessToken(payload);
        const refreshToken = this.jwtService.signRefreshToken(payload)

        return {
            accessToken,
            refreshToken,
            admin: {
                id: 'ADMIN',
                email: process.env.ADMIN_EMAIL,
            },
        };
    }
}
