import { useGetAdminDashboardStats } from "../../../hooks/Admin/AdminHooks";
import {
    AreaChart,
    Area,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from "recharts";
import {
    Users,
    Building2,
    IndianRupee,
    CreditCard,
    TrendingUp,
    TrendingDown,
    ArrowUpRight,
    Activity,
    Layers,
    Crown,
} from "lucide-react";

interface StatCardProps {
    title: string;
    value: string | number;
    change: string;
    isPositive: boolean;
    icon: React.ReactNode;
    gradient: string;
    glowColor: string;
}

interface SectionTitleProps {
    title: string;
    subtitle?: string;
}

interface TooltipPayloadItem {
    color: string;
    value: number | string;
    name: string;
}

interface ChartTooltipProps {
    active?: boolean;
    payload?: TooltipPayloadItem[];
    label?: string;
    prefix?: string;
}

// ========================
// Helpers
// ========================
const formatCurrency = (v: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(v);

const PIE_COLORS = ["#6366f1", "#22d3ee", "#f59e0b", "#10b981", "#f43f5e"];

const StatCard = ({ title, value, change, isPositive, icon, gradient, glowColor }: StatCardProps) => (
    <div
        className="relative overflow-hidden rounded-2xl p-6 border border-white/5"
        style={{ background: "rgba(18,18,30,0.85)", backdropFilter: "blur(12px)" }}
    >
        {/* Glow effect */}
        <div
            className="absolute -top-6 -right-6 w-28 h-28 rounded-full opacity-25 blur-3xl"
            style={{ background: glowColor }}
        />
        <div className="flex items-start justify-between mb-4">
            <div>
                <p className="text-xs font-medium text-zinc-500 uppercase tracking-widest mb-1">{title}</p>
                <p className="text-3xl font-bold text-white">{value}</p>
            </div>
            <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-white shrink-0"
                style={{ background: gradient }}
            >
                {icon}
            </div>
        </div>
        <div className={`flex items-center gap-1.5 text-sm font-medium ${isPositive ? "text-emerald-400" : "text-rose-400"}`}>
            {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            <span>{change}</span>
        </div>
    </div>
);

const SectionTitle = ({ title, subtitle }: SectionTitleProps) => (
    <div className="mb-5">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        {subtitle && <p className="text-xs text-zinc-500 mt-0.5">{subtitle}</p>}
    </div>
);

const cardBg = { background: "rgba(18,18,30,0.85)", backdropFilter: "blur(12px)" };

// Custom Tooltip
const ChartTooltip = ({ active, payload, label, prefix = "" }: ChartTooltipProps) => {
    if (active && payload && payload.length) {
        return (
            <div className="rounded-xl px-4 py-3 border border-white/10 shadow-2xl" style={{ background: "rgba(18,18,30,0.95)" }}>
                {label && <p className="text-xs text-zinc-400 mb-1">{label}</p>}
                {payload.map((p, i) => (
                    <p key={i} className="text-sm font-semibold" style={{ color: p.color }}>
                        {p.name && `${p.name}: `}
                        {typeof p.value === "number" && prefix === "₹" ? formatCurrency(p.value) : `${prefix}${p.value}`}
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

export const Dashboard = () => {
    const { data: response, isLoading, isError } = useGetAdminDashboardStats();
    const stats = response?.data;

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
                    <p className="text-zinc-400 text-sm">Loading dashboard data...</p>
                </div>
            </div>
        );
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
            icon: <IndianRupee size={20} />,
            gradient: "linear-gradient(135deg, #6366f1, #818cf8)",
            glowColor: "#6366f1",
        },
        {
            title: "Total Users",
            value: stats.totalUsers.toLocaleString(),
            change: `+${stats.newUsersThisMonth} this month`,
            isPositive: stats.newUsersThisMonth >= 0,
            icon: <Users size={20} />,
            gradient: "linear-gradient(135deg, #22d3ee, #38bdf8)",
            glowColor: "#22d3ee",
        },
        {
            title: "Active Workspaces",
            value: stats.totalWorkspaces.toLocaleString(),
            change: `+${stats.newWorkspacesThisMonth} this month`,
            isPositive: stats.newWorkspacesThisMonth >= 0,
            icon: <Building2 size={20} />,
            gradient: "linear-gradient(135deg, #10b981, #34d399)",
            glowColor: "#10b981",
        },
        {
            title: "Active Subscriptions",
            value: stats.activeSubscriptions.toLocaleString(),
            change: "Currently active",
            isPositive: true,
            icon: <CreditCard size={20} />,
            gradient: "linear-gradient(135deg, #f59e0b, #fbbf24)",
            glowColor: "#f59e0b",
        },
    ];

    return (
        <div className="space-y-8 pb-10">
            <div className="flex items-start justify-between">
                <div>
                    <h2 className="text-3xl font-bold bg-linear-to-r from-white to-zinc-400 bg-clip-text text-transparent">
                        Admin Dashboard
                    </h2>
                    <p className="text-zinc-500 mt-1 text-sm">Overview of key metrics and performance</p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/5 text-xs text-zinc-400" style={cardBg}>
                    <ArrowUpRight size={14} className="text-emerald-400" />
                    Live data
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
                {statCards.map((card) => (
                    <StatCard key={card.title} {...card} />
                ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
                <div className="rounded-2xl p-6 border border-white/5" style={cardBg}>
                    <SectionTitle title="Revenue (Last 6 Months)" subtitle="Monthly revenue breakdown" />
                    <ResponsiveContainer width="100%" height={220}>
                        <AreaChart data={stats.revenueByMonth} margin={{ top: 5, right: 5, left: 5, bottom: 0 }}>
                            <defs>
                                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                            <XAxis dataKey="month" tick={{ fill: "#71717a", fontSize: 11 }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fill: "#71717a", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v: number) => `₹${(v / 1000).toFixed(0)}k`} />
                            <Tooltip content={<ChartTooltip prefix="₹" />} />
                            <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2.5} fill="url(#revGrad)" dot={false} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* User Growth Chart */}
                <div className="rounded-2xl p-6 border border-white/5" style={cardBg}>
                    <SectionTitle title="User Growth (Last 6 Months)" subtitle="New user registrations per month" />
                    <ResponsiveContainer width="100%" height={220}>
                        <BarChart data={stats.userGrowthByMonth} margin={{ top: 5, right: 5, left: 5, bottom: 0 }}>
                            <defs>
                                <linearGradient id="userGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#22d3ee" stopOpacity={1} />
                                    <stop offset="100%" stopColor="#22d3ee" stopOpacity={0.5} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                            <XAxis dataKey="month" tick={{ fill: "#71717a", fontSize: 11 }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fill: "#71717a", fontSize: 11 }} axisLine={false} tickLine={false} />
                            <Tooltip content={<ChartTooltip />} />
                            <Bar dataKey="users" fill="url(#userGrad)" radius={[6, 6, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Charts Row 2: Revenue by Plan + Top Workspaces */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
                {/* Revenue by Plan - Pie */}
                <div className="rounded-2xl p-6 border border-white/5" style={cardBg}>
                    <SectionTitle title="Revenue by Plan" />
                    {stats.revenueByPlan.length > 0 ? (
                        <>
                            <ResponsiveContainer width="100%" height={180}>
                                <PieChart>
                                    <Pie
                                        data={stats.revenueByPlan}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={50}
                                        outerRadius={75}
                                        paddingAngle={3}
                                        dataKey="revenue"
                                    >
                                        {stats.revenueByPlan.map((_, index) => (
                                            <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<ChartTooltip prefix="₹" />} />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="mt-3 space-y-2">
                                {stats.revenueByPlan.map((item, i) => (
                                    <div key={item.plan} className="flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2.5 h-2.5 rounded-full" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                                            <span className="text-zinc-300">{item.plan}</span>
                                        </div>
                                        <span className="text-zinc-400 font-medium">{formatCurrency(item.revenue)}</span>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="h-40 flex items-center justify-center">
                            <p className="text-zinc-500 text-sm">No plan revenue data</p>
                        </div>
                    )}
                </div>

                {/* Top Workspaces */}
                <div className="xl:col-span-2 rounded-2xl p-6 border border-white/5" style={cardBg}>
                    <SectionTitle title="Top Workspaces" subtitle="Sorted by member count" />
                    {stats.topWorkspaces.length > 0 ? (
                        <div className="space-y-3">
                            {stats.topWorkspaces.map((ws, i) => (
                                <div
                                    key={ws.name}
                                    className="flex items-center justify-between p-3 rounded-xl border border-white/5 hover:border-white/10 transition-colors"
                                    style={{ background: "rgba(255,255,255,0.02)" }}
                                >
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white shrink-0"
                                            style={{ background: PIE_COLORS[i % PIE_COLORS.length] + "33", border: `1px solid ${PIE_COLORS[i % PIE_COLORS.length]}55` }}
                                        >
                                            {i === 0 ? <Crown size={14} style={{ color: PIE_COLORS[0] }} /> : i + 1}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-white truncate">{ws.name}</p>
                                            <p className="text-xs text-zinc-500">{ws.members} members</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs px-2.5 py-1 rounded-full font-medium" style={{ background: "#10b98120", color: "#34d399" }}>
                                            {ws.plan}
                                        </span>
                                        <div className="w-20 h-1.5 rounded-full bg-white/5 overflow-hidden">
                                            <div
                                                className="h-full rounded-full transition-all"
                                                style={{
                                                    width: `${Math.min(100, (ws.members / (stats.topWorkspaces[0]?.members || 1)) * 100)}%`,
                                                    background: PIE_COLORS[i % PIE_COLORS.length]
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="h-40 flex items-center justify-center">
                            <p className="text-zinc-500 text-sm">No workspace data available</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Detailed Breakdown Table */}
            {stats.revenueByPlan.length > 0 && (
                <div className="rounded-2xl border border-white/5 overflow-hidden" style={cardBg}>
                    <div className="px-6 py-5 border-b border-white/5">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                                <Layers size={16} className="text-indigo-400" />
                            </div>
                            <div>
                                <h3 className="text-base font-semibold text-white">Detailed Plan Breakdown</h3>
                                <p className="text-xs text-zinc-500">Revenue contribution per subscription plan</p>
                            </div>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-white/5">
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider">Plan</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider">Revenue</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider">Subscriptions</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider">Contribution</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {stats.revenueByPlan.map((item, i) => {
                                    const totalRev = stats.revenueByPlan.reduce((s, p) => s + p.revenue, 0);
                                    const contribution = totalRev > 0 ? ((item.revenue / totalRev) * 100).toFixed(1) : "0.0";
                                    return (
                                        <tr key={item.plan} className="hover:bg-white/2 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2.5">
                                                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                                                    <span className="text-sm text-white font-medium">{item.plan}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-zinc-200 font-semibold">{formatCurrency(item.revenue)}</td>
                                            <td className="px-6 py-4 text-sm text-zinc-400">{item.subscriptions}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2.5">
                                                    <div className="flex-1 max-w-24 h-1.5 bg-white/5 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full rounded-full"
                                                            style={{ width: `${contribution}%`, background: PIE_COLORS[i % PIE_COLORS.length] }}
                                                        />
                                                    </div>
                                                    <span className="text-xs text-zinc-400 tabular-nums">{contribution}%</span>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};
