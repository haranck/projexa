import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { scheduleMeeting, getProjectMeetings, joinMeeting, leaveMeeting,rescheduleMeeting } from "../../services/Meeting/meetingService";
import type { ScheduleMeetingProps, RescheduleMeetingProps } from "../../services/Meeting/meetingService";

export const useScheduleMeeting = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: ScheduleMeetingProps) => scheduleMeeting(data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["meetings", variables.projectId] });
        }
    });
};

export const useRescheduleMeeting = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: RescheduleMeetingProps) => rescheduleMeeting(data),
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

