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
    | "PROJECT_MEMBER_ADDED";

export const NOTIFICATION_EVENT_TYPES = {
    ISSUE_CREATED: "ISSUE_CREATED",
    ISSUE_UPDATED: "ISSUE_UPDATED",
    ISSUE_DELETED: "ISSUE_DELETED",
    SPRINT_CREATED: "SPRINT_CREATED",
    SPRINT_UPDATED: "SPRINT_UPDATED",
    SPRINT_DELETED: "SPRINT_DELETED",
    PROJECT_CREATED: "PROJECT_CREATED",
    PROJECT_UPDATED: "PROJECT_UPDATED",
    PROJECT_DELETED: "PROJECT_DELETED",
    PROJECT_ASSIGNED: "PROJECT_ASSIGNED",
    PROJECT_MEMBER_ADDED: "PROJECT_MEMBER_ADDED"
} as const;

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
