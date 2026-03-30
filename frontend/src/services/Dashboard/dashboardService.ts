import { API_ROUTES } from "../../constants/apiRoutes";
import { AxiosInstance } from "../../axios/axios";

export const getProjectDashboardData = async (projectId: string) => {
    const response = await AxiosInstance.get(API_ROUTES.PROJECTS.GET_PROJECT_DASHBOARD_DATA.replace(":projectId", projectId));
    return response.data?.data;
};