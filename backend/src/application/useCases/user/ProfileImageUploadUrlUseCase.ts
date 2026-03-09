import { ProfileImageUploadUrlDTO } from "../../dtos/user/requestDTOs/ProfileImageUploadUrlDTO";
import { ProfileImageUploadUrlResponseDTO } from "../../dtos/user/responseDTOs/ProfileImageUploadUrlResponseDTO";
import { IProfileImageUploadUrlUseCase } from "../../interface/user/IProfileImageUploadUrlUseCase";
import { injectable, inject } from "tsyringe";
import { IS3Service } from "../../../domain/interfaces/services/IS3Service";
import { env } from "../../../config/envValidation";

@injectable()
export class ProfileImageUploadUrlUseCase implements IProfileImageUploadUrlUseCase {
    constructor(
        @inject("IS3Service") private readonly _s3Service: IS3Service
    ) { }
    async execute(dto: ProfileImageUploadUrlDTO): Promise<ProfileImageUploadUrlResponseDTO> {
        const { userId, contentType } = dto
        const key = `profile-images/${userId}/${Date.now()}.jpg`
        const uploadUrl = await this._s3Service.getUploadUrl(key, contentType || 'image/jpeg')
        const imageUrl = `https://${env.CLOUDFRONT_URL}/${key}`
        return { uploadUrl, imageUrl }
    }
}
