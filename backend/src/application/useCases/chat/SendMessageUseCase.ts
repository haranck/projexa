import { ISendMessageUseCase } from "../../interface/chat/ISendMessageUseCase";
import { injectable, inject } from "tsyringe";
import { IMessageEntity } from "../../../domain/entities/Chat/IMessageEntity";
import { IMessageRepository } from "../../../domain/interfaces/repositories/ChatRepo/IMessageRepository";
import { IChatRepository } from "../../../domain/interfaces/repositories/ChatRepo/IChatRepository";
import { IChatService } from "../../../domain/interfaces/services/IChatService";
import { MessageDTOmapper } from "../../mappers/MessageDTOmapper";
import { MessageDTO } from "../../dtos/chat/requestDTOs/MessageDTO";
import { ISendNotificationUseCase } from "../../interface/notification/ISendNotificationUseCase";
import { NotificationEventType } from "../../../domain/enums/NotificationEventType";
import { IProjectRepository } from "../../../domain/interfaces/repositories/ProjectRepo/IProjectRepository";
import { IUserRepository } from "../../../domain/interfaces/repositories/IUserRepository";
import { NOTIFICATION_ERRORS } from "../../../domain/constants/errorMessages";


@injectable()
export class SendMessageUseCase implements ISendMessageUseCase {
    constructor(
        @inject("IMessageRepository") private readonly _messageRepository: IMessageRepository,
        @inject("IChatRepository") private readonly _chatRepository: IChatRepository,
        @inject("IChatService") private readonly _chatService: IChatService,
        @inject("ISendNotificationUseCase") private readonly _sendNotification: ISendNotificationUseCase,
        @inject("IProjectRepository") private readonly _projectRepository: IProjectRepository,
        @inject("IUserRepository") private readonly _userRepository: IUserRepository
    ) { }

    async execute(data: MessageDTO): Promise<IMessageEntity> {

        const messageData = MessageDTOmapper.toDomain(data);

        const savedMessage = await this._messageRepository.createMessage(messageData);

        const room = await this._chatRepository.findByRoomId(savedMessage.roomId);

        if (room && room.members) {
            const project = await this._projectRepository.getProjectById(room.projectId);
            const sender = await this._userRepository.findById(savedMessage.senderId);

            const projectName = project?.projectName || "Project";
            const senderName = sender ? `${sender.firstName} ${sender.lastName}` : "Someone";

            for (const recipientId of room.members) {
                if (recipientId !== savedMessage.senderId) {
                    try {
                        await this._sendNotification.execute({
                            recipientId,
                            senderId: savedMessage.senderId,
                            eventType: NotificationEventType.NEW_MESSAGE,
                            message: `${projectName}\n${senderName}: "${savedMessage.content}"`,
                            resourceId: savedMessage.roomId,
                            resourceType: 'chat'
                        });
                    } catch (err) {
                        console.error(NOTIFICATION_ERRORS.NOTIFICATION_FAILED_TO_SEND_NOTIFICATIONS, err);
                    }
                }
            }
        }

        if (savedMessage._id) {
            await this._chatRepository.updateLastMessage(savedMessage.roomId, savedMessage._id);
        }

        this._chatService.emitToRoom(savedMessage.roomId, savedMessage);

        return savedMessage;
    }
}