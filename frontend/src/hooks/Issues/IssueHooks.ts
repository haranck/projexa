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
    GetAllIssuesFilterProps
} from "../../services/Issue/IssueService";


export const useGetAllIssues = (filter: GetAllIssuesFilterProps) => {
    return useQuery({
        queryKey: ["issues", filter],
        queryFn: () => getAllIssues(filter),
        enabled: !!filter.projectId,
    });
};


export const useCreateIssue = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: CreateIssueProps) => createIssue(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["issues"] });
        },
    });
};

export const useUpdateEpic = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (data: UpdateEpicProps & { projectId: string }) => updateEpic(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["issues"] })
        }
    })
}


export const useDeleteIssue = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: { issueId: string, projectId: string }) => deleteIssue(data.issueId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["issues"] });
        },
    });
};

export const useGetAttachmentUploadUrl = () => {
    return useMutation({
        mutationFn: (contentType: string) => getAttachmentUploadUrl(contentType),
    });
};

