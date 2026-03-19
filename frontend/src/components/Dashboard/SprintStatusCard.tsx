import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { PlayCircle, CheckCircle2, Timer } from "lucide-react";

interface SprintSummary {
    id: string;
    name: string;
    status: string;
    progress: number;
}

interface SprintStatusCardProps {
    data?: SprintSummary[];
}

export const SprintStatusCard = ({ data = [] }: SprintStatusCardProps) => {
    return (
        <Card className="bg-[#141820] border-white/5 h-full">
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="text-lg font-black text-white tracking-tight">Sprints</CardTitle>
                    <p className="text-zinc-500 text-xs font-medium uppercase tracking-widest">Iterative growth</p>
                </div>
                <div className="p-2 rounded-xl bg-orange-500/10 text-orange-500">
                    <Timer className="w-5 h-5" />
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {data.length === 0 && (
                        <p className="text-zinc-500 text-xs text-center py-8">No sprints yet</p>
                    )}
                    {data.map((sprint) => {
                        const isActive = sprint.status === 'ACTIVE';
                        const isCompleted = sprint.status === 'COMPLETED';
                        const StatusIcon = isActive ? PlayCircle : CheckCircle2;
                        const statusColor = isActive ? "text-blue-500" : isCompleted ? "text-green-500" : "text-zinc-500";
                        const barColor = isActive ? "bg-blue-500" : isCompleted ? "bg-green-500" : "bg-zinc-500";

                        return (
                            <div key={sprint.id} className="group relative">
                                <div className="absolute -inset-2 bg-white/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                <div className="relative flex items-center justify-between p-2">
                                    <div className="flex items-center gap-3">
                                        <StatusIcon className={`w-5 h-5 ${statusColor}`} />
                                        <div>
                                            <p className="text-sm font-bold text-white mb-0.5">{sprint.name}</p>
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">{sprint.status}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className={`text-xs font-black ${statusColor}`}>{sprint.progress}%</span>
                                        <div className="h-1 w-16 bg-[#1c222d] rounded-full mt-2 overflow-hidden shadow-inner">
                                            <div 
                                                className={`h-full ${barColor} rounded-full`} 
                                                style={{ width: `${sprint.progress}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
};
