import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { CheckCircle2, Clock, ListChecks } from "lucide-react";
import { Button } from "../ui/button";

interface ModuleProgressData {
    sprintName: string;
    completedPoints: number;
    totalPoints: number;
    percentage: number;
    todoCount: number;
    inProgressCount: number;
    doneCount: number;
}

interface ModuleProgressGaugeProps {
    data?: ModuleProgressData | null;
}

export const ModuleProgressGauge = ({ data }: ModuleProgressGaugeProps) => {
    const total = data?.totalPoints || 0;
    const completed = data?.doneCount || 0;
    const pending = (data?.todoCount || 0) + (data?.inProgressCount || 0);
    
    const chartData = [
        { name: "Completed", value: completed, color: "#22c55e" },
        { name: "Remaining", value: Math.max(total - completed, total === 0 ? 1 : 0), color: "#1c222d" },
    ];

    return (
        <Card className="bg-[#141820] border-white/5 h-full flex flex-col overflow-hidden relative">
            {/* Subtle Gradient background matching the image style */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/5 blur-[100px] -mr-32 -mt-32 pointer-events-none" />
            
            <CardHeader className="flex flex-row items-center gap-4 pb-2 relative z-10">
                <div className="p-3 rounded-2xl bg-green-500/10 text-green-500 shadow-inner">
                    <ListChecks className="w-6 h-6" />
                </div>
                <div>
                    <CardTitle className="text-lg font-black text-white tracking-tight">
                        Current Module Task Progress
                    </CardTitle>
                    <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mt-0.5">
                        {data?.sprintName || "No Module Active"}
                    </p>
                </div>
            </CardHeader>

            <CardContent className="flex-1 flex flex-col justify-between pt-0 relative z-10">
                <div className="relative h-[220px] w-full flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={chartData}
                                cx="50%"
                                cy="75%"
                                startAngle={210}
                                endAngle={-30}
                                innerRadius={75}
                                outerRadius={105}
                                stroke="none"
                                dataKey="value"
                            >
                                {chartData.map((entry, index) => (
                                    <Cell 
                                        key={`cell-${index}`} 
                                        fill={entry.color}
                                        className={index === 0 ? "drop-shadow-[0_0_10px_rgba(34,197,94,0.3)]" : ""} 
                                    />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute top-[55%] left-1/2 -translate-x-1/2 text-center">
                        <span className="text-5xl font-black text-white tracking-tighter">{completed}/{total}</span>
                        <p className="text-[11px] font-black uppercase tracking-[0.2em] text-green-500/80 mt-1">Tasks Submitted</p>
                    </div>
                </div>

                {/* Status Grid matching the user's image */}
                <div className="grid grid-cols-2 gap-4 mt-2 px-2">
                    <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/5">
                        <div className="text-amber-500 p-1.5 bg-amber-500/10 rounded-lg">
                            <Clock className="w-4 h-4" />
                        </div>
                        <div>
                            <span className="text-sm font-black text-white block leading-none">{pending}</span>
                            <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-600">Pending</span>
                        </div>
                    </div>

                    {/* <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/5">
                        <div className="text-rose-500 p-1.5 bg-rose-500/10 rounded-lg">
                            <RotateCcw className="w-4 h-4" />
                        </div>
                        <div>
                            <span className="text-sm font-black text-white block leading-none">{redo}</span>
                            <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-600">Re-Do</span>
                        </div>
                    </div> */}

                    <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/5">
                        <div className="text-blue-500 p-1.5 bg-blue-500/10 rounded-lg">
                            <CheckCircle2 className="w-4 h-4" />
                        </div>
                        <div>
                            <span className="text-sm font-black text-white block leading-none">{completed}</span>
                            <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-600">Completed</span>
                        </div>
                    </div>

                    {/* <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/5">
                        <div className="text-emerald-500 p-1.5 bg-emerald-500/10 rounded-lg">
                            <ShieldCheck className="w-4 h-4" />
                        </div>
                        <div>
                            <span className="text-sm font-black text-white block leading-none">{verified}</span>
                            <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-600">Verified</span>
                        </div>
                    </div> */}
                </div>

                <Button className="w-full mt-8 bg-[#10b981] hover:bg-[#059669] text-white font-black h-14 rounded-2xl transition-all shadow-xl shadow-emerald-500/20 active:scale-[0.98] border border-white/5">
                    Go to Module Tasks
                </Button>
            </CardContent>
        </Card>
    );
};
