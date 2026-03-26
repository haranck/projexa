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
    AlertCircle
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
            // Ensure task state is set correctly for the popup
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
                <div className="p-8 text-white animate-pulse flex items-center justify-center min-h-[50vh]">
                    <div className="flex flex-col items-center gap-6">
                        <div className="relative">
                            <Activity className="w-16 h-16 text-blue-500 animate-spin" />
                            <div className="absolute inset-0 blur-2xl bg-blue-500/20 rounded-full animate-pulse" />
                        </div>
                        <span className="text-2xl font-black tracking-[0.3em] uppercase text-zinc-500">Synchronizing...</span>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    if (!currentProject && !isLoading) {
        return (
            <DashboardLayout>
                <div className="p-8 flex flex-col items-center justify-center min-h-[70vh] text-center relative overflow-hidden">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />

                    <div className="relative z-10 max-w-lg">
                        <div className="w-24 h-24 bg-blue-500/10 border border-blue-500/20 rounded-[2.5rem] flex items-center justify-center mb-8 mx-auto shadow-2xl shadow-blue-500/10 rotate-3 transition-transform hover:rotate-0 duration-500">
                            <Layout className="w-12 h-12 text-blue-500" />
                        </div>
                        <h2 className="text-5xl font-black text-white tracking-tighter mb-4">Initialize Workspace</h2>
                        <p className="text-zinc-500 text-lg mb-10 font-medium">
                            Welcome to Projexa. To begin your journey, select an existing project or create a new mission.
                        </p>
                        <div className="flex gap-4 justify-center">
                            <Link to={FRONTEND_ROUTES.PROJECTS}>
                                <Button className="bg-[#1c222d] hover:bg-zinc-800 text-white h-14 px-10 rounded-2xl font-black transition-all border border-white/5 active:scale-95 shadow-xl">
                                    Browse Projects
                                </Button>
                            </Link>
                            <Button
                                onClick={() => setIsCreateModalOpen(true)}
                                className="bg-blue-600 hover:bg-blue-500 text-white h-14 px-10 rounded-2xl font-black transition-all shadow-xl shadow-blue-600/30 active:scale-95 flex items-center gap-3"
                            >
                                <Plus className="w-5 h-5" />
                                Start New Project
                            </Button>
                        </div>
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
            <div className="relative min-h-screen">
                {/* Overdue Tasks Popup */}
                {showOverduePopup && (
                    <OverdueTasksPopup 
                        tasks={overdueTasks} 
                        onClose={() => setShowOverduePopup(false)} 
                    />
                )}

                {/* Background Decor */}
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-500/2 blur-[150px] rounded-full -mr-96 -mt-96 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-emerald-500/1 blur-[120px] rounded-full -ml-40 -mb-40 pointer-events-none" />

                <div className="p-6 lg:p-10 space-y-8 max-w-screen-2xl mx-auto relative z-10 overflow-x-hidden">
                    {/* Header Section */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 shadow-sm pb-6 border-b border-white/5">
                        <div className="space-y-2">
                            <div className="inline-flex items-center gap-3 px-3 py-1.5 rounded-xl bg-white/3 border border-white/5 text-zinc-400 text-[8px] font-black uppercase tracking-[0.3em] shadow-inner">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                                Project Intel Center
                            </div>
                            <h1 className="text-2xl lg:text-3xl font-black text-white tracking-tighter leading-none uppercase">
                                Projexa <span className="text-blue-500">Dashboard</span>
                            </h1>
                            <p className="text-zinc-500 text-[12px] font-medium max-w-lg leading-snug">
                                High-velocity operational intelligence and mission-critical metrics for <span className="text-zinc-300 font-bold">{currentProject?.projectName}</span>.
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <Button
                                onClick={() => setIsCreateModalOpen(true)}
                                className="bg-[#1c222d] hover:bg-zinc-800 text-white h-12 px-6 rounded-xl text-[11px] font-black transition-all hover:scale-105 active:scale-95 flex items-center gap-2 border border-white/5 shadow-2xl uppercase tracking-widest"
                            >
                                <Plus className="w-4 h-4 text-blue-500" />
                                New Initiative
                            </Button>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                        <StatsCard
                            title="Total Issues"
                            value={stats.totalIssues.toString()}
                            icon={ListTodo}
                            color="blue"
                            description="Across all modules"
                        />
                        <StatsCard
                            title="Completed"
                            value={stats.completedIssues.toString()}
                            icon={CheckCircle2}
                            description={`${stats.completionRate}% completion`}
                            trend="+4.2%"
                            color="green"
                        />
                        <StatsCard
                            title="Active Sprints"
                            value={stats.activeSprintsCount.toString().padStart(2, '0')}
                            icon={Activity}
                            color="purple"
                            description="Operational sprints"
                        />
                        <StatsCard
                            title="Team Power"
                            value={stats.memberCount.toString()}
                            icon={Layout}
                            description="Active collaborators"
                            color="orange"
                        />
                    </div>

                    {/* Operational Row: Overdue + Meetings */}
                    {(dashboardData?.overdueTasks?.length > 0 || dashboardData?.todayMeetings?.length > 0) && (
                        <div className={`grid grid-cols-1 ${
                            dashboardData?.overdueTasks?.length > 0 && dashboardData?.todayMeetings?.length > 0 
                            ? "lg:grid-cols-2" 
                            : ""
                        } gap-10 items-start`}>
                            {/* Critical Overdue Alerts Section */}
                            {dashboardData?.overdueTasks?.length > 0 && (
                                <div className="space-y-6 pt-4 animate-in fade-in slide-in-from-top-4 duration-1000">
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center border border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.1)]">
                                                    <AlertTriangle className="w-4 h-4 text-red-500 animate-pulse" />
                                                </div>
                                                <h2 className="text-xl font-black text-white uppercase tracking-tight italic">Overdue Operations</h2>
                                            </div>
                                            <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest ml-11">Critical Deployment Delays Detected</p>
                                        </div>
                                        <Link to={FRONTEND_ROUTES.BOARD}>
                                            <Button variant="ghost" className="text-red-500/70 hover:text-red-500 hover:bg-red-500/5 text-[10px] font-black uppercase tracking-widest gap-2">
                                                Resolve All <ArrowRight className="w-3 h-3" />
                                            </Button>
                                        </Link>
                                    </div>
                                    <div className={`grid grid-cols-1 ${
                                        dashboardData?.todayMeetings?.length > 0 
                                        ? "xl:grid-cols-1" 
                                        : "md:grid-cols-2 lg:grid-cols-3"
                                    } gap-6`}>
                                        {dashboardData.overdueTasks.map((task: OverdueTask) => (
                                            <div key={task.id} className="group p-6 rounded-[2.5rem] bg-[#1a1414] border border-red-500/10 hover:border-red-500/40 transition-all shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[160px]">
                                                <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 blur-2xl -mr-16 -mt-16 pointer-events-none group-hover:bg-red-500/10 transition-colors" />
                                                
                                                <div className="relative z-10">
                                                    <div className="flex justify-between items-start mb-4">
                                                        <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-red-500/10 border border-red-500/20">
                                                            <AlertCircle className="w-3 h-3 text-red-500" />
                                                            <span className="text-[10px] font-black text-red-500 tracking-widest uppercase animate-pulse">
                                                                Overdue
                                                            </span>
                                                        </div>
                                                        <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">
                                                            {task.key}
                                                        </span>
                                                    </div>
                                                    <h4 className="text-lg font-black text-white tracking-tight mb-1 group-hover:text-red-400 transition-colors line-clamp-1">{task.title}</h4>
                                                    <p className="text-zinc-500 text-[10px] font-medium uppercase tracking-widest mb-4 flex items-center gap-2">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-red-900" />
                                                        Due: <span className="text-red-400/80">{new Date(task.endDate).toLocaleDateString()}</span>
                                                    </p>
                                                </div>

                                                <Link to={FRONTEND_ROUTES.BOARD} className="relative z-10 mt-auto">
                                                    <Button className="w-full bg-red-600/10 hover:bg-red-600 text-white border border-red-500/20 h-10 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95">
                                                        Execute Resolution
                                                    </Button>
                                                </Link>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {dashboardData?.todayMeetings?.length > 0 && (
                                <div className="space-y-6 pt-4 animate-in slide-in-from-bottom-4 duration-700">
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                                                    <Video className="w-4 h-4 text-blue-500" />
                                                </div>
                                                <h2 className="text-xl font-black text-white uppercase tracking-tight italic">Today&apos;s Missions</h2>
                                            </div>
                                            <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest ml-11">Synchronized Operational Briefings</p>
                                        </div>
                                        <Link to={FRONTEND_ROUTES.MEETINGS}>
                                            <Button variant="ghost" className="text-zinc-500 hover:text-white text-[10px] font-black uppercase tracking-widest gap-2">
                                                View Schedule <ArrowRight className="w-3 h-3" />
                                            </Button>
                                        </Link>
                                    </div>
                                    <div className={`grid grid-cols-1 ${
                                        dashboardData?.overdueTasks?.length > 0 
                                        ? "xl:grid-cols-1" 
                                        : "md:grid-cols-2 lg:grid-cols-3"
                                    } gap-6`}>
                                        {dashboardData.todayMeetings.map((meeting: TodayMeeting) => (
                                            <div key={meeting.id} className="group p-6 rounded-[2.5rem] bg-[#1c222d] border border-white/5 hover:border-blue-500/30 transition-all shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[160px]">
                                                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-2xl -mr-16 -mt-16 pointer-events-none group-hover:bg-blue-500/10 transition-colors" />
                                                
                                                <div className="relative z-10">
                                                    <div className="flex justify-between items-start mb-4">
                                                        <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20">
                                                            <Clock className="w-3 h-3 text-blue-500" />
                                                            <span className="text-[10px] font-black text-white tracking-widest uppercase">
                                                                {new Date(meeting.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                            </span>
                                                        </div>
                                                        <div className="flex -space-x-2">
                                                            <div className="w-8 h-8 rounded-full border-2 border-[#1c222d] bg-zinc-800 overflow-hidden shadow-xl group-hover:scale-110 transition-transform">
                                                                {meeting.hostAvatar ? (
                                                                    <img src={meeting.hostAvatar} alt={meeting.hostName} className="w-full h-10 object-cover" />
                                                                ) : (
                                                                    <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-zinc-500 uppercase">{meeting.hostName[0]}</div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <h4 className="text-lg font-black text-white tracking-tight mb-1 group-hover:text-blue-400 transition-colors">{meeting.title}</h4>
                                                    <p className="text-zinc-500 text-[10px] font-medium uppercase tracking-widest mb-4 flex items-center gap-2">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-zinc-700" />
                                                        Host: <span className="text-zinc-300">{meeting.hostName}</span>
                                                    </p>
                                                </div>

                                                <Link to={FRONTEND_ROUTES.MEETINGS} className="relative z-10 mt-auto">
                                                    <Button className="w-full bg-white/5 hover:bg-white/10 text-white border border-white/5 h-10 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all group-hover:bg-blue-600 group-hover:border-blue-500 group-hover:shadow-lg group-hover:shadow-blue-600/20 active:scale-95">
                                                        Join Tactical Room
                                                    </Button>
                                                </Link>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    <ProgressLinear
                        title="Overall Project Velocity"
                        percentage={stats.completionRate}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 h-full items-stretch">
                        <IssueDistributionChart data={dashboardData?.distribution} />
                        <SprintStatusCard data={dashboardData?.recentSprints} />
                        <ModuleProgressGauge data={dashboardData?.progress} />
                    </div>


                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 auto-rows-fr">
                        <div className="lg:col-span-1 h-full flex flex-col">
                            <TopPerformerCard data={dashboardData?.topPerformer || null} />
                        </div>
                        <div className="lg:col-span-2 h-full flex flex-col">
                            <TeamActivitySection activities={dashboardData?.teamActivity || []} />
                        </div>
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
