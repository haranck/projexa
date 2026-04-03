import { IMeetingParticipantEntity } from "./IMeetingParticipantEntity";

export interface IMeetingEntity {
    _id?: string;
    title: string;
    description?: string;
    startTime: Date;
    endTime: Date;
    projectId: string;
    hostId: string;
    participants: IMeetingParticipantEntity[];
    status: 'upcoming' | 'completed' | 'cancelled';
    roomName: string;
    recordingUrl?: string;
    transcript?: string;
    summary?: string;
    summaryMetadata?: {
        actionItems: string[];
        decisions: string[];
    };
    createdAt?: Date;
    updatedAt?: Date;
}
