import { IMeetingEntity } from "../../../domain/entities/Meeting/IMeetingEntity";
import { IMeetingSummaryEntity } from "../../../domain/entities/Meeting/IMeetingSummaryEntity";

export interface IEndMeetingUseCase {
    execute(meetingId: string, hostId: string): Promise<{ meeting: IMeetingEntity; summary: IMeetingSummaryEntity }>;
}
