import { RegisterUserDTO } from "../dtos/auth/requestDTOs/RegisterUserDTO";

export interface IRegisterUserService {
    execute(dto: RegisterUserDTO): Promise<void>;
}
