import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

interface AdminStatCardProps {
    title: string;
    value: string | number;
    change: string;
    isPositive: boolean;
    icon: React.ReactElement<{ size?: number }>;
    gradient: string;
    glowColor: string;
}

export const AdminStatCard = ({ 
    title, 
    value, 
    change, 
    isPositive, 
    icon, 
    gradient, 
    glowColor 
}: AdminStatCardProps) => {
    return (
        <div
            className="relative overflow-hidden rounded-2xl p-6 border border-white/5 group hover:border-white/10 transition-all duration-300 shadow-xl shadow-black/20"
            style={{ background: "rgba(18,18,30,0.85)", backdropFilter: "blur(12px)" }}
        >
            <div
                className="absolute -top-6 -right-6 w-28 h-28 rounded-full opacity-20 blur-3xl group-hover:opacity-40 transition-opacity duration-500"
                style={{ background: glowColor }}
            />
            
            <div className="flex items-start justify-between mb-4">
                <div>
                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] mb-1.5">{title}</p>
                    <p className="text-3xl font-bold text-white tabular-nums tracking-tight">{value}</p>
                </div>
                <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center text-white shrink-0 shadow-lg"
                    style={{ background: gradient }}
                >
                    {React.cloneElement(icon, { size: 20 })}
                </div>
            </div>
            
            <div className={`flex items-center gap-1.5 text-xs font-semibold px-2 py-1 rounded-lg w-fit ${
                isPositive 
                    ? "text-emerald-400 bg-emerald-400/10 border border-emerald-400/20" 
                    : "text-rose-400 bg-rose-400/10 border border-rose-400/20"
            }`}>
                {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                <span>{change}</span>
            </div>
        </div>
    );
};
