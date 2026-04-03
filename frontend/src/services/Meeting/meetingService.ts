import { API_ROUTES } from "../../constants/apiRoutes";
import { AxiosInstance } from "../../axios/axios";

export interface ScheduleMeetingProps {
    title: string;
    description?: string;
    startTime: Date;
    endTime: Date;
    projectId: string;
    hostId: string;
    invitees: string[];
}


export const scheduleMeeting = async (meetingData: ScheduleMeetingProps) => {
    const response = await AxiosInstance.post(API_ROUTES.PROJECTS.SCHEDULE_MEETING, meetingData)
    return response.data
}

export const getProjectMeetings = async (projectId: string) => {
    const response = await AxiosInstance.get(API_ROUTES.PROJECTS.GET_PROJECT_MEETINGS.replace(":projectId", projectId))
    return response.data
}

export const joinMeeting = async (meetingId: string) => {
    const response = await AxiosInstance.patch(API_ROUTES.PROJECTS.JOIN_MEETING.replace(":meetingId", meetingId))
    return response.data
}

export const leaveMeeting = async (meetingId: string) => {
    const response = await AxiosInstance.patch(API_ROUTES.PROJECTS.LEAVE_MEETING.replace(":meetingId", meetingId))
    return response.data
}
