import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { GetAllProjectsParams } from "../../types/project";
import {
    createProject,
    getAllProjects,
    updateProject,
    deleteProject,
    addProjectMember,
    removeProjectMember,
    updateProjectMemberRole
} from "../../services/Project/projectService";


export const useCreateProject = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createProject,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['projects'] });
        }
    })
}

export const useGetAllProjects = (params: GetAllProjectsParams) => {
    return useQuery({
        queryKey: ['projects', params],
        queryFn: () => getAllProjects(params),
        enabled: !!params.workspaceId
    })
}

export const useUpdateProject = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateProject,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['projects'] });
        }
    })
}

export const useDeleteProject = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteProject,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['projects'] });
        }
    })
}

export const useAddProjectMember = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: addProjectMember,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['projects'] });
        }
    })
}

export const useRemoveProjectMember = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: removeProjectMember,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['projects'] });
        }
    })
}

export const useUpdateProjectMemberRole = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateProjectMemberRole,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['projects'] });
        }
    })
}