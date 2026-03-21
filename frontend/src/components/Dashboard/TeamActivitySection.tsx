import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Users } from "lucide-react";
import type { TeamActivity } from "../../types/dashboard";

interface TeamActivitySectionProps {
    activities: TeamActivity[];
}

export const TeamActivitySection = ({ activities }: TeamActivitySectionProps) => {
    return (
        <Card className="bg-[#141820]/80 backdrop-blur-xl border-white/5 h-full flex flex-col py-0 gap-0 relative group overflow-hidden">
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-emerald-500/5 blur-[100px] -mr-32 -mb-32 pointer-events-none group-hover:opacity-20 transition-opacity duration-500" />

            <CardHeader className="flex flex-row items-center gap-4 pb-6 relative z-10 px-8 pt-8">
                <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 shadow-inner">
                    <Users className="w-5 h-5" />
                </div>
                <div>
                    <CardTitle className="text-xl font-black text-white tracking-tight leading-none uppercase">
                        Personnel Log
                    </CardTitle>
                    <p className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.2em] mt-2">Active Engagement</p>
                </div>
            </CardHeader>

            <CardContent className="flex-1 space-y-6 relative z-10 px-8 pb-8 overflow-y-auto custom-scrollbar">
                {activities.map((member, index) => (
                    <div key={member.userId} className="group/item">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    <div className="h-12 w-12 rounded-2xl border-2 border-white/5 group-hover/item:border-emerald-500/30 transition-all duration-500 group-hover/item:rotate-3 overflow-hidden bg-zinc-800">
                                        {member.profilePicture ? (
                                            <img src={member.profilePicture} alt={member.userName} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-zinc-400 font-black text-xs uppercase">
                                                {member.userName.slice(0, 2)}
                                            </div>
                                        )}
                                    </div>
                                    <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-lg bg-[#141820] flex items-center justify-center border border-white/5">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                                    </div>
                                </div>
                                <div>
                                    <div className="text-sm font-black text-white uppercase tracking-tight group-hover/item:text-emerald-400 transition-colors">
                                        {member.userName}
                                    </div>
                                    <div className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mt-1">
                                        {member.role}
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="text-lg font-black text-white tracking-tighter">{member.hoursLogged}h</span>
                                <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mt-1">Logged</p>
                            </div>
                        </div>
                        <div className="h-2 w-full bg-white/2 rounded-full overflow-hidden border border-white/5 p-px shadow-inner">
                            <div
                                className="h-full bg-linear-to-r from-emerald-600 to-teal-400 rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(16,185,129,0.3)] relative"
                                style={{
                                    width: `${Math.min((member.hoursLogged / 40) * 100, 100)}%`,
                                    transitionDelay: `${index * 100}ms`
                                }}
                            >
                                <div className="absolute inset-0 bg-white/10" />
                            </div>
                        </div>
                    </div>
                ))}

                {activities.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-10 opacity-40">
                        <Users className="w-12 h-12 text-zinc-700 mb-4" />
                        <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">No activity data available</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
