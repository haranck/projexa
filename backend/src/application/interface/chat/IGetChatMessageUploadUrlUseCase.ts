import { ChatMessageUploadUrlDTO } from "../../dtos/chat/requestDTOs/ChatMessageUploadUrlDTO";
import { ChatMessageUploadUrlResponseDTO } from "../../dtos/chat/responseDTOs/ChatMessageUploadUrlResponseDTO";

export interface IGetChatMessageUploadUrlUseCase {
    execute(data: ChatMessageUploadUrlDTO, roomId: string, userId: string): Promise<ChatMessageUploadUrlResponseDTO>;
}