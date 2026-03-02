import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Info } from "lucide-react";
import { BoardCard } from "./BoardCard";
import type { IssueItem } from "@/utils/filterIssues";
import type { Project } from "@/types/project";
import type { IssueStatus } from "@/services/Issue/IssueService";

interface BoardColumnProps {
    title: string;
    status: IssueStatus;
    count: number;
    borderColor: string;
    issues: IssueItem[];
    allIssues: IssueItem[];
    currentProject: Project | null;
}

export const BoardColumn = ({
    title,
    status,
    count,
    borderColor,
    issues,
    allIssues,
    currentProject
}: BoardColumnProps) => {
    const { setNodeRef, isOver } = useDroppable({
        id: status,
    });

    return (
        <div
            ref={setNodeRef}
            className={`flex-1 min-w-[320px] flex flex-col bg-[#161b22]/30 rounded-2xl border transition-colors ${isOver ? 'border-blue-500 bg-blue-500/5' : 'border-zinc-800/50'}`}
        >
            {/* Column Header */}
            <div className="p-4 border-b border-zinc-800/50">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-zinc-400 tracking-wider">{title}</span>
                        <span className="px-2 py-0.5 bg-zinc-800 rounded text-[10px] font-bold text-zinc-500">{count}</span>
                    </div>
                </div>
                <div className={`h-1 w-full rounded-full ${borderColor.replace("border-", "bg-")}`} />
            </div>

            {/* Column Content */}
            <div className="p-4 flex flex-col gap-4 overflow-y-auto no-scrollbar flex-1">
                <SortableContext items={issues.map(i => i._id)} strategy={verticalListSortingStrategy}>
                    {issues.length > 0 ? (
                        issues.map((issue) => (
                            <BoardCard
                                key={issue._id}
                                issue={issue}
                                allIssues={allIssues}
                                currentProject={currentProject}
                            />
                        ))
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center py-20 text-center opacity-50">
                            <div className="w-12 h-12 rounded-xl border-2 border-dashed border-zinc-700 flex items-center justify-center mb-4">
                                <Info className="w-6 h-6 text-zinc-700" />
                            </div>
                            <p className="text-sm font-medium text-zinc-400">No issues</p>
                            <p className="text-[10px] text-zinc-500">Drag issues here</p>
                        </div>
                    )}
                </SortableContext>
            </div>
        </div>
    );
};
