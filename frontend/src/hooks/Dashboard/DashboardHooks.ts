import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { getProjectDashboardData } from "../../services/Dashboard/dashboardService";
import type { RootState } from "../../store/store";

export const useDashboardData = () => {
    const { projectId: routeProjectId } = useParams();
    const { currentProject } = useSelector((state: RootState) => state.project);
    const effectiveProjectId = routeProjectId || currentProject?._id;

    return useQuery({
        queryKey: ["dashboard", effectiveProjectId],
        queryFn: () => getProjectDashboardData(effectiveProjectId!),
        enabled: !!effectiveProjectId,
        refetchOnWindowFocus: false
    });
};