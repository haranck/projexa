import { IUserRepository } from "../../../domain/interfaces/repositories/IUserRepository";
import { IOtpRepository } from "../../../domain/interfaces/repositories/IOtpRepository";
import { IPasswordService } from "../../../domain/interfaces/services/IPasswordService";
import { ResetPasswordDTO } from "../../dtos/auth/requestDTOs/ResetPasswordDTO";
import { IResetPasswordService } from "../../services/IResetPasswordService";


export class ResetPasswordUseCase implements IResetPasswordService {
  constructor(
    private userRepo: IUserRepository,
    private otpRepo: IOtpRepository,
    private passwordService: IPasswordService,
  ) { }

  async execute(dto: ResetPasswordDTO): Promise<void> {
    if (dto.password !== dto.confirmPassword) {
      throw new Error("Passwords do not match");
    }

    const user = await this.userRepo.findByEmail(dto.email);
    if (!user || !user.id) {
      throw new Error("User not found");
    }

    const hashedPassword = await this.passwordService.hash(dto.password);
    await this.userRepo.updatePassword(user.id, hashedPassword);
  }
}
