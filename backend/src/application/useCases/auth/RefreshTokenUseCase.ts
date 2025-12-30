
import { IJwtService } from "../../../domain/interfaces/services/IJwtService";
import { IUserRepository } from "../../../domain/interfaces/repositories/IUserRepository";
import { LoginResponseDTO } from "../../dtos/auth/responseDTOs/LoginResponseDTO";

export class RefreshTokenUseCase {
    constructor(
        private jwtService: IJwtService,
        private userRepo: IUserRepository
    ) { }

    async execute(refreshToken: string): Promise<LoginResponseDTO> {
        const payload = this.jwtService.verifyRefreshToken(refreshToken);
        if (!payload || !payload.userId) {
            throw new Error("Invalid Refresh Token");
        }

        const user = await this.userRepo.findById(payload.userId);
        if (!user) {
            throw new Error("User not found");
        }

        const newPayload = { userId: user.id!, email: user.email };
        const newAccessToken = this.jwtService.signAccessToken(newPayload);

        return {
            accessToken: newAccessToken,
            refreshToken: refreshToken,
            user: {
                id: user.id!,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                isEmailVerified: user.isEmailVerified
            }
        }
    }
}
