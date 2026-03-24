import { ChatMessageUploadUrlResponseDTO } from "../../dtos/chat/responseDTOs/ChatMessageUploadUrlResponseDTO";

export class ChatDTOmapper {
    static toUploadUrlResponseDTO(uploadUrl: string, fileUrl: string): ChatMessageUploadUrlResponseDTO {
        return {
            uploadUrl,
            fileUrl
        };
    }
}
