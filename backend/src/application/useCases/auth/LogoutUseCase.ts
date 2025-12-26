import { ITokenBlacklistRepository } from "../../../domain/interfaces/repositories/ITokenBlacklistRepository";
import { IJwtService } from "../../../domain/interfaces/services/IJwtService";
import { ILogoutService } from "../../services/ILogoutService";

export class LogoutUseCase implements ILogoutService {
  constructor(
    private blacklistRepo: ITokenBlacklistRepository,
    private jwtService: IJwtService
  ) {}
  async execute(accessToken: string): Promise<void> {
    const payload = this.jwtService.verifyAccessToken(accessToken);
    if (!payload) return;

    const decoded: any = payload;
    const exp = decoded.exp; 

    const ttl = exp - Math.floor(Date.now() / 1000);
    if (ttl > 0) {
      await this.blacklistRepo.blacklist(accessToken, ttl);
    }
  }
}
