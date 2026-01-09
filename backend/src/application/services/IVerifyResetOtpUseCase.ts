import { VerifyResetOtpDTO } from "../dtos/auth/requestDTOs/VerifyResetOtpDTO";

export interface IVerifyResetOtpUseCase {
  execute(dto: VerifyResetOtpDTO): Promise<void>;
}
