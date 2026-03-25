import { IMeetingEntity } from "../../../domain/entities/Meeting/IMeetingEntity";

export interface ILeaveMeetingUseCase {
    execute(meetingId: string, userId: string): Promise<IMeetingEntity>;
}
