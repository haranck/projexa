export interface IUserEntity {
  _id?: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;
  password?: string;
  avatarUrl?: string;
  isBlocked?: boolean;
  isEmailVerified?: boolean;
  onboardingCompleted?: boolean;
  lastSeenAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
