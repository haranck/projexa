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
    BarChart3,
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

// ─── Injected CSS ───────────────────────────────────────────────────────────
const HP_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

  .hp-root * { box-sizing: border-box; font-family: 'Inter', sans-serif; }

  @keyframes hp-fade-slide {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes hp-pulse-ring {
    0%, 100% { opacity: 1; transform: scale(1); }
    50%       { opacity: 0.4; transform: scale(0.95); }
  }
  @keyframes hp-breathe {
    0%, 100% { opacity: 0.05; transform: scale(1); }
    50%       { opacity: 0.11; transform: scale(1.08); }
  }
  @keyframes hp-float {
    0%, 100% { transform: translateY(0); }
    50%       { transform: translateY(-8px); }
  }
  @keyframes hp-spin {
    to { transform: rotate(360deg); }
  }
  @keyframes hp-shimmer {
    0%   { background-position: -200% center; }
    100% { background-position:  200% center; }
  }

  /* Staggered entrance */
  .hp-s0 { animation: hp-fade-slide .5s cubic-bezier(.22,1,.36,1) both; }
  .hp-s1 { animation: hp-fade-slide .5s cubic-bezier(.22,1,.36,1) .07s both; }
  .hp-s2 { animation: hp-fade-slide .5s cubic-bezier(.22,1,.36,1) .14s both; }
  .hp-s3 { animation: hp-fade-slide .5s cubic-bezier(.22,1,.36,1) .21s both; }
  .hp-s4 { animation: hp-fade-slide .5s cubic-bezier(.22,1,.36,1) .28s both; }
  .hp-s5 { animation: hp-fade-slide .5s cubic-bezier(.22,1,.36,1) .35s both; }

  .hp-live-dot {
    width: 7px; height: 7px; border-radius: 50%;
    background: #22c55e;
    animation: hp-pulse-ring 1.8s ease-in-out infinite;
  }
  .hp-float { animation: hp-float 4s ease-in-out infinite; }
  .hp-spin  { animation: hp-spin .9s linear infinite; }

  /* Glass card */
  .hp-glass {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 20px;
    backdrop-filter: blur(16px);
    transition: border-color .25s ease, box-shadow .25s ease, transform .25s ease;
  }
  .hp-glass:hover {
    border-color: rgba(255,255,255,0.12);
    box-shadow: 0 12px 40px rgba(0,0,0,0.4);
    transform: translateY(-2px);
  }

  /* Alert row items */
  .hp-overdue-row {
    display: flex; align-items: center; justify-content: space-between;
    padding: 11px 14px; border-radius: 12px; gap: 10px;
    background: rgba(239,68,68,0.05);
    border: 1px solid rgba(239,68,68,0.1);
    transition: border-color .2s, background .2s;
  }
  .hp-overdue-row:hover {
    background: rgba(239,68,68,0.09);
    border-color: rgba(239,68,68,0.18);
  }
  .hp-meeting-row {
    display: flex; align-items: center; justify-content: space-between;
    padding: 11px 14px; border-radius: 12px; gap: 10px;
    background: rgba(59,130,246,0.05);
    border: 1px solid rgba(59,130,246,0.1);
    transition: border-color .2s, background .2s;
  }
  .hp-meeting-row:hover {
    background: rgba(59,130,246,0.09);
    border-color: rgba(59,130,246,0.18);
  }

  /* CTA Button */
  .hp-cta-btn {
    display: inline-flex; align-items: center; gap: 7px;
    height: 40px; padding: 0 20px; border-radius: 12px; border: none;
    background: linear-gradient(135deg, #3b82f6 0%, #6366f1 100%);
    color: #fff; font-size: 13px; font-weight: 600; cursor: pointer;
    box-shadow: 0 4px 20px rgba(59,130,246,0.35);
    transition: opacity .2s, transform .18s, box-shadow .2s;
    white-space: nowrap;
  }
  .hp-cta-btn:hover {
    opacity: 0.9; transform: translateY(-1px);
    box-shadow: 0 6px 28px rgba(59,130,246,0.45);
  }
  .hp-cta-btn:active { transform: translateY(0); }

  /* Outline ghost button */
  .hp-ghost-btn {
    display: inline-flex; align-items: center; gap: 6px;
    height: 40px; padding: 0 20px; border-radius: 12px;
    border: 1px solid rgba(255,255,255,0.1);
    background: rgba(255,255,255,0.04);
    color: rgba(255,255,255,0.8); font-size: 13px; font-weight: 600;
    cursor: pointer; transition: background .2s, border-color .2s;
  }
  .hp-ghost-btn:hover {
    background: rgba(255,255,255,0.08);
    border-color: rgba(255,255,255,0.18);
  }

  /* Inline action buttons */
  .hp-btn-rose {
    flex-shrink: 0; height: 28px; padding: 0 12px;
    border-radius: 8px; border: 1px solid rgba(239,68,68,0.22);
    background: rgba(239,68,68,0.1); color: #f87171;
    font-size: 11px; font-weight: 600; cursor: pointer;
    transition: background .2s;
  }
  .hp-btn-rose:hover { background: rgba(239,68,68,0.18); }
  .hp-btn-blue {
    flex-shrink: 0; height: 28px; padding: 0 12px;
    border-radius: 8px; border: 1px solid rgba(59,130,246,0.22);
    background: rgba(59,130,246,0.1); color: #60a5fa;
    font-size: 11px; font-weight: 600; cursor: pointer;
    transition: background .2s;
  }
  .hp-btn-blue:hover { background: rgba(59,130,246,0.18); }

  /* View-all link */
  .hp-view-all {
    display: inline-flex; align-items: center; gap: 3px;
    font-size: 12px; font-weight: 500; color: rgba(161,161,170,0.55);
    background: none; border: none; cursor: pointer;
    transition: color .2s;
  }
  .hp-view-all:hover { color: rgba(255,255,255,0.85); }

  /* Section divider label */
  .hp-divider-label {
    display: flex; align-items: center; gap: 10px;
    font-size: 11px; font-weight: 700; letter-spacing: .08em;
    text-transform: uppercase; color: rgba(161,161,170,0.5);
    margin-bottom: 14px;
  }
  .hp-divider-label::after {
    content: ''; flex: 1; height: 1px;
    background: rgba(255,255,255,0.05);
  }

  /* Responsive grid helpers */
  .hp-stats-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 14px;
  }
  .hp-charts-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 16px;
  }
  .hp-team-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 16px;
  }
  .hp-alert-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 16px;
  }

  @media (min-width: 640px) {
    .hp-charts-grid  { grid-template-columns: repeat(2, 1fr); }
  }
  @media (min-width: 768px) {
    .hp-stats-grid   { grid-template-columns: repeat(4, 1fr); }
    .hp-alert-grid   { grid-template-columns: repeat(2, 1fr); }
    .hp-page-pad     { padding: 28px 28px !important; }
  }
  @media (min-width: 1024px) {
    .hp-charts-grid  { grid-template-columns: repeat(3, 1fr); }
    .hp-team-grid    { grid-template-columns: 1fr 2fr; }
    .hp-page-pad     { padding: 32px 40px !important; }
  }
`;

// ─── Component ──────────────────────────────────────────────────────────────
export const HomePage = () => {
    const dispatch = useDispatch();
    const { currentProject } = useSelector((state: RootState) => state.project);
    const { currentWorkspace } = useSelector((state: RootState) => state.workspace);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [showOverduePopup, setShowOverduePopup] = useState(false);
    const [overdueTasks, setOverdueTasks] = useState<OverdueTask[]>([]);

    // Inject styles once
    useEffect(() => {
        const TAG = "hp-global-styles";
        if (!document.getElementById(TAG)) {
            const s = document.createElement("style");
            s.id = TAG;
            s.textContent = HP_STYLES;
            document.head.appendChild(s);
        }
    }, []);

    const { data: projectsResponse } = useGetAllProjects({
        workspaceId: currentWorkspace?._id || currentWorkspace?.id || "",
        page: 1,
        limit: 10,
    });
    const projects = projectsResponse?.data?.projects || [];

    useEffect(() => {
        if (!currentProject && projects.length > 0) dispatch(setCurrentProject(projects[0]));
    }, [currentProject, projects, dispatch]);

    const { data: dashboardData, isLoading, refetch } = useDashboardData();

    useEffect(() => {
        if (!socket) return;
        socket.on(NOTIFICATION_EVENTS.ISSUE_UPDATED,   () => refetch());
        socket.on(NOTIFICATION_EVENTS.SPRINT_STARTED,  () => refetch());
        socket.on(NOTIFICATION_EVENTS.SPRINT_COMPLETED,() => refetch());
        return () => {
            socket.off(NOTIFICATION_EVENTS.ISSUE_UPDATED);
            socket.off(NOTIFICATION_EVENTS.SPRINT_STARTED);
            socket.off(NOTIFICATION_EVENTS.SPRINT_COMPLETED);
        };
    }, [refetch]);

    useEffect(() => {
        if (dashboardData?.overdueTasks?.length > 0) {
            setOverdueTasks(dashboardData.overdueTasks);
            const key = `overdue_shown_${currentProject?._id}`;
            if (!sessionStorage.getItem(key)) {
                setShowOverduePopup(true);
                sessionStorage.setItem(key, "true");
            }
        }
    }, [dashboardData, currentProject?._id]);

    // ── Loading state ────────────────────────────────────────────────────────
    if (isLoading) {
        return (
            <DashboardLayout>
                <div className="hp-root" style={{ display:"flex", alignItems:"center", justifyContent:"center", minHeight:"60vh" }}>
                    <div style={{ textAlign:"center" }}>
                        <div className="hp-spin" style={{
                            width:42, height:42, margin:"0 auto 16px",
                            borderRadius:"50%",
                            border:"2px solid rgba(99,102,241,0.2)",
                            borderTop:"2px solid #6366f1",
                        }} />
                        <p style={{ fontSize:13, color:"rgba(161,161,170,0.6)", fontWeight:500, margin:0 }}>
                            Loading your dashboard…
                        </p>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    // ── Empty / no project state ─────────────────────────────────────────────
    if (!currentProject && !isLoading) {
        return (
            <DashboardLayout>
                <div className="hp-root" style={{
                    display:"flex", flexDirection:"column",
                    alignItems:"center", justifyContent:"center",
                    minHeight:"72vh", padding:"0 24px", textAlign:"center",
                }}>
                    {/* Glowing folder */}
                    <div className="hp-float" style={{
                        width:80, height:80,
                        borderRadius:24,
                        background:"linear-gradient(135deg, rgba(99,102,241,0.18), rgba(59,130,246,0.12))",
                        border:"1px solid rgba(99,102,241,0.28)",
                        display:"flex", alignItems:"center", justifyContent:"center",
                        marginBottom:28,
                        boxShadow:"0 0 50px rgba(99,102,241,0.15)",
                    }}>
                        <Folder style={{ width:32, height:32, color:"#818cf8" }} />
                    </div>

                    <h2 style={{ fontSize:22, fontWeight:700, color:"#fff", margin:"0 0 10px" }}>
                        No project selected
                    </h2>
                    <p style={{ fontSize:14, color:"rgba(161,161,170,0.6)", margin:"0 0 32px", maxWidth:300, lineHeight:1.7 }}>
                        Pick an existing project or create a new one to see your live dashboard.
                    </p>

                    <div style={{ display:"flex", gap:12, flexWrap:"wrap", justifyContent:"center" }}>
                        <Link to={FRONTEND_ROUTES.PROJECTS}>
                            <button className="hp-ghost-btn">Browse Projects</button>
                        </Link>
                        <button className="hp-cta-btn" onClick={() => setIsCreateModalOpen(true)}>
                            <Plus style={{ width:15, height:15 }} /> New Project
                        </button>
                    </div>
                </div>
                <CreateProjectModal open={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
            </DashboardLayout>
        );
    }

    const stats = dashboardData?.stats || {
        totalIssues: 0, completedIssues: 0,
        activeSprintsCount: 0, memberCount: 0, completionRate: 0,
    };
    const hasOverdue  = (dashboardData?.overdueTasks?.length  ?? 0) > 0;
    const hasMeetings = (dashboardData?.todayMeetings?.length ?? 0) > 0;

    // ── Main dashboard ───────────────────────────────────────────────────────
    return (
        <DashboardLayout>
            <div className="hp-root" style={{ position:"relative", minHeight:"100vh" }}>

                {showOverduePopup && (
                    <OverdueTasksPopup tasks={overdueTasks} onClose={() => setShowOverduePopup(false)} />
                )}

                {/* ── Soft ambient orbs ── */}
                <div aria-hidden style={{
                    position:"fixed", inset:0,
                    pointerEvents:"none", zIndex:0, overflow:"hidden",
                }}>
                    <div style={{
                        position:"absolute", top:"-8%", right:"-6%",
                        width:560, height:560, borderRadius:"50%",
                        background:"radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)",
                        animation:"hp-breathe 5s ease-in-out infinite",
                    }} />
                    <div style={{
                        position:"absolute", bottom:"-10%", left:"-4%",
                        width:460, height:460, borderRadius:"50%",
                        background:"radial-gradient(circle, rgba(59,130,246,0.07) 0%, transparent 70%)",
                        animation:"hp-breathe 5s ease-in-out infinite 2s",
                    }} />
                </div>

                {/* ── Page content ── */}
                <div className="hp-page-pad" style={{
                    position:"relative", zIndex:1,
                    padding:"20px 16px",
                    maxWidth:1440, margin:"0 auto",
                }}>

                    {/* ════════ HEADER ════════ */}
                    <header className="hp-s0" style={{
                        display:"flex", flexWrap:"wrap",
                        justifyContent:"space-between", alignItems:"flex-start",
                        gap:16, marginBottom:32,
                    }}>
                        <div>
                            {/* Live indicator */}
                            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
                                <span className="hp-live-dot" />
                                <span style={{
                                    display:"inline-flex", alignItems:"center", gap:4,
                                    padding:"2px 10px", borderRadius:99,
                                    background:"rgba(34,197,94,0.1)",
                                    border:"1px solid rgba(34,197,94,0.2)",
                                    color:"#4ade80", fontSize:11, fontWeight:600,
                                }}>
                                    <Sparkles style={{ width:10, height:10 }} /> Live
                                </span>
                                <span style={{ color:"rgba(161,161,170,0.35)", fontSize:12 }}>·</span>
                                <span style={{
                                    fontSize:12, color:"rgba(161,161,170,0.55)", fontWeight:500,
                                    maxWidth:180, overflow:"hidden",
                                    textOverflow:"ellipsis", whiteSpace:"nowrap",
                                }}>
                                    {currentProject?.projectName}
                                </span>
                            </div>

                            <h1 style={{
                                fontSize:"clamp(22px, 3.5vw, 30px)",
                                fontWeight:800, color:"#fff",
                                margin:0, letterSpacing:"-0.02em", lineHeight:1.1,
                            }}>
                                Dashboard
                            </h1>
                            <p style={{
                                fontSize:14, marginTop:6,
                                color:"rgba(161,161,170,0.55)", lineHeight:1.5,
                            }}>
                                Realtime overview of your projects performance.
                            </p>
                        </div>

                        <button className="hp-cta-btn" onClick={() => setIsCreateModalOpen(true)}>
                            <Plus style={{ width:16, height:16 }} /> New Project
                        </button>
                    </header>

                    {/* ════════ STATS CARDS ════════ */}
                    <section className="hp-s1 hp-stats-grid" style={{ marginBottom:24 }}>
                        <StatsCard title="Total Issues"   value={stats.totalIssues}       icon={ListTodo}    color="blue"   description="All modules" />
                        <StatsCard title="Completed"      value={stats.completedIssues}    icon={CheckCircle2} color="green"  description={`${stats.completionRate}% done`} trend="+4.2%" />
                        <StatsCard title="Active Sprints" value={stats.activeSprintsCount} icon={Activity}    color="purple" description="Running cycles" />
                        <StatsCard title="Team Size"      value={stats.memberCount}        icon={Layout}      color="orange" description="Collaborators" />
                    </section>

                    {/* ════════ SUMMARY PILLS ════════ */}
                    <section className="hp-s2" style={{ display:"flex", flexWrap:"wrap", gap:10, marginBottom:26 }}>
                        {([
                            { icon:TrendingUp, label:"Completion",    val:`${stats.completionRate}%`, c:"#22c55e", bg:"rgba(34,197,94,0.08)",   bd:"rgba(34,197,94,0.18)" },
                            { icon:BarChart3,  label:"Issues Done",   val:stats.completedIssues,      c:"#818cf8", bg:"rgba(129,140,248,0.08)", bd:"rgba(129,140,248,0.18)" },
                            { icon:Users,      label:"Members",       val:stats.memberCount,           c:"#f59e0b", bg:"rgba(245,158,11,0.08)",  bd:"rgba(245,158,11,0.18)" },
                            { icon:Activity,   label:"Sprints",       val:stats.activeSprintsCount,    c:"#38bdf8", bg:"rgba(56,189,248,0.08)",  bd:"rgba(56,189,248,0.18)" },
                        ] as const).map(({ icon: Ic, label, val, c, bg, bd }) => (
                            <div key={label} style={{
                                display:"flex", alignItems:"center", gap:7,
                                padding:"6px 14px", borderRadius:30,
                                background:bg, border:`1px solid ${bd}`,
                                backdropFilter:"blur(10px)",
                            }}>
                                <Ic style={{ width:12, height:12, color:c, flexShrink:0 }} />
                                <span style={{ fontSize:12, color:"rgba(255,255,255,0.45)", fontWeight:500 }}>{label}</span>
                                <span style={{ fontSize:12, fontWeight:700, color:c }}>{val}</span>
                            </div>
                        ))}
                    </section>

                    {/* ════════ PROGRESS BAR ════════ */}
                    <section className="hp-s2" style={{ marginBottom:32 }}>
                        <ProgressLinear title="Overall Completion Rate" percentage={stats.completionRate} />
                    </section>

                    {/* ════════ ALERTS: OVERDUE + MEETINGS ════════ */}
                    {(hasOverdue || hasMeetings) && (
                        <section className="hp-s3" style={{ marginBottom:32 }}>
                            <p className="hp-divider-label">⚡ Needs Attention</p>
                            <div className="hp-alert-grid">

                                {/* — Overdue Tasks — */}
                                {hasOverdue && (
                                    <div className="hp-glass" style={{ padding:20 }}>
                                        {/* card header */}
                                        <div style={{
                                            display:"flex", alignItems:"center",
                                            justifyContent:"space-between", marginBottom:16,
                                        }}>
                                            <div style={{ display:"flex", alignItems:"center", gap:9 }}>
                                                <div style={{
                                                    width:32, height:32, borderRadius:10,
                                                    background:"rgba(239,68,68,0.12)",
                                                    border:"1px solid rgba(239,68,68,0.2)",
                                                    display:"flex", alignItems:"center", justifyContent:"center",
                                                }}>
                                                    <AlertTriangle style={{ width:15, height:15, color:"#f87171" }} />
                                                </div>
                                                <div>
                                                    <p style={{ margin:0, fontSize:13, fontWeight:700, color:"#fff" }}>
                                                        Overdue Tasks
                                                    </p>
                                                    <p style={{ margin:0, fontSize:11, color:"rgba(161,161,170,0.5)" }}>
                                                        {dashboardData.overdueTasks.length} task{dashboardData.overdueTasks.length !== 1 ? "s" : ""} past deadline
                                                    </p>
                                                </div>
                                            </div>
                                            <Link to={FRONTEND_ROUTES.BOARD}>
                                                <button className="hp-view-all">
                                                    View all <ArrowRight style={{ width:12, height:12 }} />
                                                </button>
                                            </Link>
                                        </div>
                                        {/* task list */}
                                        <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                                            {dashboardData.overdueTasks.map((task: OverdueTask) => (
                                                <div key={task.id} className="hp-overdue-row">
                                                    <div style={{ display:"flex", alignItems:"center", gap:9, minWidth:0 }}>
                                                        <AlertCircle style={{ width:14, height:14, color:"#f87171", flexShrink:0 }} />
                                                        <div style={{ minWidth:0 }}>
                                                            <p style={{
                                                                margin:0, fontSize:13, fontWeight:600, color:"#fff",
                                                                overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap",
                                                            }}>{task.title}</p>
                                                            <p style={{ margin:"2px 0 0", fontSize:11, color:"rgba(161,161,170,0.5)" }}>
                                                                {task.key} · Due {new Date(task.endDate).toLocaleDateString()}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <Link to={FRONTEND_ROUTES.BOARD}>
                                                        <button className="hp-btn-rose">Resolve</button>
                                                    </Link>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* — Today's Meetings — */}
                                {hasMeetings && (
                                    <div className="hp-glass" style={{ padding:20 }}>
                                        {/* card header */}
                                        <div style={{
                                            display:"flex", alignItems:"center",
                                            justifyContent:"space-between", marginBottom:16,
                                        }}>
                                            <div style={{ display:"flex", alignItems:"center", gap:9 }}>
                                                <div style={{
                                                    width:32, height:32, borderRadius:10,
                                                    background:"rgba(59,130,246,0.12)",
                                                    border:"1px solid rgba(59,130,246,0.2)",
                                                    display:"flex", alignItems:"center", justifyContent:"center",
                                                }}>
                                                    <Video style={{ width:15, height:15, color:"#60a5fa" }} />
                                                </div>
                                                <div>
                                                    <p style={{ margin:0, fontSize:13, fontWeight:700, color:"#fff" }}>
                                                        Todays Meetings
                                                    </p>
                                                    <p style={{ margin:0, fontSize:11, color:"rgba(161,161,170,0.5)" }}>
                                                        {dashboardData.todayMeetings.length} scheduled today
                                                    </p>
                                                </div>
                                            </div>
                                            <Link to={FRONTEND_ROUTES.MEETINGS}>
                                                <button className="hp-view-all">
                                                    Schedule <ArrowRight style={{ width:12, height:12 }} />
                                                </button>
                                            </Link>
                                        </div>
                                        {/* meeting list */}
                                        <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                                            {dashboardData.todayMeetings.map((meeting: TodayMeeting) => (
                                                <div key={meeting.id} className="hp-meeting-row">
                                                    <div style={{ display:"flex", alignItems:"center", gap:10, minWidth:0 }}>
                                                        {/* avatar */}
                                                        <div style={{
                                                            width:36, height:36, borderRadius:"50%", flexShrink:0,
                                                            background:"rgba(255,255,255,0.07)",
                                                            border:"1px solid rgba(255,255,255,0.1)",
                                                            overflow:"hidden",
                                                            display:"flex", alignItems:"center", justifyContent:"center",
                                                        }}>
                                                            {meeting.hostAvatar
                                                                ? <img src={meeting.hostAvatar} alt={meeting.hostName} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                                                                : <span style={{ fontSize:13, fontWeight:700, color:"rgba(255,255,255,0.75)" }}>{meeting.hostName[0]}</span>
                                                            }
                                                        </div>
                                                        <div style={{ minWidth:0 }}>
                                                            <p style={{
                                                                margin:0, fontSize:13, fontWeight:600, color:"#fff",
                                                                overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap",
                                                            }}>{meeting.title}</p>
                                                            <p style={{ margin:"2px 0 0", fontSize:11, color:"rgba(161,161,170,0.5)", display:"flex", alignItems:"center", gap:4 }}>
                                                                <Clock style={{ width:10, height:10 }} />
                                                                {new Date(meeting.startTime).toLocaleTimeString([], { hour:"2-digit", minute:"2-digit" })}
                                                                &nbsp;·&nbsp;{meeting.hostName}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <Link to={FRONTEND_ROUTES.MEETINGS}>
                                                        <button className="hp-btn-blue">Join</button>
                                                    </Link>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </section>
                    )}

                    {/* ════════ ANALYTICS CHARTS ════════ */}
                    <section className="hp-s4" style={{ marginBottom:32 }}>
                        <p className="hp-divider-label">📊 Analytics</p>
                        <div className="hp-charts-grid">
                            <IssueDistributionChart data={dashboardData?.distribution} />
                            <SprintStatusCard       data={dashboardData?.recentSprints} />
                            <ModuleProgressGauge    data={dashboardData?.progress} />
                        </div>
                    </section>

                    {/* ════════ TEAM ════════ */}
                    <section className="hp-s5" style={{ marginBottom:8 }}>
                        <p className="hp-divider-label">👥 Team</p>
                        <div className="hp-team-grid">
                            <TopPerformerCard    data={dashboardData?.topPerformer || null} />
                            <TeamActivitySection activities={dashboardData?.teamActivity || []} />
                        </div>
                    </section>

                </div>
            </div>

            <CreateProjectModal open={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
        </DashboardLayout>
    );
};
