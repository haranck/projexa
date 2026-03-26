import { AlertCircle, X, Calendar, ArrowRight } from "lucide-react";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";
import { FRONTEND_ROUTES } from "../../constants/frontendRoutes";

interface OverdueTask {
    id: string;
    title: string;
    endDate: string | Date;
    key: string;
}

interface OverdueTasksPopupProps {
    tasks: OverdueTask[];
    onClose: () => void;
}

export const OverdueTasksPopup = ({ tasks, onClose }: OverdueTasksPopupProps) => {
    if (tasks.length === 0) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-zinc-900 border border-red-500/20 rounded-[2.5rem] w-full max-w-lg overflow-hidden shadow-2xl shadow-red-500/10 animate-in zoom-in-95 duration-300">
                <div className="bg-red-500/10 p-8 flex items-center justify-between border-b border-red-500/10">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-red-500/20 flex items-center justify-center border border-red-500/20">
                            <AlertCircle className="w-6 h-6 text-red-500" />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-white tracking-tighter">Overdue Tasks</h3>
                            <p className="text-red-400/60 text-xs font-bold uppercase tracking-widest">{tasks.length} MISSION CRITICAL DELAYS</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-xl transition-colors text-zinc-500 hover:text-white">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-8 space-y-4 max-h-[400px] overflow-y-auto custom-scrollbar">
                    {tasks.map((task) => (
                        <div key={task.id} className="group p-4 rounded-2xl bg-white/3 border border-white/5 hover:border-red-500/30 transition-all">
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-[10px] font-black text-red-500 uppercase tracking-[0.2em]">{task.key}</span>
                                <div className="flex items-center gap-1.5 text-zinc-500 group-hover:text-red-400 transition-colors">
                                    <Calendar className="w-3 h-3" />
                                    <span className="text-[10px] font-bold">
                                        {new Date(task.endDate).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                                    </span>
                                </div>
                            </div>
                            <h4 className="text-sm font-bold text-zinc-200 group-hover:text-white transition-colors">{task.title}</h4>
                        </div>
                    ))}
                </div>

                <div className="p-8 bg-black/20 border-t border-white/5 flex gap-3">
                    <Button 
                        variant="ghost" 
                        onClick={onClose}
                        className="flex-1 h-12 rounded-xl text-zinc-500 font-bold hover:text-white hover:bg-white/5"
                    >
                        Dismiss
                    </Button>
                    <Link to={FRONTEND_ROUTES.BOARD} className="flex-[2]">
                        <Button className="w-full h-12 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black shadow-lg shadow-red-600/20 flex items-center justify-center gap-2">
                            Resolve Now
                            <ArrowRight className="w-4 h-4" />
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
};
