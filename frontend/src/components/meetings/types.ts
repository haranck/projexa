export interface Meeting {
    id: string;
    title: string;
    tag: string;
    tagColor: string;
    date: string;
    time: string;
    duration: string;
    host: {
        name: string;
        avatar: string;
    };
    attendees: { name: string; avatar: string }[];
    status?: 'upcoming' | 'in_progress' | 'completed' | 'cancelled';
    userStatus?: 'joined' | 'left' | 'missed' | 'invited';
    projectId: string; 
    hostId: string;
    description?: string;
    startTime: string | Date;
    endTime: string | Date;
    invitees: string[];
}

export interface IActionItem {
    task: string;
    assignee?: string;
    dueDate?: string;
}

export interface MeetingSummary {
    _id?: string;
    meetingId: string;
    transcript?: string;
    summary?: string;
    keyPoints: string[];
    decisions: string[];
    actionItems: IActionItem[];
    status: 'pending' | 'processing' | 'completed' | 'failed';
    errorMessage?: string;
    createdAt?: string;
    updatedAt?: string;
}
