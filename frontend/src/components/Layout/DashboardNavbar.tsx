import { useState, useEffect, useRef } from "react";
import { Bell, Settings as SettingsIcon, ChevronDown, LogOut, User, Plus, Check } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearAuth } from "../../store/slice/authSlice";
import { clearAccessToken } from "../../store/slice/tokenSlice";
import { setWorkspaces, setCurrentWorkspace, type Workspace } from "../../store/slice/workspaceSlice";
import type { RootState } from "../../store/store";
import { FRONTEND_ROUTES } from "../../constants/frontendRoutes";
import { useUserLogout } from "@/hooks/Auth/AuthHooks";
import { useGetUserWorkspaces } from "../../hooks/Workspace/WorkspaceHooks";

const DashboardNavbar = () => {
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [isWorkspaceDropdownOpen, setIsWorkspaceDropdownOpen] = useState(false);
    const workspaceDropdownRef = useRef<HTMLDivElement>(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector((state: RootState) => state.auth.user);
    const { currentWorkspace, workspaces } = useSelector((state: RootState) => state.workspace);
    const { mutate: logoutUser } = useUserLogout()

    const { data: workspacesData, isLoading: isWorkspacesLoading } = useGetUserWorkspaces();

    useEffect(() => {
        if (workspacesData?.data) {
            dispatch(setWorkspaces(workspacesData.data));
            if (!currentWorkspace && workspacesData.data.length > 0) {
                dispatch(setCurrentWorkspace(workspacesData.data[0]));
            }
        }
    }, [workspacesData, currentWorkspace, dispatch]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (workspaceDropdownRef.current && !workspaceDropdownRef.current.contains(event.target as Node)) {
                setIsWorkspaceDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleLogout = () => {
        logoutUser(undefined, {
            onSettled: () => {
                dispatch(clearAuth());
                dispatch(clearAccessToken());
                navigate(FRONTEND_ROUTES.LANDING, { replace: true });
            }
        })
    };

    const handleSwitchWorkspace = (workspace:Workspace) => {
        dispatch(setCurrentWorkspace(workspace));
        setIsWorkspaceDropdownOpen(false);
    };

    return (
        <nav className="fixed top-0 left-64 right-0 z-30 h-20 bg-[#0b0e14]/80 backdrop-blur-md">
            <div className="flex items-center justify-between h-full px-8">
                {/* Left Side: Navigation / Context */}
                <div className="flex items-center gap-6">
                    <div className="flex flex-col gap-0.5 mt-1 relative" ref={workspaceDropdownRef}>
                        <div className="flex items-center gap-1 text-[9px] font-bold text-zinc-500 uppercase tracking-widest pl-0.5">
                            <div className="w-2.5 h-[1.5px] bg-zinc-700 rounded-full" />
                            Workspace
                        </div>
                        <button
                            onClick={() => setIsWorkspaceDropdownOpen(!isWorkspaceDropdownOpen)}
                            className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 transition-all border border-white/5 group"
                        >
                            <div className="w-5.5 h-5.5 rounded-lg bg-blue-500 flex items-center justify-center text-[9px] font-black text-white shadow-[0_0_10px_rgba(59,130,246,0.3)]">
                                {currentWorkspace?.name ? currentWorkspace.name.charAt(0).toUpperCase() : "W"}
                            </div>
                            <span className="text-xs font-semibold text-white">
                                {currentWorkspace?.name || (isWorkspacesLoading ? "Loading..." : "Select Workspace")}
                            </span>
                            <ChevronDown className={`h-3.5 w-3.5 text-zinc-500 group-hover:text-zinc-300 transition-transform ${isWorkspaceDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {/* Workspace Dropdown */}
                        {isWorkspaceDropdownOpen && (
                            <div className="absolute top-full left-0 mt-2 w-64 bg-[#14171f] border border-white/5 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 z-50">
                                <div className="p-2 max-h-60 overflow-y-auto custom-scrollbar">
                                    <div className="px-3 py-2 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                                        My Workspaces
                                    </div>
                                    {workspaces?.map((workspace) => (
                                        <button
                                            key={workspace.id}
                                            onClick={() => handleSwitchWorkspace(workspace)}
                                            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-all ${currentWorkspace?.id === workspace.id
                                                    ? "bg-blue-500/10 text-blue-400"
                                                    : "text-zinc-400 hover:text-white hover:bg-white/5"
                                                }`}
                                        >
                                            <div className={`w-2 h-2 rounded-full ${currentWorkspace?.id === workspace.id ? 'bg-blue-500' : 'bg-zinc-700'}`} />
                                            <span className="flex-1 text-left truncate font-medium">{workspace.name}</span>
                                            {currentWorkspace?.id === workspace.id && <Check className="h-3.5 w-3.5" />}
                                        </button>
                                    ))}
                                </div>
                                <div className="p-2 border-t border-white/5 bg-[#14171f]">
                                    <button
                                        onClick={() => navigate(FRONTEND_ROUTES.WORKSPACE.CREATE_WORKSPACE)}
                                        className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 text-white text-xs font-semibold rounded-xl transition-all border border-white/5 hover:border-white/10"
                                    >
                                        <Plus className="h-3.5 w-3.5" />
                                        Create New Workspace
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="h-8 w-px bg-white/5 mt-3" />

                    <div className="flex flex-col gap-0.5 mt-1">
                        <div className="flex items-center gap-1 text-[9px] font-bold text-zinc-500 uppercase tracking-widest pl-0.5">
                            <div className="w-2.5 h-[1.5px] bg-zinc-700 rounded-full" />
                            Projects
                        </div>
                        <button className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 transition-all border border-white/5 group">
                            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
                            <span className="text-xs font-semibold text-zinc-400 group-hover:text-white transition-colors">select project</span>
                            <ChevronDown className="h-3.5 w-3.5 text-zinc-500 group-hover:text-zinc-300" />
                        </button>
                    </div>
                </div>

                {/* Right Side: Tools & User */}
                <div className="flex items-center gap-6">


                    <div className="flex items-center gap-2">
                        <button className="relative p-2.5 rounded-xl hover:bg-white/5 text-zinc-400 hover:text-white transition-all">
                            <Bell className="h-5 w-5" />
                            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-[#0b0e14]"></span>
                        </button>
                        <button className="p-2.5 rounded-xl hover:bg-white/5 text-zinc-400 hover:text-white transition-all">
                            <SettingsIcon className="h-5 w-5" />
                        </button>
                    </div>

                    <div className="h-8 w-px bg-white/5" />

                    <div className="relative">
                        <button
                            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                            className="flex items-center gap-3 p-1 rounded-xl hover:bg-white/5 transition-all group"
                        >
                            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white text-xs font-bold shadow-[0_0_15px_rgba(37,99,235,0.3)] group-hover:scale-105 transition-transform overflow-hidden">
                                {user?.avatarUrl ? (
                                    <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <>{user?.firstName?.[0] || 'A'}{user?.lastName?.[0] || 'M'}</>
                                )}
                            </div>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleLogout();
                                }}
                                className="p-2 rounded-lg hover:bg-red-500/10 text-zinc-500 hover:text-red-400 transition-all"
                                title="Logout"
                            >
                                <LogOut className="h-5 w-5" />
                            </button>
                        </button>

                        {isUserMenuOpen && (
                            <div className="absolute right-0 mt-3 w-64 bg-[#14171f] border border-white/5 rounded-2xl shadow-2xl py-3 overflow-hidden animate-in fade-in slide-in-from-top-2">
                                <div className="px-5 py-3 border-b border-white/5">
                                    <p className="text-sm font-bold text-white">
                                        {user?.firstName} {user?.lastName}
                                    </p>
                                    <p className="text-[11px] text-zinc-500 font-medium mt-0.5">{user?.email}</p>
                                </div>

                                <div className="p-2">
                                    <button className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-zinc-400 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                                        onClick={() => navigate(FRONTEND_ROUTES.PROFILE)}>
                                        <User className="h-4 w-4" />
                                        <span className="font-medium">Account Settings</span>
                                    </button>
                                    <button className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-zinc-400 hover:text-white hover:bg-white/5 rounded-xl transition-all">
                                        <SettingsIcon className="h-4 w-4" />
                                        <span className="font-medium">Preference</span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default DashboardNavbar;
