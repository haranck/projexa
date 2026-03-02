import DashboardLayout from "@/components/Layout/DashboardLayout";
import { Search, MoreHorizontal, Check, X } from "lucide-react";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import { useGetAllIssues } from "@/hooks/Issues/IssueHooks";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { useMemo, useState } from "react";
import { filterIssues, type IssueItem } from "@/utils/filterIssues";
import { IssueStatus, IssueType } from "@/services/Issue/IssueService";
import { useCompleteSprint, useGetSprints } from "@/hooks/sprint/SprintHooks";
import type { ISprintEntity } from "@/services/Sprint/sprintService";
import { SprintStatus } from "@/services/Sprint/sprintService";
import type { Project, ProjectMember } from "@/types/project";
import { CompleteSprintModal } from "@/components/modals/CompleteSprintModal";
import { useUpdateEpic } from "@/hooks/Issues/IssueHooks";
import {
    DndContext,
    PointerSensor,
    useSensor,
    useSensors,
    DragOverlay,
    defaultDropAnimationSideEffects,
} from "@dnd-kit/core";
import type { DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import { BoardColumn } from "./components/BoardColumn";
import { BoardCard } from "./components/BoardCard";
import { getErrorMessage } from "@/utils/errorHandler";

export const BoardPage = () => {
    const [selectedAssignee, setSelectedAssignee] = useState<string | null>(null);
    const [selectedIssueType, setSelectedIssueType] = useState<string | null>(null);
    const [selectedEpicId, setSelectedEpicId] = useState<string | null>(null);
    const [selectedSprintId, setSelectedSprintId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
    const [activeIssue, setActiveIssue] = useState<IssueItem | null>(null);
    const queryClient = useQueryClient();
    const { mutate: updateIssue } = useUpdateEpic();

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );

    const { currentProject } = useSelector((state: RootState) => state.project) as { currentProject: Project | null };

    const { data: issueResponse, isLoading: isLoadingIssues, isError: isErrorIssues } = useGetAllIssues({
        projectId: currentProject?._id || '',
    });
    const { data: sprintResponse, isLoading: isLoadingSprints } = useGetSprints(currentProject?._id || '');
    const sprints = (sprintResponse?.data || []) as ISprintEntity[];
    const activeSprint = sprints.find(s => s.status === SprintStatus.ACTIVE);

    const { mutate: executeCompleteSprint, isPending: isCompletingSpring } = useCompleteSprint(currentProject?._id || '');

    const handleCompleteSprintSubmit = (data: { moveIncompleteIssuesToSprintId?: string }) => {
        if (!activeSprint) return;
        executeCompleteSprint(
            { sprintId: activeSprint._id, ...data },
            {
                onSuccess: () => {
                    toast.success(`Sprint "${activeSprint.name}" completed!`);
                    setIsCompleteModalOpen(false);
                },
                onError: () => toast.error("Failed to complete sprint."),
            }
        );
    };

    const allIssues = useMemo(() => {
        const data = (issueResponse?.data || []) as IssueItem[];
        return data;
    }, [issueResponse]);

    const epics = allIssues.filter(i => i.issueType === IssueType.EPIC);

    const filteredIssues = useMemo(() => {
        const result = filterIssues(allIssues, {
            assigneeId: selectedAssignee,
            issueType: selectedIssueType,
            parentIssueId: selectedEpicId,
            sprintId: selectedSprintId,
            searchQuery: searchQuery
        });
        return result;
    }, [allIssues, selectedAssignee, selectedIssueType, selectedEpicId, selectedSprintId, searchQuery]);

    const columns = useMemo(() => {
        const boardIssues = filteredIssues.filter(i => i.issueType !== IssueType.EPIC);
        return [
            {
                title: "TO DO",
                status: IssueStatus.TODO,
                count: boardIssues.filter(i => i.status === IssueStatus.TODO).length,
                borderColor: "border-blue-400",
                issues: boardIssues.filter(i => i.status === IssueStatus.TODO)
            },
            {
                title: "IN PROGRESS",
                status: IssueStatus.IN_PROGRESS,
                count: boardIssues.filter(i => i.status === IssueStatus.IN_PROGRESS).length,
                borderColor: "border-amber-400",
                issues: boardIssues.filter(i => i.status === IssueStatus.IN_PROGRESS)
            },
            {
                title: "DONE",
                status: IssueStatus.DONE,
                count: boardIssues.filter(i => i.status === IssueStatus.DONE).length,
                borderColor: "border-emerald-400",
                issues: boardIssues.filter(i => i.status === IssueStatus.DONE)
            }
        ];
    }, [filteredIssues]);

    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event;
        const issue = allIssues.find(i => i._id === active.id);
        if (issue) {
            setActiveIssue(issue);
        }
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveIssue(null);

        if (!over) return;
        if (active.id === over.id) return;

        const issueId = active.id as string;
        let newStatus: IssueStatus;

        // Check if dropped over a column (status id) or another issue
        if (Object.values(IssueStatus).includes(over.id as IssueStatus)) {
            newStatus = over.id as IssueStatus;
        } else {
            const overIssue = allIssues.find(i => i._id === over.id);
            if (!overIssue) return;
            newStatus = overIssue.status as IssueStatus;
        }

        // Optimistic Update
        const queryKey = ["issues", { projectId: currentProject?._id || '' }];
        const previousIssues = queryClient.getQueryData(queryKey);

        queryClient.setQueryData(queryKey, (old: { data: IssueItem[] } | undefined) => {
            if (!old?.data) return old;
            return {
                ...old,
                data: old.data.map((issue: IssueItem) =>
                    issue._id === issueId ? { ...issue, status: newStatus } : issue
                )
            };
        });

        updateIssue({
            epicId: issueId,
            status: newStatus,
            projectId: currentProject?._id || "",
        }, {
            onError: (err: unknown) => {
                // Rollback
                queryClient.setQueryData(queryKey, previousIssues);
                toast.error(getErrorMessage(err) || "Failed to update status");
                console.error(err);
            },
            onSettled: () => {
                queryClient.invalidateQueries({ queryKey });
            }
        });
    }

    const dropAnimation = {
        sideEffects: defaultDropAnimationSideEffects({
            styles: {
                active: {
                    opacity: '0.5',
                },
            },
        }),
    };

    if (!currentProject) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center min-h-[calc(100vh-80px)] text-zinc-500">
                    <p>No project selected. Please select a project from the sidebar.</p>
                </div>
            </DashboardLayout>
        );
    }

    if (isLoadingIssues || isLoadingSprints) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center min-h-[calc(100vh-80px)] text-zinc-500">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-4" />
                    <p className="ml-3">Loading board...</p>
                </div>
            </DashboardLayout>
        );
    }

    if (isErrorIssues) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center min-h-[calc(100vh-80px)] text-rose-500">
                    <p>Error loading issues. Please try again later.</p>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="flex flex-col min-h-[calc(100vh-80px)] bg-[#0b0e14] text-white p-8">
                {/* Header Section */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold mb-1">Board</h1>
                        <p className="text-zinc-500 text-sm">Manage and track your team&apos;s progress</p>
                    </div>
                    <button
                        onClick={() => setIsCompleteModalOpen(true)}
                        disabled={!activeSprint || isCompletingSpring}
                        className="flex items-center gap-2 bg-[#00d26a] hover:bg-[#00b85c] disabled:opacity-40 disabled:cursor-not-allowed text-black px-4 py-2 rounded-lg font-bold text-sm transition-colors"
                    >
                        <Check className="w-4 h-4" />
                        {activeSprint ? `Complete "${activeSprint.name}"` : "No Active Sprint"}
                    </button>
                </div>

                {/* Filter Bar */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4 flex-1 max-w-2xl">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search issues..."
                                className="w-full bg-[#161b22] border border-zinc-800 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <select
                                value={selectedEpicId || ""}
                                onChange={(e) => setSelectedEpicId(e.target.value || null)}
                                className="bg-[#161b22] border border-zinc-800 rounded-lg py-2 px-3 text-sm text-zinc-300 focus:outline-none"
                            >
                                <option value="">All Epics</option>
                                {epics.map(epic => (
                                    <option key={epic._id} value={epic._id}>{epic.title}</option>
                                ))}
                            </select>

                            <select
                                value={selectedSprintId || ""}
                                onChange={(e) => setSelectedSprintId(e.target.value || null)}
                                className="bg-[#161b22] border border-zinc-800 rounded-lg py-2 px-3 text-sm text-zinc-300 focus:outline-none"
                            >
                                <option value="">All Sprints</option>
                                {sprints.map((sprint: ISprintEntity) => (
                                    <option key={sprint._id} value={sprint._id}>{sprint.name}</option>
                                ))}
                            </select>

                            <select
                                value={selectedIssueType || ""}
                                onChange={(e) => setSelectedIssueType(e.target.value || null)}
                                className="bg-[#161b22] border border-zinc-800 rounded-lg py-2 px-3 text-sm text-zinc-300 focus:outline-none"
                            >
                                <option value="">All Types</option>
                                {Object.values(IssueType).filter(t => t !== IssueType.EPIC).map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>

                            {(selectedEpicId || selectedSprintId || selectedAssignee || searchQuery || selectedIssueType) && (
                                <button
                                    onClick={() => {
                                        setSelectedEpicId(null);
                                        setSelectedSprintId(null);
                                        setSelectedAssignee(null);
                                        setSearchQuery("");
                                        setSelectedIssueType(null);
                                    }}
                                    className="p-2 hover:bg-zinc-800 rounded-lg text-rose-400"
                                    title="Reset Filters"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex -space-x-2">
                            {currentProject?.members?.map((member: ProjectMember) => (
                                <div
                                    key={member.userId}
                                    onClick={() => setSelectedAssignee(selectedAssignee === member.userId ? null : member.userId)}
                                    className={`w-8 h-8 rounded-full border-2 cursor-pointer transition-all overflow-hidden ${selectedAssignee === member.userId ? 'border-blue-500 scale-110 z-10 grayscale-0' : 'border-[#0b0e14] grayscale hover:grayscale-0'}`}
                                    title={member.user?.userName}
                                >
                                    {member.user?.profilePicture ? (
                                        <img src={member.user.profilePicture} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full bg-zinc-800 flex items-center justify-center text-[10px] text-zinc-400 font-bold">
                                            {member.user?.userName?.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                        <button className="p-2 hover:bg-zinc-800 rounded-lg transition-colors">
                            <MoreHorizontal className="w-5 h-5 text-zinc-500" />
                        </button>
                    </div>
                </div>

                {/* Board Columns */}
                <DndContext
                    sensors={sensors}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                >
                    <div className="flex gap-6 flex-1 min-h-[500px] overflow-x-auto pb-4">
                        {columns.map((column) => (
                            <BoardColumn
                                key={column.title}
                                title={column.title}
                                status={column.status}
                                count={column.count}
                                borderColor={column.borderColor}
                                issues={column.issues}
                                allIssues={allIssues}
                                currentProject={currentProject}
                            />
                        ))}
                    </div>

                    <DragOverlay dropAnimation={dropAnimation}>
                        {activeIssue ? (
                            <BoardCard
                                issue={activeIssue}
                                allIssues={allIssues}
                                currentProject={currentProject}
                            />
                        ) : null}
                    </DragOverlay>
                </DndContext>
            </div>

            {activeSprint && (
                <CompleteSprintModal
                    isOpen={isCompleteModalOpen}
                    onClose={() => setIsCompleteModalOpen(false)}
                    onSubmit={handleCompleteSprintSubmit}
                    isLoading={isCompletingSpring}
                    sprint={activeSprint}
                    issues={allIssues.filter(i => i.sprintId === activeSprint._id) as unknown as Parameters<typeof CompleteSprintModal>[0]["issues"]}
                    plannedSprints={sprints.filter(s => s.status === SprintStatus.PLANNED)}
                />
            )}
        </DashboardLayout>
    );
};


