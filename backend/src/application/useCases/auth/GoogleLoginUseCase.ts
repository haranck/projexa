import { IUserRepository } from "../../../domain/interfaces/repositories/IUserRepository";
import { IJwtService } from "../../../domain/interfaces/services/IJwtService";
import { IGoogleAuthService } from "../../../domain/interfaces/services/IGoogleAuthService";
import {
  IGoogleLoginService,
  IGoogleLoginResult,
} from "../../services/IGoogleLoginService";

export class GoogleLoginUseCase implements IGoogleLoginService {
  constructor(
    private userRepo: IUserRepository,
    private jwtService: IJwtService,
    private googleAuthService: IGoogleAuthService
  ) {}
  async execute(idToken: string): Promise<IGoogleLoginResult> {
    const googleUser = await this.googleAuthService.verifyIdToken(idToken);
    if (!googleUser) throw new Error("Invalid Google Token");
    let user = await this.userRepo.findByEmail(googleUser.email);

    if (!user) {
      user = await this.userRepo.createUser({
        firstName: googleUser.firstName,
        lastName: googleUser.lastName,
        email: googleUser.email,
        password: "",
        avatarUrl: googleUser.avatarUrl,
        isEmailVerified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
    if (!user.id) throw new Error("User id missing");

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
