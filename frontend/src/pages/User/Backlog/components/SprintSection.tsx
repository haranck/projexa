import { useState } from "react";
import { ChevronDown, ChevronRight, Plus, MoreHorizontal } from "lucide-react";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import type { ISprintEntity } from "@/services/Sprint/sprintService";
import type { IssueItem } from "../BacklogPage";
import type { ProjectMember } from "@/types/project";
import { DraggableIssueItem } from "./DraggableIssueItem";
import { StartSprintModal } from "../../../../components/modals/StartSprintModal";
import { CompleteSprintModal } from "../../../../components/modals/CompleteSprintModal";
import { useStartSprint, useCompleteSprint } from "@/hooks/sprint/SprintHooks";
import { SprintStatus } from "@/services/Sprint/sprintService";
import { toast } from "react-hot-toast";
import { getErrorMessage } from "@/utils/errorHandler";

interface SprintSectionProps {
    sprint: ISprintEntity;
    isOpen: boolean;
    onToggle: () => void;
    onCreateIssueClick: () => void;
    issues: IssueItem[];
    projectMembers: ProjectMember[];
    taskDotColors: string[];
    onIssueClick: (id: string) => void;
    onUpdateStatus: (issueId: string, status: string) => void;
    allIssues: IssueItem[];
    allSprints: ISprintEntity[];
    activeStatusDropdownId: string | null;
    onActiveStatusDropdownChange: (id: string | null) => void;
}

export const SprintSection = ({
    sprint,
    isOpen,
    onToggle,
    onCreateIssueClick,
    issues,
    projectMembers,
    taskDotColors,
    onIssueClick,
    onUpdateStatus,
    allIssues,
    allSprints,
    activeStatusDropdownId,
    onActiveStatusDropdownChange
}: SprintSectionProps) => {
    const { setNodeRef, isOver } = useDroppable({
        id: sprint._id as string,
    });

    const [isStartModalOpen, setIsStartModalOpen] = useState(false);
    const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);

    const { mutate: startSprintMutation, isPending: isStarting } = useStartSprint(sprint.projectId);
    const { mutate: completeSprintMutation, isPending: isCompleting } = useCompleteSprint(sprint.projectId);

    const handleStartSprintSubmit = (data: { startDate: string; endDate: string; goal?: string }) => {
        startSprintMutation({
            sprintId: sprint._id as string,
            ...data
        }, {
            onSuccess: () => {
                toast.success("Sprint started successfully");
                setIsStartModalOpen(false);
            },
            onError: (err) => {
                toast.error(getErrorMessage(err) || "Failed to start sprint");
                console.error(err);
            }
        });
    };

    const handleCompleteSprintSubmit = (data: { moveIncompleteIssuesToSprintId?: string }) => {
        completeSprintMutation({
            sprintId: sprint._id as string,
            ...data
        }, {
            onSuccess: () => {
                toast.success("Sprint completed successfully");
                setIsCompleteModalOpen(false);
            },
            onError: (err) => {
                toast.error(getErrorMessage(err) || "Failed to complete sprint");
                console.error(err);
            }
        });
    };

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
                    <span className="font-bold text-sm tracking-tight uppercase text-zinc-200">{sprint.name}</span>
                    {sprint.status === SprintStatus.COMPLETED && (
                        <div className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold tracking-wider">
                            COMPLETED
                        </div>
                    )}
                    <span className="text-xs font-semibold text-zinc-600 ml-1">({issues.length} issues)</span>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5">
                        <div className="w-4 h-1.5 bg-zinc-800 rounded-full" />
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                    </div>
                    {sprint.status === SprintStatus.PLANNED && (
                        <button
                            className="px-4 py-2 text-[10px] font-bold bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl transition-all border border-white/5 active:scale-95 shadow-sm"
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsStartModalOpen(true);
                            }}
                        >
                            Start sprint
                        </button>
                    )}
                    {sprint.status === SprintStatus.ACTIVE && (
                        <button
                            className="px-4 py-2 text-[10px] font-bold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-xl transition-all border border-emerald-500/20 active:scale-95 shadow-sm"
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsCompleteModalOpen(true);
                            }}
                        >
                            Complete sprint
                        </button>
                    )}
                    <button className="p-2 hover:bg-white/10 rounded-xl transition-colors text-zinc-500">
                        <MoreHorizontal className="w-4 h-4" />
                    </button>
                </div>
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
                                        <h3 className="text-sm font-bold text-zinc-400 mb-2">Plan your sprint</h3>
                                        <p className="text-[11px] text-zinc-600 max-w-[240px] mx-auto leading-relaxed">
                                            Drag issues here from the backlog or another sprint to plan the work.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </SortableContext>
                    </div>
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

            <StartSprintModal
                isOpen={isStartModalOpen}
                onClose={() => setIsStartModalOpen(false)}
                onSubmit={handleStartSprintSubmit}
                isLoading={isStarting}
                sprintName={sprint.name}
            />

            <CompleteSprintModal
                isOpen={isCompleteModalOpen}
                onClose={() => setIsCompleteModalOpen(false)}
                onSubmit={handleCompleteSprintSubmit}
                isLoading={isCompleting}
                sprint={sprint}
                issues={issues}
                plannedSprints={allSprints.filter(s => s.status === SprintStatus.PLANNED)}
            />
        </div>
    );
};

