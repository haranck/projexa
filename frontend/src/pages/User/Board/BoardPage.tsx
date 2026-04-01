import DashboardLayout from "@/components/Layout/DashboardLayout";
import { Search, MoreHorizontal, Check, X, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import { useGetAllIssues } from "@/hooks/Issues/IssueHooks";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { useMemo, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FRONTEND_ROUTES } from "@/constants/frontendRoutes";
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
    TouchSensor,
    useSensor,
    useSensors,
    DragOverlay,
    defaultDropAnimationSideEffects,
} from "@dnd-kit/core";
import type { DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import { BoardColumn } from "./components/BoardColumn";
import { BoardCard } from "./components/BoardCard";
import { getErrorMessage } from "@/utils/errorHandler";
import { IssueDetailDrawer, type IssueData } from "@/components/Issue/IssueDetailDrawer";

export const BoardPage = () => {
    const [selectedAssignee, setSelectedAssignee] = useState<string | null>(null);
    const [selectedIssueType, setSelectedIssueType] = useState<string | null>(null);
    const [selectedEpicId, setSelectedEpicId] = useState<string | null>(null);
    const [selectedSprintId, setSelectedSprintId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
    const [activeIssue, setActiveIssue] = useState<IssueItem | null>(null);
    const [isIssueDrawerOpen, setIsIssueDrawerOpen] = useState(false);
    const [selectedDrawerIssueId, setSelectedDrawerIssueId] = useState<string | null>(null);
    const queryClient = useQueryClient();
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const state = location.state as { selectedIssueId?: string };
        if (state?.selectedIssueId) {
            setSelectedDrawerIssueId(state.selectedIssueId);
            setIsIssueDrawerOpen(true);
            window.history.replaceState({}, document.title);
        }
    }, [location]);
    const { mutate: updateIssue } = useUpdateEpic();

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(TouchSensor, {
            activationConstraint: {
                delay: 250,
                tolerance: 5,
            },
        })
    );

    const { currentProject } = useSelector((state: RootState) => state.project) as { currentProject: Project | null };

    const { data: issueResponse, isLoading: isLoadingIssues, isError: isErrorIssues } = useGetAllIssues({
        projectId: currentProject?._id || '',
    });
    const { data: sprintResponse, isLoading: isLoadingSprints } = useGetSprints(currentProject?._id || '');
    const sprints = (sprintResponse?.data || []) as ISprintEntity[];
    
    const activeSprints = useMemo(() => sprints.filter(s => s.status === SprintStatus.ACTIVE), [sprints]);
    const activeSprint = activeSprints[0];
    const hasActiveSprints = activeSprints.length > 0;

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
        const effectiveSprintId = selectedSprintId !== null ? selectedSprintId : activeSprints.map(s => s._id);
        const result = filterIssues(allIssues, {
            assigneeId: selectedAssignee,
            issueType: selectedIssueType,
            parentIssueId: selectedEpicId,
            sprintId: effectiveSprintId,
            searchQuery: searchQuery
        });
        return result;
    }, [allIssues, selectedAssignee, selectedIssueType, selectedEpicId, selectedSprintId, searchQuery, activeSprints]);

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
            },
            {
                title: "HOLD",
                status: IssueStatus.HOLD,
                count: boardIssues.filter(i => i.status === IssueStatus.HOLD).length,
                borderColor: "border-orange-400",
                issues: boardIssues.filter(i => i.status === IssueStatus.HOLD)
            }
        ];
    }, [filteredIssues]);

    const getChildTasks = (parentId: string) => {
        return allIssues.filter(i => i.parentIssueId === parentId);
    };

    const checkSubtasksDone = (parentId: string) => {
        const subtasks = getChildTasks(parentId);
        if (subtasks.length === 0) return true;
        return subtasks.every(s => s.status?.toUpperCase() === "DONE");
    };

    const handleIssueClick = (id: string) => {
        setSelectedDrawerIssueId(id);
        setIsIssueDrawerOpen(true);
    };

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

        if (Object.values(IssueStatus).includes(over.id as IssueStatus)) {
            newStatus = over.id as IssueStatus;
        } else {
            const overIssue = allIssues.find(i => i._id === over.id);
            if (!overIssue) return;
            newStatus = overIssue.status as IssueStatus;
        }

        if (newStatus === IssueStatus.DONE) {
            if (!checkSubtasksDone(issueId)) {
                toast.error("Finish all subtasks before moving to done", {
                    icon: <AlertCircle className="w-4 h-4 text-rose-500" />,
                    style: {
                        background: '#1a1c22',
                        color: '#fff',
                        border: '1px solid rgba(255,255,255,0.05)',
                        fontSize: '11px',
                        fontWeight: 'bold',
                    }
                });
                return;
            }
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
                {!hasActiveSprints && selectedSprintId === null ? (
                    <div className="flex flex-col items-center justify-center flex-1 w-full border border-white/5 rounded-[2.5rem] bg-linear-to-b from-[#14171f] to-[#0b0e14] mt-4 lg:mt-8 mb-8 relative overflow-hidden shadow-2xl shadow-black/50" style={{ minHeight: '60vh' }}>
                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-blue-900/10 via-[#0b0e14]/0 to-[#0b0e14]/0 pointer-events-none" />
                        <div className="w-20 h-20 lg:w-24 lg:h-24 bg-linear-to-br from-zinc-800 to-zinc-900 rounded-[2rem] flex items-center justify-center mb-6 border border-white/5 shadow-inner relative z-10">
                            <AlertCircle className="w-10 h-10 lg:w-12 lg:h-12 text-zinc-600" />
                        </div>
                        <h2 className="text-2xl lg:text-3xl font-black text-white mb-3 tracking-tight relative z-10">No Active Sprint</h2>
                        <p className="text-zinc-500 text-sm max-w-sm text-center mb-8 px-6 leading-relaxed relative z-10">
                            Start a sprint in the Backlog to view and manage your team&apos;s tasks on this board.
                        </p>
                        <button 
                            onClick={() => navigate(FRONTEND_ROUTES.BACKLOG)}
                            className="bg-zinc-100 hover:bg-white text-zinc-900 px-8 py-3 rounded-2xl font-bold transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.1)] relative z-10"
                        >
                            Go to Backlog
                        </button>
                    </div>
                ) : (
                    <DndContext
                        sensors={sensors}
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                    >
                        <div className="flex gap-4 lg:gap-6 flex-1 min-h-[500px] overflow-x-auto pb-4 custom-scrollbar">
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
                                    onIssueClick={handleIssueClick}
                                />
                            ))}
                        </div>

                        <DragOverlay dropAnimation={dropAnimation}>
                            {activeIssue ? (
                                <BoardCard
                                    issue={activeIssue}
                                    allIssues={allIssues}
                                    currentProject={currentProject}
                                    onIssueClick={handleIssueClick}
                                />
                            ) : null}
                        </DragOverlay>
                    </DndContext>
                )}
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

            <IssueDetailDrawer
                isOpen={isIssueDrawerOpen}
                onClose={() => setIsIssueDrawerOpen(false)}
                issue={allIssues.find(i => i._id === selectedDrawerIssueId) as unknown as IssueData || null}
                childTasks={selectedDrawerIssueId ? getChildTasks(selectedDrawerIssueId) : []}
                projectName={currentProject.projectName || ""}
                projectId={currentProject._id || ""}
                workspaceId={currentProject.workspaceId || ""}
                members={currentProject.members || []}
                projectKey={currentProject.key || ""}
                onSubtaskClick={(id) => setSelectedDrawerIssueId(id)}
            />
        </DashboardLayout>
    );
};


