import { injectable, inject } from "tsyringe";
import { IGetChatRoomUseCase } from "../../interface/chat/IGetChatRoomUseCase";
import { IChatRoomEntity } from "../../../domain/entities/Chat/IChatRoomEntity";
import { IChatRepository } from "../../../domain/interfaces/repositories/ChatRepo/IChatRepository";
import { IProjectRepository } from "../../../domain/interfaces/repositories/ProjectRepo/IProjectRepository";

@injectable()
export class GetChatRoomUseCase implements IGetChatRoomUseCase {
    constructor(
        @inject("IChatRepository") private readonly _chatRepository: IChatRepository,
        @inject("IProjectRepository") private readonly _projectRepository: IProjectRepository
    ) { }

    async execute(projectId: string): Promise<IChatRoomEntity | null> {
        let room = await this._chatRepository.getRoomByProjectId(projectId);

        if (!room) {
            const project = await this._projectRepository.getProjectById(projectId);
            if (!project) return null;

            const chatMembers = project.members?.map(m => m.userId) || [];
            if (!chatMembers.includes(project.createdBy)) {
                chatMembers.push(project.createdBy);
            }

            room = await this._chatRepository.createRoom({
                projectId,
                members: chatMembers
            });
        }

        return room;
    }
}