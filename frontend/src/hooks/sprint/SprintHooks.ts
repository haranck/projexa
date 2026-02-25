import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createSprint, deleteSprint, moveIssueToSprint, startSprint, getSprintsByProjectId, completeSprint } from "@/services/Sprint/sprintService";

export const useMoveIssueToSprint = (projectId: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: moveIssueToSprint,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['sprints', projectId] });
            queryClient.invalidateQueries({ queryKey: ['issues', projectId] });
        }
    })
}

export const useCreateSprint = (projectId: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createSprint,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['sprints', projectId] });
        }
    })
}

export const useDeleteSprint = (projectId: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteSprint,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['sprints', projectId] });
            queryClient.invalidateQueries({ queryKey: ['issues', projectId] });
        }
    })
}

export const useStartSprint = (projectId: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: startSprint,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['sprints', projectId] });
        }
    })
}

export const useGetSprints = (projectId: string) => {
    return useQuery({
        queryKey: ['sprints', projectId],
        queryFn: () => getSprintsByProjectId(projectId),
        enabled: !!projectId
    })
}

export const useCompleteSprint = (projectId: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: completeSprint,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['sprints', projectId] });
            queryClient.invalidateQueries({ queryKey: ['issues', projectId] });
        }
    })
}