export interface IGoogleAuthService {
  verifyIdToken(idToken: string): Promise<{
    email: string;
    firstName: string;
    lastName: string;
    avatarUrl?: string;
  } | null>;
}
