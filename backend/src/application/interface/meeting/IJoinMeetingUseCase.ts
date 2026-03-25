import { IMeetingEntity } from "../../../domain/entities/Meeting/IMeetingEntity";

export interface IJoinMeetingUseCase {
    execute(meetingId: string, userId: string): Promise<IMeetingEntity>;
}
