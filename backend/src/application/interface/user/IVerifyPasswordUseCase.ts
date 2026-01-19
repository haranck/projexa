import { VerifyPasswordDTO } from "../../dtos/user/requestDTOs/VerifyPasswordDTO";

export interface IVerifyPasswordUseCase {
    execute(dto: VerifyPasswordDTO): Promise<void>;
}