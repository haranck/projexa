import { injectable, inject } from "tsyringe";
import { IUserRepository } from "../../../domain/interfaces/repositories/IUserRepository";
import { IJwtService } from "../../../domain/interfaces/services/IJwtService";
import { IGoogleAuthService } from "../../../domain/interfaces/services/IGoogleAuthService";
import {
  IGoogleLoginUseCase,
  IGoogleLoginResult,
} from "../../interface/auth/IGoogleLoginUseCase";
import { ERROR_MESSAGES } from "../../../domain/constants/errorMessages";
import { USER_ERRORS } from "../../../domain/constants/errorMessages";

@injectable()
export class GoogleLoginUseCase implements IGoogleLoginUseCase {
  constructor(
    @inject('IUserRepository') private userRepo: IUserRepository,
    @inject('IJwtService') private jwtService: IJwtService,
    @inject('IGoogleAuthService') private googleAuthService: IGoogleAuthService
  ) { }
  async execute(idToken: string): Promise<IGoogleLoginResult> {

    const googleUser = await this.googleAuthService.verifyIdToken(idToken);
    if (!googleUser) throw new Error(ERROR_MESSAGES.INVALID_GOOGLE_TOKEN);
    let user = await this.userRepo.findByEmail(googleUser.email);

    if (!user) {
      await this.userRepo.createUser({
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
      user = await this.userRepo.findByEmail(googleUser.email);
    }
    if (!user?.id) throw new Error(USER_ERRORS.USER_ID_MISSING);

    const payload = {
      userId: user.id,
      email: user.email,
    };

    return {
      accessToken: this.jwtService.signAccessToken(payload),
      refreshToken: this.jwtService.signRefreshToken(payload),
      user,
    };
  }
}
