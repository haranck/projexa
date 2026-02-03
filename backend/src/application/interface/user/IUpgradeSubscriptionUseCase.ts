import {UpgradeSubscriptionInputDTO} from "../../dtos/user/requestDTOs/UpgradeSubscriptionDTO";

export interface IUpgradeSubscriptionUseCase {
    execute(dto:UpgradeSubscriptionInputDTO): Promise<void>;
}
