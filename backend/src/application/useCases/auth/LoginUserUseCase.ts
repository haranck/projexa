import { IUserRepository } from "../../../domain/interfaces/repositories/IUserRepository";
import { IPasswordService } from "../../../domain/interfaces/services/IPasswordService";
import { IJwtService } from "../../../domain/interfaces/services/IJwtService";
import { LoginUserDTO } from "../../dtos/auth/LoginUserDTO";
import { LoginResponseDTO } from "../../dtos/auth/responseDTOs/LoginResponseDTO";

export class LoginUserUseCase {
  constructor(
    private userRepo: IUserRepository,
    private passwordService: IPasswordService,
    private jwtService: IJwtService
  ) {}

  async execute(dto: LoginUserDTO): Promise<LoginResponseDTO> {
    const user = await this.userRepo.findByEmail(dto.email);

    if (!user) throw new Error("Invalid Credentials");

    if (!user.isEmailVerified) throw new Error("Email not Verified");

    const isMatch = await this.passwordService.compare(
      dto.password,
      user.password
    );

    if (!isMatch) throw new Error("Invalid Credentials");

    if (!user.id) throw new Error("User id Missing");

    const payload = {
      userId: user.id,
      email: user.email,
    };

    const accessToken = this.jwtService.signAccessToken(payload);
    const refreshToken = this.jwtService.signRefreshToken(payload);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        isEmailVerified: user.isEmailVerified,
      },
    };
  }
}
