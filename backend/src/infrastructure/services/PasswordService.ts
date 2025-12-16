import bcrypt from "bcrypt";
import { IPasswordService } from "../../domain/interfaces/services/IPasswordService";
export class PasswordService implements IPasswordService {
  async hash(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }
}
