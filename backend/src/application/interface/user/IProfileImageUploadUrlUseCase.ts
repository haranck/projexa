import { ProfileImageUploadUrlDTO } from "../../dtos/user/requestDTOs/ProfileImageUploadUrlDTO";
import { ProfileImageUploadUrlResponseDTO } from "../../dtos/user/responseDTOs/ProfileImageUploadUrlResponseDTO";

export interface IProfileImageUploadUrlUseCase{
    execute(dto: ProfileImageUploadUrlDTO):Promise<ProfileImageUploadUrlResponseDTO>
} 