import { Request, Response, NextFunction } from "express";
import { IJwtService } from "../../../domain/interfaces/services/IJwtService";
import { ITokenBlacklistRepository } from "../../../domain/interfaces/repositories/ITokenBlacklistRepository";
import { JwtPayload } from "../../../domain/entities/IJwtPayload";
import { ERROR_MESSAGES, USER_ERRORS } from "../../../domain/constants/errorMessages";
import { HTTP_STATUS } from "../../../domain/constants/httpStatus";
import { IUserRepository } from "../../../domain/interfaces/repositories/IUserRepository"
import { injectable, inject } from "tsyringe";

export interface AuthRequest extends Request {
  user?: JwtPayload;
}

@injectable()
export class AuthMiddleware {
  constructor(
    @inject('IJwtService') private readonly _jwtService: IJwtService,
    @inject('ITokenBlacklistRepository') private readonly _blacklistRepo: ITokenBlacklistRepository,
    @inject('IUserRepository') private readonly _userRepository: IUserRepository
  ) { }

  authenticate = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {

      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: ERROR_MESSAGES.UNAUTHORIZED });
        return;
      }

      const token = authHeader.split(" ")[1];

      const isBlacklisted = await this._blacklistRepo.isBlacklisted(token);
      if (isBlacklisted) {
        res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: ERROR_MESSAGES.TOKEN_REVOKED });
        return;
      }

      const payload = this._jwtService.verifyAccessToken(token);
      if (!payload) {
        res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: ERROR_MESSAGES.INVALID_TOKEN });
        return;
      }

      if (payload.userId === 'ADMIN') {
        req.user = payload;
        next();
        return;
      }

      const user = await this._userRepository.findById(payload.userId);
      if (!user) {
        res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: USER_ERRORS.USER_NOT_FOUND });
        return;
      }

      if (user.isBlocked) {
        res.status(HTTP_STATUS.FORBIDDEN).json({ message: USER_ERRORS.USER_BLOCKED });
        return;
      }

      req.user = payload;
      next();

    } catch (error) {
      if (error instanceof Error) {
        res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: error.message });
        return;
      }

      res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: ERROR_MESSAGES.AUTHENTICATION_FAILED });
    }
  };
}
