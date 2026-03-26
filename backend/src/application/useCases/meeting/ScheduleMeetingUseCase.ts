import { inject, injectable } from "tsyringe";
import { IMeetingRepository } from "../../../domain/interfaces/repositories/MeetingRepo/IMeetingRepository";
import { ScheduleMeetingDTO } from "../../dtos/project/requestDTOs/ScheduleMeetingDTO";
import { IMeetingEntity } from "../../../domain/entities/Meeting/IMeetingEntity";
import { IMeetingParticipantEntity } from "../../../domain/entities/Meeting/IMeetingParticipantEntity";
import { MEETING_ERRORS } from "../../../domain/constants/errorMessages";
import { IScheduleMeetingUseCase } from "../../interface/meeting/IScheduleMeetingUseCase";
import { IProjectRepository } from "../../../domain/interfaces/repositories/ProjectRepo/IProjectRepository";
import { ISendNotificationUseCase } from "../../interface/notification/ISendNotificationUseCase";
import { NotificationEventType } from "../../../domain/enums/NotificationEventType";

@injectable()
export class ScheduleMeetingUseCase implements IScheduleMeetingUseCase {
    constructor(
        @inject("IMeetingRepository") private meetingRepo: IMeetingRepository,
        @inject("IProjectRepository") private projectRepo: IProjectRepository,
        @inject("ISendNotificationUseCase") private sendNotification: ISendNotificationUseCase
    ) { }

    async execute(dto: ScheduleMeetingDTO): Promise<IMeetingEntity> {
        const project = await this.projectRepo.getProjectById(dto.projectId);
        if (!project) {
            throw new Error("Project not found");
        }

        if (project.createdBy.toString() !== dto.hostId.toString()) {
            throw new Error(MEETING_ERRORS.MEETING_NOT_AUTHORIZED);
        }

        if (new Date(dto.startTime) <= new Date()) {
            throw new Error(MEETING_ERRORS.MEETING_INVALID_DATES);
        }

        const participants: IMeetingParticipantEntity[] = dto.invitees.map(userId => ({
            userId,
            status: 'invited' as const
        }));

        const roomName = `projexa_${dto.projectId}_${Date.now()}`;

        const meeting = await this.meetingRepo.createMeeting({
            ...dto,
            participants,
            roomName,
            status: 'upcoming'
        });

        participants.forEach(async (participant) => {
            await this.sendNotification.execute({
                recipientId: participant.userId,
                eventType: NotificationEventType.MEETING_SCHEDULED,
                message: `Meeting "${dto.title}" has been scheduled`,
                resourceId: meeting._id,
                resourceType: "meeting"
            });
        });

        return meeting;
    }
}
