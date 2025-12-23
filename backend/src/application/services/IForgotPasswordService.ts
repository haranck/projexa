import { ForgotPasswordDTO } from "../dtos/auth/requestDTOs/ForgotPasswordDTO";

export interface IForgotPasswordService{
    execute(dto:ForgotPasswordDTO):Promise<void>
}