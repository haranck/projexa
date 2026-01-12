import { IAdminLogoutUseCase } from "../../interface/admin/IAdminLogoutUseCase";
import { injectable, inject } from "tsyringe";
import { IJwtService } from "../../../domain/interfaces/services/IJwtService";
import { ITokenBlacklistRepository } from "../../../domain/interfaces/repositories/ITokenBlacklistRepository";
import { ERROR_MESSAGES } from "../../../domain/constants/errorMessages";
import { JwtPayload } from "jsonwebtoken";

@injectable()
export class AdminLogoutUseCase implements IAdminLogoutUseCase {
    constructor(
        @inject('IJwtService') private jwtService: IJwtService,
        @inject('ITokenBlacklistRepository') private blacklistRepo: ITokenBlacklistRepository
    ) { }

    async execute(accessToken: string): Promise<void> {
        const payload = this.jwtService.verifyAccessToken(accessToken)

        if (!payload) throw new Error(ERROR_MESSAGES.INVALID_TOKEN)

        const decoded = payload as JwtPayload
        if (!decoded.exp) throw new Error(ERROR_MESSAGES.INVALID_TOKEN)
            
        const ttl = decoded.exp - Math.floor(Date.now() / 1000)

        if (ttl > 0) {
            await this.blacklistRepo.blacklist(accessToken, ttl)
        }
    }
}
