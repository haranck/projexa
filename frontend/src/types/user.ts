export interface User {
    id?: string;
    _id?: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    avatarUrl?: string;
    isBlocked: boolean;
    isEmailVerified: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface UserResponse {
    message: string;
    data: {
        data: User[];
        meta: {
            totalDocs: number;
            totalPages: number;
            page: number;
            limit: number;
        };
    };
}
