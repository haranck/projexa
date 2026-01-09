import { ForgotPasswordDTO } from "../dtos/auth/requestDTOs/ForgotPasswordDTO";

export interface IForgotPasswordUseCase{
    execute(dto:ForgotPasswordDTO):Promise<void>
}