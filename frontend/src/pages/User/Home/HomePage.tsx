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
    Folder,
    Sparkles,
    TrendingUp,
    Users,
    Zap
} from "lucide-react";
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

/* ─── tiny CSS injected once ─── */
const styles = `
@keyframes hpFadeUp {
  from { opacity: 0; transform: translateY(18px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes hpPulse {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.4; }
}
@keyframes hpGlow {
  0%, 100% { opacity: 0.06; }
  50%       { opacity: 0.12; }
}
@keyframes hpFloat {
  0%, 100% { transform: translateY(0px); }
  50%       { transform: translateY(-6px); }
}
.hp-fade-up        { animation: hpFadeUp  0.55s cubic-bezier(.22,1,.36,1) both; }
.hp-fade-up-d1     { animation-delay: 0.05s; }
.hp-fade-up-d2     { animation-delay: 0.10s; }
.hp-fade-up-d3     { animation-delay: 0.15s; }
.hp-fade-up-d4     { animation-delay: 0.20s; }
.hp-fade-up-d5     { animation-delay: 0.25s; }
.hp-fade-up-d6     { animation-delay: 0.30s; }
.hp-pulse-dot      { animation: hpPulse 1.8s ease-in-out infinite; }
.hp-glow-anim      { animation: hpGlow  3s ease-in-out infinite; }
.hp-float          { animation: hpFloat 4s ease-in-out infinite; }
.hp-card {
  background: linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 18px;
  backdrop-filter: blur(12px);
  transition: border-color .25s, box-shadow .25s, transform .25s;
}
.hp-card:hover {
  border-color: rgba(255,255,255,0.13);
  box-shadow: 0 8px 32px rgba(0,0,0,0.35);
  transform: translateY(-2px);
}
.hp-alert-card {
  background: linear-gradient(135deg, rgba(239,68,68,0.06) 0%, rgba(239,68,68,0.02) 100%);
  border: 1px solid rgba(239,68,68,0.12);
  border-radius: 14px;
  transition: border-color .2s, background .2s;
}
.hp-alert-card:hover {
  background: linear-gradient(135deg, rgba(239,68,68,0.09) 0%, rgba(239,68,68,0.04) 100%);
  border-color: rgba(239,68,68,0.2);
}
.hp-meeting-card {
  background: linear-gradient(135deg, rgba(59,130,246,0.06) 0%, rgba(59,130,246,0.02) 100%);
  border: 1px solid rgba(59,130,246,0.12);
  border-radius: 14px;
  transition: border-color .2s, background .2s;
}
.hp-meeting-card:hover {
  background: linear-gradient(135deg, rgba(59,130,246,0.09) 0%, rgba(59,130,246,0.04) 100%);
  border-color: rgba(59,130,246,0.2);
}
.hp-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  border-radius: 99px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.02em;
}
.hp-section-label {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: rgba(161,161,170,0.7);
}
.hp-resolve-btn {
  flex-shrink: 0;
  margin-left: 8px;
  height: 28px;
  padding: 0 10px;
  font-size: 11px;
  font-weight: 600;
  background: rgba(239,68,68,0.1);
  border: 1px solid rgba(239,68,68,0.2);
  color: #f87171;
  border-radius: 8px;
  cursor: pointer;
  transition: background .2s, border-color .2s;
  white-space: nowrap;
}
.hp-resolve-btn:hover {
  background: rgba(239,68,68,0.18);
  border-color: rgba(239,68,68,0.3);
}
.hp-join-btn {
  flex-shrink: 0;
  margin-left: 8px;
  height: 28px;
  padding: 0 10px;
  font-size: 11px;
  font-weight: 600;
  background: rgba(59,130,246,0.1);
  border: 1px solid rgba(59,130,246,0.2);
  color: #60a5fa;
  border-radius: 8px;
  cursor: pointer;
  transition: background .2s, border-color .2s;
  white-space: nowrap;
}
.hp-join-btn:hover {
  background: rgba(59,130,246,0.18);
  border-color: rgba(59,130,246,0.3);
}
`;

export const HomePage = () => {
    const dispatch = useDispatch();
    const { currentProject } = useSelector((state: RootState) => state.project);
    const { currentWorkspace } = useSelector((state: RootState) => state.workspace);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [showOverduePopup, setShowOverduePopup] = useState(false);
    const [overdueTasks, setOverdueTasks] = useState<OverdueTask[]>([]);

    /* inject styles once */
    useEffect(() => {
        const id = "hp-styles";
        if (!document.getElementById(id)) {
            const el = document.createElement("style");
            el.id = id;
            el.textContent = styles;
            document.head.appendChild(el);
        }
    }, []);

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

    /* ── Loading ── */
    if (isLoading) {
        return (
            <DashboardLayout>
                <div style={{ display:"flex", alignItems:"center", justifyContent:"center", minHeight:"60vh" }}>
                    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:16 }}>
                        <div style={{
                            width:44, height:44,
                            border:"2px solid rgba(59,130,246,0.2)",
                            borderTop:"2px solid #3b82f6",
                            borderRadius:"50%",
                            animation:"spin 0.9s linear infinite"
                        }} />
                        <p style={{ fontSize:13, color:"rgba(161,161,170,0.7)", fontWeight:500 }}>Loading dashboard…</p>
                    </div>
                </div>
                <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
            </DashboardLayout>
        );
    }

    /* ── No project ── */
    if (!currentProject && !isLoading) {
        return (
            <DashboardLayout>
                <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", minHeight:"70vh", textAlign:"center", padding:"0 20px" }}>
                    {/* floating folder icon */}
                    <div className="hp-float" style={{
                        width:72, height:72,
                        background:"linear-gradient(135deg, rgba(59,130,246,0.15) 0%, rgba(139,92,246,0.1) 100%)",
                        border:"1px solid rgba(59,130,246,0.25)",
                        borderRadius:22,
                        display:"flex", alignItems:"center", justifyContent:"center",
                        marginBottom:24,
                        boxShadow:"0 0 40px rgba(59,130,246,0.12)"
                    }}>
                        <Folder style={{ width:30, height:30, color:"#60a5fa" }} />
                    </div>

                    <h2 style={{ fontSize:24, fontWeight:700, color:"#fff", marginBottom:8 }}>No project selected</h2>
                    <p style={{ fontSize:14, color:"rgba(161,161,170,0.7)", marginBottom:32, maxWidth:320, lineHeight:1.6 }}>
                        Select an existing project or create a new one to view your dashboard.
                    </p>

                    <div style={{ display:"flex", gap:12, flexWrap:"wrap", justifyContent:"center" }}>
                        <Link to={FRONTEND_ROUTES.PROJECTS}>
                            <button style={{
                                height:40, padding:"0 22px",
                                borderRadius:12, border:"1px solid rgba(255,255,255,0.1)",
                                background:"rgba(255,255,255,0.04)",
                                color:"rgba(255,255,255,0.85)",
                                fontSize:13, fontWeight:600, cursor:"pointer",
                                transition:"background .2s, border-color .2s",
                                display:"flex", alignItems:"center", gap:6,
                                backdropFilter:"blur(8px)"
                            }}
                            onMouseEnter={e => {
                                (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.08)";
                                (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.18)";
                            }}
                            onMouseLeave={e => {
                                (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.04)";
                                (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.1)";
                            }}>
                                Browse Projects
                            </button>
                        </Link>
                        <button
                            onClick={() => setIsCreateModalOpen(true)}
                            style={{
                                height:40, padding:"0 22px",
                                borderRadius:12, border:"none",
                                background:"linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)",
                                color:"#fff",
                                fontSize:13, fontWeight:600, cursor:"pointer",
                                display:"flex", alignItems:"center", gap:6,
                                boxShadow:"0 4px 20px rgba(59,130,246,0.35)",
                                transition:"opacity .2s, transform .15s"
                            }}
                            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.opacity = "0.88"; }}
                            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.opacity = "1"; }}>
                            <Plus style={{ width:15, height:15 }} /> New Project
                        </button>
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

    const hasOverdue  = (dashboardData?.overdueTasks?.length  ?? 0) > 0;
    const hasMeetings = (dashboardData?.todayMeetings?.length ?? 0) > 0;

    return (
        <DashboardLayout>
            <div style={{ position:"relative", minHeight:"100vh" }}>
                {showOverduePopup && (
                    <OverdueTasksPopup tasks={overdueTasks} onClose={() => setShowOverduePopup(false)} />
                )}

                {/* ── Ambient background glow ── */}
                <div style={{
                    position:"fixed", top:0, left:0, right:0, bottom:0,
                    pointerEvents:"none", zIndex:0, overflow:"hidden"
                }}>
                    <div className="hp-glow-anim" style={{
                        position:"absolute", top:"-10%", right:"-5%",
                        width:600, height:600,
                        background:"radial-gradient(circle, rgba(99,102,241,0.07) 0%, transparent 70%)",
                        borderRadius:"50%"
                    }} />
                    <div className="hp-glow-anim" style={{
                        position:"absolute", bottom:"-10%", left:"-5%",
                        width:500, height:500,
                        background:"radial-gradient(circle, rgba(59,130,246,0.06) 0%, transparent 70%)",
                        borderRadius:"50%",
                        animationDelay:"1.5s"
                    }} />
                </div>

                <div style={{ position:"relative", zIndex:1, padding:"20px 16px", maxWidth:1400, margin:"0 auto" }}
                     className="hp-page-content">

                    {/* ══ PAGE HEADER ══ */}
                    <div className="hp-fade-up" style={{
                        display:"flex", flexWrap:"wrap", justifyContent:"space-between", alignItems:"flex-start",
                        gap:16, paddingBottom:24, borderBottom:"1px solid rgba(255,255,255,0.05)",
                        marginBottom:28
                    }}>
                        <div>
                            {/* live badge */}
                            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
                                <span className="hp-pulse-dot" style={{
                                    display:"inline-block", width:7, height:7,
                                    borderRadius:"50%", background:"#10b981"
                                }} />
                                <span className="hp-badge" style={{ background:"rgba(16,185,129,0.1)", color:"#34d399", border:"1px solid rgba(16,185,129,0.2)" }}>
                                    <Sparkles style={{ width:10, height:10 }} /> Live
                                </span>
                                <span style={{ fontSize:12, color:"rgba(161,161,170,0.5)" }}>·</span>
                                <span style={{ fontSize:12, color:"rgba(161,161,170,0.6)", fontWeight:500, maxWidth:160,
                                    overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                                    {currentProject?.projectName}
                                </span>
                            </div>

                            <h1 style={{ fontSize:"clamp(20px,3vw,26px)", fontWeight:700, color:"#fff", margin:0, letterSpacing:"-0.01em" }}>
                                Dashboard
                            </h1>
                            <p style={{ fontSize:13, color:"rgba(161,161,170,0.6)", marginTop:4 }}>
                                Track your projects performance and team activity.
                            </p>
                        </div>

                        <button
                            onClick={() => setIsCreateModalOpen(true)}
                            style={{
                                display:"flex", alignItems:"center", gap:7,
                                height:40, padding:"0 20px",
                                borderRadius:12, border:"none",
                                background:"linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)",
                                color:"#fff", fontSize:13, fontWeight:600, cursor:"pointer",
                                boxShadow:"0 4px 20px rgba(59,130,246,0.3)",
                                transition:"opacity .2s, transform .15s",
                                flexShrink:0
                            }}
                            onMouseEnter={e => {
                                (e.currentTarget as HTMLButtonElement).style.opacity = "0.88";
                                (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)";
                            }}
                            onMouseLeave={e => {
                                (e.currentTarget as HTMLButtonElement).style.opacity = "1";
                                (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
                            }}>
                            <Plus style={{ width:16, height:16 }} /> New Project
                        </button>
                    </div>

                    {/* ══ STATS GRID ══ */}
                    <div className="hp-fade-up hp-fade-up-d1" style={{
                        display:"grid",
                        gridTemplateColumns:"repeat(2, 1fr)",
                        gap:14,
                        marginBottom:24
                    }}>
                        <style>{`
                          @media (min-width: 768px) {
                            .hp-stats-grid { grid-template-columns: repeat(4, 1fr) !important; }
                          }
                        `}</style>
                        <div className="hp-stats-grid" style={{ display:"contents" }}>
                            <StatsCard title="Total Issues"   value={stats.totalIssues}       icon={ListTodo}    color="blue"   description="Across all modules" />
                            <StatsCard title="Completed"      value={stats.completedIssues}    icon={CheckCircle2} color="green"  description={`${stats.completionRate}% done`} trend="+4.2%" />
                            <StatsCard title="Active Sprints" value={stats.activeSprintsCount} icon={Activity}    color="purple" description="Running cycles" />
                            <StatsCard title="Team Size"      value={stats.memberCount}        icon={Layout}      color="orange" description="Collaborators" />
                        </div>
                    </div>

                    {/* Quick stat pills (mobile-friendly summary row) */}
                    <div className="hp-fade-up hp-fade-up-d2" style={{
                        display:"flex", flexWrap:"wrap", gap:10, marginBottom:24
                    }}>
                        {[
                            { icon: TrendingUp, label:"Completion Rate",  value:`${stats.completionRate}%`, color:"#10b981", bg:"rgba(16,185,129,0.1)", border:"rgba(16,185,129,0.2)" },
                            { icon: Zap,        label:"Velocity",          value:"High",                    color:"#f59e0b", bg:"rgba(245,158,11,0.1)",  border:"rgba(245,158,11,0.2)" },
                            { icon: Users,      label:"Active Members",    value:stats.memberCount,          color:"#818cf8", bg:"rgba(129,140,248,0.1)", border:"rgba(129,140,248,0.2)" },
                        ].map(({ icon: Ic, label, value, color, bg, border }) => (
                            <div key={label} style={{
                                display:"flex", alignItems:"center", gap:8,
                                padding:"7px 14px", borderRadius:30,
                                background:bg, border:`1px solid ${border}`,
                                backdropFilter:"blur(8px)"
                            }}>
                                <Ic style={{ width:13, height:13, color, flexShrink:0 }} />
                                <span style={{ fontSize:12, color:"rgba(255,255,255,0.55)", fontWeight:500 }}>{label}:</span>
                                <span style={{ fontSize:12, fontWeight:700, color }}>{value}</span>
                            </div>
                        ))}
                    </div>

                    {/* ══ PROGRESS BAR ══ */}
                    <div className="hp-fade-up hp-fade-up-d2" style={{ marginBottom:28 }}>
                        <ProgressLinear title="Overall Completion Rate" percentage={stats.completionRate} />
                    </div>

                    {/* ══ ALERTS SECTION (Overdue + Meetings) ══ */}
                    {(hasOverdue || hasMeetings) && (
                        <div className="hp-fade-up hp-fade-up-d3" style={{ marginBottom:28 }}>
                            <p className="hp-section-label" style={{ marginBottom:14 }}>⚡ Attention Required</p>

                            <div style={{
                                display:"grid",
                                gridTemplateColumns: hasOverdue && hasMeetings ? "repeat(auto-fit, minmax(300px, 1fr))" : "1fr",
                                gap:16
                            }}>
                                {/* Overdue Tasks */}
                                {hasOverdue && (
                                    <div className="hp-card" style={{ padding:20 }}>
                                        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16 }}>
                                            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                                                <div style={{
                                                    width:30, height:30, borderRadius:9,
                                                    background:"rgba(239,68,68,0.12)",
                                                    border:"1px solid rgba(239,68,68,0.2)",
                                                    display:"flex", alignItems:"center", justifyContent:"center"
                                                }}>
                                                    <AlertTriangle style={{ width:14, height:14, color:"#f87171" }} />
                                                </div>
                                                <span style={{ fontSize:14, fontWeight:600, color:"#fff" }}>Overdue Tasks</span>
                                                <span style={{
                                                    padding:"2px 8px", borderRadius:99,
                                                    background:"rgba(239,68,68,0.12)",
                                                    border:"1px solid rgba(239,68,68,0.2)",
                                                    color:"#f87171", fontSize:11, fontWeight:700
                                                }}>
                                                    {dashboardData.overdueTasks.length}
                                                </span>
                                            </div>
                                            <Link to={FRONTEND_ROUTES.BOARD}>
                                                <button style={{
                                                    display:"flex", alignItems:"center", gap:4,
                                                    fontSize:12, color:"rgba(161,161,170,0.6)",
                                                    background:"none", border:"none", cursor:"pointer",
                                                    transition:"color .2s"
                                                }}
                                                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = "#fff"; }}
                                                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = "rgba(161,161,170,0.6)"; }}>
                                                    View all <ArrowRight style={{ width:12, height:12 }} />
                                                </button>
                                            </Link>
                                        </div>

                                        <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                                            {dashboardData.overdueTasks.map((task: OverdueTask) => (
                                                <div key={task.id} className="hp-alert-card" style={{
                                                    display:"flex", alignItems:"center",
                                                    justifyContent:"space-between", padding:"10px 14px"
                                                }}>
                                                    <div style={{ display:"flex", alignItems:"center", gap:10, minWidth:0 }}>
                                                        <AlertCircle style={{ width:14, height:14, color:"#f87171", flexShrink:0 }} />
                                                        <div style={{ minWidth:0 }}>
                                                            <p style={{
                                                                fontSize:13, fontWeight:600, color:"#fff",
                                                                overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap",
                                                                margin:0
                                                            }}>{task.title}</p>
                                                            <p style={{ fontSize:11, color:"rgba(161,161,170,0.55)", marginTop:2 }}>
                                                                {task.key} · Due {new Date(task.endDate).toLocaleDateString()}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <Link to={FRONTEND_ROUTES.BOARD}>
                                                        <button className="hp-resolve-btn">Resolve</button>
                                                    </Link>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Today's Meetings */}
                                {hasMeetings && (
                                    <div className="hp-card" style={{ padding:20 }}>
                                        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16 }}>
                                            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                                                <div style={{
                                                    width:30, height:30, borderRadius:9,
                                                    background:"rgba(59,130,246,0.12)",
                                                    border:"1px solid rgba(59,130,246,0.2)",
                                                    display:"flex", alignItems:"center", justifyContent:"center"
                                                }}>
                                                    <Video style={{ width:14, height:14, color:"#60a5fa" }} />
                                                </div>
                                                <span style={{ fontSize:14, fontWeight:600, color:"#fff" }}>Todays Meetings</span>
                                                <span style={{
                                                    padding:"2px 8px", borderRadius:99,
                                                    background:"rgba(59,130,246,0.12)",
                                                    border:"1px solid rgba(59,130,246,0.2)",
                                                    color:"#60a5fa", fontSize:11, fontWeight:700
                                                }}>
                                                    {dashboardData.todayMeetings.length}
                                                </span>
                                            </div>
                                            <Link to={FRONTEND_ROUTES.MEETINGS}>
                                                <button style={{
                                                    display:"flex", alignItems:"center", gap:4,
                                                    fontSize:12, color:"rgba(161,161,170,0.6)",
                                                    background:"none", border:"none", cursor:"pointer",
                                                    transition:"color .2s"
                                                }}
                                                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = "#fff"; }}
                                                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = "rgba(161,161,170,0.6)"; }}>
                                                    Schedule <ArrowRight style={{ width:12, height:12 }} />
                                                </button>
                                            </Link>
                                        </div>

                                        <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                                            {dashboardData.todayMeetings.map((meeting: TodayMeeting) => (
                                                <div key={meeting.id} className="hp-meeting-card" style={{
                                                    display:"flex", alignItems:"center",
                                                    justifyContent:"space-between", padding:"10px 14px"
                                                }}>
                                                    <div style={{ display:"flex", alignItems:"center", gap:10, minWidth:0 }}>
                                                        <div style={{
                                                            width:36, height:36, borderRadius:"50%",
                                                            border:"1px solid rgba(255,255,255,0.1)",
                                                            background:"rgba(255,255,255,0.06)",
                                                            overflow:"hidden", display:"flex", alignItems:"center",
                                                            justifyContent:"center", flexShrink:0
                                                        }}>
                                                            {meeting.hostAvatar ? (
                                                                <img src={meeting.hostAvatar} alt={meeting.hostName} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                                                            ) : (
                                                                <span style={{ fontSize:13, fontWeight:700, color:"rgba(255,255,255,0.8)" }}>
                                                                    {meeting.hostName[0]}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div style={{ minWidth:0 }}>
                                                            <p style={{
                                                                fontSize:13, fontWeight:600, color:"#fff", margin:0,
                                                                overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap"
                                                            }}>{meeting.title}</p>
                                                            <p style={{ fontSize:11, color:"rgba(161,161,170,0.55)", marginTop:2, display:"flex", alignItems:"center", gap:4 }}>
                                                                <Clock style={{ width:10, height:10 }} />
                                                                {new Date(meeting.startTime).toLocaleTimeString([], { hour:"2-digit", minute:"2-digit" })} · {meeting.hostName}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <Link to={FRONTEND_ROUTES.MEETINGS}>
                                                        <button className="hp-join-btn">Join</button>
                                                    </Link>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* ══ CHARTS ROW ══ */}
                    <div className="hp-fade-up hp-fade-up-d4" style={{ marginBottom:28 }}>
                        <p className="hp-section-label" style={{ marginBottom:14 }}>📊 Analytics</p>
                        <div style={{
                            display:"grid",
                            gridTemplateColumns:"repeat(auto-fit, minmax(280px, 1fr))",
                            gap:16
                        }}>
                            <IssueDistributionChart data={dashboardData?.distribution} />
                            <SprintStatusCard data={dashboardData?.recentSprints} />
                            <ModuleProgressGauge data={dashboardData?.progress} />
                        </div>
                    </div>

                    {/* ══ TEAM ROW ══ */}
                    <div className="hp-fade-up hp-fade-up-d5" style={{ marginBottom:8 }}>
                        <p className="hp-section-label" style={{ marginBottom:14 }}>👥 Team</p>
                        <div style={{
                            display:"grid",
                            gridTemplateColumns:"repeat(auto-fit, minmax(280px, 1fr))",
                            gap:16
                        }}>
                            <TopPerformerCard data={dashboardData?.topPerformer || null} />
                            <div style={{ gridColumn:"span 2" }} className="hp-team-activity-span">
                                <TeamActivitySection activities={dashboardData?.teamActivity || []} />
                            </div>
                        </div>
                        <style>{`
                          @media (max-width: 767px) {
                            .hp-team-activity-span { grid-column: span 1 !important; }
                          }
                        `}</style>
                    </div>

                </div>
            </div>

            <CreateProjectModal open={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />

            {/* ── Global responsive overrides ── */}
            <style>{`
              @media (min-width: 768px) {
                .hp-page-content { padding: 28px 32px !important; }
                .hp-stats-grid-wrapper { grid-template-columns: repeat(4, 1fr) !important; }
              }
              @media (min-width: 1024px) {
                .hp-page-content { padding: 32px 40px !important; }
              }
            `}</style>
        </DashboardLayout>
    );
};
