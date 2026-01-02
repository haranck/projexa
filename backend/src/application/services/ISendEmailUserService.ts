import { ITempUserData } from "../../domain/interfaces/services/ITempUserStore";

export interface ISendEmailUserService {
    execute(userData:ITempUserData): Promise<void>;
}