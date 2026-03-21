import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { type LucideIcon } from "lucide-react";

interface StatsCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    description?: string;
    trend?: string;
    color?: "blue" | "purple" | "green" | "orange" | "red";
}

export const StatsCard = ({ title, value, icon: Icon, description, trend, color = "blue" }: StatsCardProps) => {
    const colorClasses = {
        blue: "text-blue-500 bg-blue-500/10 border-blue-500/20 shadow-blue-500/10",
        green: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20 shadow-emerald-500/10",
        purple: "text-purple-500 bg-purple-500/10 border-purple-500/20 shadow-purple-500/10",
        orange: "text-orange-500 bg-orange-500/10 border-orange-500/20 shadow-orange-500/10",
        red: "text-rose-500 bg-rose-500/10 border-rose-500/20 shadow-rose-500/10",
    };

    const accentColorClass = color === 'blue' ? 'bg-blue-500' :
        color === 'green' ? 'bg-emerald-500' :
            color === 'purple' ? 'bg-purple-500' :
                color === 'red' ? 'bg-rose-500' :
                    'bg-orange-500';

    return (
        <Card className="bg-[#141820]/80 backdrop-blur-xl border-white/5 transition-all duration-500 hover:scale-[1.02] hover:bg-white/5 active:scale-[0.98] group relative overflow-hidden h-full cursor-default">
            {/* Background Accent Glow */}
            <div className={`absolute top-0 right-0 w-32 h-32 blur-2xl opacity-10 group-hover:opacity-20 transition-opacity -mr-16 -mt-16 pointer-events-none ${accentColorClass}`} />

            <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
                <CardTitle className="text-[10px] font-black uppercase tracking-[0.25em] text-zinc-500 group-hover:text-zinc-400 transition-colors">
                    {title}
                </CardTitle>
                <div className={`p-3 rounded-2xl border transition-all duration-500 group-hover:rotate-12 group-hover:scale-110 shadow-inner ${colorClasses[color as keyof typeof colorClasses]}`}>
                    <Icon className="w-5 h-5" />
                </div>
            </CardHeader>
            <CardContent className="relative z-10">
                <div className="flex flex-col gap-1">
                    <div className="text-4xl font-black text-white tracking-tighter group-active:scale-95 transition-transform duration-200">
                        {value}
                    </div>
                    {(description || trend) && (
                        <div className="flex items-center gap-2 mt-3 p-3 rounded-xl bg-white/3 border border-white/5 backdrop-blur-md">
                            {trend && (
                                <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-md ${trend.startsWith('+') ? 'text-emerald-500 bg-emerald-500/10' : 'text-rose-500 bg-rose-500/10'}`}>
                                    {trend}
                                </span>
                            )}
                            {description && (
                                <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest leading-none">
                                    {description}
                                </p>
                            )}
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};
