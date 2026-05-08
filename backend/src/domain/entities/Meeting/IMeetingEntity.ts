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
    status: 'upcoming' | 'in_progress' | 'completed' | 'cancelled';
    roomName: string;
    reminderSent?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}
