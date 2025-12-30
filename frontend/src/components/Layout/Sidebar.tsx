import { Link, useLocation } from "react-router-dom";
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
import { cn } from "@/lib/utils";
// import { Separator } from "@/components/ui/separator";

interface SidebarProps {
    className?: string;
}

const Sidebar = ({ className }: SidebarProps) => {
    const location = useLocation();

    const menuSections = [
        {
            label: "Main",
            items: [
                { name: "Dashboard", icon: LayoutDashboard, path: "/home" },
                { name: "Backlog", icon: ListTodo, path: "/backlog" },
                { name: "Board", icon: Kanban, path: "/board" },
            ],
        },
        {
            label: "Communication",
            items: [
                { name: "Chat", icon: MessageSquare, path: "/chat" },
                { name: "Meeting", icon: Video, path: "/meeting" },
            ],
        },
        {
            label: "Organization",
            items: [
                { name: "Teams & Members", icon: Users, path: "/teams" },
                { name: "Projects", icon: FolderKanban, path: "/projects" },
            ],
        },
        {
            label: "System",
            items: [
                { name: "Settings", icon: Settings, path: "/settings" },
                { name: "Payment Details", icon: CreditCard, path: "/payment" },
            ],
        },
    ];

    const isActive = (path: string) => location.pathname === path;

    return (
        <aside
            className={cn(
                "fixed left-0 top-0 z-40 h-screen w-60 bg-[#0f0f23] border-r border-white/5",
                className
            )}
        >
            {/* Logo */}
            <div className="flex h-16 items-center px-6 border-b border-white/5">
                <Link to="/home" className="flex items-center space-x-2">
                    <span className="text-xl font-bold text-white">ProJexa</span>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
                {menuSections.map((section, sectionIndex) => (
                    <div key={sectionIndex}>
                        <h3 className="px-3 mb-2 text-xs font-semibold text-[#3b82f6] uppercase tracking-wider">
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
                                            "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200",
                                            active
                                                ? "bg-[#3b82f6] text-white"
                                                : "text-zinc-400 hover:text-white hover:bg-white/5"
                                        )}
                                    >
                                        <Icon className="h-4 w-4" />
                                        <span>{item.name}</span>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </nav>

            {/* User Profile */}
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/5 bg-[#0f0f23]">
                <button className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-white/5 transition-colors group">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-semibold">
                        AM
                    </div>
                    <div className="flex-1 text-left">
                        <p className="text-sm font-medium text-white">Alex Morgan</p>
                        <p className="text-xs text-zinc-500">alex@projexa.com</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-zinc-500 group-hover:text-white transition-colors" />
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
