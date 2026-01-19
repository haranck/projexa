import jwt from 'jsonwebtoken'
import { IJwtService } from '../../domain/interfaces/services/IJwtService'
import { JwtPayload } from '../../domain/entities/IJwtPayload'
import { ERROR_MESSAGES } from '../../domain/constants/errorMessages'
import { env } from '../../config/envValidation'
import { env } from '../../config/envValidation'

export class JwtService implements IJwtService {
    private _ACCESS_SECRET: string
    private _REFRESH_SECRET: string

    constructor() {
        this._ACCESS_SECRET = env.JWT_ACCESS_SECRET
        this._REFRESH_SECRET = env.JWT_REFRESH_SECRET
    }

    signAccessToken(payload: JwtPayload): string {
        return jwt.sign(payload, this._ACCESS_SECRET, { expiresIn: '30m' })
    }

    signRefreshToken(payload: JwtPayload): string {
        return jwt.sign(payload, this._REFRESH_SECRET, { expiresIn: "7d" })
    }

    verifyAccessToken(token: string): JwtPayload | null {
        try {
            return jwt.verify(token, this._ACCESS_SECRET) as JwtPayload
        } catch {
            throw new Error(ERROR_MESSAGES.INVALID_TOKEN)
        }
    }

    verifyRefreshToken(token: string): JwtPayload | null {
        try {
            return jwt.verify(token, this._REFRESH_SECRET) as JwtPayload
        } catch {
            throw new Error(ERROR_MESSAGES.INVALID_TOKEN)
        }
    }
}
