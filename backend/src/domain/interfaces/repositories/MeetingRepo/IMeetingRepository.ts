import { IMeetingEntity } from "../../../../domain/entities/Meeting/IMeetingEntity";

export interface IMeetingRepository {
    createMeeting(meeting: IMeetingEntity): Promise<IMeetingEntity>;
    getMeetingById(id: string): Promise<IMeetingEntity | null>;
    getMeetingsByProjectId(projectId: string): Promise<IMeetingEntity[]>;
    updateMeetingStatus(meetingId: string, status: string): Promise<IMeetingEntity | null>;
    updateParticipantStatus(
        meetingId: string,
        userId: string,
        status: 'joined' | 'left' | 'missed'
    ): Promise<IMeetingEntity | null>;
    updateMeeting(meetingId: string, meeting: Partial<IMeetingEntity>): Promise<IMeetingEntity | null>;
}
