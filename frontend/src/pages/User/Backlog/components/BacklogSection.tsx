import { useDroppable } from "@dnd-kit/core";
import { ChevronDown, ChevronRight, Plus } from "lucide-react";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import type { IssueItem } from "../BacklogPage";
import type { ProjectMember } from "@/types/project";
import { DraggableIssueItem } from "./DraggableIssueItem";

interface BacklogSectionProps {
    isOpen: boolean;
    onToggle: () => void;
    onCreateIssueClick: () => void;
    onCreateSprintClick: () => void;
    issues: IssueItem[];
    projectMembers: ProjectMember[];
    taskDotColors: string[];
    onIssueClick: (id: string) => void;
    onUpdateStatus: (issueId: string, status: string) => void;
    allIssues: IssueItem[];
    activeStatusDropdownId: string | null;
    onActiveStatusDropdownChange: (id: string | null) => void;
}

export const BacklogSection = ({
    isOpen,
    onToggle,
    onCreateIssueClick,
    onCreateSprintClick,
    issues,
    projectMembers,
    taskDotColors,
    onIssueClick,
    onUpdateStatus,
    allIssues,
    activeStatusDropdownId,
    onActiveStatusDropdownChange
}: BacklogSectionProps) => {
    const { setNodeRef, isOver } = useDroppable({
        id: 'backlog',
    });

    return (
        <div
            ref={setNodeRef}
            className={`
                bg-[#14171f] rounded-[1.5rem] border transition-all duration-300
                ${isOver ? 'border-blue-500/50 bg-blue-500/5 shadow-2xl scale-[1.01]' : 'border-white/5'}
            `}
        >
            <div
                className="flex items-center justify-between px-4 sm:px-6 py-4 bg-white/2 cursor-pointer hover:bg-white/4 transition-colors rounded-t-[1.5rem]"
                onClick={onToggle}
            >
                <div className="flex items-center gap-2 sm:gap-3">
                    <button className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-zinc-500">
                        {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </button>
                    <span className="font-bold text-xs sm:text-sm tracking-tight uppercase text-zinc-200">Backlog</span>
                    <span className="text-[10px] sm:text-xs font-semibold text-zinc-600 ml-1">({issues.length} issues)</span>
                </div>
                
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onCreateSprintClick();
                    }}
                    className="px-3 sm:px-4 py-1.5 sm:py-2 text-[10px] sm:text-[11px] font-bold bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl transition-all border border-white/5 active:scale-95 shadow-sm"
                >
                    Create sprint
                </button>
            </div>

            {isOpen && (
                <div className="transition-all duration-300">
                    <div className="px-2 pb-2">
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
                                            allIssues={allIssues}
                                            projectMembers={projectMembers}
                                            taskDotColors={taskDotColors}
                                            onIssueClick={onIssueClick}
                                            onUpdateStatus={onUpdateStatus}
                                            activeStatusDropdownId={activeStatusDropdownId}
                                            onActiveStatusDropdownChange={onActiveStatusDropdownChange}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="p-8 bg-[#0e1117]/30 min-h-[140px] flex flex-col items-center justify-center border-2 border-white/5 border-dashed m-2 rounded-2xl transition-colors hover:bg-[#0e1117]/50">
                                    <div className="text-center">
                                        <h3 className="text-sm font-bold text-zinc-400 mb-2">Backlog is empty</h3>
                                        <p className="text-[11px] text-zinc-600 max-w-[240px] mx-auto leading-relaxed">
                                            Start by creating issues to plan your project progress.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </SortableContext>
                    </div>
                </div>
            )}
            
            <div className="p-3 sm:p-4 px-6 sm:px-8 border-t border-white/5">
                <button
                    onClick={onCreateIssueClick}
                    className="flex items-center gap-2.5 text-[10px] sm:text-[11px] font-bold text-zinc-500 hover:text-white transition-all group w-full sm:w-auto"
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
