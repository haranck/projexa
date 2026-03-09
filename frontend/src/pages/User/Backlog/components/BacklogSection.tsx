import { ChevronDown, ChevronRight, MoreHorizontal, Plus } from "lucide-react";
import type { IssueItem } from "../BacklogPage";
import type { ProjectMember } from "@/types/project";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { DraggableIssueItem } from "./DraggableIssueItem";

interface BacklogSectionProps {
    isOpen: boolean;
    onToggle: () => void;
    issues: IssueItem[];
    allIssues: IssueItem[];
    onIssueClick: (id: string) => void;
    onCreateSprintClick: () => void;
    onCreateIssueClick: () => void;
    projectMembers: ProjectMember[];
    taskDotColors: string[];
    onUpdateStatus: (issueId: string, status: string) => void;
    activeStatusDropdownId: string | null;
    onActiveStatusDropdownChange: (id: string | null) => void;
}

export const BacklogSection = ({
    isOpen,
    onToggle,
    issues,
    onIssueClick,
    onCreateSprintClick,
    onCreateIssueClick,
    projectMembers,
    taskDotColors,
    allIssues,
    onUpdateStatus,
    activeStatusDropdownId,
    onActiveStatusDropdownChange
}: BacklogSectionProps) => {

    const { setNodeRef, isOver } = useDroppable({
        id: 'backlog',
    });

    return (
        <div
            ref={setNodeRef}
            className={`bg-[#14171f] rounded-[1.5rem] border transition-all duration-300 ${isOver ? 'border-blue-500/50 bg-blue-500/5 shadow-2xl shadow-blue-500/10 scale-[1.01]' : 'border-white/5'}`}
        >
            <div
                className="flex items-center justify-between px-6 py-4 bg-white/2 cursor-pointer hover:bg-white/4 transition-colors"
                onClick={onToggle}
            >
                <div className="flex items-center gap-3">
                    <button className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-zinc-500">
                        {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </button>
                    <span className="font-bold text-sm tracking-tight text-zinc-200">Backlog</span>
                    <span className="text-xs font-semibold text-zinc-600 ml-1">({issues.length} issues)</span>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5">
                        <div className="w-4 h-1.5 bg-zinc-800 rounded-full" />
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                    </div>
                    <button
                        className="px-4 py-2 text-[10px] font-bold bg-emerald-500 hover:bg-emerald-400 text-white rounded-xl transition-all shadow-lg shadow-emerald-500/20 active:scale-95 border border-emerald-400/20"
                        onClick={(e) => {
                            e.stopPropagation();
                            onCreateSprintClick();
                        }}
                    >
                        Create Sprint
                    </button>
                    <button className="p-2 hover:bg-white/10 rounded-xl transition-colors text-zinc-500">
                        <MoreHorizontal className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {isOpen && (
                <div className="transition-all duration-300 px-2 pb-2">
                    <SortableContext
                        items={issues.map(i => i._id)}
                        strategy={verticalListSortingStrategy}
                    >
                        {issues.length > 0 ? (
                            <div className="space-y-1">
                                {issues.map((issue, idx) => (
                                    <DraggableIssueItem
                                        key={issue._id}
                                        issue={issue}
                                        idx={idx}
                                        projectMembers={projectMembers}
                                        taskDotColors={taskDotColors}
                                        onIssueClick={onIssueClick}
                                        onUpdateStatus={onUpdateStatus}
                                        allIssues={allIssues}
                                        activeStatusDropdownId={activeStatusDropdownId}
                                        onActiveStatusDropdownChange={onActiveStatusDropdownChange}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="p-8 bg-[#0e1117]/30 flex flex-col items-center justify-center border-2 border-white/5 border-dashed m-2 rounded-2xl transition-colors hover:bg-[#0e1117]/50">
                                <p className="text-[11px] font-bold text-zinc-600">
                                    Backlog is empty. Drag issues here or create new ones.
                                </p>
                            </div>
                        )}
                    </SortableContext>
                </div>
            )}
            <div className="p-4 px-8 border-t border-white/5">
                <button
                    onClick={onCreateIssueClick}
                    className="flex items-center gap-2.5 text-[10px] font-bold text-zinc-500 hover:text-white transition-all group"
                >
                    <div className="p-1.5 rounded-lg bg-zinc-800 group-hover:bg-blue-600 transition-all shadow-sm">
                        <Plus className="w-3 h-3 text-white" />
                    </div>
                    Create issue
                </button>
            </div>
        </div>
    );
};

