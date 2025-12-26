import { OAuth2Client } from "google-auth-library";
import { IGoogleAuthService } from "../../domain/interfaces/services/IGoogleAuthService";

export class GoogleAuthService implements IGoogleAuthService{

    private client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)
    async verifyIdToken(idToken: string): Promise<{ email: string; firstName: string; lastName: string; avatarUrl?: string; } | null> {
        const ticket = await this.client.verifyIdToken({
            idToken,
            audience:process.env.GOOGLE_CLIENT_ID
        })
        const payload = (await ticket).getPayload()

        if(!payload || !payload.email) return null

        return {
            email:payload.email,
            firstName:payload.given_name||'',
            lastName:payload.family_name||'',
            avatarUrl:payload.picture
        }
    }
}
