import { Response } from "express";
import { injectable, inject } from "tsyringe";
import { HTTP_STATUS } from "../../../domain/constants/httpStatus";
import { MESSAGES } from "../../../domain/constants/messages";
import { AuthRequest } from "../../middleware/auth/authMiddleware";
import { IGetMessagesUseCase } from "../../../application/interface/chat/IGetMessagesUseCase";
import { IChatRepository } from "../../../domain/interfaces/repositories/ChatRepo/IChatRepository";
import { IGetChatRoomUseCase } from "../../../application/interface/chat/IGetChatRoomUseCase";
import { IGetChatMessageUploadUrlUseCase } from "../../../application/interface/chat/IGetChatMessageUploadUrlUseCase";
import { ChatMessageUploadUrlDTO } from "../../../application/dtos/chat/requestDTOs/ChatMessageUploadUrlDTO";
import { ERROR_MESSAGES } from "../../../domain/constants/errorMessages";

@injectable()
export class ChatController {
    constructor(
        @inject("IGetMessagesUseCase") private readonly _getMessagesUseCase: IGetMessagesUseCase,
        @inject("IChatRepository") private readonly _chatRepository: IChatRepository,
        @inject("IGetChatRoomUseCase") private readonly _getChatRoomUseCase: IGetChatRoomUseCase,
        @inject("IGetChatMessageUploadUrlUseCase") private readonly _getChatMessageUploadUrlUseCase: IGetChatMessageUploadUrlUseCase,
    ) { }

    getChatRoom = async (req: AuthRequest, res: Response) => {
        try {
            const { projectId } = req.params;
            const room = await this._getChatRoomUseCase.execute(projectId as string);
            return res.status(HTTP_STATUS.OK).json({ message: MESSAGES.CHAT.ROOM_FETCHED_SUCCESSFULLY, data: room });
        } catch (error: unknown) {
            const err = error as { status?: number; message: string };
            res.status(err.status || HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: err.message });
        }
    }

    getMessages = async (req: AuthRequest, res: Response) => {
        try {
            const { roomId } = req.params;
            const messages = await this._getMessagesUseCase.execute(roomId as string);
            return res.status(HTTP_STATUS.OK).json({ message: MESSAGES.CHAT.MESSAGES_FETCHED_SUCCESSFULLY, data: messages });
        } catch (error: unknown) {
            const err = error as { status?: number; message: string };
            res.status(err.status || HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: err.message });
        }
    }

    getUploadUrl = async (req: AuthRequest, res: Response) => {
        try {
            const { roomId } = req.params;
            const userId = req.user?.userId;
            if (!userId) throw new Error(ERROR_MESSAGES.UNAUTHORIZED);

            const dto: ChatMessageUploadUrlDTO = req.body;
            const result = await this._getChatMessageUploadUrlUseCase.execute(dto, roomId as string, userId);

            return res.status(HTTP_STATUS.OK).json({
                message: MESSAGES.CHAT.UPLOAD_URL_GENERATED_SUCCESSFULLY,
                data: result
            });
        } catch (error: unknown) {
            const err = error as { status?: number; message: string };
            res.status(err.status || HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: err.message });
        }
    }
}