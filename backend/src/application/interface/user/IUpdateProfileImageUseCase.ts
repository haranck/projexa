import { UpdateProfileImageDTO } from "../../dtos/user/requestDTOs/UpdateProfileImageDTO";
import { UpdateProfileImageResponseDTO } from "../../dtos/user/responseDTOs/UpdateProfileImageResponseDTO";

export interface IUpdateProfileImageUseCase{
    execute(dto:UpdateProfileImageDTO):Promise<UpdateProfileImageResponseDTO>
}