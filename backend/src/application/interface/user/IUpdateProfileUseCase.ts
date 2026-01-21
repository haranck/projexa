import { UpdateProfileDTO } from "../../dtos/user/requestDTOs/UpdateProfileDTO";
import { UpdateProfileResponseDTO } from "../../dtos/user/responseDTOs/UpdateProfileResponseDTO";

export interface IUpdateProfileUseCase {
    execute(dto:UpdateProfileDTO):Promise<UpdateProfileResponseDTO>
}
