import jwt from 'jsonwebtoken'
import { IJwtService } from '../../domain/interfaces/services/IJwtService'
import { JwtPayload } from '../../domain/entities/IJwtPayload'
import { ERROR_MESSAGES } from '../../domain/constants/errorMessages'

export class JwtService implements IJwtService {
    private ACCESS_SECRET: string
    private REFRESH_SECRET: string

    constructor() {
        const access = process.env.JWT_ACCESS_SECRET
        const refresh = process.env.JWT_REFRESH_SECRET

        if (!access || !refresh) {
            throw new Error(ERROR_MESSAGES.JWT_SECRET_MISSING)
        }

        this.ACCESS_SECRET = access
        this.REFRESH_SECRET = refresh
    }

    signAccessToken(payload: JwtPayload): string {
        return jwt.sign(payload, this.ACCESS_SECRET, { expiresIn: '30m' })
    }

    signRefreshToken(payload: JwtPayload): string {
        return jwt.sign(payload, this.REFRESH_SECRET, { expiresIn: "7d" })
    }

    verifyAccessToken(token: string): JwtPayload | null {
        try {
            return jwt.verify(token, this.ACCESS_SECRET) as JwtPayload
        } catch {
            throw new Error(ERROR_MESSAGES.INVALID_TOKEN)
        }
    }

    verifyRefreshToken(token: string): JwtPayload | null {
        try {
            return jwt.verify(token, this.REFRESH_SECRET) as JwtPayload
        } catch {
            throw new Error(ERROR_MESSAGES.INVALID_TOKEN)
        }
    }
}
