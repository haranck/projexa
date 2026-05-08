import { IActionItem } from "../../entities/Meeting/IMeetingSummaryEntity";

export interface IAISummaryResult {
    summary: string;
    keyPoints: string[];
    decisions: string[];
    actionItems: IActionItem[];
}

export interface IAIService {
    generateMeetingSummary(transcript: string, meetingTitle: string): Promise<IAISummaryResult>;
}
