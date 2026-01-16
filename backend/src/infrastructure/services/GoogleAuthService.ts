import { OAuth2Client } from "google-auth-library";
import { IGoogleAuthService } from "../../domain/interfaces/services/IGoogleAuthService";
import logger from "../../config/logger";

export class GoogleAuthService implements IGoogleAuthService {

    private client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)
    
    async verifyIdToken(token: string): Promise<{ email: string; firstName: string; lastName: string; avatarUrl?: string; } | null> {
        try {
            const response = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (!response.ok) {
                const text = await response.text();
                logger.error('Failed to fetch user info from Google:', response.status, response.statusText, text);
                return null;
            }
            const payload = await response.json();

            if (!payload || !payload.email) return null;

            return {
                email: payload.email,
                firstName: payload.given_name || '',
                lastName: payload.family_name || '',
                avatarUrl: payload.picture
            };
        } catch (error) {
            logger.error('Error verifying Google token:', error);
            return null;
        }
    }
}
