import { Card, CardContent, CardHeader } from "../ui/card";
import { Layers, PlayCircle, CheckCircle2, Clock } from "lucide-react";
import type { SprintSummary } from "../../types/dashboard";

interface SprintStatusCardProps {
    data?: SprintSummary[];
}

export const SprintStatusCard = ({ data }: SprintStatusCardProps) => {
    if (!data) return null;

    return (
        <Card className="bg-[#0f1117] border border-white/6 h-[440px] flex flex-col py-0 gap-0 relative rounded-2xl hover:border-white/1 transition-all duration-300">
            <CardHeader className="flex flex-row items-center gap-3 px-5 pt-5 pb-4 border-b border-white/5">
                <div className="p-2 rounded-xl bg-violet-500/10 border border-violet-500/20">
                    <Layers className="w-4 h-4 text-violet-400" />
                </div>
                <div>
                    <p className="text-sm font-semibold text-white">Sprint Tracker</p>
                    <p className="text-xs text-zinc-500 mt-0.5">{data.length} cycle{data.length !== 1 ? 's' : ''} tracked</p>
                </div>
            </CardHeader>

            <CardContent className="flex-1 overflow-y-auto custom-scrollbar px-5 pb-5 pt-4 space-y-3">
                {data.map((sprint, index) => {
                    const isActive = sprint.status === 'ACTIVE';
                    return (
                        <div
                            key={sprint.id}
                            className="p-4 rounded-xl bg-white/3 border border-white/6 hover:bg-white/5 hover:border-white/1 transition-all duration-200 cursor-default"
                        >
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <h4 className="text-sm font-semibold text-white truncate max-w-[160px]">{sprint.name}</h4>
                                    <div className="flex items-center gap-1.5 mt-1">
                                        {isActive ? (
                                            <PlayCircle className="w-3 h-3 text-emerald-400" />
                                        ) : (
                                            <CheckCircle2 className="w-3 h-3 text-zinc-500" />
                                        )}
                                        <span className={`text-[11px] font-medium ${isActive ? 'text-emerald-400' : 'text-zinc-500'}`}>
                                            {isActive ? 'Active' : 'Completed'}
                                        </span>
                                    </div>
                                </div>
                                <span className={`text-xs font-bold px-2 py-1 rounded-lg ${isActive ? 'bg-violet-500/10 text-violet-400 border border-violet-500/20' : 'bg-white/4 text-zinc-400 border border-white/6'}`}>
                                    {sprint.progress}%
                                </span>
                            </div>
                            <div className="h-1.5 w-full bg-white/4 rounded-full overflow-hidden">
                                <div
                                    className={`h-full rounded-full transition-all duration-700 ease-out ${isActive ? 'bg-linear-to-r from-violet-500 to-blue-400' : 'bg-linear-to-r from-zinc-600 to-zinc-500'}`}
                                    style={{ width: `${sprint.progress}%`, transitionDelay: `${index * 80}ms` }}
                                />
                            </div>
                        </div>
                    );
                })}

                {data.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center py-16 opacity-50">
                        <Clock className="w-8 h-8 text-zinc-600 mb-3" />
                        <p className="text-sm text-zinc-500">No sprints yet</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
