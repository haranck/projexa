import {
    LayoutDashboard,
    LineChart,
    CreditCard,
    Briefcase,
    Users,
    DollarSign,
    UserCircle
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { FRONTEND_ROUTES } from "@/constants/frontendRoutes";

const sidebarLinks = [
    {
        icon: LayoutDashboard,
        label: "Dashboard",
        href: FRONTEND_ROUTES.ADMIN_DASHBOARD,
    },
    {
        icon: LineChart,
        label: "Sales & Reports",
        href: "/admin/sales-reports",
    },
    {
        icon: CreditCard,
        label: "Subscription Plans",
        href: "/admin/subscription-plans",
    },
    {
        icon: Briefcase,
        label: "Manage Workspace",
        href: "/admin/workspaces",
    },
    {
        icon: Users,
        label: "Manage Users",
        href: FRONTEND_ROUTES.ADMIN_USERS,
    },
    {
        icon: DollarSign,
        label: "Payment Details",
        href: "/admin/payments",
    },
];

export const AdminSidebar = () => {
    const location = useLocation();

    return (
        <div className="fixed left-0 top-0 h-full w-64 bg-[#0A0A0A] border-r border-[#1F1F1F] flex flex-col z-50">
            {/* Logo Section */}
            <div className="h-16 flex items-center px-10 border-b border-[#1F1F1F]/50 gap-2">
                <img src="/logo.png" alt="Projexa" className="h-14 w-auto object-contain" />
                <h1 className="text-xl font-bold text-blue-500" style={{ marginTop: "-6px" }}>
                    Admin
                </h1>
            </div>

            {/* Navigation Links */}
            <div className="flex-1 py-6 space-y-2 px-3">
                {sidebarLinks.map((link) => {
                    const isActive = location.pathname === link.href;
                    return (
                        <Link
                            key={link.href}
                            to={link.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group font-medium text-sm",
                                isActive
                                    ? "bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.3)]"
                                    : "text-zinc-400 hover:text-white hover:bg-zinc-900"
                            )}
                        >
                            <link.icon className={cn("w-5 h-5", isActive ? "text-white" : "text-zinc-500 group-hover:text-white")} />
                            <span>{link.label}</span>
                        </Link>
                    );
                })}
            </div>

            {/* Bottom Section - Admin Profile */}
            <div className="p-4 border-t border-[#1F1F1F]/50">
                <Link
                    to="/admin/dashboard"
                    className="flex items-center gap-3 px-3 py-3 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-900 transition-all cursor-pointer"
                >
                    <UserCircle className="w-6 h-6 text-zinc-500" />
                    <span className="text-sm font-medium">Admin Profile</span>
                </Link>
            </div>
        </div>
    );
};
