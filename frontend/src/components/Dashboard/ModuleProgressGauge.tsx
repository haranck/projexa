import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { CheckCircle2, Clock, ListChecks } from "lucide-react";
import { Button } from "../ui/button";
import type { ModuleProgress } from "../../types/dashboard";

interface ModuleProgressGaugeProps {
    data?: ModuleProgress | null;
}

export const ModuleProgressGauge = ({ data }: ModuleProgressGaugeProps) => {
    const total = data?.totalPoints || 0;
    const completed = data?.doneCount || 0;
    const pending = (data?.todoCount || 0) + (data?.inProgressCount || 0);

    const chartData = [
        { name: "Completed", value: completed, color: "#10b981" },
        { name: "Remaining", value: Math.max(total - completed, total === 0 ? 1 : 0), color: "rgba(255,255,255,0.03)" },
    ];

    return (
        <Card className="bg-[#141820]/80 backdrop-blur-xl border-white/5 h-[450px] flex flex-col py-0 gap-0 overflow-hidden relative group">
            {/* Subtle Gradient background matching the image style */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-[100px] -mr-32 -mt-32 pointer-events-none group-hover:opacity-20 transition-opacity duration-500" />

            <CardHeader className="flex flex-row items-center gap-3 pb-0 pt-4 px-4 relative z-10 shrink-0">
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 shadow-inner">
                    <ListChecks className="w-4 h-4" />
                </div>
                <div>
                    <CardTitle className="text-sm font-black text-white tracking-tight leading-none uppercase">
                        Module Analysis
                    </CardTitle>
                    <p className="text-zinc-600 text-[9px] font-black uppercase tracking-[0.2em] mt-0.5">
                        {data?.sprintName || "No Module Active"}
                    </p>
                </div>
            </CardHeader>

            <CardContent className="flex flex-col gap-3 pt-0 px-5 pb-5 relative z-10 overflow-y-auto custom-scrollbar">
                <div className="relative h-[120px] w-full flex items-center justify-center shrink-0">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={chartData}
                                cx="50%"
                                cy="75%"
                                startAngle={210}
                                endAngle={-30}
                                innerRadius={45}
                                outerRadius={65}
                                stroke="none"
                                dataKey="value"
                            >
                                {chartData.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={entry.color}
                                        className={index === 0 ? "drop-shadow-[0_0_15px_rgba(16,185,129,0.3)]" : ""}
                                    />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute top-[48%] left-1/2 -translate-x-1/2 -translate-y-1/4 text-center">
                        <span className="text-xl font-black text-white tracking-tighter block leading-none font-mono">{completed}</span>
                        <p className="text-[8px] font-black uppercase tracking-[0.2em] text-emerald-500/80 mt-0.5">of {total} Done</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-2 shrink-0">
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-white/2 border border-white/5 group/item cursor-default hover:bg-white/5 transition-colors">
                        <div className="text-amber-500 p-1 bg-amber-500/10 rounded-md border border-amber-500/20 group-hover/item:scale-110 transition-transform">
                            <Clock className="w-3 h-3" />
                        </div>
                        <div>
                            <span className="text-sm font-black text-white block leading-none">{pending}</span>
                            <span className="text-[7px] font-black uppercase tracking-widest text-zinc-600">Pending</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 p-2 rounded-lg bg-white/2 border border-white/5 group/item cursor-default hover:bg-white/5 transition-colors">
                        <div className="text-emerald-500 p-1 bg-emerald-500/10 rounded-md border border-emerald-500/20 group-hover/item:scale-110 transition-transform">
                            <CheckCircle2 className="w-3 h-3" />
                        </div>
                        <div>
                            <span className="text-sm font-black text-white block leading-none">{completed}</span>
                            <span className="text-[7px] font-black uppercase tracking-widest text-zinc-600">Done</span>
                        </div>
                    </div>
                </div>

                <div className="flex justify-around items-center py-2 px-2 rounded-lg bg-black/20 border border-white/5 shadow-inner shrink-0">
                    <div className="text-center group/sub">
                        <span className="text-xs font-black text-white block group-hover/sub:text-blue-400 transition-colors uppercase tracking-tight">{data?.storyCount || 0}</span>
                        <span className="text-[7px] font-black uppercase tracking-widest text-zinc-600">Stories</span>
                    </div>
                    <div className="w-px h-5 bg-white/5" />
                    <div className="text-center group/sub">
                        <span className="text-xs font-black text-white block group-hover/sub:text-emerald-400 transition-colors uppercase tracking-tight">{data?.taskCount || 0}</span>
                        <span className="text-[7px] font-black uppercase tracking-widest text-zinc-600">Tasks</span>
                    </div>
                    <div className="w-px h-5 bg-white/5" />
                    <div className="text-center group/sub">
                        <span className="text-xs font-black text-white block group-hover/sub:text-rose-400 transition-colors uppercase tracking-tight">{data?.bugCount || 0}</span>
                        <span className="text-[7px] font-black uppercase tracking-widest text-zinc-600">Bugs</span>
                    </div>
                </div>

                <Button className="w-full bg-[#10b981] hover:bg-[#059669] text-white font-black h-8 rounded-lg transition-all shadow-xl shadow-emerald-500/20 active:scale-[0.98] border border-white/5 uppercase tracking-widest text-[9px] shrink-0">
                    Access Operations
                </Button>
            </CardContent>
        </Card>
    );
};