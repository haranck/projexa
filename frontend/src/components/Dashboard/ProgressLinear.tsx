import { Card } from "../ui/card";
import { Activity } from "lucide-react";

interface ProgressLinearProps {
    title: string;
    percentage: number;
    color?: string;
}

export const ProgressLinear = ({ title, percentage, color = "blue" }: ProgressLinearProps) => {
    const barColors = {
        blue: "from-blue-600 to-indigo-500 shadow-[0_0_10px_rgba(37,99,235,0.3)]",
        green: "from-emerald-600 to-teal-400 shadow-[0_0_10px_rgba(16,185,129,0.3)]",
        purple: "from-purple-600 to-pink-500 shadow-[0_0_10px_rgba(168,85,247,0.3)]",
    };

    return (
        <Card className="bg-[#141820]/80 backdrop-blur-xl border-white/5 transition-all duration-500 hover:bg-white/5 group relative overflow-hidden cursor-default">
            <div className="flex items-center gap-4 px-5 py-3.5 relative z-10">
                <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500 border border-blue-500/20 shadow-inner group-hover:rotate-6 transition-transform duration-500 shrink-0">
                    <Activity className="w-4 h-4" />
                </div>
                <span className="text-xs font-black text-white tracking-tight uppercase whitespace-nowrap shrink-0">
                    {title}
                </span>
                <div className="flex-1 h-3 bg-white/2 rounded-full overflow-hidden border border-white/5 p-0.5 shadow-inner">
                    <div
                        className={`h-full rounded-full bg-linear-to-r transition-all duration-1000 ease-out relative ${barColors[color as keyof typeof barColors]}`}
                        style={{ width: `${percentage}%` }}
                    >
                        <div className="absolute inset-0 bg-white/10 animate-pulse" />
                    </div>
                </div>
                <span className="text-lg font-black text-white tracking-tighter font-mono shrink-0">
                    {percentage}%
                </span>
            </div>
        </Card>
    );
};
