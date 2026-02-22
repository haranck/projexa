import { AttachmentUploadUrlDTO } from "../../dtos/issue/requestDTOs/AttachmentUploadUrlDTO";
import { AttachmentUploadUrlResponseDTO } from "../../dtos/issue/responseDTOs/AttachmentUploadUrlResponseDTO";

export interface IAttachmentUploadUrlUseCase {
    execute(dto: AttachmentUploadUrlDTO, userId: string): Promise<AttachmentUploadUrlResponseDTO>;
}