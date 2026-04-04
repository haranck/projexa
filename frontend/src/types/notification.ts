export type NotificationEventType =
    | "ISSUE_CREATED"
    | "ISSUE_UPDATED"
    | "ISSUE_DELETED"
    | "SPRINT_CREATED"
    | "SPRINT_UPDATED"
    | "SPRINT_DELETED"
    | "PROJECT_CREATED"
    | "PROJECT_UPDATED"
    | "PROJECT_DELETED"
    | "PROJECT_ASSIGNED"
    | "PROJECT_MEMBER_ADDED"
    | "ISSUE_MENTIONED";

export const NOTIFICATION_EVENT_TYPES = {
    ISSUE_CREATED: "ISSUE_CREATED" as const,
    ISSUE_UPDATED: "ISSUE_UPDATED" as const,
    ISSUE_DELETED: "ISSUE_DELETED" as const,
    SPRINT_CREATED: "SPRINT_CREATED" as const,
    SPRINT_UPDATED: "SPRINT_UPDATED" as const,
    SPRINT_DELETED: "SPRINT_DELETED" as const,
    PROJECT_CREATED: "PROJECT_CREATED" as const,
    PROJECT_UPDATED: "PROJECT_UPDATED" as const,
    PROJECT_DELETED: "PROJECT_DELETED" as const,
    PROJECT_ASSIGNED: "PROJECT_ASSIGNED" as const,
    PROJECT_MEMBER_ADDED: "PROJECT_MEMBER_ADDED" as const,
    ISSUE_MENTIONED: "ISSUE_MENTIONED" as const
};

export interface Notification {
    _id: string;
    recipientId: string;
    senderId?: string;
    eventType: NotificationEventType;
    message: string;
    resourceId?: string;
    resourceType?: string;
    isRead: boolean;
    createdAt: string;
}

export interface NotificationResponse {
    message: string;
    data: Notification[];
}
