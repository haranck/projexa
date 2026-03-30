import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { ChartTooltip } from "./ChartTooltip";

interface PlanRevenueChartProps {
    data: { plan: string; revenue: number }[];
    colors: string[];
}

const formatCurrency = (v: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(v);

export const PlanRevenueChart = ({ data, colors }: PlanRevenueChartProps) => {
    if (!data || data.length === 0) {
        return (
            <div className="rounded-2xl p-6 border border-white/5 bg-[#12121e]/85 backdrop-blur-xl h-full flex items-center justify-center min-h-[300px]">
                <p className="text-zinc-500 text-sm italic">No plan data available</p>
            </div>
        );
    }

    const totalRevenue = data.reduce((acc, curr) => acc + curr.revenue, 0);

    return (
        <div className="rounded-2xl p-6 border border-white/5 bg-[#12121e]/85 backdrop-blur-xl h-full flex flex-col">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-6">Revenue by Plan</h3>
            
            <div className="flex-1 min-h-[180px]">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data.map(d => ({ ...d, name: d.plan, value: d.revenue }))}
                            cx="50%"
                            cy="50%"
                            innerRadius={55}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                            stroke="none"
                        >
                            {data.map((_, index) => (
                                <Cell 
                                    key={index} 
                                    fill={colors[index % colors.length]} 
                                    className="outline-none hover:opacity-80 transition-opacity"
                                />
                            ))}
                        </Pie>
                        <Tooltip content={<ChartTooltip prefix="₹" />} />
                    </PieChart>
                </ResponsiveContainer>
            </div>

            <div className="mt-6 space-y-3">
                {data.map((item, i) => {
                    const percentage = totalRevenue > 0 ? ((item.revenue / totalRevenue) * 100).toFixed(0) : "0";
                    return (
                        <div key={item.plan} className="flex items-center justify-between group">
                            <div className="flex items-center gap-3">
                                <div 
                                    className="w-2.5 h-2.5 rounded-full shadow-lg" 
                                    style={{ background: colors[i % colors.length], boxShadow: `0 0 8px ${colors[i % colors.length]}33` }} 
                                />
                                <span className="text-xs font-medium text-zinc-300 group-hover:text-white transition-colors capitalize">{item.plan}</span>
                            </div>
                            <div className="text-right">
                                <p className="text-xs font-bold text-white tabular-nums">{formatCurrency(item.revenue)}</p>
                                <p className="text-[10px] text-zinc-500 mt-0.5">{percentage}% of total</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
