import { useGetAdminDashboardStats } from "../../../hooks/Admin/AdminHooks";
import {
    Users,
    Building2,
    IndianRupee,
    CreditCard,
    ArrowUpRight,
    Activity,
} from "lucide-react";
import { AdminStatCard } from "../../../components/Dashboard/Admin/AdminStatCard";
import { RevenueChart } from "../../../components/Dashboard/Admin/RevenueChart";
import { UserGrowthChart } from "../../../components/Dashboard/Admin/UserGrowthChart";
import { PlanRevenueChart } from "../../../components/Dashboard/Admin/PlanRevenueChart";
import { TopWorkspacesTable } from "../../../components/Dashboard/Admin/TopWorkspacesTable";
import { PlanBreakdownTable } from "../../../components/Dashboard/Admin/PlanBreakdownTable";
import { DashboardSkeleton } from "../../../components/Dashboard/Admin/DashboardSkeleton";


const formatCurrency = (v: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(v);

const PIE_COLORS = ["#6366f1", "#22d3ee", "#f59e0b", "#10b981", "#f43f5e"];

export const Dashboard = () => {
    const { data: response, isLoading, isError } = useGetAdminDashboardStats();
    const stats = response?.data;

    if (isLoading) {
        return <DashboardSkeleton />;
    }

    if (isError || !stats) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 bg-rose-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Activity size={28} className="text-rose-400" />
                    </div>
                    <p className="text-white font-semibold">Failed to load dashboard</p>
                    <p className="text-zinc-500 text-sm mt-1">Please try refreshing the page</p>
                </div>
            </div>
        );
    }

    const statCards = [
        {
            title: "Total Revenue",
            value: formatCurrency(stats.totalRevenue),
            change: `+${formatCurrency(stats.revenueThisMonth)} this month`,
            isPositive: stats.revenueThisMonth >= 0,
            icon: <IndianRupee />,
            gradient: "linear-gradient(135deg, #6366f1, #818cf8)",
            glowColor: "#6366f1",
        },
        {
            title: "Total Users",
            value: stats.totalUsers.toLocaleString(),
            change: `+${stats.newUsersThisMonth} this month`,
            isPositive: stats.newUsersThisMonth >= 0,
            icon: <Users />,
            gradient: "linear-gradient(135deg, #22d3ee, #38bdf8)",
            glowColor: "#22d3ee",
        },
        {
            title: "Active Workspaces",
            value: stats.totalWorkspaces.toLocaleString(),
            change: `+${stats.newWorkspacesThisMonth} this month`,
            isPositive: stats.newWorkspacesThisMonth >= 0,
            icon: <Building2 />,
            gradient: "linear-gradient(135deg, #10b981, #34d399)",
            glowColor: "#10b981",
        },
        {
            title: "Active Subscriptions",
            value: stats.activeSubscriptions.toLocaleString(),
            change: "Currently active",
            isPositive: true,
            icon: <CreditCard />,
            gradient: "linear-gradient(135deg, #f59e0b, #fbbf24)",
            glowColor: "#f59e0b",
        },
    ];

    return (
        <div className="space-y-8 pb-10 max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-extrabold bg-linear-to-r from-white to-zinc-400 bg-clip-text text-transparent tracking-tight">
                        Admin Dashboard
                    </h2>
                    <p className="text-zinc-500 mt-1 text-sm font-medium">Overview of your enterprise ecosystem</p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/5 text-[10px] font-bold text-zinc-400 bg-[#12121e]/85 backdrop-blur-xl shadow-lg uppercase tracking-widest">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <ArrowUpRight size={14} className="text-emerald-400" />
                    Live Metrics
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                {statCards.map((card) => (
                    <AdminStatCard key={card.title} {...card} />
                ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <RevenueChart data={stats.revenueByMonth} />
                <UserGrowthChart data={stats.userGrowthByMonth} />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="xl:col-span-1">
                    <PlanRevenueChart data={stats.revenueByPlan} colors={PIE_COLORS} />
                </div>
                <div className="xl:col-span-2">
                    <TopWorkspacesTable workspaces={stats.topWorkspaces} colors={PIE_COLORS} />
                </div>
            </div>

            {stats.revenueByPlan.length > 0 && (
                <PlanBreakdownTable data={stats.revenueByPlan} colors={PIE_COLORS} />
            )}
        </div>
    );
};
