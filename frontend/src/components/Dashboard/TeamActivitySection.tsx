import { Card, CardContent, CardHeader } from "../ui/card";
import { Users } from "lucide-react";
import type { TeamActivity } from "../../types/dashboard";

interface TeamActivitySectionProps {
    activities: TeamActivity[];
}

export const TeamActivitySection = ({ activities }: TeamActivitySectionProps) => {
    return (
        <Card className="bg-[#0f1117] border border-white/6 h-full flex flex-col py-0 gap-0 relative rounded-2xl hover:border-white/1 transition-all duration-300">
            <CardHeader className="flex flex-row items-center gap-3 px-6 pt-6 pb-4 border-b border-white/5">
                <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                    <Users className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                    <p className="text-sm font-semibold text-white">Team Activity</p>
                    <p className="text-xs text-zinc-500 mt-0.5">{activities.length} active members</p>
                </div>
            </CardHeader>

            <CardContent className="flex-1 space-y-1 px-6 pb-6 pt-4 overflow-y-auto custom-scrollbar">
                {activities.map((member, index) => {
                    const pct = Math.min((member.hoursLogged / 40) * 100, 100);
                    const initials = member.userName.slice(0, 2).toUpperCase();

                    return (
                        <div key={member.userId} className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/3 transition-colors duration-200 group/item cursor-default">
                            {/* Avatar */}
                            <div className="relative shrink-0">
                                <div className="h-9 w-9 rounded-full border border-white/10 overflow-hidden bg-zinc-800 flex items-center justify-center">
                                    {member.profilePicture ? (
                                        <img src={member.profilePicture} alt={member.userName} className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-xs font-semibold text-zinc-300">{initials}</span>
                                    )}
                                </div>
                                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-[#0f1117]" />
                            </div>

                            {/* Info + Bar */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1.5">
                                    <span className="text-sm font-medium text-white truncate group-hover/item:text-emerald-400 transition-colors">{member.userName}</span>
                                    <span className="text-xs text-zinc-400 ml-3 shrink-0">{member.hoursLogged}h</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="flex-1 h-1.5 bg-white/4 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-linear-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-700 ease-out"
                                            style={{ width: `${pct}%`, transitionDelay: `${index * 60}ms` }}
                                        />
                                    </div>
                                    <span className="text-[11px] text-zinc-600 shrink-0">{member.role}</span>
                                </div>
                            </div>
                        </div>
                    );
                })}

                {activities.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-12 opacity-50">
                        <Users className="w-8 h-8 text-zinc-600 mb-3" />
                        <p className="text-sm text-zinc-500">No activity data</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
