import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { PieChart as PieChartIcon } from "lucide-react";
import type { IssueDistribution } from "../../types/dashboard";

interface IssueDistributionChartProps {
    data?: IssueDistribution[];
}

const TYPE_COLORS: Record<string, string> = {
    STORY: "#3b82f6",
    TASK: "#10b981",
    BUG: "#f43f5e",
};

export const IssueDistributionChart = ({ data }: IssueDistributionChartProps) => {
    if (!data || data.length === 0) return null;

    const chartData = data.map(item => ({
        name: item.type,
        value: item.count,
        color: TYPE_COLORS[item.type] || "#6366f1"
    }));

    return (
        <Card className="bg-[#141820]/80 backdrop-blur-xl border-white/5 h-[450px] flex flex-col py-0 gap-0 relative group overflow-hidden">
            <div className="absolute top-0 left-0 w-64 h-64 bg-blue-500/5 blur-[100px] -ml-32 -mt-32 pointer-events-none group-hover:opacity-20 transition-opacity duration-500" />

            <CardHeader className="flex flex-row items-center gap-4 pb-0 relative z-10">
                <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 shadow-inner">
                    <PieChartIcon className="w-5 h-5" />
                </div>
                <div>
                    <CardTitle className="text-xl font-black text-white tracking-tight leading-none uppercase">
                        Structure Analysis
                    </CardTitle>
                    <p className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.2em] mt-2">Issue Distribution</p>
                </div>
            </CardHeader>

            <CardContent className="flex-1 pb-6 relative z-10">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            innerRadius={70}
                            outerRadius={100}
                            paddingAngle={8}
                            dataKey="value"
                            stroke="none"
                        >
                            {chartData.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={entry.color}
                                    className="transition-all duration-500 hover:opacity-80 cursor-pointer drop-shadow-2xl"
                                />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                        <Legend content={<CustomLegend />} verticalAlign="bottom" height={36} />
                    </PieChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
};

const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: { name: string; value: number; color: string }[] }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-[#1c222d] border border-white/10 p-4 rounded-2xl shadow-2xl backdrop-blur-xl">
                <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">{payload[0].name}</p>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: payload[0].color }} />
                    <p className="text-xl font-black text-white tracking-tighter">
                        {payload[0].value} <span className="text-[10px] text-zinc-500 ml-1 font-black">ITEMS</span>
                    </p>
                </div>
            </div>
        );
    }
    return null;
};

const CustomLegend = (props: { payload?: { value: string; color: string }[] }) => {
    const { payload } = props;
    return (
        <div className="flex justify-center gap-6 mt-4">
            {payload?.map((entry, index: number) => (
                <div key={`item-${index}`} className="flex items-center gap-2 group cursor-default">
                    <div className="w-2 h-2 rounded-full shadow-lg" style={{ backgroundColor: entry.color }} />
                    <span className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.2em] group-hover:text-zinc-300 transition-colors">
                        {entry.value}
                    </span>
                </div>
            ))}
        </div>
    );
};
