import { ResetPasswordDTO } from "../../dtos/auth/requestDTOs/ResetPasswordDTO";

export interface IResetPasswordUseCase {
  execute(dto: ResetPasswordDTO): Promise<void>;
}
