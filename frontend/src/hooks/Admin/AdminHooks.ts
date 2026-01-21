import { useMutation, useQuery, useQueryClient, keepPreviousData } from "@tanstack/react-query";

import {
    adminLogin,
    adminLogout,
    getUsers,
    blockUser,
    unblockUser
} from "../../services/Admin/adminService";
import type { UserResponse } from "../../types/user";

interface UseGetUsersProps {
    page: number;
    limit: number;
    search?: string;
}
export const useAdminLogin = () => {
    return useMutation({
        mutationFn: adminLogin
    })
}

export const useAdminLogout = () => {
    return useMutation({
        mutationFn: adminLogout
    })
}

export const useGetUsers = ({ page, limit, search }: UseGetUsersProps) => {
    return useQuery<UserResponse>({
        queryKey: ['users', page, limit, search],
        queryFn: () => getUsers({ page, limit, search }),
        placeholderData: keepPreviousData,
    })
}

export const useBlockUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: blockUser,
        onSuccess: (_, variables) => {
            queryClient.setQueriesData<UserResponse>({ queryKey: ['users'] }, (oldData) => {
                if (!oldData) return oldData;
                return {
                    ...oldData,
                    data: {
                        ...oldData.data,
                        data: oldData.data.data.map(user =>
                            (user.id === variables.userId || user._id === variables.userId)
                                ? { ...user, isBlocked: true }
                                : user
                        )
                    }
                };
            });
        }
    })
}

export const useUnblockUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: unblockUser,
        onSuccess: (_, variables) => {
            queryClient.setQueriesData<UserResponse>({ queryKey: ['users'] }, (oldData) => {
                if (!oldData) return oldData;
                return {
                    ...oldData,
                    data: {
                        ...oldData.data,
                        data: oldData.data.data.map(user =>
                            (user.id === variables.userId || user._id === variables.userId)
                                ? { ...user, isBlocked: false }
                                : user
                        )
                    }
                };
            });
        }
    })
}
