import { injectable, inject } from "tsyringe";
import { IUserRepository } from "../../../domain/interfaces/repositories/IUserRepository";
import { IJwtService } from "../../../domain/interfaces/services/IJwtService";
import { IGoogleAuthService } from "../../../domain/interfaces/services/IGoogleAuthService";
import { IWorkspaceRepository } from "../../../domain/interfaces/repositories/IWorkspaceRepository";
import { IGoogleLoginUseCase } from "../../interface/auth/IGoogleLoginUseCase";
import { ERROR_MESSAGES } from "../../../domain/constants/errorMessages";
import { USER_ERRORS } from "../../../domain/constants/errorMessages";
import { GoogleLoginResponseDTO } from "../../dtos/auth/responseDTOs/GoogleLoginResponseDTO";

import { AuthDTOmapper } from "../../mappers/Auth/AuthDTOmapper";

@injectable()
export class GoogleLoginUseCase implements IGoogleLoginUseCase {
  constructor(
    @inject('IUserRepository') private _userRepo: IUserRepository,
    @inject('IJwtService') private _jwtService: IJwtService,
    @inject('IGoogleAuthService') private _googleAuthService: IGoogleAuthService,
    @inject("IWorkspaceRepository") private _workspaceRepository: IWorkspaceRepository,
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
        phone: "",
        password: "",
        avatarUrl: googleUser.avatarUrl,
        isBlocked: false,
        isEmailVerified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      user = await this._userRepo.findByEmail(googleUser.email);
    }
    if (!user?._id) throw new Error(USER_ERRORS.USER_ID_MISSING);

    const payload = {
      userId: user._id,
      email: user.email,
    };

    const workspaces = await this._workspaceRepository.getWorkspacesByUserId(user._id.toString());
    const accessToken = this._jwtService.signAccessToken(payload);
    const refreshToken = this._jwtService.signRefreshToken(payload);

    return AuthDTOmapper.toGoogleLoginResponseDTO(user, accessToken, refreshToken, workspaces);
  }
}
