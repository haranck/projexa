import { ChatMessageUploadUrlDTO } from "../../dtos/chat/requestDTOs/ChatMessageUploadUrlDTO";
import { ChatMessageUploadUrlResponseDTO } from "../../dtos/chat/responseDTOs/ChatMessageUploadUrlResponseDTO";
import { IGetChatMessageUploadUrlUseCase } from "../../interface/chat/IGetChatMessageUploadUrlUseCase";
import { injectable, inject } from "tsyringe";
import { IS3Service } from "../../../domain/interfaces/services/IS3Service";
import { env } from "../../../config/envValidation";
import { CHAT_ERRORS } from "../../../domain/constants/errorMessages";
import crypto from 'crypto'

@injectable()
export class GetChatMessageUploadUrlUseCase implements IGetChatMessageUploadUrlUseCase {
    constructor(
        @inject("IS3Service") private readonly _s3Service: IS3Service
    ) { }
    async execute(data: ChatMessageUploadUrlDTO, roomId: string, userId: string): Promise<ChatMessageUploadUrlResponseDTO> {
        if (!data.contentType) throw new Error(CHAT_ERRORS.CONTENT_TYPE_REQUIRED)

        const extension = data.contentType.split('/')[1]
        const tempId = crypto.randomUUID()
        const key = `chat/attachments/${roomId}/${userId}/${tempId}.${extension}`
        const uploadUrl = await this._s3Service.getUploadUrl(key, data.contentType)
        const fileUrl = `https://${env.CLOUDFRONT_URL}/${key}`
        return { uploadUrl, fileUrl }
    }
}