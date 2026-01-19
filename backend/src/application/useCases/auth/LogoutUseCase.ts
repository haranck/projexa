import { inject, injectable } from "tsyringe";
import { ITokenBlacklistRepository } from "../../../domain/interfaces/repositories/ITokenBlacklistRepository";
import { IJwtService } from "../../../domain/interfaces/services/IJwtService";
import { ILogoutUseCase } from "../../interface/auth/ILogoutUseCase";
import { JwtPayload } from "jsonwebtoken";
import { ERROR_MESSAGES } from "../../../domain/constants/errorMessages";

@injectable()
export class LogoutUseCase implements ILogoutUseCase {
    constructor(
        @inject('ITokenBlacklistRepository') private _blacklistRepo: ITokenBlacklistRepository,
        @inject('IJwtService') private _jwtService: IJwtService
    ) { }
    async execute(accessToken: string): Promise<void> {
        const payload = this._jwtService.verifyAccessToken(accessToken)
        if (!payload) throw new Error(ERROR_MESSAGES.INVALID_TOKEN)

        const decoded = payload as JwtPayload
        if (!decoded.exp) throw new Error(ERROR_MESSAGES.INVALID_TOKEN)
        const exp = decoded.exp

        const ttl = exp - Math.floor(Date.now() / 1000)
        if (ttl > 0) {
            await this._blacklistRepo.blacklist(accessToken, ttl)
        }
    }
}
