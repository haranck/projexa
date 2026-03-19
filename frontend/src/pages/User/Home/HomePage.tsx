import { useState, useEffect } from "react";
import { Plus, Layout, CheckCircle2, ListTodo, Activity } from "lucide-react";
import { Button } from "../../../components/ui/button";
import DashboardLayout from "../../../components/Layout/DashboardLayout";
import { CreateProjectModal } from "../../../components/modals/CreateProjectModal";
import { StatsCard } from "../../../components/Dashboard/StatsCard";
import { ProgressLinear } from "../../../components/Dashboard/ProgressLinear";
import { IssueDistributionChart } from "../../../components/Dashboard/IssueDistributionChart";
import { ModuleProgressGauge } from "../../../components/Dashboard/ModuleProgressGauge";
import { SprintStatusCard } from "../../../components/Dashboard/SprintStatusCard";
import { useDashboardData } from "../../../hooks/Dashboard/DashboardHooks";
import { socket } from "../../../socket/socket";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../../store/store";
import { useGetAllProjects } from "../../../hooks/Project/ProjectHooks";
import { setCurrentProject } from "../../../store/slice/projectSlice";
import { Link } from "react-router-dom";
import { FRONTEND_ROUTES } from "../../../constants/frontendRoutes";

export const HomePage = () => {
    const dispatch = useDispatch();
    const { currentProject } = useSelector((state: RootState) => state.project);
    const { currentWorkspace } = useSelector((state: RootState) => state.workspace);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    
    // Fetch projects to ensure we have a selection if none exists
    const { data: projectsResponse } = useGetAllProjects({
        workspaceId: currentWorkspace?._id || currentWorkspace?.id || '',
        page: 1,
        limit: 10
    });

    const projects = projectsResponse?.data?.projects || [];

    // Auto-select first project if none is selected
    useEffect(() => {
        if (!currentProject && projects.length > 0) {
            dispatch(setCurrentProject(projects[0]));
        }
    }, [currentProject, projects, dispatch]);

    const { data: dashboardData, isLoading, refetch } = useDashboardData();

    useEffect(() => {
        if (!socket) return;
        
        socket.on("issue_updated", () => refetch());
        socket.on("sprint_started", () => refetch());
        socket.on("sprint_completed", () => refetch());

        return () => {
            socket.off("issue_updated");
            socket.off("sprint_started");
            socket.off("sprint_completed");
        };
    }, [refetch]);

    if (isLoading) {
        return (
            <DashboardLayout>
                <div className="p-8 text-white animate-pulse flex items-center justify-center min-h-[50vh]">
                    <div className="flex flex-col items-center gap-4">
                        <Activity className="w-12 h-12 text-blue-500 animate-spin" />
                        <span className="text-xl font-bold tracking-widest uppercase">Loading Projexa...</span>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    if (!currentProject && !isLoading) {
        return (
            <DashboardLayout>
                <div className="p-8 flex flex-col items-center justify-center min-h-[60vh] text-center">
                    <div className="w-20 h-20 bg-blue-500/10 rounded-[2.5rem] flex items-center justify-center mb-6 shadow-xl shadow-blue-500/5">
                        <Layout className="w-10 h-10 text-blue-500" />
                    </div>
                    <h2 className="text-3xl font-black text-white tracking-tight mb-2">Select a Project</h2>
                    <p className="text-zinc-500 max-w-sm mb-8 font-medium">
                        To view dashboard insights, please select a project from the projects list or create a new one.
                    </p>
                    <div className="flex gap-4">
                        <Link to={FRONTEND_ROUTES.PROJECTS}>
                            <Button className="bg-white hover:bg-zinc-200 text-black h-12 px-8 rounded-xl font-bold transition-all">
                                Go to Projects
                            </Button>
                        </Link>
                        <Button 
                            onClick={() => setIsCreateModalOpen(true)}
                            className="bg-blue-600 hover:bg-blue-500 text-white h-12 px-8 rounded-xl font-bold transition-all shadow-lg shadow-blue-600/20"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Create New Project
                        </Button>
                    </div>
                </div>
                <CreateProjectModal
                    open={isCreateModalOpen}
                    onClose={() => setIsCreateModalOpen(false)}
                />
            </DashboardLayout>
        );
    }

    const stats = dashboardData?.stats || { 
        totalIssues: 0, 
        completedIssues: 0, 
        activeSprintsCount: 0, 
        memberCount: 0, 
        completionRate: 0 
    };

    return (
        <DashboardLayout>
            <div className="p-8 space-y-8 max-w-[1600px] mx-auto">
                {/* Header Section */}
                <div className="flex justify-between items-end">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-500 text-[10px] font-black uppercase tracking-widest mb-3">
                            Project Dashboard
                        </div>
                        <h1 className="text-4xl font-black text-white tracking-tight">Projexa Overview</h1>
                        <p className="text-zinc-500 text-sm font-medium mt-1">Real-time insights and project health metrics.</p>
                    </div>
                    <div className="flex gap-4">
                        <Button 
                            onClick={() => refetch()}
                            className="bg-zinc-800 hover:bg-zinc-700 text-white h-12 px-6 rounded-xl text-sm font-bold transition-all"
                        >
                            Refresh
                        </Button>
                        <Button 
                            onClick={() => setIsCreateModalOpen(true)}
                            className="bg-white hover:bg-zinc-200 text-black h-12 px-6 rounded-xl text-sm font-bold transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            New Project
                        </Button>
                    </div>
                </div>

                {/* Top Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatsCard 
                        title="Total Issues" 
                        value={stats.totalIssues.toString()} 
                        icon={ListTodo} 
                        color="blue"
                    />
                    <StatsCard 
                        title="Completed" 
                        value={stats.completedIssues.toString()} 
                        icon={CheckCircle2} 
                        description={`${stats.completionRate}% Completion rate`}
                        color="green"
                    />
                    <StatsCard 
                        title="Active Sprints" 
                        value={stats.activeSprintsCount.toString().padStart(2, '0')} 
                        icon={Activity} 
                        color="purple"
                    />
                    <StatsCard 
                        title="Total Members" 
                        value={stats.memberCount.toString()} 
                        icon={Layout} 
                        description="Team members active"
                        color="orange"
                    />
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left & Middle Column (Charts & Progress) */}
                    <div className="lg:col-span-2 space-y-8">
                        <ProgressLinear 
                            title="Overall Progress" 
                            description={`${stats.completedIssues} of ${stats.totalIssues} issues completed across all sprints`} 
                            completed={stats.completedIssues} 
                            total={stats.totalIssues} 
                        />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <IssueDistributionChart data={dashboardData?.distribution} />
                            <SprintStatusCard data={dashboardData?.recentSprints} />
                        </div>
                    </div>

                    {/* Right Column (Module Progress) */}
                    <div className="lg:col-span-1">
                        <ModuleProgressGauge data={dashboardData?.progress} />
                    </div>
                </div>
            </div>

            <CreateProjectModal
                open={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
            />
        </DashboardLayout>
    );
};
