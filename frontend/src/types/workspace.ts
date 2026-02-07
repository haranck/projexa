export interface Workspace {
    _id: string;
    id?: string;
    name: string;
    subscriptionId?: {
        status: string;
        endDate: string;
        planId?: {
            name: string;
            interval: string;
            price?: number;
        };
    };
}