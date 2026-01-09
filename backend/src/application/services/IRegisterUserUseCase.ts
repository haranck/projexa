import { RegisterUserDTO } from "../dtos/auth/requestDTOs/RegisterUserDTO";

export interface IRegisterUserUseCase {
    execute(dto: RegisterUserDTO): Promise<void>;
}
