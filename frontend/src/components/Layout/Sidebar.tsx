import { Link, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import {
    LayoutDashboard,
    ListTodo,
    Kanban,
    MessageSquare,
    Video,
    Users,
    FolderKanban,
    Settings,
    CreditCard,
    ChevronRight,
} from "lucide-react";
import { cn } from "../../lib/utils";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import { FRONTEND_ROUTES } from "../../constants/frontendRoutes";

interface SidebarProps {
    className?: string;
}

const Sidebar = ({ className }: SidebarProps) => {
    const navigate = useNavigate()
    const location = useLocation();
    const user = useSelector((state: RootState) => state.auth.user);
    const { currentWorkspace } = useSelector((state: RootState) => state.workspace);

    const menuSections = [
        {
            label: "Main",
            items: [
                { name: "Dashboard", icon: LayoutDashboard, path: FRONTEND_ROUTES.HOME },
                { name: "Backlog", icon: ListTodo, path: FRONTEND_ROUTES.BACKLOG },
                { name: "Board", icon: Kanban, path: FRONTEND_ROUTES.BOARD },
            ],
        },
        {
            label: "Communication",
            items: [
                { name: "Chat", icon: MessageSquare, path: FRONTEND_ROUTES.CHAT },
                { name: "Meeting", icon: Video, path: FRONTEND_ROUTES.MEETINGS },
            ],
        },
        {
            label: "Organization",
            items: [
                { name: "Teams & Members", icon: Users, path: FRONTEND_ROUTES.TEAMS },
                { name: "Projects", icon: FolderKanban, path: FRONTEND_ROUTES.PROJECTS },
            ],
        },
        {
            label: "System",
            items: [
                { name: "Settings", icon: Settings, path: FRONTEND_ROUTES.SETTINGS },
                { name: "Payment Details", icon: CreditCard, path: FRONTEND_ROUTES.PAYMENTS },
            ],
        },
    ];

    const isActive = (path: string) => location.pathname === path;

    return (
        <aside
            className={cn(
                "fixed left-0 top-0 z-40 h-screen w-64 bg-[#0b0e14] border-r border-white/5 flex flex-col",
                className
            )}
        >
            <div className="flex h-20 items-center px-6">
                <Link to={FRONTEND_ROUTES.LANDING} className="flex items-center">
                    <img
                        src="/logo.png"
                        alt="ProJexa Logo"
                        className="h-30 w-31 ml-6 mt-5 mb-2 object-contain"
                    />
                </Link>
            </div>
            <nav className="flex-1 px-3 py-4 space-y-7">
                {menuSections.map((section, sectionIndex) => (
                    <div key={sectionIndex}>
                        <h3 className="px-4 mb-3 text-[10px] font-bold text-blue-400/80 uppercase tracking-[0.2em] opacity-80">
                            {section.label}
                        </h3>
                        <div className="space-y-1">
                            {section.items.map((item, itemIndex) => {
                                const Icon = item.icon;
                                const active = isActive(item.path);

                                return (
                                    <Link
                                        key={itemIndex}
                                        to={item.path}
                                        className={cn(
                                            "group relative flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-sm transition-all duration-200",
                                            active
                                                ? "bg-blue-500/10 text-white"
                                                : "text-zinc-500 hover:text-white hover:bg-white/5"
                                        )}
                                    >
                                        {active && (
                                            <div className="absolute left-0 w-1 h-5 bg-blue-500 rounded-r-full shadow-[0_0_12px_rgba(59,130,246,0.5)]" />
                                        )}
                                        <Icon className={cn("h-4.5 w-4.5 transition-colors", active ? "text-blue-500" : "group-hover:text-white")} />
                                        <span className="font-medium tracking-wide">{item.name}</span>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </nav>

            {/* User Profile Footer */}
            <div className="p-3 mt-auto border-t border-white/5">
                <button className="flex items-center gap-3 w-full px-3 py-2 rounded-xl hover:bg-white/5 transition-all duration-200 group"
                    onClick={() => navigate(FRONTEND_ROUTES.PROFILE)}>
                    <div className="relative">
                        <div className="w-9 h-9 rounded-full border border-zinc-800 overflow-hidden bg-linear-to-br from-zinc-700 to-zinc-800 flex items-center justify-center">
                            {user?.avatarUrl ? (
                                <img src={user.avatarUrl} alt="User" className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-white text-xs font-bold leading-none">
                                    {user?.firstName?.[0] || 'A'}{user?.lastName?.[0] || 'M'}
                                </span>
                            )}
                        </div>
                        <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-[#0b0e14] rounded-full" />
                    </div>
                    <div className="flex-1 text-left min-w-0">
                        <p className="text-sm font-bold text-white truncate leading-tight">
                            {user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : (user?.firstName || "Unknown User")}
                        </p>
                        <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest truncate mt-0.5">
                            {user?.id === currentWorkspace?.ownerId ? "Owner" : "Member"}
                        </p>
                    </div>
                    <ChevronRight className="h-3.5 w-3.5 text-zinc-700 group-hover:text-white transition-colors shrink-0" />
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
