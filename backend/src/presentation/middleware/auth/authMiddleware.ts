import { Request, Response, NextFunction } from "express";
import { IJwtService } from "../../../domain/interfaces/services/IJwtService";
import { ITokenBlacklistRepository } from "../../../domain/interfaces/repositories/ITokenBlacklistRepository";
import { ERROR_MESSAGES } from "../../../domain/constants/errorMessages";
import { HTTP_STATUS } from "../../../domain/constants/httpStatus";

export class AuthMiddleware {
  constructor(
    private readonly jwtService: IJwtService,
    private readonly blacklistRepo: ITokenBlacklistRepository
  ) {}
  authenticate = async (
    req: Request,
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

      const isBlacklisted = await this.blacklistRepo.isBlacklisted(token);
      if (isBlacklisted) {
        res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: ERROR_MESSAGES.TOKEN_REVOKED });
        return;
      }

      const payload = this.jwtService.verifyAccessToken(token);
      if (!payload) {
        res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: ERROR_MESSAGES.INVALID_TOKEN });
        return;
      }

      (req as any).user = payload;
      next();
    } catch (error) {
      res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: ERROR_MESSAGES.AUTHENTICATION_FAILED });
    }
  };
}
