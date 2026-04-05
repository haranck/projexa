import { inject, injectable } from "tsyringe";
import { IMeetingRepository } from "../../../domain/interfaces/repositories/MeetingRepo/IMeetingRepository";
import { RescheduleMeetingDTO } from "../../dtos/project/requestDTOs/ScheduleMeetingDTO";
import { IMeetingEntity } from "../../../domain/entities/Meeting/IMeetingEntity";
import { MEETING_ERRORS } from "../../../domain/constants/errorMessages";
import { IRescheduleMeetingUseCase } from "../../interface/meeting/IRescheduleMeetingUseCase";
import { ISendNotificationUseCase } from "../../interface/notification/ISendNotificationUseCase";
import { NotificationEventType } from "../../../domain/enums/NotificationEventType";
import { IProjectRepository } from "../../../domain/interfaces/repositories/ProjectRepo/IProjectRepository";
import { IRoleRepository } from "../../../domain/interfaces/repositories/IRoleRepository";
// import { ProjectRole } from "../../../domain/enums/ProjectRole";

@injectable()
export class RescheduleMeetingUseCase implements IRescheduleMeetingUseCase {
    constructor(
        @inject("IMeetingRepository") private meetingRepo: IMeetingRepository,
        @inject("IProjectRepository") private projectRepo: IProjectRepository,
        @inject("IRoleRepository") private roleRepo: IRoleRepository,
        @inject("ISendNotificationUseCase") private sendNotification: ISendNotificationUseCase
    ) { }

    async execute(dto: RescheduleMeetingDTO): Promise<IMeetingEntity> {
        const meeting = await this.meetingRepo.getMeetingById(dto.meetingId);
        if (!meeting) throw new Error(MEETING_ERRORS.MEETING_NOT_FOUND);

        // let isAuthorized = meeting.hostId === dto.hostId;

        // if (!isAuthorized) {
        //     const project = await this.projectRepo.getProjectById(meeting.projectId);
        //     const member = project?.members?.find(m => m.userId === dto.hostId);
        //     if (member) {
        //         const role = await this.roleRepo.getRoleById(member.roleId);
        //         if (role?.name === ProjectRole.PROJECT_MANAGER) isAuthorized = true;
        //     }
        // }

        // if (!isAuthorized) throw new Error(MEETING_ERRORS.ONLY_HOST_CAN_RESCHEDULE);

        if (dto.startTime && new Date(dto.startTime) <= new Date()) {
            throw new Error(MEETING_ERRORS.MEETING_INVALID_DATES);
        }

        const participants = dto.invitees?.map(userId =>
            meeting.participants?.find(p => p.userId === userId) || { userId, status: 'invited' as const }
        );

        const updated = await this.meetingRepo.updateMeeting(dto.meetingId, {
            title: dto.title,
            description: dto.description,
            startTime: dto.startTime,
            endTime: dto.endTime,
            participants
        });

        if (!updated) throw new Error(MEETING_ERRORS.FAILED_TO_UPDATE_MEETING);

        updated.participants?.forEach(async (p) => {
            const isNew = !meeting.participants?.some(ep => ep.userId === p.userId);
            await this.sendNotification.execute({
                recipientId: p.userId,
                eventType: isNew ? NotificationEventType.MEETING_SCHEDULED : NotificationEventType.MEETING_RESCHEDULED,
                message: isNew ? `You have been invited to meeting "${updated.title}"` : `Meeting "${updated.title}" has been rescheduled`,
                resourceId: updated._id,
                resourceType: "meeting"
            });
        });

        return updated;
    }
}
