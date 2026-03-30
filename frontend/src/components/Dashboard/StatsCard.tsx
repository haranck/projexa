import { Card, CardContent } from "../ui/card";
import { type LucideIcon, TrendingUp, TrendingDown } from "lucide-react";

interface StatsCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    description?: string;
    trend?: string;
    color?: "blue" | "purple" | "green" | "orange" | "red";
}

export const StatsCard = ({ title, value, icon: Icon, description, trend, color = "blue" }: StatsCardProps) => {
    const palette = {
        blue:   { icon: "text-blue-400 bg-blue-500/10 border-blue-500/20",   glow: "bg-blue-500",    bar: "bg-blue-500" },
        green:  { icon: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20", glow: "bg-emerald-500", bar: "bg-emerald-500" },
        purple: { icon: "text-violet-400 bg-violet-500/10 border-violet-500/20",  glow: "bg-violet-500",  bar: "bg-violet-500" },
        orange: { icon: "text-amber-400 bg-amber-500/10 border-amber-500/20",   glow: "bg-amber-500",   bar: "bg-amber-500" },
        red:    { icon: "text-rose-400 bg-rose-500/10 border-rose-500/20",     glow: "bg-rose-500",    bar: "bg-rose-500" },
    };
    const c = palette[color];
    const isPositive = trend?.startsWith('+');

    return (
        <Card className="bg-[#0f1117] border border-white/6 hover:border-white/12 transition-all duration-300 group relative overflow-hidden h-full cursor-default rounded-2xl">
            {/* Soft ambient glow */}
            <div className={`absolute top-0 right-0 w-40 h-40 blur-3xl opacity-[0.06] group-hover:opacity-[0.1] transition-opacity duration-500 -mr-20 -mt-20 pointer-events-none rounded-full ${c.glow}`} />

            <CardContent className="p-5 relative z-10 h-full flex flex-col justify-between">
                <div className="flex items-start justify-between">
                    <div>
                        <p className="text-xs font-medium text-zinc-500 mb-1">{title}</p>
                        <p className="text-3xl font-bold text-white tracking-tight">{value}</p>
                    </div>
                    <div className={`p-2.5 rounded-xl border ${c.icon} shrink-0`}>
                        <Icon className="w-4 h-4" />
                    </div>
                </div>

                {(description || trend) && (
                    <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/5">
                        {trend && (
                            <span className={`inline-flex items-center gap-1 text-xs font-semibold px-1.5 py-0.5 rounded-md ${isPositive ? 'text-emerald-400 bg-emerald-500/10' : 'text-rose-400 bg-rose-500/10'}`}>
                                {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                                {trend}
                            </span>
                        )}
                        {description && (
                            <p className="text-xs text-zinc-500">{description}</p>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
