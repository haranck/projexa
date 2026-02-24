import { X, Loader2, ChevronDown, Plus } from "lucide-react";
import type { IssueItem } from "../BacklogPage";

interface EpicSidebarProps {
    isOpen: boolean;
    onClose: () => void;
    isLoading: boolean;
    epics: IssueItem[];
    getChildTasks: (parentId: string) => IssueItem[];
    getCompletedCount: (tasks: IssueItem[]) => number;
    expandedEpicId: string | null;
    setExpandedEpicId: (id: string | null) => void;
    onIssueClick: (id: string) => void;
    onCreateEpicClick: () => void;
    isCreating: boolean;
    taskDotColors: string[];
}

export const EpicSidebar = ({
    isOpen,
    onClose,
    isLoading,
    epics,
    getChildTasks,
    getCompletedCount,
    expandedEpicId,
    setExpandedEpicId,
    onIssueClick,
    onCreateEpicClick,
    isCreating,
    taskDotColors,
}: EpicSidebarProps) => {
    if (!isOpen) return null;

    return (
        <div className="w-80 shrink-0 animate-in slide-in-from-left duration-300">
            <div className="bg-[#14171f] rounded-[2rem] border border-white/10 overflow-hidden flex flex-col h-[calc(100vh-14rem)] sticky top-6 shadow-2xl">
                <div className="px-6 py-5 border-b border-white/5 flex items-center justify-between">
                    <div className="relative group/epic-title">
                        <h3 className="font-bold text-sm tracking-tight text-white mb-1 px-1">Epic</h3>
                        <div className="absolute -bottom-5 left-1 w-8 h-[2px] bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)] rounded-full" />
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-lg hover:bg-white/5 text-zinc-600 hover:text-white transition-all"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center h-32 gap-2">
                            <Loader2 className="w-5 h-5 text-zinc-600 animate-spin" />
                            <p className="text-xs text-zinc-600">Loading epics...</p>
                        </div>
                    ) : epics.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-32 gap-2 text-center">
                            <p className="text-xs font-bold text-zinc-600">No epics yet</p>
                            <p className="text-[10px] text-zinc-700">Create your first epic below</p>
                        </div>
                    ) : (
                        epics.map((epic) => {
                            const epicTasks = getChildTasks(epic._id);
                            const completedCount = getCompletedCount(epicTasks);
                            const totalCount = epicTasks.length;
                            const isExpanded = expandedEpicId === epic._id;

                            return (
                                <div key={epic._id}>
                                    <div
                                        className={`rounded-2xl border transition-all cursor-pointer ${isExpanded
                                            ? 'bg-[#1a1d26] border-white/10 shadow-lg'
                                            : 'bg-white/2 border-white/5 hover:border-white/10'
                                            }`}
                                        onClick={() => setExpandedEpicId(isExpanded ? null : epic._id)}
                                    >
                                        {/* Epic Header */}
                                        <div className="flex items-center justify-between px-5 py-4">
                                            <div className="flex flex-col gap-1 min-w-0 flex-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">{epic.issueType}</span>
                                                    <span className="text-[10px] font-semibold text-zinc-600 bg-white/4 px-1.5 py-0.5 rounded">
                                                        {epic.key}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2.5">
                                                    <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${epic.color}`} />
                                                    <span className="text-[13px] font-bold text-white tracking-tight truncate">{epic.title}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2.5 shrink-0">
                                                <span className="text-[10px] font-bold text-zinc-500 bg-zinc-800/80 px-2 py-0.5 rounded-full">
                                                    {completedCount}/{totalCount}
                                                </span>
                                                <ChevronDown className={`w-3.5 h-3.5 text-zinc-600 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                                            </div>
                                        </div>

                                        {/* Expanded Content */}
                                        {isExpanded && (
                                            <div className="animate-in fade-in slide-in-from-top-1 duration-200">
                                                {/* Dates Section */}
                                                <div className="px-5 space-y-2.5 pb-4">
                                                    <span className="text-[15px] font-semibold text-zinc-600 mt-2">{epic.key}</span>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-[11px] text-zinc-600">Start Date</span>
                                                        <span className="text-[11px] font-semibold text-zinc-300">
                                                            {epic.startDate
                                                                ? new Date(epic.startDate as string).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                                                                : 'Not set'}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-[11px] text-zinc-600">End Date</span>
                                                        <span className="text-[11px] font-semibold text-zinc-300">
                                                            {epic.endDate
                                                                ? new Date(epic.endDate as string).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                                                                : 'Not set'}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* View All Details Button */}
                                                <div className="px-5 pb-4">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            onIssueClick(epic._id);
                                                        }}
                                                        className="w-full py-2 rounded-xl border border-blue-500/30 text-blue-400 text-[11px] font-semibold hover:bg-blue-500/5 transition-all"
                                                    >
                                                        View all details
                                                    </button>
                                                </div>

                                                {/* Tasks Section */}
                                                <div className="border-t border-white/5">
                                                    <div className="px-5 pt-3.5 pb-1">
                                                        <span className="text-[10px] font-semibold text-zinc-600 uppercase tracking-wider">Tasks</span>
                                                    </div>
                                                    <div className="px-3 pb-3 space-y-0.5">
                                                        {epicTasks.length === 0 ? (
                                                            <p className="text-[11px] text-zinc-700 px-2 py-2">No tasks yet</p>
                                                        ) : (
                                                            epicTasks.map((task, ti) => (
                                                                <div
                                                                    key={task._id}
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        onIssueClick(task._id);
                                                                    }}
                                                                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/3 transition-colors cursor-pointer group"
                                                                >
                                                                    <div className={`w-2 h-2 rounded-full shrink-0 ${taskDotColors[ti % taskDotColors.length]}`} />
                                                                    <span className="text-[12px] text-zinc-300 truncate flex-1">{task.title}</span>
                                                                    <span className="text-[10px] font-semibold text-zinc-500 bg-white/5 px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                                                        {task.key}
                                                                    </span>
                                                                </div>
                                                            ))
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                <div className="p-6 border-t border-white/5 bg-zinc-900/10">
                    <button
                        onClick={onCreateEpicClick}
                        disabled={isCreating}
                        className="w-full py-3.5 rounded-2xl bg-transparent border border-blue-500/30 text-blue-400 text-xs font-black hover:bg-blue-500/5 transition-all active:scale-95 flex items-center justify-center gap-2 shadow-lg shadow-blue-500/5 disabled:opacity-50"
                    >
                        <Plus className="w-4 h-4" />
                        Create epic
                    </button>
                </div>
            </div>
        </div>
    );
};
