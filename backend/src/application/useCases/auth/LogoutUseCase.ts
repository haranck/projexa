import { inject, injectable } from "tsyringe";
import { ITokenBlacklistRepository } from "../../../domain/interfaces/repositories/ITokenBlacklistRepository";
import { IJwtService } from "../../../domain/interfaces/services/IJwtService";
import { ILogoutService } from "../../services/ILogoutService";
import { JwtPayload } from "jsonwebtoken";


@injectable()
export class LogoutUseCase implements ILogoutService{
    constructor(
        @inject('ITokenBlacklistRepository') private blacklistRepo:ITokenBlacklistRepository,
        @inject('IJwtService') private jwtService:IJwtService
    ){}
    async execute(accessToken: string): Promise<void> {
        const payload = this.jwtService.verifyAccessToken(accessToken)
        if(!payload)return

        const decoded = payload as JwtPayload
        if(!decoded.exp) return
        const exp = decoded.exp 
        
        const ttl = exp - Math.floor(Date.now() / 1000)
        if(ttl > 0){
            await this.blacklistRepo.blacklist(accessToken,ttl)
        }
    }
}

