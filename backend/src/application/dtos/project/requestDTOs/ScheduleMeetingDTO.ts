export interface ScheduleMeetingDTO {
    title: string;
    description?: string;
    startTime: Date;
    endTime: Date;
    projectId: string;
    hostId: string;
    invitees: string[];
}

export interface RescheduleMeetingDTO {
    meetingId: string;
    title?: string;
    description?: string;
    startTime?: Date;
    endTime?: Date;
    projectId?: string;
    hostId?: string;
    invitees?: string[];
}
