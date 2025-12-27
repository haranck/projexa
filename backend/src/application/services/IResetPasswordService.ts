import { ResetPasswordDTO } from "../dtos/auth/requestDTOs/ResetPasswordDTO";

export interface IResetPasswordService {
  execute(dto: ResetPasswordDTO): Promise<void>;
}
