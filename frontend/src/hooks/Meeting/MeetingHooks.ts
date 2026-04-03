import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { scheduleMeeting, getProjectMeetings, joinMeeting, leaveMeeting, triggerMeetingSummary } from "../../services/Meeting/meetingService";
import type { ScheduleMeetingProps } from "../../services/Meeting/meetingService";
import { toast } from "react-hot-toast";
import { getErrorMessage } from "@/utils/errorHandler";

export const useScheduleMeeting = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: ScheduleMeetingProps) => scheduleMeeting(data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["meetings", variables.projectId] });
        }
    });
};

export const useGetProjectMeetings = (projectId: string) => {
    return useQuery({
        queryKey: ["meetings", projectId],
        queryFn: () => getProjectMeetings(projectId),
        enabled: !!projectId
    });
};

export const useJoinMeeting = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (meetingId: string) => joinMeeting(meetingId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["meetings"] });
        }
    });
};

export const useLeaveMeeting = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (meetingId: string) => leaveMeeting(meetingId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["meetings"] });
        }
    });
};

export const useTriggerMeetingSummary = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ meetingId, recordingPath }: { meetingId: string; recordingPath: string }) => 
            triggerMeetingSummary(meetingId, recordingPath),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["meetings"] });
            toast.success("Meeting summary processing started");
        },
        onError: (error: unknown) => {
            const err = getErrorMessage(error);
            toast.error(err || "Failed to start meeting summary");
        }
    });
};
