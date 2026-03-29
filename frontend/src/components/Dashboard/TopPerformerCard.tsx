import type { TopPerformer } from "../../types/dashboard";
import { Trophy, Clock, CheckCircle, Flame } from "lucide-react";
import { Card, CardContent } from "../ui/card";

interface TopPerformerCardProps {
    data: TopPerformer | null;
}

export const TopPerformerCard = ({ data }: TopPerformerCardProps) => {
    if (!data) return (
        <Card className="bg-[#0f1117] border border-white/6 h-full rounded-2xl">
            <CardContent className="h-full flex flex-col items-center justify-center p-8 opacity-40">
                <Trophy className="w-8 h-8 text-zinc-600 mb-3" />
                <p className="text-sm text-zinc-500 text-center">No performer data yet</p>
            </CardContent>
        </Card>
    );

    const initials = data.userName.slice(0, 2).toUpperCase();

    return (
        <Card className="bg-[#0f1117] border border-white/6 h-full rounded-2xl hover:border-white/1 transition-all duration-300 overflow-hidden group">
            <div className="absolute inset-0 bg-linear-to-br from-amber-500/3 via-transparent to-blue-500/3 pointer-events-none" />

            <CardContent className="relative z-10 p-6 flex flex-col h-full">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20">
                            <Trophy className="w-4 h-4 text-amber-400" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-white">Top Performer</p>
                            <p className="text-xs text-zinc-500">This sprint</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-rose-500/10 border border-rose-500/20">
                        <Flame className="w-3 h-3 text-rose-400" />
                        <span className="text-xs font-semibold text-rose-400">MVP</span>
                    </div>
                </div>

                {/* Profile */}
                <div className="flex flex-col items-center mb-6 flex-1 justify-center">
                    <div className="relative mb-4 group-hover:scale-105 transition-transform duration-500">
                        <div className="w-20 h-20 rounded-2xl border border-white/10 overflow-hidden bg-zinc-800 flex items-center justify-center shadow-xl">
                            {data.profilePicture ? (
                                <img src={data.profilePicture} alt={data.userName} className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-2xl font-bold text-zinc-200">{initials}</span>
                            )}
                        </div>
                        <div className="absolute -bottom-2 -right-2 p-1.5 bg-blue-600 rounded-lg border-2 border-[#0f1117] shadow-lg">
                            <CheckCircle className="w-3 h-3 text-white" />
                        </div>
                    </div>
                    <h4 className="text-lg font-bold text-white text-center">{data.userName}</h4>
                    <p className="text-xs text-zinc-500 mt-1">{data.role || 'Contributor'}</p>
                </div>

                {/* Stats */}
                <div className="space-y-2.5">
                    <div className="flex items-center justify-between p-3 rounded-xl bg-white/3 border border-white/6">
                        <div className="flex items-center gap-2.5">
                            <div className="p-1.5 bg-blue-500/10 rounded-lg border border-blue-500/20">
                                <Clock className="w-3.5 h-3.5 text-blue-400" />
                            </div>
                            <span className="text-xs text-zinc-400">Hours Logged</span>
                        </div>
                        <span className="text-sm font-bold text-white tabular-nums">{data.hoursLogged}h</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-xl bg-white/3 border border-white/6">
                        <div className="flex items-center gap-2.5">
                            <div className="p-1.5 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                            </div>
                            <span className="text-xs text-zinc-400">Issues Closed</span>
                        </div>
                        <span className="text-sm font-bold text-white tabular-nums">{data.issuesCompleted}</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
