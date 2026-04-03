import { useState, useEffect, useRef } from "react";
import {
    Bell,
    Settings as SettingsIcon,
    ChevronDown,
    LogOut,
    User,
    Plus,
    Check,
    Menu,
    Building2,
    FolderOpen,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearAuth } from "../../store/slice/authSlice";
import { clearAccessToken } from "../../store/slice/tokenSlice";
import { setWorkspaces, setCurrentWorkspace, type Workspace } from "../../store/slice/workspaceSlice";
import type { RootState } from "../../store/store";
import { FRONTEND_ROUTES } from "../../constants/frontendRoutes";
import { useUserLogout } from "@/hooks/Auth/AuthHooks";
import { useGetUserWorkspaces } from "../../hooks/Workspace/WorkspaceHooks";
import { useGetAllProjects } from "@/hooks/Project/ProjectHooks";
import { setProjects, setCurrentProject } from "@/store/slice/projectSlice";
import { CreateProjectModal } from "../modals/CreateProjectModal";
import { NotificationModal } from "../modals/NotificationModal";
import { useNotifications } from "../../hooks/Notification/NotificationHooks";
import type { NotificationResponse, Notification } from "../../types/notification";
import type { Project } from "@/types/project";

interface DashboardNavbarProps {
    onMenuToggle?: () => void;
}

const DashboardNavbar = ({ onMenuToggle }: DashboardNavbarProps) => {
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [isWorkspaceDropdownOpen, setIsWorkspaceDropdownOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
    const workspaceDropdownRef = useRef<HTMLDivElement>(null);
    const projectDropdownRef = useRef<HTMLDivElement>(null);
    const userMenuRef = useRef<HTMLDivElement>(null);
    const notificationButtonRef = useRef<HTMLButtonElement>(null);
    const [isProjectDropdownOpen, setIsProjectDropdownOpen] = useState(false);
    const { data: notificationsResponse } = useNotifications() as { data: NotificationResponse | undefined };
    const { projects, currentProject } = useSelector((state: RootState) => state.project);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector((state: RootState) => state.auth.user);
    const { currentWorkspace, workspaces } = useSelector((state: RootState) => state.workspace);
    const { mutate: logoutUser } = useUserLogout();

    const { data: workspacesData, isLoading: isWorkspacesLoading } = useGetUserWorkspaces();
    const { data: projectsData, isLoading: isProjectsLoading } = useGetAllProjects({
        workspaceId: currentWorkspace?._id || currentWorkspace?.id || "",
    });

    useEffect(() => {
        if (workspacesData?.data) {
            dispatch(setWorkspaces(workspacesData.data));
            if (!currentWorkspace && workspacesData.data.length > 0) {
                dispatch(setCurrentWorkspace(workspacesData.data[0]));
            }
        }
    }, [workspacesData, currentWorkspace, dispatch]);

    useEffect(() => {
        const workspaceId = currentWorkspace?._id || currentWorkspace?.id || "";
        if (currentProject && currentProject.workspaceId !== workspaceId) {
            dispatch(setCurrentProject(null));
        }
    }, [currentWorkspace, dispatch, currentProject]);

    useEffect(() => {
        const workspaceProjects = projectsData?.data?.projects;
        if (workspaceProjects) {
            dispatch(setProjects(workspaceProjects));
            const workspaceId = currentWorkspace?._id || currentWorkspace?.id || "";
            const isProjectFromOtherWorkspace =
                currentProject && currentProject.workspaceId !== workspaceId;
            if ((!currentProject || isProjectFromOtherWorkspace) && workspaceProjects.length > 0) {
                dispatch(setCurrentProject(workspaceProjects[0]));
            } else if (workspaceProjects.length === 0) {
                dispatch(setCurrentProject(null));
            }
        }
    }, [projectsData, currentProject, currentWorkspace, dispatch]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (workspaceDropdownRef.current && !workspaceDropdownRef.current.contains(event.target as Node)) {
                setIsWorkspaceDropdownOpen(false);
            }
            if (projectDropdownRef.current && !projectDropdownRef.current.contains(event.target as Node)) {
                setIsProjectDropdownOpen(false);
            }
            if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
                setIsUserMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = () => {
        logoutUser(undefined, {
            onSettled: () => {
                dispatch(clearAuth());
                dispatch(clearAccessToken());
                navigate(FRONTEND_ROUTES.LANDING, { replace: true });
            },
        });
    };

    const handleSwitchWorkspace = (workspace: Workspace) => {
        dispatch(setCurrentWorkspace(workspace));
        setIsWorkspaceDropdownOpen(false);
    };

    const handleSwitchProject = (project: Project) => {
        dispatch(setCurrentProject(project));
        setIsProjectDropdownOpen(false);
    };

    const unreadCount = (notificationsResponse?.data || []).filter(
        (n: Notification) => !n.isRead
    ).length;

    return (
        <>
            <nav className="fixed top-0 left-0 right-0 lg:left-64 z-30 h-16 lg:h-18 bg-[#0b0e14]/90 backdrop-blur-xl border-b border-white/60">
                <div className="flex items-center justify-between h-full px-3 sm:px-5 lg:px-8 gap-2">

                    {/* ── Left: hamburger + selectors ── */}
                    <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 flex-1">

                        {/* Hamburger (mobile only) */}
                        <button
                            onClick={onMenuToggle}
                            className="lg:hidden flex items-center justify-center w-9 h-9 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 active:bg-white/10 transition-all shrink-0"
                            aria-label="Open menu"
                        >
                            <Menu className="h-5 w-5" />
                        </button>

                        {/* Mobile Branding */}
                        <div className="lg:hidden flex items-center shrink-0 mr-2 -ml-1">
                            <img src="/logo.png" alt="ProJexa" className="h-10 w-auto object-contain brightness-110" />
                        </div>

                        {/* ── Workspace Selector ── */}
                        <div className="relative" ref={workspaceDropdownRef}>
                            <button
                                onClick={() => setIsWorkspaceDropdownOpen((v) => !v)}
                                className={`
                                    flex items-center gap-2 h-9 pl-2 pr-3 rounded-xl border transition-all duration-200 group
                                    ${isWorkspaceDropdownOpen
                                        ? "bg-blue-500/10 border-blue-500/30 text-white"
                                        : "bg-white/4 border-white/6 text-zinc-300 hover:bg-white/8 hover:border-white/10 hover:text-white"
                                    }
                                `}

                                
                            >
                                {/* Avatar */}
                                <div className="w-5 h-5 shrink-0 rounded-md bg-linear-to-br from-blue-500 to-blue-600 flex items-center justify-center text-[9px] font-black text-white shadow-lg shadow-blue-500/25">
                                    {currentWorkspace?.name ? currentWorkspace.name.charAt(0).toUpperCase() : <Building2 className="w-3 h-3" />}
                                </div>
                                {/* Label -- hidden on xs, visible sm+ */}
                                <span className="hidden sm:block text-xs font-semibold truncate max-w-[100px] md:max-w-[140px]">
                                    {currentWorkspace?.name || (isWorkspacesLoading ? "Loading…" : "Workspace")}
                                </span>
                                <ChevronDown className={`w-3.5 h-3.5 shrink-0 transition-transform duration-200 text-zinc-500 group-hover:text-zinc-300 ${isWorkspaceDropdownOpen ? "rotate-180 text-blue-400" : ""}`} />
                            </button>

                            {/* Workspace Dropdown */}
                            {isWorkspaceDropdownOpen && (
                                <div className="absolute top-full left-0 mt-2 w-64 bg-[#14171f] border border-white/[0.07] rounded-2xl shadow-2xl shadow-black/40 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                                    <div className="px-4 pt-3 pb-1.5">
                                        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">My Workspaces</p>
                                    </div>
                                    <div className="p-1.5 max-h-56 overflow-y-auto">
                                        {workspaces?.map((workspace) => (
                                            <button
                                                key={workspace.id}
                                                onClick={() => handleSwitchWorkspace(workspace)}
                                                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                                                    currentWorkspace?.id === workspace.id
                                                        ? "bg-blue-500/10 text-blue-400"
                                                        : "text-zinc-400 hover:text-white hover:bg-white/5"
                                                }`}
                                            >
                                                <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black text-white shrink-0 ${currentWorkspace?.id === workspace.id ? "bg-blue-500" : "bg-zinc-700"}`}>
                                                    {workspace.name.charAt(0).toUpperCase()}
                                                </div>
                                                <span className="flex-1 text-left truncate font-medium">{workspace.name}</span>
                                                {currentWorkspace?.id === workspace.id && <Check className="h-3.5 w-3.5 shrink-0 text-blue-400" />}
                                            </button>
                                        ))}
                                    </div>
                                    <div className="p-1.5 pt-0 border-t border-white/60 mt-1">
                                        <button
                                            onClick={() => { navigate(FRONTEND_ROUTES.WORKSPACE.CREATE_WORKSPACE); setIsWorkspaceDropdownOpen(false); }}
                                            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-white/4 hover:bg-white/8 text-zinc-300 hover:text-white text-xs font-semibold rounded-xl transition-all border border-dashed border-white/8 hover:border-white/20"
                                        >
                                            <Plus className="h-3.5 w-3.5" />
                                            New Workspace
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Divider */}
                        <div className="hidden sm:block h-5 w-px bg-white/8 shrink-0" />

                        {/* ── Project Selector ── */}
                        <div className="relative" ref={projectDropdownRef}>
                            <button
                                onClick={() => setIsProjectDropdownOpen((v) => !v)}
                                className={`
                                    flex items-center gap-2 h-9 pl-2 pr-3 rounded-xl border transition-all duration-200 group
                                    ${isProjectDropdownOpen
                                        ? "bg-emerald-500/10 border-emerald-500/30 text-white"
                                        : "bg-white/4 border-white/6 text-zinc-300 hover:bg-white/8 hover:border-white/10 hover:text-white"
                                    }
                                `}
                            >
                                <div className={`w-2 h-2 shrink-0 rounded-full ${isProjectDropdownOpen ? "bg-emerald-400" : "bg-emerald-500"} shadow-[0_0_8px_rgba(16,185,129,0.5)]`} />
                                <span className="hidden sm:block text-xs font-semibold truncate max-w-[90px] md:max-w-[130px]">
                                    {currentProject?.projectName || (isProjectsLoading ? "Loading…" : "Project")}
                                </span>
                                <ChevronDown className={`w-3.5 h-3.5 shrink-0 transition-transform duration-200 text-zinc-500 group-hover:text-zinc-300 ${isProjectDropdownOpen ? "rotate-180 text-emerald-400" : ""}`} />
                            </button>

                            {/* Project Dropdown */}
                            {isProjectDropdownOpen && (
                                <div className="absolute top-full left-0 mt-2 w-64 bg-[#14171f] border border-white/[0.07] rounded-2xl shadow-2xl shadow-black/40 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                                    <div className="px-4 pt-3 pb-1.5">
                                        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Projects</p>
                                    </div>
                                    <div className="p-1.5 max-h-56 overflow-y-auto">
                                        {projects?.length === 0 ? (
                                            <div className="flex flex-col items-center gap-1.5 py-6 px-4 text-center">
                                                <FolderOpen className="w-6 h-6 text-zinc-700" />
                                                <p className="text-xs text-zinc-500">No projects yet</p>
                                            </div>
                                        ) : (
                                            projects?.map((p: Project) => (
                                                <button
                                                    key={p._id}
                                                    onClick={() => handleSwitchProject(p)}
                                                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                                                        currentProject?._id === p._id
                                                            ? "bg-emerald-500/10 text-emerald-400"
                                                            : "text-zinc-400 hover:text-white hover:bg-white/5"
                                                    }`}
                                                >
                                                    <div className={`w-1.5 h-1.5 shrink-0 rounded-full ${currentProject?._id === p._id ? "bg-emerald-500" : "bg-zinc-600"}`} />
                                                    <span className="flex-1 text-left truncate font-medium">{p.projectName}</span>
                                                    {currentProject?._id === p._id && <Check className="h-3.5 w-3.5 shrink-0 text-emerald-400" />}
                                                </button>
                                            ))
                                        )}
                                    </div>
                                    <div className="p-1.5 pt-0 border-t border-white/60 mt-1">
                                        <button
                                            onClick={() => { setIsCreateModalOpen(true); setIsProjectDropdownOpen(false); }}
                                            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-white/4 hover:bg-white/8 text-zinc-300 hover:text-white text-xs font-semibold rounded-xl transition-all border border-dashed border-white/8 hover:border-white/20"
                                        >
                                            <Plus className="h-3.5 w-3.5" />
                                            New Project
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ── Right: actions + user ── */}
                    <div className="flex items-center gap-1 shrink-0">

                        {/* Notifications */}
                        <div className="relative">
                            <button
                                ref={notificationButtonRef}
                                onClick={() => setIsNotificationModalOpen((v) => !v)}
                                className={`relative flex items-center justify-center w-9 h-9 rounded-xl transition-all ${
                                    isNotificationModalOpen
                                        ? "bg-white/10 text-white"
                                        : "text-zinc-400 hover:text-white hover:bg-white/5"
                                }`}
                                aria-label="Notifications"
                            >
                                <Bell className="h-5 w-5" />
                                {unreadCount > 0 && (
                                    <span className="absolute top-1.5 right-1.5 w-[7px] h-[7px] bg-rose-500 rounded-full border-[1.5px] border-[#0b0e14] shadow-lg" />
                                )}
                            </button>
                            <NotificationModal
                                isOpen={isNotificationModalOpen}
                                onClose={() => setIsNotificationModalOpen(false)}
                                anchorRect={notificationButtonRef.current?.getBoundingClientRect()}
                            />
                        </div>

                        {/* Settings (hidden xs) */}
                        <button
                            className="hidden sm:flex items-center justify-center w-9 h-9 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition-all"
                            aria-label="Settings"
                        >
                            <SettingsIcon className="h-5 w-5" />
                        </button>

                        {/* Divider */}
                        <div className="hidden sm:block h-5 w-px bg-white/8 mx-1" />

                        {/* User area */}
                        <div className="relative flex items-center gap-1" ref={userMenuRef}>
                            {/* Avatar button (opens menu) */}
                            <button
                                onClick={() => setIsUserMenuOpen((v) => !v)}
                                className={`flex items-center justify-center w-9 h-9 rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                                    isUserMenuOpen
                                        ? "border-blue-500/60 ring-2 ring-blue-500/20 scale-105"
                                        : "border-zinc-700/60 hover:border-zinc-500 hover:scale-105"
                                } bg-linear-to-br from-blue-600 to-blue-700 text-white text-xs font-bold shadow-lg shadow-blue-500/10 shrink-0`}
                                aria-label="User menu"
                            >
                                {user?.avatarUrl ? (
                                    <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-[11px] font-black">
                                        {user?.firstName?.[0] || "A"}{user?.lastName?.[0] || "M"}
                                    </span>
                                )}
                            </button>

                            {/* Logout shortcut */}
                            <button
                                onClick={handleLogout}
                                className="hidden sm:flex items-center justify-center w-9 h-9 rounded-xl text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 shrink-0"
                                title="Sign out"
                                aria-label="Sign out"
                            >
                                <LogOut className="h-4.5 w-4.5" />
                            </button>

                            {/* User dropdown */}
                            {isUserMenuOpen && (
                                <div className="absolute right-0 top-full mt-2 w-64 bg-[#14171f] border border-white/7 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                                    {/* Profile header */}
                                    <div className="px-5 py-4 border-b border-white/60 flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl overflow-hidden bg-linear-to-br from-blue-600 to-blue-700 flex items-center justify-center shrink-0 shadow-lg">
                                            {user?.avatarUrl ? (
                                                <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                                            ) : (
                                                <span className="text-xs font-black text-white">
                                                    {user?.firstName?.[0] || "A"}{user?.lastName?.[0] || "M"}
                                                </span>
                                            )}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-bold text-white truncate">
                                                {user?.firstName} {user?.lastName}
                                            </p>
                                            <p className="text-[11px] text-zinc-500 truncate mt-0.5">{user?.email}</p>
                                        </div>
                                    </div>

                                    <div className="p-1.5">
                                        <button
                                            className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-zinc-400 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                                            onClick={() => { navigate(FRONTEND_ROUTES.PROFILE); setIsUserMenuOpen(false); }}
                                        >
                                            <User className="h-4 w-4 shrink-0" />
                                            <span className="font-medium">Account Settings</span>
                                        </button>
                                        <button className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-zinc-400 hover:text-white hover:bg-white/5 rounded-xl transition-all">
                                            <SettingsIcon className="h-4 w-4 shrink-0" />
                                            <span className="font-medium">Preferences</span>
                                        </button>
                                    </div>

                                    <div className="p-1.5 pt-0 border-t border-white/60 mt-0.5">
                                        <button
                                            onClick={handleLogout}
                                            className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-all"
                                        >
                                            <LogOut className="h-4 w-4 shrink-0" />
                                            <span className="font-medium">Sign out</span>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            <CreateProjectModal
                open={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
            />
        </>
    );
};

export default DashboardNavbar;