import { useMutation, useQuery } from "@tanstack/react-query";

import {
    createWorkspace,
    getPlans,
    selectPlan,
    createCheckoutSession,
    getUserWorkspaces,
    upgradePlan,
    getWorkspaceInvoices
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