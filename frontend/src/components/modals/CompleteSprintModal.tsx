import { useState } from "react";
import { Loader2, ArrowLeft, AlertCircle, Info } from "lucide-react";
import type { ISprintEntity } from "@/services/Sprint/sprintService";
import type { IssueItem } from "../../pages/User/Backlog/BacklogPage";

interface CompleteSprintModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: { moveIncompleteIssuesToSprintId?: string }) => void;
    isLoading: boolean;
    sprint: ISprintEntity;
    issues: IssueItem[];
    plannedSprints: ISprintEntity[];
}

export const CompleteSprintModal = ({
    isOpen,
    onClose,
    onSubmit,
    isLoading,
    sprint,
    issues,
    plannedSprints
}: CompleteSprintModalProps) => {
    const [destinationId, setDestinationId] = useState<string>("backlog");

    if (!isOpen) return null;

    const incompleteIssuesCount = issues.filter(i => i.status?.toUpperCase() !== "DONE").length;
    const completedIssuesCount = issues.length - incompleteIssuesCount;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({
            moveIncompleteIssuesToSprintId: destinationId === "backlog" || !destinationId ? undefined : destinationId
        });
    };

    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-[#0d1016]/80 backdrop-blur-md"
                onClick={onClose}
            />

            <div className="relative w-full max-w-lg bg-[#0d1016] border border-white/10 rounded-2xl shadow-2xl animate-in fade-in zoom-in-95 duration-200 overflow-hidden flex flex-col">
                <div className="flex items-center justify-between px-8 py-6 border-b border-white/5 shrink-0">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={onClose}
                            className="p-1.5 rounded-lg hover:bg-white/5 text-zinc-400 hover:text-white transition-all"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <div>
                            <h2 className="text-lg font-bold text-white">Complete Sprint</h2>
                            <p className="text-xs text-zinc-500 mt-0.5">{sprint.name}</p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    {/* Summary Stats */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl group transition-all hover:bg-emerald-500/10">
                            <div className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mb-1">Completed</div>
                            <div className="text-2xl font-black text-white">{completedIssuesCount}</div>
                            <div className="text-[10px] text-zinc-600 font-medium">issues finished</div>
                        </div>
                        <div className="p-4 bg-zinc-500/5 border border-white/5 rounded-2xl group transition-all hover:bg-zinc-500/10">
                            <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Incomplete</div>
                            <div className="text-2xl font-black text-white">{incompleteIssuesCount}</div>
                            <div className="text-[10px] text-zinc-600 font-medium">issues remaining</div>
                        </div>
                    </div>

                    {/* Destination Selection */}
                    {incompleteIssuesCount > 0 && (
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-zinc-400">
                                <AlertCircle className="w-4 h-4 text-zinc-500" />
                                <span className="text-xs font-bold uppercase tracking-tight">Move incomplete issues to:</span>
                            </div>

                            <select
                                value={destinationId}
                                onChange={(e) => setDestinationId(e.target.value)}
                                className="w-full bg-[#14171f] border border-white/5 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500/40 transition-all appearance-none cursor-pointer"
                            >
                                <option value="backlog">Backlog</option>
                                {plannedSprints.filter(s => s._id !== sprint._id).map(s => (
                                    <option key={s._id} value={s._id}>{s.name}</option>
                                ))}
                            </select>

                            <div className="p-4 bg-blue-500/5 border border-blue-500/10 rounded-xl flex gap-3">
                                <Info className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                                <p className="text-[10px] text-blue-400/80 leading-relaxed">
                                    All unfinished work will be moved to your selected destination. The sprint will be closed and moved to the &quot;Reports&quot; or &quot;Completed&quot; view.
                                </p>
                            </div>
                        </div>
                    )}

                    {incompleteIssuesCount === 0 && (
                        <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-xl flex gap-3">
                            <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                                <span className="text-xs">🎉</span>
                            </div>
                            <p className="text-[10px] text-emerald-400/80 leading-relaxed font-medium">
                                Excellent work! All issues in this sprint are completed. You&apos;re ready to close it.
                            </p>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-3 pt-6 border-t border-white/5">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3 text-xs font-bold text-zinc-500 hover:text-white bg-[#14171f] border border-white/5 rounded-xl hover:bg-white/5 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex-[1.5] py-3 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-600/20 transition-all active:scale-95 disabled:opacity-50"
                        >
                            {isLoading ? (
                                <span className="flex items-center gap-2 justify-center">
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" /> Completing...
                                </span>
                            ) : "Complete Sprint"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
