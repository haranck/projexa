import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "../ui/card";

interface StatsCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    trend?: string;
    description?: string;
    color?: string;
}

export const StatsCard = ({ title, value, icon: Icon, trend, description, color = "blue" }: StatsCardProps) => {
    const colorClasses = {
        blue: "text-blue-500 bg-blue-500/10",
        purple: "text-purple-500 bg-purple-500/10",
        green: "text-green-500 bg-green-500/10",
        orange: "text-orange-500 bg-orange-500/10",
        red: "text-red-500 bg-red-500/10",
    };

    const selectedColor = colorClasses[color as keyof typeof colorClasses] || colorClasses.blue;

    return (
        <Card className="bg-[#141820] border-white/5 overflow-hidden group hover:border-white/10 transition-all duration-300">
            <CardContent className="p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest mb-1">{title}</p>
                        <h3 className="text-3xl font-black text-white tracking-tight">{value}</h3>
                        {description && (
                            <p className="text-zinc-500 text-xs mt-1 font-medium">{description}</p>
                        )}
                    </div>
                    <div className={`p-3 rounded-2xl ${selectedColor} group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="w-6 h-6" />
                    </div>
                </div>
                {trend && (
                    <div className="mt-4 flex items-center gap-2">
                        <span className="text-xs font-bold text-green-500 bg-green-500/10 px-2 py-0.5 rounded-full">
                            {trend}
                        </span>
                        <span className="text-zinc-600 text-[10px] font-bold uppercase tracking-wider">vs last week</span>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
