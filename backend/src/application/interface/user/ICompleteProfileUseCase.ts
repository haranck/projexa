import { IUserEntity } from "../../../domain/entities/IUserEntity";
import { CompleteProfileDTO } from "../../dtos/user/requestDTOs/CompleteProfileDTO";

export interface ICompleteProfileUseCase {
    execute(userId: string, dto: CompleteProfileDTO): Promise<IUserEntity>;
}
