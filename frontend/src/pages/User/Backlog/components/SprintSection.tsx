import { ChevronDown, ChevronRight, Plus, MoreHorizontal } from "lucide-react";

interface SprintSectionProps {
    isOpen: boolean;
    onToggle: () => void;
    onCreateIssueClick: () => void;
}

export const SprintSection = ({
    isOpen,
    onToggle,
    onCreateIssueClick,
}: SprintSectionProps) => {
    return (
        <div className="bg-[#14171f] rounded-[2rem] border border-white/5 overflow-hidden">
            <div
                className="flex items-center justify-between px-6 py-4 bg-white/2 cursor-pointer hover:bg-white/4 transition-colors"
                onClick={onToggle}
            >
                <div className="flex items-center gap-3">
                    <button className="p-1 hover:bg-white/10 rounded transition-colors text-zinc-500">
                        {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </button>
                    <span className="font-bold text-sm tracking-tight uppercase">ECA Sprint 1</span>
                    <div className="flex items-center gap-2 px-2 py-0.5 rounded bg-blue-500/10 text-blue-400">
                        <Plus className="w-3 h-3" />
                        <span className="text-[10px] font-bold">Add dates</span>
                    </div>
                    <span className="text-xs font-medium text-zinc-600">(0 issues)</span>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5">
                        <div className="w-4 h-1.5 bg-zinc-800 rounded-full" />
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                    </div>
                    <button
                        className="px-4 py-1.5 text-[10px] font-bold bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg transition-colors border border-white/5 active:scale-95"
                        onClick={(e) => e.stopPropagation()}
                    >
                        Start sprint
                    </button>
                    <button className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-zinc-500">
                        <MoreHorizontal className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {isOpen && (
                <div className="p-6 bg-[#0e1117]/50 min-h-[160px] flex flex-col items-center justify-center border-y border-white/5 border-dashed mx-6 my-2 rounded-2xl">
                    <div className="text-center">
                        <h3 className="text-sm font-bold text-white mb-2">Plan your sprint</h3>
                        <p className="text-xs text-zinc-500 max-w-xs mx-auto leading-relaxed">
                            Drag issues from the Backlog section, or create new issues, to plan the work for this sprint.
                        </p>
                    </div>
                </div>
            )}
            <div className="p-4 px-6">
                <button
                    onClick={onCreateIssueClick}
                    className="flex items-center gap-2 text-[10px] font-bold text-zinc-500 hover:text-white transition-colors group"
                >
                    <div className="p-1 rounded bg-zinc-800 group-hover:bg-blue-600 transition-colors">
                        <Plus className="w-3 h-3 text-white" />
                    </div>
                    Create issue
                </button>
            </div>
        </div>
    );
};
