import { ForgotPasswordDTO } from "../dtos/auth/requestDTOs/ForgotPasswordDTO";

export interface IResetPasswordService {
  execute(dto: ForgotPasswordDTO): Promise<void>;
}
