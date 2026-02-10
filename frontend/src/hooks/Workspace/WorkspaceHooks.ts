import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
    createWorkspace,
    getPlans,
    selectPlan,
    createCheckoutSession,
    getUserWorkspaces,
    upgradePlan,
    getWorkspaceInvoices,
    inviteMembers,
    acceptInvite,
    completeProfile,
    getWorkspaceMembers,
    removeWorkspaceMember
} from "../../services/Workspace/workspaceService";

export const useCreateWorkspace = () => {
    return useMutation({
        mutationFn: createWorkspace
    })
}

export const useGetPlans = () => {
    return useQuery({
        queryKey: ['plans'],
        queryFn: getPlans
    })
}

export const useSelectPlan = () => {
    return useMutation({
        mutationFn: selectPlan
    })
}

export const useCreateCheckoutSession = () => {
    return useMutation({
        mutationFn: createCheckoutSession
    })
}

export const useGetUserWorkspaces = () => {
    return useQuery({
        queryKey: ['user-workspaces'],
        queryFn: getUserWorkspaces
    })
}

export const useUpgradePlan = () => {
    return useMutation({
        mutationFn: upgradePlan
    })
}

export const useGetWorkspaceInvoices = (workspaceId: string) => {
    return useQuery({
        queryKey: ['workspace-invoices', workspaceId],
        queryFn: () => getWorkspaceInvoices(workspaceId)
    })
}

export const useInviteMembers = () => {
    return useMutation({
        mutationFn: inviteMembers
    })
}

export const useAcceptInvite = (token: string) => {
    return useQuery({
        queryKey: ['accept-invite', token],
        queryFn: () => acceptInvite(token)
    })
}

export const useCompleteProfile = () => {
    return useMutation({
        mutationFn: completeProfile
    })
}

export const useGetWorkspaceMembers = (workspaceId: string) => {
    return useQuery({
        queryKey: ['workspace-members', workspaceId],
        queryFn: () => getWorkspaceMembers(workspaceId),
        enabled: !!workspaceId
    })
}

export const useRemoveWorkspaceMember = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: removeWorkspaceMember,
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['workspace-members', variables.workspaceId] });
        }
    })
}