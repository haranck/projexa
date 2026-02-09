import { IUserRepository } from "../../../domain/interfaces/repositories/IUserRepository";
import { IPasswordService } from "../../../domain/interfaces/services/IPasswordService";
import { IJwtService } from "../../../domain/interfaces/services/IJwtService";
import { LoginUserDTO } from "../../dtos/auth/requestDTOs/LoginUserDTO";
import { LoginResponseDTO } from "../../dtos/auth/responseDTOs/LoginResponseDTO";
import { ERROR_MESSAGES } from "../../../domain/constants/errorMessages";
import { USER_ERRORS } from "../../../domain/constants/errorMessages";
import { ILoginUserUseCase } from "../../interface/auth/ILoginUserUseCase";
import { IWorkspaceRepository } from "../../../domain/interfaces/repositories/IWorkspaceRepository";
import { injectable, inject } from "tsyringe";
import { env } from "../../../config/envValidation";

@injectable()
export class LoginUserUseCase implements ILoginUserUseCase {
  constructor(
    @inject('IUserRepository') private _userRepo: IUserRepository,
    @inject('IPasswordService') private _passwordService: IPasswordService,
    @inject('IJwtService') private _jwtService: IJwtService,
    @inject("IWorkspaceRepository") private _workspaceRepository: IWorkspaceRepository,
  ) { }

  async execute(dto: LoginUserDTO): Promise<LoginResponseDTO> {



    if (dto.email === env.ADMIN_EMAIL) throw new Error(ERROR_MESSAGES.ADMIN_LOGIN_NOT_ALLOWED);

    const user = await this._userRepo.findByEmail(dto.email);

    if (user?.isBlocked) throw new Error(USER_ERRORS.USER_BLOCKED);

    if (!user) throw new Error(ERROR_MESSAGES.INVALID_CREDENTIALS);

    if (!user.isEmailVerified) throw new Error(USER_ERRORS.USER_EMAIL_NOT_VERIFIED);

    const isMatch = await this._passwordService.compare(dto.password, user.password!);

    if (!isMatch) throw new Error(ERROR_MESSAGES.INVALID_CREDENTIALS);

    if (!user.id) throw new Error(USER_ERRORS.USER_ID_MISSING);

    const workspaces = await this._workspaceRepository.getWorkspacesByUserId(user.id.toString());

    const workspaceMap = workspaces.map(workspace => ({
      id: workspace._id!.toString(),
      name: workspace.name,
      ownerId: workspace.ownerId!
    }))

    const defaultWorkspace = workspaceMap.length > 0 ? workspaceMap[0] : null;

    const payload = {
      userId: user.id,
      email: user.email,
    };

    const accessToken = this._jwtService.signAccessToken(payload);
    const refreshToken = this._jwtService.signRefreshToken(payload);


    return {
      accessToken,
      refreshToken,
      hasWorkspace: workspaces.length > 0,
      workspaces: workspaceMap,
      defaultWorkspace,
      user: {
        id: user.id,
        firstName: user.firstName!,
        lastName: user.lastName!,
        email: user.email,
        phone: user.phone || "",
        isEmailVerified: user.isEmailVerified,
        avatarUrl: user.avatarUrl,
      },
    };
  }
}
