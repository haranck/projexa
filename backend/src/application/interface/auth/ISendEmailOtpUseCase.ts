import { ITempUserData } from "../../domain/interfaces/services/ITempUserStore";

export interface ISendEmailOtpUseCase {
    execute(userData:ITempUserData): Promise<void>;
}