import React from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { ChartTooltip } from "./ChartTooltip";

interface RevenueChartProps {
    data: { month: string; revenue: number }[];
}

export const RevenueChart = ({ data }: RevenueChartProps) => {
    return (
        <div className="rounded-2xl p-6 border border-white/5 bg-[#12121e]/85 backdrop-blur-xl h-full flex flex-col">
            <div className="mb-6">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Revenue Analysis</h3>
                <p className="text-xs text-zinc-500 mt-1">Monthly revenue breakdown (Last 6 Months)</p>
            </div>
            
            <div className="flex-1 min-h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                        <XAxis 
                            dataKey="month" 
                            tick={{ fill: "#71717a", fontSize: 10, fontWeight: 500 }} 
                            axisLine={false} 
                            tickLine={false} 
                            dy={10}
                        />
                        <YAxis 
                            tick={{ fill: "#71717a", fontSize: 10, fontWeight: 500 }} 
                            axisLine={false} 
                            tickLine={false} 
                            tickFormatter={(v: number) => `₹${(v / 1000).toFixed(0)}k`}
                            dx={-10}
                        />
                        <Tooltip content={<ChartTooltip prefix="₹" />} cursor={{ stroke: '#6366f1', strokeWidth: 1, strokeDasharray: '4 4' }} />
                        <Area 
                            type="monotone" 
                            dataKey="revenue" 
                            stroke="#6366f1" 
                            strokeWidth={3} 
                            fill="url(#revGrad)" 
                            dot={{ fill: '#6366f1', strokeWidth: 2, r: 4, stroke: '#12121e' }}
                            activeDot={{ r: 6, strokeWidth: 0 }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};
