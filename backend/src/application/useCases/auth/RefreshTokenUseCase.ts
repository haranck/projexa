import { injectable, inject } from "tsyringe";
import { IJwtService } from "../../../domain/interfaces/services/IJwtService";
import { IUserRepository } from "../../../domain/interfaces/repositories/IUserRepository";
import { LoginResponseDTO } from "../../dtos/auth/responseDTOs/LoginResponseDTO";
import { ERROR_MESSAGES } from "../../../domain/constants/errorMessages";
import { USER_ERRORS } from "../../../domain/constants/errorMessages";
import { IRefreshTokenUseCase } from "../../interface/auth/IRefreshTokenUseCase";

@injectable()
export class RefreshTokenUseCase implements IRefreshTokenUseCase {
    constructor(
        @inject('IJwtService') private _jwtService: IJwtService,
        @inject('IUserRepository') private _userRepo: IUserRepository
    ) { }

    async execute(refreshToken: string): Promise<LoginResponseDTO> {
        const payload = this._jwtService.verifyRefreshToken(refreshToken);
        if (!payload || !payload.userId) {
            throw new Error(ERROR_MESSAGES.INVALID_TOKEN);
        }

        if (payload.userId === 'ADMIN') {
            const newPayload = { userId: 'ADMIN', email: payload.email };
            const newAccessToken = this._jwtService.signAccessToken(newPayload);
            const newRefreshToken = this._jwtService.signRefreshToken(newPayload);

            return {
                accessToken: newAccessToken,
                refreshToken: newRefreshToken,
                user: {
                    id: 'ADMIN',
                    firstName: 'Admin',
                    lastName: 'User',
                    email: payload.email,
                    isEmailVerified: true
                }
            };
        }

        const user = await this._userRepo.findById(payload.userId);
        if (!user) {
            throw new Error(USER_ERRORS.USER_NOT_FOUND);
        }

        const newPayload = { userId: user.id!, email: user.email };
        const newAccessToken = this._jwtService.signAccessToken(newPayload);

        return {
            accessToken: newAccessToken,
            refreshToken: refreshToken,
            user: {
                id: user.id!,
                firstName: user.firstName!,
                lastName: user.lastName!,
                email: user.email,
                isEmailVerified: user.isEmailVerified!
            }
        }
    }
}