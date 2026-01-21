import { GoogleLoginResponseDTO } from "../../dtos/auth/responseDTOs/GoogleLoginResponseDTO";

export interface IGoogleLoginUseCase {
    execute(idToken: string): Promise<GoogleLoginResponseDTO>;
}