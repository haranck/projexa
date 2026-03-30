import { IMeetingEntity } from "../../../domain/entities/Meeting/IMeetingEntity";

export interface IGetProjectMeetingsUseCase {
    execute(projectId: string, currentUserId: string): Promise<{
        upcoming: IMeetingEntity[];
        recent: (IMeetingEntity & { currentUserStatus: string })[];
    }>;
}
