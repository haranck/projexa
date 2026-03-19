import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface IssueDistributionData {
    type: string;
    count: number;
}

interface IssueDistributionChartProps {
    data?: IssueDistributionData[];
}

const TYPE_COLORS: Record<string, string> = {
    EPIC: "#a855f7",
    STORY: "#3b82f6",
    TASK: "#22c55e",
    BUG: "#ef4444",
    SUBTASK: "#f97316",
};

export const IssueDistributionChart = ({ data = [] }: IssueDistributionChartProps) => {
    const chartData = data.map(item => ({
        name: item.type,
        value: item.count,
        color: TYPE_COLORS[item.type] || "#71717a"
    })).sort((a, b) => b.value - a.value);

    const displayData = chartData.length > 0 ? chartData : [
        { name: "No Data", value: 0, color: "#1c222d" }
    ];

    return (
        <Card className="bg-[#141820] border-white/5 h-full">
            <CardHeader>
                <CardTitle className="text-lg font-black text-white tracking-tight">Issues by Type</CardTitle>
                <p className="text-zinc-500 text-xs font-medium uppercase tracking-widest">Distribution across project</p>
            </CardHeader>
            <CardContent>
                <div className="h-[300px] w-full mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            layout="vertical"
                            data={displayData}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                            <XAxis type="number" hide />
                            <YAxis 
                                dataKey="name" 
                                type="category" 
                                axisLine={false} 
                                tickLine={false}
                                tick={{ fill: "#71717a", fontSize: 10, fontWeight: 600 }}
                                width={80}
                            />
                            <Tooltip 
                                cursor={{ fill: "transparent" }}
                                contentStyle={{ 
                                    backgroundColor: "#1c222d", 
                                    border: "1px solid rgba(255,255,255,0.1)",
                                    borderRadius: "12px",
                                    color: "#fff"
                                }}
                            />
                            <Bar 
                                dataKey="value" 
                                radius={[0, 10, 10, 0]} 
                                barSize={30}
                            >
                                {displayData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                
                <div className="mt-6 flex flex-wrap gap-4 justify-center">
                    {displayData.map((entry, index) => (
                        <div key={index} className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">{entry.name}</span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};
