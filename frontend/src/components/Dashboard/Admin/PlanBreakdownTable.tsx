import { Layers } from "lucide-react";

interface PlanBreakdown {
    plan: string;
    revenue: number;
    subscriptions: number;
}

interface PlanBreakdownTableProps {
    data: PlanBreakdown[];
    colors: string[];
}

const formatCurrency = (v: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(v);

export const PlanBreakdownTable = ({ data, colors }: PlanBreakdownTableProps) => {
    const totalRev = data.reduce((s, p) => s + p.revenue, 0);

    return (
        <div className="rounded-2xl border border-white/5 bg-[#12121e]/85 backdrop-blur-xl overflow-hidden shadow-2xl">
            <div className="px-6 py-5 border-b border-white/5 bg-white/02">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shadow-lg shadow-indigo-500/10">
                        <Layers size={18} className="text-indigo-400" />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider">Detailed Plan Breakdown</h3>
                        <p className="text-xs text-zinc-500 mt-1">Revenue contribution per subscription tier</p>
                    </div>
                </div>
            </div>
            <div className="overflow-x-auto overflow-y-hidden">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-white/01">
                            <th className="px-6 py-4 text-left text-[10px] font-bold text-zinc-500 uppercase tracking-widest border-b border-white/5">Subscription Tier</th>
                            <th className="px-6 py-4 text-left text-[10px] font-bold text-zinc-500 uppercase tracking-widest border-b border-white/5">Total Revenue</th>
                            <th className="px-6 py-4 text-left text-[10px] font-bold text-zinc-500 uppercase tracking-widest border-b border-white/5">Active Accounts</th>
                            <th className="px-6 py-4 text-left text-[10px] font-bold text-zinc-500 uppercase tracking-widest border-b border-white/5">Market Share</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/3">
                        {data.map((item, i) => {
                            const contribution = totalRev > 0 ? ((item.revenue / totalRev) * 100).toFixed(1) : "0.0";
                            return (
                                <tr key={item.plan} className="hover:bg-white/02 transition-colors group cursor-default">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-2.5 h-2.5 rounded-full shadow-lg transition-transform group-hover:scale-125 duration-300" 
                                                 style={{ background: colors[i % colors.length], boxShadow: `0 0 8px ${colors[i % colors.length]}55` }} />
                                            <span className="text-sm text-white font-bold tracking-tight group-hover:text-indigo-400 transition-colors uppercase">{item.plan}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-zinc-100 font-bold tabular-nums">
                                        {formatCurrency(item.revenue)}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-zinc-400 font-medium tabular-nums">
                                        {item.subscriptions}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="flex-1 max-w-[120px] h-1.5 bg-white/5 rounded-full overflow-hidden shadow-inner">
                                                <div
                                                    className="h-full rounded-full transition-all duration-1000 ease-out"
                                                    style={{ 
                                                        width: `${contribution}%`, 
                                                        background: colors[i % colors.length],
                                                        boxShadow: `0 0 10px ${colors[i % colors.length]}33`
                                                    }}
                                                />
                                            </div>
                                            <span className="text-xs font-bold text-zinc-500 tabular-nums min-w-[32px]">{contribution}%</span>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
