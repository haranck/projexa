import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Layers, PlayCircle, CheckCircle2 } from "lucide-react";
import type { SprintSummary } from "../../types/dashboard";

interface SprintStatusCardProps {
    data?: SprintSummary[];
}

export const SprintStatusCard = ({ data }: SprintStatusCardProps) => {
    if (!data) return null;

    return (
        <Card className="bg-[#141820]/80 backdrop-blur-xl border-white/5 h-[450px] flex flex-col py-0 gap-0 relative group overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 blur-[100px] -mr-32 -mt-32 pointer-events-none group-hover:opacity-20 transition-opacity duration-500" />

            <CardHeader className="flex flex-row items-center gap-4 pb-4 relative z-10">
                <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-500 border border-purple-500/20 shadow-inner">
                    <Layers className="w-5 h-5" />
                </div>
                <div>
                    <CardTitle className="text-xl font-black text-white tracking-tight leading-none uppercase">
                        Sprint Ledger
                    </CardTitle>
                    <p className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.2em] mt-2">Active Cycles</p>
                </div>
            </CardHeader>

            <CardContent className="flex-1 overflow-y-auto custom-scrollbar relative z-10 space-y-4 px-6">
                {data.map((sprint, index) => {
                    const isActive = sprint.status === 'ACTIVE';
                    const StatusIcon = isActive ? PlayCircle : CheckCircle2;

                    return (
                        <div
                            key={sprint.id}
                            className="p-5 rounded-2xl bg-white/2 border border-white/5 hover:bg-white/5 hover:border-white/10 transition-all duration-300 group/item cursor-default"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="space-y-1">
                                    <h4 className="text-sm font-black text-white group-hover/item:text-blue-400 transition-colors uppercase tracking-tight">{sprint.name}</h4>
                                    <div className="flex items-center gap-2">
                                        <div className={`p-1 rounded-md bg-black/20 ${isActive ? 'text-blue-400' : 'text-emerald-400'}`}>
                                            <StatusIcon className="w-3 h-3" />
                                        </div>
                                        <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">{sprint.status}</span>
                                    </div>
                                </div>
                                <span className="text-[10px] font-black text-purple-400 bg-purple-500/10 px-2.5 py-1 rounded-lg border border-purple-500/20 uppercase tracking-widest shadow-inner">
                                    {sprint.progress}%
                                </span>
                            </div>
                            <div className="h-2 w-full bg-black/40 rounded-full overflow-hidden border border-white/5 p-px">
                                <div
                                    className="h-full bg-linear-to-r from-purple-600 to-blue-500 rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(168,85,247,0.3)] relative"
                                    style={{ width: `${sprint.progress}%`, transitionDelay: `${index * 100}ms` }}
                                >
                                    <div className="absolute inset-0 bg-linear-to-r from-white/20 to-transparent" />
                                </div>
                            </div>
                        </div>
                    );
                })}

                {data.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center py-10 opacity-40">
                        <div className="w-16 h-16 rounded-[2rem] bg-white/2 border border-white/5 flex items-center justify-center mb-4">
                            <Layers className="w-8 h-8 text-zinc-700" />
                        </div>
                        <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">No active sprints identified</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
