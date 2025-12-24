import { Request, Response, NextFunction } from "express";
import { IJwtService } from "../../../domain/interfaces/services/IJwtService";
import { ITokenBlacklistRepository } from "../../../domain/interfaces/repositories/ITokenBlacklistRepository";

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
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      const token = authHeader.split(" ")[1];

      const isBlacklisted = await this.blacklistRepo.isBlacklisted(token);
      if (isBlacklisted) {
        res.status(401).json({ message: "Token is revoked" });
        return;
      }

      const payload = this.jwtService.verifyAccessToken(token);
      if (!payload) {
        res.status(401).json({ message: "Invalid token" });
        return;
      }

      (req as any).user = payload;
      next();
    } catch (error) {
      res.status(401).json({ message: "Authentication failed" });
    }
  };
}
