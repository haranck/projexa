export interface IUserEntity {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  password: string;
  avatarUrl?: string;
  isEmailVerified: boolean;
  lastSeenAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
