import type { TopPerformer } from "../../types/dashboard";
import { Trophy, Clock, CheckCircle, Star } from "lucide-react";
import { Card, CardContent } from "../ui/card";

interface TopPerformerCardProps {
    data: TopPerformer | null;
}

export const TopPerformerCard = ({ data }: TopPerformerCardProps) => {
    if (!data) return (
        <Card className="bg-[#141820]/80 backdrop-blur-xl border-white/5 h-full relative group overflow-hidden">
            <CardContent className="h-full flex flex-col items-center justify-center p-8 opacity-40">
                <Trophy className="w-12 h-12 text-zinc-700 mb-4" />
                <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">No MVP identified yet</p>
            </CardContent>
        </Card>
    );

    return (
        <Card className="bg-[#141820]/80 backdrop-blur-xl border-white/5 h-full py-0 gap-0 relative group overflow-hidden">
            {/* Main Card with Premium Gradient & Glassmorphism */}
            <div className="h-full p-8 text-white flex flex-col justify-between transition-all duration-500 group relative">

                {/* Decorative Premium Glows */}
                <div className="absolute -top-10 -right-10 w-48 h-48 bg-blue-600/5 rounded-full blur-[80px] pointer-events-none group-hover:opacity-20 transition-opacity" />
                <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-purple-600/5 rounded-full blur-[80px] pointer-events-none group-hover:opacity-20 transition-opacity" />

                {/* Header */}
                <div className="relative flex items-center justify-between mb-8 z-10">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-2xl shadow-inner group-hover:rotate-12 transition-transform duration-500">
                            <Trophy className="w-5 h-5 text-yellow-500" />
                        </div>
                        <div>
                            <h3 className="text-xl font-black tracking-tight leading-none uppercase text-white">MVP</h3>
                            <p className="text-zinc-600 text-[9px] font-black uppercase tracking-[0.2em] mt-2">Project Champion</p>
                        </div>
                    </div>
                    <div className="flex gap-1">
                        {[1, 2, 3].map(i => (
                            <Star key={i} className="w-3 h-3 text-yellow-500/40 fill-yellow-500/20" />
                        ))}
                    </div>
                </div>

                {/* Profile Section */}
                <div className="relative flex flex-col items-center mb-10 z-10">
                    <div className="relative mb-6 group-hover:scale-110 transition-transform duration-700 ease-out">
                        <div className="absolute -inset-4 bg-linear-to-r from-blue-600/20 to-purple-600/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition duration-700" />
                        <div className="relative w-28 h-28 rounded-[2.5rem] border-2 border-white/5 overflow-hidden bg-white/5 backdrop-blur-xl p-1 shadow-2xl">
                            <div className="w-full h-full rounded-[2.2rem] overflow-hidden bg-black/40">
                                {data.profilePicture ? (
                                    <img src={data.profilePicture} alt={data.userName} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-4xl font-black bg-linear-to-br from-blue-500/20 to-purple-500/20 text-white leading-none">
                                        {data.userName.charAt(0)}
                                    </div>
                                )}
                            </div>
                        </div>
                        {/* Elite Badge */}
                        <div className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-2 rounded-xl shadow-xl border border-white/20">
                            <CheckCircle className="w-4 h-4" />
                        </div>
                    </div>
                    <div className="text-center">
                        <h4 className="text-3xl font-black text-white tracking-tighter leading-none group-hover/item:text-blue-400 transition-colors uppercase">{data.userName}</h4>
                        <div className="mt-3 flex items-center justify-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                            <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.25em]">{data.role || 'Contributor'}</p>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="relative grid grid-cols-1 gap-3 z-10">
                    <div className="flex items-center justify-between p-5 bg-white/2 rounded-2xl border border-white/5 group/stat hover:bg-white/5 hover:border-white/10 transition-all duration-300 shadow-inner">
                        <div className="flex items-center gap-4">
                            <div className="p-2 bg-blue-500/10 rounded-xl text-blue-400 group-hover/stat:rotate-12 transition-transform">
                                <Clock className="w-4 h-4" />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Utilization</span>
                        </div>
                        <span className="text-xl font-black text-white tracking-tighter font-mono">{data.hoursLogged}h</span>
                    </div>

                    <div className="flex items-center justify-between p-5 bg-white/2 rounded-2xl border border-white/5 group/stat hover:bg-white/5 hover:border-white/10 transition-all duration-300 shadow-inner">
                        <div className="flex items-center gap-4">
                            <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-400 group-hover/stat:rotate-12 transition-transform">
                                <CheckCircle className="w-4 h-4" />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Resolved</span>
                        </div>
                        <span className="text-xl font-black text-white tracking-tighter font-mono">{data.issuesCompleted}</span>
                    </div>
                </div>
            </div>
        </Card>
    );
};
