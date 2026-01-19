import { IAdminLoginUseCase } from "../../interface/admin/IAdminLoginUseCase";
import { AdminLoginDTO } from "../../dtos/admin/requestDTOs/AdminLoginDTO";
import { ERROR_MESSAGES } from "../../../domain/constants/errorMessages";
import { HTTP_STATUS } from "../../../domain/constants/httpStatus";
import { IJwtService } from "../../../domain/interfaces/services/IJwtService";
import { inject, injectable } from "tsyringe";
import { AdminLoginResponseDTO } from "../../dtos/admin/responseDTOs/AdminLoginResponseDTO";
import { env } from "../../../config/envValidation";

@injectable()
export class AdminLoginUseCase implements IAdminLoginUseCase {
    constructor(
        @inject('IJwtService') private _jwtService: IJwtService
    ) { }
    
    async execute(dto: AdminLoginDTO): Promise<AdminLoginResponseDTO> {
        const { email, password } = dto;
        if (email !== env.ADMIN_EMAIL || password !== env.ADMIN_PASSWORD) {
            throw { statusCode: HTTP_STATUS.UNAUTHORIZED, message: ERROR_MESSAGES.INVALID_CREDENTIALS };
        }

        const payload = {
            userId: 'ADMIN',
            email: env.ADMIN_EMAIL
        }

        const accessToken = this._jwtService.signAccessToken(payload);
        const refreshToken = this._jwtService.signRefreshToken(payload)
        return {
            accessToken,
            refreshToken,
            admin: {
                id: 'ADMIN',
                email: env.ADMIN_EMAIL,
            },
        };
    }
}
