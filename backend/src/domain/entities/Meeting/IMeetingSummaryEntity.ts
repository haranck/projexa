import { MeetingSummaryStatus } from "../../enums/MeetingSummaryStatus";

export interface IActionItem {
    task: string;
    assignee?: string;
    dueDate?: string;
}

export interface IMeetingSummaryEntity {
    _id?: string;
    meetingId: string;
    projectId?: string;
    transcript?: string;
    summary?: string;
    keyPoints: string[];
    decisions: string[];
    actionItems: IActionItem[];
    status: MeetingSummaryStatus;
    errorMessage?: string;
    createdAt?: Date;
    updatedAt?: Date;
}
