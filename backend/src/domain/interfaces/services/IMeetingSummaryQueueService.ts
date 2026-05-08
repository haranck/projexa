export interface IMeetingSummaryJobData {
    meetingId: string;
    meetingTitle: string;
    projectId: string;
    audioUrl?: string;
    transcript?: string;
}

export interface IMeetingSummaryQueueService {
    addSummaryJob(data: IMeetingSummaryJobData): Promise<void>;
}
