import { CreateCheckoutSessionUseCaseDTO } from "../../dtos/user/requestDTOs/CreateCheckoutSessionUseCaseDTO";

export interface ICreateCheckoutSessionUseCase {
    execute(dto:CreateCheckoutSessionUseCaseDTO): Promise<string>;
}