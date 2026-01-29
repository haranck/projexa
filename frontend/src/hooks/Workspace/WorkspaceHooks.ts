import { useMutation, useQuery } from "@tanstack/react-query";

import {
    createWorkspace,
    getPlans,
    selectPlan,
    createCheckoutSession
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