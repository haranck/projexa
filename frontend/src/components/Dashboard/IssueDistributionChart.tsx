import { Card, CardContent, CardHeader } from "../ui/card";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { BarChart2 } from "lucide-react";
import type { IssueDistribution } from "../../types/dashboard";

interface IssueDistributionChartProps {
    data?: IssueDistribution[];
}

const TYPE_COLORS: Record<string, string> = {
    STORY:   "#6366f1",
    TASK:    "#10b981",
    BUG:     "#f43f5e",
    EPIC:    "#a855f7",
    SUBTASK: "#f59e0b",
};

export const IssueDistributionChart = ({ data }: IssueDistributionChartProps) => {
    if (!data || data.length === 0) return null;

    const total = data.reduce((acc, d) => acc + d.count, 0);
    const chartData = data.map(item => ({
        name: item.type,
        value: item.count,
        color: TYPE_COLORS[item.type] || "#6366f1",
        pct: total > 0 ? Math.round((item.count / total) * 100) : 0,
    }));

    return (
        <Card className="bg-[#0f1117] border border-white/6 h-[440px] flex flex-col py-0 gap-0 relative overflow-hidden rounded-2xl hover:border-white/1 transition-all duration-300">
            <CardHeader className="flex flex-row items-center gap-3 px-5 pt-5 pb-4 border-b border-white/5">
                <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                    <BarChart2 className="w-4 h-4 text-indigo-400" />
                </div>
                <div>
                    <p className="text-sm font-semibold text-white">Issue Distribution</p>
                    <p className="text-xs text-zinc-500 mt-0.5">{total} total issues</p>
                </div>
            </CardHeader>

            <CardContent className="flex-1 flex flex-col p-5 gap-4">
                <div className="flex-1">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={chartData}
                                cx="50%"
                                cy="50%"
                                innerRadius={55}
                                outerRadius={90}
                                paddingAngle={4}
                                dataKey="value"
                                stroke="none"
                            >
                                {chartData.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={entry.color}
                                        opacity={0.9}
                                        className="transition-opacity hover:opacity-100 cursor-pointer"
                                    />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Legend */}
                <div className="grid grid-cols-2 gap-2">
                    {chartData.map((entry) => (
                        <div key={entry.name} className="flex items-center gap-2 bg-white/3 rounded-lg px-3 py-2 border border-white/5">
                            <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: entry.color }} />
                            <span className="text-xs text-zinc-400 truncate">{entry.name}</span>
                            <span className="ml-auto text-xs font-semibold text-white">{entry.pct}%</span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: { name: string; value: number; payload: { color: string; pct: number } }[] }) => {
    if (active && payload && payload.length) {
        const { name, value, payload: p } = payload[0];
        return (
            <div className="bg-[#1c1f26] border border-white/10 px-4 py-3 rounded-xl shadow-2xl">
                <div className="flex items-center gap-2 mb-1">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
                    <span className="text-xs font-medium text-zinc-300">{name}</span>
                </div>
                <p className="text-lg font-bold text-white">{value} <span className="text-sm text-zinc-500 font-normal">issues · {p.pct}%</span></p>
            </div>
        );
    }
    return null;
};
