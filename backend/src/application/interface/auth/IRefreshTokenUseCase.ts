import { LoginResponseDTO } from "../dtos/auth/responseDTOs/LoginResponseDTO";

export interface IRefreshTokenUseCase {
    execute(refreshToken: string): Promise<LoginResponseDTO>;
}