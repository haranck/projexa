import { useState, useEffect } from "react";
import { Loader2, Calendar, ArrowLeft, Target } from "lucide-react";
import { toast } from "react-hot-toast";

interface StartSprintModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: { startDate: string; endDate: string; goal?: string }) => void;
    isLoading: boolean;
    sprintName: string;
}

export const StartSprintModal = ({
    isOpen,
    onClose,
    onSubmit,
    isLoading,
    sprintName
}: StartSprintModalProps) => {
    const [goal, setGoal] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    useEffect(() => {
        if (isOpen) {
            // Set default dates: today and 2 weeks from now
            const today = new Date();
            const twoWeeksLater = new Date();
            twoWeeksLater.setDate(today.getDate() + 14);

            setStartDate(today.toISOString().split('T')[0]);
            setEndDate(twoWeeksLater.toISOString().split('T')[0]);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!startDate || !endDate) {
            toast.error("Start and end dates are required");
            return;
        }

        if (new Date(startDate) >= new Date(endDate)) {
            toast.error("End date must be after start date");
            return;
        }

        onSubmit({
            startDate: new Date(startDate).toISOString(),
            endDate: new Date(endDate).toISOString(),
            goal: goal.trim() || undefined
        });
    };

    const handleClose = () => {
        setGoal("");
        onClose();
    };

    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-[#0d1016]/80 backdrop-blur-md"
                onClick={handleClose}
            />

            <div className="relative w-full max-w-lg bg-[#0d1016] border border-white/10 rounded-2xl shadow-2xl animate-in fade-in zoom-in-95 duration-200 overflow-hidden flex flex-col">
                <div className="flex items-center justify-between px-8 py-6 border-b border-white/5 shrink-0">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={handleClose}
                            className="p-1.5 rounded-lg hover:bg-white/5 text-zinc-400 hover:text-white transition-all"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <div>
                            <h2 className="text-lg font-bold text-white">Start Sprint</h2>
                            <p className="text-xs text-zinc-500 mt-0.5">{sprintName}</p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    {/* Goal */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                            <Target className="w-3 h-3" />
                            Sprint Goal
                        </label>
                        <textarea
                            value={goal}
                            onChange={(e) => setGoal(e.target.value)}
                            placeholder="What are we aiming to achieve in this sprint?"
                            rows={3}
                            className="w-full bg-[#14171f] border border-white/5 rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-700 focus:outline-none focus:ring-1 focus:ring-blue-500/40 resize-none transition-all leading-relaxed"
                        />
                    </div>

                    {/* Dates */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                                <Calendar className="w-3 h-3" />
                                Start Date
                            </label>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="w-full bg-[#14171f] border border-white/5 rounded-xl px-4 py-2.5 text-xs text-zinc-300 focus:outline-none focus:ring-1 focus:ring-blue-500/40 scheme-dark"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                                <Calendar className="w-3 h-3" />
                                End Date
                            </label>
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="w-full bg-[#14171f] border border-white/5 rounded-xl px-4 py-2.5 text-xs text-zinc-300 focus:outline-none focus:ring-1 focus:ring-blue-500/40 scheme-dark"
                            />
                        </div>
                    </div>

                    {/* Info text */}
                    <div className="p-4 bg-blue-500/5 border border-blue-500/10 rounded-xl">
                        <p className="text-[10px] text-blue-400 leading-relaxed">
                            Starting this sprint will move all issues from planned to active. You can still modify the sprint goal and dates later.
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3 pt-6 border-t border-white/5">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="flex-1 py-3 text-xs font-bold text-zinc-500 hover:text-white bg-[#14171f] border border-white/5 rounded-xl hover:bg-white/5 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex-[1.5] py-3 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-blue-600/20 transition-all active:scale-95 disabled:opacity-50"
                        >
                            {isLoading ? (
                                <span className="flex items-center gap-2 justify-center">
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" /> Starting...
                                </span>
                            ) : "Start Sprint"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
