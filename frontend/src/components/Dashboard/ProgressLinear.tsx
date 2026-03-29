import { Zap } from "lucide-react";

interface ProgressLinearProps {
    title: string;
    percentage: number;
    color?: string;
}

export const ProgressLinear = ({ title, percentage }: ProgressLinearProps) => {
    const clampedPct = Math.max(0, Math.min(100, percentage));

    const getColor = () => {
        if (clampedPct >= 75) return { bar: "from-emerald-500 to-teal-400", text: "text-emerald-400", glow: "shadow-emerald-500/30" };
        if (clampedPct >= 40) return { bar: "from-blue-500 to-indigo-400", text: "text-blue-400", glow: "shadow-blue-500/30" };
        return { bar: "from-amber-500 to-orange-400", text: "text-amber-400", glow: "shadow-amber-500/30" };
    };
    const scheme = getColor();

    return (
        <div className="bg-[#0f1117] border border-white/6 hover:border-white/12 rounded-2xl transition-all duration-300 group">
            <div className="flex items-center gap-4 px-5 py-4">
                <div className="p-2 rounded-xl bg-white/4 border border-white/6 shrink-0">
                    <Zap className="w-4 h-4 text-zinc-400" />
                </div>
                <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-zinc-300">{title}</span>
                        <span className={`text-sm font-bold font-mono ${scheme.text}`}>{clampedPct}%</span>
                    </div>
                    <div className="h-2 bg-white/4 rounded-full overflow-hidden border border-white/6">
                        <div
                            className={`h-full bg-linear-to-r ${scheme.bar} rounded-full transition-all duration-1000 ease-out shadow-sm ${scheme.glow} relative`}
                            style={{ width: `${clampedPct}%` }}
                        >
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white/60 shadow-lg" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
