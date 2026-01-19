import { injectable, inject } from "tsyringe";
import { IUserRepository } from "../../../domain/interfaces/repositories/IUserRepository";
import { IJwtService } from "../../../domain/interfaces/services/IJwtService";
import { IGoogleAuthService } from "../../../domain/interfaces/services/IGoogleAuthService";
import { IGoogleLoginUseCase } from "../../interface/auth/IGoogleLoginUseCase";
import { ERROR_MESSAGES } from "../../../domain/constants/errorMessages";
import { USER_ERRORS } from "../../../domain/constants/errorMessages";
import { GoogleLoginResponseDTO } from "../../dtos/auth/responseDTOs/GoogleLoginResponseDTO"; 

@injectable()
export class GoogleLoginUseCase implements IGoogleLoginUseCase {
  constructor(
    @inject('IUserRepository') private _userRepo: IUserRepository,
    @inject('IJwtService') private _jwtService: IJwtService,
    @inject('IGoogleAuthService') private _googleAuthService: IGoogleAuthService
  ) { }

  async execute(idToken: string): Promise<GoogleLoginResponseDTO> {

    const googleUser = await this._googleAuthService.verifyIdToken(idToken);
    if (!googleUser) throw new Error(ERROR_MESSAGES.INVALID_GOOGLE_TOKEN);
    let user = await this._userRepo.findByEmail(googleUser.email);

    if (!user) {
      await this._userRepo.createUser({
        firstName: googleUser.firstName,
        lastName: googleUser.lastName,
        email: googleUser.email,
        password: "",
        avatarUrl: googleUser.avatarUrl,
        isBlocked: false,
        isEmailVerified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      user = await this._userRepo.findByEmail(googleUser.email);
    }
    if (!user?.id) throw new Error(USER_ERRORS.USER_ID_MISSING);

    const payload = {
      userId: user.id,
      email: user.email,
    };

    return {
      accessToken: this._jwtService.signAccessToken(payload),
      refreshToken: this._jwtService.signRefreshToken(payload),
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        isEmailVerified: user.isEmailVerified,
        avatarUrl: user.avatarUrl,
      },
    };
  }
}
