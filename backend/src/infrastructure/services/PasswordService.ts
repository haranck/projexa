import bcrypt from "bcrypt";
import { IPasswordService } from "../../domain/interfaces/services/IPasswordService";

export class PasswordService implements IPasswordService {
  async hash(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }
  async compare(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password,hashedPassword)
  }
}
