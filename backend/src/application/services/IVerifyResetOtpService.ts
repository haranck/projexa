import { VerifyResetOtpDTO } from "../dtos/auth/requestDTOs/VerifyResetOtpDTO";

export interface IVerifyResetOtpService {
  execute(dto: VerifyResetOtpDTO): Promise<void>;
}
