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
    status?: 'upcoming' | 'completed' | 'cancelled' | 'joined' | 'left' | 'missed' | 'invited'; 
    projectId: string; 
    transcript?: string;
    summary?: string;
    summaryMetadata?: {
        actionItems: string[];
        decisions: string[];
    };
    recordingUrl?: string;
}
