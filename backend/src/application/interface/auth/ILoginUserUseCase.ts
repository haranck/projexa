import { LoginUserDTO } from "../../dtos/auth/requestDTOs/LoginUserDTO";
import { LoginResponseDTO } from "../../dtos/auth/responseDTOs/LoginResponseDTO";

export interface ILoginUserUseCase {
    execute(dto: LoginUserDTO): Promise<LoginResponseDTO>;
}

