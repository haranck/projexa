import { LoginResponseDTO } from "../dtos/auth/responseDTOs/LoginResponseDTO";

export interface IRefreshTokenService {
    execute(refreshToken: string): Promise<LoginResponseDTO>;
}