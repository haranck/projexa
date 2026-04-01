import { useState, useEffect } from "react";
import {
    Plus,
    Layout,
    CheckCircle2,
    ListTodo,
    Activity,
    Video,
    Clock,
    ArrowRight,
    AlertTriangle,
    AlertCircle,
    Folder
} from "lucide-react";
import { Button } from "../../../components/ui/button";
import DashboardLayout from "../../../components/Layout/DashboardLayout";
import { CreateProjectModal } from "../../../components/modals/CreateProjectModal";
import { StatsCard } from "../../../components/Dashboard/StatsCard";
import { ProgressLinear } from "../../../components/Dashboard/ProgressLinear";
import { IssueDistributionChart } from "../../../components/Dashboard/IssueDistributionChart";
import { ModuleProgressGauge } from "../../../components/Dashboard/ModuleProgressGauge";
import { SprintStatusCard } from "../../../components/Dashboard/SprintStatusCard";
import { TeamActivitySection } from "../../../components/Dashboard/TeamActivitySection";
import { TopPerformerCard } from "../../../components/Dashboard/TopPerformerCard";
import { OverdueTasksPopup } from "../../../components/modals/OverdueTasksPopup";
import { useDashboardData } from "../../../hooks/Dashboard/DashboardHooks";
import { socket } from "../../../socket/socket";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../../store/store";
import { useGetAllProjects } from "../../../hooks/Project/ProjectHooks";
import { setCurrentProject } from "../../../store/slice/projectSlice";
import { Link } from "react-router-dom";
import { FRONTEND_ROUTES } from "../../../constants/frontendRoutes";
import { NOTIFICATION_EVENTS } from "../../../constants/notification.events";

interface TodayMeeting {
    id: string;
    title: string;
    startTime: string | Date;
    hostName: string;
    hostAvatar?: string;
}

interface OverdueTask {
    id: string;
    title: string;
    endDate: string | Date;
    key: string;
}

export const HomePage = () => {
    const dispatch = useDispatch();
    const { currentProject } = useSelector((state: RootState) => state.project);
    const { currentWorkspace } = useSelector((state: RootState) => state.workspace);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [showOverduePopup, setShowOverduePopup] = useState(false);
    const [overdueTasks, setOverdueTasks] = useState<OverdueTask[]>([]);

    const { data: projectsResponse } = useGetAllProjects({
        workspaceId: currentWorkspace?._id || currentWorkspace?.id || '',
        page: 1,
        limit: 10
    });

    const projects = projectsResponse?.data?.projects || [];

    useEffect(() => {
        if (!currentProject && projects.length > 0) {
            dispatch(setCurrentProject(projects[0]));
        }
    }, [currentProject, projects, dispatch]);

    const { data: dashboardData, isLoading, refetch } = useDashboardData();

    useEffect(() => {
        if (!socket) return;
        socket.on(NOTIFICATION_EVENTS.ISSUE_UPDATED, () => refetch());
        socket.on(NOTIFICATION_EVENTS.SPRINT_STARTED, () => refetch());
        socket.on(NOTIFICATION_EVENTS.SPRINT_COMPLETED, () => refetch());
        return () => {
            socket.off(NOTIFICATION_EVENTS.ISSUE_UPDATED);
            socket.off(NOTIFICATION_EVENTS.SPRINT_STARTED);
            socket.off(NOTIFICATION_EVENTS.SPRINT_COMPLETED);
        };
    }, [refetch]);

    useEffect(() => {
        if (dashboardData?.overdueTasks?.length > 0) {
            setOverdueTasks(dashboardData.overdueTasks);
            const hasShown = sessionStorage.getItem(`overdue_shown_${currentProject?._id}`);
            if (!hasShown) {
                setShowOverduePopup(true);
                sessionStorage.setItem(`overdue_shown_${currentProject?._id}`, 'true');
            }
        }
    }, [dashboardData, currentProject?._id]);

    if (isLoading) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-10 h-10 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
                        <p className="text-sm text-zinc-500">Loading dashboard...</p>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    if (!currentProject && !isLoading) {
        return (
            <DashboardLayout>
                <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
                    <div className="w-16 h-16 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-blue-500/10">
                        <Folder className="w-7 h-7 text-blue-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">No project selecteddddd</h2>
                    <p className="text-zinc-500 text-sm mb-8 max-w-sm">
                        Select an existing project or create a new one to view your dashboard.
                    </p>
                    <div className="flex gap-3">
                        <Link to={FRONTEND_ROUTES.PROJECTS}>
                            <Button variant="outline" className="border-white/10 bg-white/3 hover:bg-white/6 text-white h-10 px-6 rounded-xl text-sm font-medium">
                                Browse Projects
                            </Button>
                        </Link>
                        <Button
                            onClick={() => setIsCreateModalOpen(true)}
                            className="bg-blue-600 hover:bg-blue-500 text-white h-10 px-6 rounded-xl text-sm font-medium shadow-lg shadow-blue-600/20 flex items-center gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            New Project
                        </Button>
                    </div>
                </div>
                <CreateProjectModal open={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
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
            <div className="relative min-h-screen">
                {showOverduePopup && (
                    <OverdueTasksPopup tasks={overdueTasks} onClose={() => setShowOverduePopup(false)} />
                )}

                <div className="p-6 lg:p-8 space-y-6 max-w-screen-2xl mx-auto">
                    {/* Page Header */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-white/5">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                <span className="text-xs font-medium text-emerald-500">Liveeeeee</span>
                                <span className="text-xs text-zinc-600">·</span>
                                <span className="text-xs text-zinc-500">{currentProject?.projectName}</span>
                            </div>
                            <h1 className="text-xl font-semibold text-white">Dashboard</h1>
                            <p className="text-sm text-zinc-500 mt-0.5">Track your projects performance and team activity.</p>
                        </div>
                        <Button
                            onClick={() => setIsCreateModalOpen(true)}
                            className="bg-blue-600 hover:bg-blue-500 text-white h-9 px-4 rounded-xl text-sm font-medium shadow-lg shadow-blue-600/20 flex items-center gap-2 shrink-0"
                        >
                            <Plus className="w-4 h-4" />
                            New Project
                        </Button>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <StatsCard title="Total Issues" value={stats.totalIssues} icon={ListTodo} color="blue" description="Across all modules" />
                        <StatsCard title="Completed" value={stats.completedIssues} icon={CheckCircle2} color="green" description={`${stats.completionRate}% done`} trend="+4.2%" />
                        <StatsCard title="Active Sprints" value={stats.activeSprintsCount} icon={Activity} color="purple" description="Running cycles" />
                        <StatsCard title="Team Size" value={stats.memberCount} icon={Layout} color="orange" description="Collaborators" />
                    </div>

                    {/* Progress Bar */}
                    <ProgressLinear title="Overall Completion Rate" percentage={stats.completionRate} />

                    {/* Alerts: Overdue + Meetings */}
                    {(dashboardData?.overdueTasks?.length > 0 || dashboardData?.todayMeetings?.length > 0) && (
                        <div className={`grid grid-cols-1 gap-4 ${
                            dashboardData?.overdueTasks?.length > 0 && dashboardData?.todayMeetings?.length > 0
                                ? "lg:grid-cols-2"
                                : ""
                        }`}>

                            {/* Overdue Tasks */}
                            {dashboardData?.overdueTasks?.length > 0 && (
                                <div>
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-2">
                                            <AlertTriangle className="w-4 h-4 text-rose-400" />
                                            <h2 className="text-sm font-semibold text-white">Overdue Tasks</h2>
                                            <span className="px-1.5 py-0.5 rounded-md bg-rose-500/10 text-rose-400 text-xs font-medium border border-rose-500/20">
                                                {dashboardData.overdueTasks.length}
                                            </span>
                                        </div>
                                        <Link to={FRONTEND_ROUTES.BOARD}>
                                            <button className="text-xs text-zinc-500 hover:text-white flex items-center gap-1 transition-colors">
                                                View all <ArrowRight className="w-3 h-3" />
                                            </button>
                                        </Link>
                                    </div>
                                    <div className="space-y-2">
                                        {dashboardData.overdueTasks.map((task: OverdueTask) => (
                                            <div key={task.id} className="flex items-center justify-between p-3.5 rounded-xl bg-rose-500/4 border border-rose-500/10 hover:border-rose-500/20 transition-colors group cursor-default">
                                                <div className="flex items-center gap-3 min-w-0">
                                                    <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                                                    <div className="min-w-0">
                                                        <p className="text-sm font-medium text-white truncate group-hover:text-rose-300 transition-colors">{task.title}</p>
                                                        <p className="text-xs text-zinc-600 mt-0.5">{task.key} · Due {new Date(task.endDate).toLocaleDateString()}</p>
                                                    </div>
                                                </div>
                                                <Link to={FRONTEND_ROUTES.BOARD}>
                                                    <Button className="shrink-0 ml-3 h-7 px-3 text-xs bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 rounded-lg transition-colors">
                                                        Resolve
                                                    </Button>
                                                </Link>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Today's Meetings */}
                            {dashboardData?.todayMeetings?.length > 0 && (
                                <div>
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-2">
                                            <Video className="w-4 h-4 text-blue-400" />
                                            <h2 className="text-sm font-semibold text-white">Todays Meetings</h2>
                                            <span className="px-1.5 py-0.5 rounded-md bg-blue-500/10 text-blue-400 text-xs font-medium border border-blue-500/20">
                                                {dashboardData.todayMeetings.length}
                                            </span>
                                        </div>
                                        <Link to={FRONTEND_ROUTES.MEETINGS}>
                                            <button className="text-xs text-zinc-500 hover:text-white flex items-center gap-1 transition-colors">
                                                Schedule <ArrowRight className="w-3 h-3" />
                                            </button>
                                        </Link>
                                    </div>
                                    <div className="space-y-2">
                                        {dashboardData.todayMeetings.map((meeting: TodayMeeting) => (
                                            <div key={meeting.id} className="flex items-center justify-between p-3.5 rounded-xl bg-white/3 border border-white/6 hover:border-white/10 transition-colors group cursor-default">
                                                <div className="flex items-center gap-3 min-w-0">
                                                    <div className="w-9 h-9 rounded-full border border-white/10 bg-zinc-800 overflow-hidden flex items-center justify-center shrink-0">
                                                        {meeting.hostAvatar ? (
                                                            <img src={meeting.hostAvatar} alt={meeting.hostName} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <span className="text-xs font-semibold text-zinc-300">{meeting.hostName[0]}</span>
                                                        )}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="text-sm font-medium text-white truncate group-hover:text-blue-300 transition-colors">{meeting.title}</p>
                                                        <p className="text-xs text-zinc-500 mt-0.5 flex items-center gap-1">
                                                            <Clock className="w-3 h-3" />
                                                            {new Date(meeting.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} · {meeting.hostName}
                                                        </p>
                                                    </div>
                                                </div>
                                                <Link to={FRONTEND_ROUTES.MEETINGS}>
                                                    <Button className="shrink-0 ml-3 h-7 px-3 text-xs bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 rounded-lg transition-colors">
                                                        Join
                                                    </Button>
                                                </Link>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Charts Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        <IssueDistributionChart data={dashboardData?.distribution} />
                        <SprintStatusCard data={dashboardData?.recentSprints} />
                        <ModuleProgressGauge data={dashboardData?.progress} />
                    </div>

                    {/* Team Row */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                        <div className="lg:col-span-1">
                            <TopPerformerCard data={dashboardData?.topPerformer || null} />
                        </div>
                        <div className="lg:col-span-2">
                            <TeamActivitySection activities={dashboardData?.teamActivity || []} />
                        </div>
                    </div>
                </div>
            </div>

            <CreateProjectModal open={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
        </DashboardLayout>
    );
};
