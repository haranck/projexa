import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader } from "../ui/card";
import { CheckCircle2, Clock, GitBranch } from "lucide-react";
import { Button } from "../ui/button";
import type { ModuleProgress } from "../../types/dashboard";
import { Link } from "react-router-dom";
import { FRONTEND_ROUTES } from "../../constants/frontendRoutes";

interface ModuleProgressGaugeProps {
    data?: ModuleProgress | null;
}

export const ModuleProgressGauge = ({ data }: ModuleProgressGaugeProps) => {
    const total = data?.totalPoints || 0;
    const completed = data?.doneCount || 0;
    const pending = (data?.todoCount || 0) + (data?.inProgressCount || 0);
    const completionPct = total > 0 ? Math.round((completed / total) * 100) : 0;

    const chartData = [
        { name: "Completed", value: completed || 0, color: "#10b981" },
        { name: "Remaining", value: Math.max(total - completed, total === 0 ? 1 : 0), color: "rgba(255,255,255,0.04)" },
    ];

    return (
        <Card className="bg-[#0f1117] border border-white/  6 h-[440px] flex flex-col py-0 gap-0 overflow-hidden relative rounded-2xl hover:border-white/1 transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between px-5 pt-5 pb-4 border-b border-white/5">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                        <GitBranch className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-white">Task Overview</p>
                        <p className="text-xs text-zinc-500 mt-0.5 truncate max-w-[120px]">{data?.sprintName || "No active sprint"}</p>
                    </div>
                </div>
                <span className="text-2xl font-bold text-emerald-400 tabular-nums">{completionPct}%</span>
            </CardHeader>

            <CardContent className="flex flex-col gap-2 px-5 pb-5 pt-3 flex-1">
                {/* Gauge */}
                <div className="relative h-[120px] w-full flex items-center justify-center shrink-0">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={chartData}
                                cx="50%"
                                cy="100%"
                                startAngle={180}
                                endAngle={0}
                                innerRadius={75}
                                outerRadius={100}
                                stroke="none"
                                dataKey="value"
                            >
                                {chartData.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={entry.color}
                                    />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-center pb-1">
                        <span className="text-3xl font-bold text-white tabular-nums leading-none block">{completed}</span>
                        <span className="text-[10px] text-zinc-500 block leading-tight mt-1">of {total} done</span>
                    </div>
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-2 gap-2 mt-auto shrink-0">
                    <div className="flex items-center gap-2 p-1.5 rounded-lg justify-center bg-white/3 border border-white/6">
                        <div className="p-1 bg-amber-500/10 rounded-md border border-amber-500/20">
                            <Clock className="w-3 h-3 text-amber-400" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-bold text-white leading-none mb-0.5">{pending}</span>
                            <span className="text-[9px] text-zinc-500 leading-none">Pending</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 p-1.5 rounded-lg justify-center bg-white/3 border border-white/6">
                        <div className="p-1 bg-emerald-500/10 rounded-md border border-emerald-500/20">
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-bold text-white leading-none mb-0.5">{completed}</span>
                            <span className="text-[9px] text-zinc-500 leading-none">Done</span>
                        </div>
                    </div>
                </div>

                {/* Type breakdown */}
                <div className="flex items-center justify-around p-1.5 rounded-lg bg-white/3 border border-white/6 shrink-0">
                    {[
                        { label: "Stories", count: data?.storyCount || 0, color: "text-indigo-400" },
                        { label: "Tasks", count: data?.taskCount || 0, color: "text-emerald-400" },
                        { label: "Bugs", count: data?.bugCount || 0, color: "text-rose-400" },
                    ].map((item) => (
                        <div key={item.label} className="flex items-center gap-1.5">
                            <span className={`text-xs font-bold ${item.color} leading-none`}>{item.count}</span>
                            <span className="text-[9px] text-zinc-500 leading-none">{item.label}</span>
                        </div>
                    ))}
                </div>

                <Link to={FRONTEND_ROUTES.BOARD} className="w-full mt-auto">
                    <Button className="w-full bg-emerald-600/10 hover:bg-emerald-600 text-emerald-400 hover:text-white border border-emerald-600/20 hover:border-emerald-600 h-9 rounded-xl text-xs font-semibold transition-all duration-200 shadow-none hover:shadow-lg hover:shadow-emerald-500/20">
                        View Board
                    </Button>
                </Link>
            </CardContent>
        </Card>
    );
};