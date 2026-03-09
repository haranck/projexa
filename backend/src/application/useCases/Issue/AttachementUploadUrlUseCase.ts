import { AttachmentUploadUrlDTO } from "../../dtos/issue/requestDTOs/AttachmentUploadUrlDTO";
import { AttachmentUploadUrlResponseDTO } from "../../dtos/issue/responseDTOs/AttachmentUploadUrlResponseDTO";
import { IAttachmentUploadUrlUseCase } from "../../interface/Issue/IAttachementUploadUrlUseCase";
import { injectable, inject } from "tsyringe";
import { IS3Service } from "../../../domain/interfaces/services/IS3Service";
import { env } from "../../../config/envValidation";
import { PROJECT_ERRORS } from "../../../domain/constants/errorMessages";
import crypto from 'crypto'

@injectable()
export class AttachmentUploadUrlUseCase implements IAttachmentUploadUrlUseCase {
    constructor(
        @inject("IS3Service") private readonly _s3Service: IS3Service
    ) { }
    async execute(dto: AttachmentUploadUrlDTO, userId: string): Promise<AttachmentUploadUrlResponseDTO> {
        if (!dto.contentType.trim()) throw new Error(PROJECT_ERRORS.CONTENT_TYPE_REQUIRED)

        const extension = dto.contentType.split('/')[1]
        const tempId = crypto.randomUUID()
        const key = `attachments/${userId}/${tempId}.${extension}`
        const uploadUrl = await this._s3Service.getUploadUrl(key, dto.contentType)
        const fileUrl = `https://${env.CLOUDFRONT_URL}/${key}`
        return { uploadUrl, fileUrl }
    }
}
