import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    createIssue,
    getAllIssues,
    deleteIssue,
    getAttachmentUploadUrl,
    updateEpic,
} from "../../services/Issue/IssueService";

import type {
    CreateIssueProps,
    UpdateEpicProps,
} from "../../services/Issue/IssueService";


export const useGetAllIssues = (projectId: string) => {
    return useQuery({
        queryKey: ["issues", projectId],
        queryFn: () => getAllIssues(projectId),
        enabled: !!projectId,
    });
};


export const useCreateIssue = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: CreateIssueProps) => createIssue(data),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: ["issues", variables.projectId] });
        },
    });
};

export const useUpdateEpic = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (data: UpdateEpicProps & { projectId: string }) => updateEpic(data),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: ["issues", variables.projectId] })
        }
    })
}


export const useDeleteIssue = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: { issueId: string, projectId: string }) => deleteIssue(data.issueId),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: ["issues", variables.projectId] });
        },
    });
};

export const useGetAttachmentUploadUrl = () => {
    return useMutation({
        mutationFn: (contentType: string) => getAttachmentUploadUrl(contentType),
    });
};

