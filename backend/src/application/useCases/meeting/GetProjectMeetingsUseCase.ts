import { inject, injectable } from "tsyringe";
import { IMeetingRepository } from "../../../domain/interfaces/repositories/MeetingRepo/IMeetingRepository";
import { IGetProjectMeetingsUseCase } from "../../interface/meeting/IGetProjectMeetingsUseCase";
import { IMeetingEntity } from "../../../domain/entities/Meeting/IMeetingEntity";

@injectable()
export class GetProjectMeetingsUseCase implements IGetProjectMeetingsUseCase {
    constructor(
        @inject("IMeetingRepository") private meetingRepo: IMeetingRepository
    ) {}

    async execute(projectId: string, currentUserId: string): Promise<{
        upcoming: (IMeetingEntity & { currentUserStatus: string })[];
        recent: (IMeetingEntity & { currentUserStatus: string })[];
    }> {
        const meetings = await this.meetingRepo.getMeetingsByProjectId(projectId);

        const upcoming: (IMeetingEntity & { currentUserStatus: string })[] = [];
        const recent: (IMeetingEntity & { currentUserStatus: string })[] = [];

        meetings.forEach(meeting => {
            const participant = meeting.participants.find(p => p.userId.toString() === currentUserId.toString());
            let userStatus = participant ? participant.status : 'invited';
            
            const isCompleted = meeting.status === 'completed' || 
                               meeting.status === 'cancelled' || 
                               new Date(meeting.endTime) < new Date() ||
                               userStatus === 'left';
            
            if (isCompleted) {
                if (userStatus === 'invited') userStatus = 'missed';
                
                recent.push({
                    ...meeting,
                    currentUserStatus: userStatus
                });
            } else {
                upcoming.push({
                    ...meeting,
                    currentUserStatus: userStatus
                });
            }
        });

        return { upcoming, recent };
    }
}