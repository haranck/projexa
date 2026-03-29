import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { ChartTooltip } from "./ChartTooltip";

interface UserGrowthChartProps {
    data: { month: string; users: number }[];
}

export const UserGrowthChart = ({ data }: UserGrowthChartProps) => {
    return (
        <div className="rounded-2xl p-6 border border-white/5 bg-[#12121e]/85 backdrop-blur-xl h-full flex flex-col">
            <div className="mb-6">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">User Growth</h3>
                <p className="text-xs text-zinc-500 mt-1">New user registrations (Last 6 Months)</p>
            </div>
            
            <div className="flex-1 min-h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="userGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#22d3ee" stopOpacity={1} />
                                <stop offset="100%" stopColor="#22d3ee" stopOpacity={0.6} />
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
                            dx={-10}
                        />
                        <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(255,255,255,0.02)' }} />
                        <Bar 
                            dataKey="users" 
                            fill="url(#userGrad)" 
                            radius={[6, 6, 0, 0]} 
                            barSize={32}
                            activeBar={{ fill: '#22d3ee', stroke: '#22d3ee', strokeWidth: 1 }}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};
