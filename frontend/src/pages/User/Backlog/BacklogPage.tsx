import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import DashboardLayout from "@/components/Layout/DashboardLayout";
import { Plus, SlidersHorizontal } from "lucide-react";
import { AddMemberDropdown } from "@/components/Project/AddMemberDropdown";
import { CreateEpicModal } from "@/components/Issue/CreateEpicModal";
import { CreateIssueModal } from "@/components/Issue/CreateIssueModal";
import type { EpicFormData } from "@/components/Issue/CreateEpicModal";
import { IssueDetailDrawer } from "@/components/Issue/IssueDetailDrawer";
import type { RootState } from "@/store/store";
import { useSelector, useDispatch } from 'react-redux';
import { useGetWorkspaceMembers, useGetRoles } from '../../../hooks/Workspace/WorkspaceHooks';
import { useAddProjectMember } from '../../../hooks/Project/ProjectHooks';
import { toast } from 'react-hot-toast';
import { getErrorMessage } from '@/utils/errorHandler';
import type { User } from '../../../types/user';
import { setCurrentProject, setProjects } from "@/store/slice/projectSlice";
import type { ProjectMember } from "@/types/project";
import { useCreateIssue, useGetAllIssues, useUpdateEpic } from "@/hooks/Issues/IssueHooks";
import { IssueType, type GetAllIssuesFilterProps } from "@/services/Issue/IssueService";
import type { CreateIssueProps } from "@/services/Issue/IssueService";
import { Filter, X, Calendar, Hash } from "lucide-react";

import { EpicSidebar } from "./components/EpicSidebar";
import { SprintSection } from "./components/SprintSection";
import { BacklogSection } from "./components/BacklogSection";
import { DraggableIssueItem } from "./components/DraggableIssueItem";
import { useMoveIssueToSprint, useGetSprints, useCreateSprint } from "@/hooks/sprint/SprintHooks";
import {
    DndContext,
    type DragEndEvent,
    type DragStartEvent,
    PointerSensor,
    KeyboardSensor,
    useSensor,
    useSensors,
    pointerWithin,
    DragOverlay,
    defaultDropAnimationSideEffects,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import type { ISprintEntity } from "@/services/Sprint/sprintService";

interface Role {
    _id: string;
    name: string;
}

export interface IssueItem {
    _id: string;
    key: string;
    title: string;
    description?: string;
    startDate?: string | Date | null;
    endDate?: string | Date | null;
    attachments?: Array<{ type: "file" | "link"; url: string; fileName?: string }>;
    issueType: string;
    color: string;
    parentIssueId?: string | null;
    sprintId?: string | null;
    status?: string;
    assigneeId?: string | null;
}

export const BacklogPage = () => {
    const [expandedSprints, setExpandedSprints] = useState<Record<string, boolean>>({});
    const [isBacklogOpen, setIsBacklogOpen] = useState(true);
    const [expandedEpic, setExpandedEpic] = useState<string | null>(null);
    const [isEpicSidebarOpen, setIsEpicSidebarOpen] = useState(() => window.innerWidth >= 768);
    const [isMemberDropdownOpen, setIsMemberDropdownOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [preparingMember, setPreparingMember] = useState<User | null>(null);
    const [preparingRoleId, setPreparingRoleId] = useState<string>('');
    const [isCreateEpicModalOpen, setIsCreateEpicModalOpen] = useState(false);
    const [isCreateIssueModalOpen, setIsCreateIssueModalOpen] = useState(false);
    const [isIssueDrawerOpen, setIsIssueDrawerOpen] = useState(false);
    const [selectedDrawerIssueId, setSelectedDrawerIssueId] = useState<string | null>(null);
    const [activeIssue, setActiveIssue] = useState<IssueItem | null>(null);
    const [activeStatusDropdownId, setActiveStatusDropdownId] = useState<string | null>(null);
    const [showCompletedSprints, setShowCompletedSprints] = useState(false);
    const [activeFilter, setActiveFilter] = useState<Omit<GetAllIssuesFilterProps, 'projectId'>>({});
    const [showFilters, setShowFilters] = useState(false);
    const dispatch = useDispatch();
    const queryClient = useQueryClient();
    const location = useLocation();

    useEffect(() => {
        const state = location.state as { selectedIssueId?: string };
        if (state?.selectedIssueId) {
            setSelectedDrawerIssueId(state.selectedIssueId);
            setIsIssueDrawerOpen(true);
            window.history.replaceState({}, document.title);
        }
    }, [location]);

    const { currentProject, projects } = useSelector((state: RootState) => state.project);

    const { mutate: createIssue, isPending: isCreatingIssue } = useCreateIssue();
    const { mutate: updateIssue } = useUpdateEpic();
    const { data: issuesResponse, isLoading: isLoadingIssues } = useGetAllIssues({
        projectId: currentProject?._id || '',
        ...activeFilter
    });
    const { data: workspaceMembersResponse, isLoading: isLoadingMembers } = useGetWorkspaceMembers(currentProject?.workspaceId || '');
    const { data: rolesResponse } = useGetRoles();
    const { data: sprintsResponse, isLoading: isLoadingSprints } = useGetSprints(currentProject?._id || '');
    const addMemberMutation = useAddProjectMember();

    const workspaceMembers: User[] = workspaceMembersResponse?.data || [];
    const roles: Role[] = rolesResponse?.data || [];
    const allIssues = (issuesResponse?.data || []) as IssueItem[];

    const projectMemberIds = currentProject?.members?.map(m => m.userId) || [];

    const availableMembers = workspaceMembers.filter(m =>
        m._id &&
        !projectMemberIds.includes(m._id) &&
        (m.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            m.email.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const handlePrepareAdd = (member: User) => {
        setPreparingMember(member);
        setPreparingRoleId(roles[0]?._id || '');
    };

    const { mutate: moveIssueToSprint } = useMoveIssueToSprint(currentProject?._id || '');

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

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

        const issueId = active.id as string;
        const overId = over.id as string;

        let targetSprintId: string | null = null;

        if (overId === 'backlog') {
            targetSprintId = null;
        } else if (sprintsResponse?.data?.some((s: ISprintEntity) => s._id === overId)) {
            targetSprintId = overId;
        } else {
            const overIssue = allIssues.find(i => i._id === overId);
            if (overIssue) {
                targetSprintId = overIssue.sprintId || null;
            }
        }

        const activeIssueObj = allIssues.find(i => i._id === issueId);
        if (activeIssueObj && activeIssueObj.sprintId === (targetSprintId || null)) {
            return;
        }

        moveIssueToSprint({
            issueId,
            sprintId: targetSprintId || ''
        }, {
            onSuccess: () => {
                toast.success(`Issue moved to ${targetSprintId ? 'sprint' : 'backlog'}`);
            },
            onError: (err: unknown) => {
                toast.error(getErrorMessage(err) || "Failed to move issue");
            }
        });
    };

    const dropAnimation = {
        sideEffects: defaultDropAnimationSideEffects({
            styles: {
                active: { opacity: '0.5' },
            },
        }),
    };

    const { mutate: createSprintMutation } = useCreateSprint(currentProject?._id || '');

    const handleCreateSprint = () => {
        if (!currentProject || !currentProject.workspaceId) {
            toast.error("Project or Workspace context missing");
            return;
        }
        createSprintMutation({
            projectId: currentProject._id,
            workspaceId: currentProject.workspaceId
        }, {
            onSuccess: () => { toast.success("Sprint created"); },
            onError: (err: unknown) => { toast.error(getErrorMessage(err) || "Failed to create sprint"); }
        });
    };

    const handleAddMember = () => {
        if (!currentProject) return;
        if (!preparingMember?._id || !preparingRoleId) {
            toast.error("Please select a member and role");
            return;
        }

        const memberId = preparingMember._id;
        const memberRole = preparingRoleId;
        const memberData = preparingMember;

        addMemberMutation.mutate({
            projectId: currentProject._id,
            userId: memberId,
            roleId: memberRole
        }, {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["issues"] });
                toast.success("Member added to project");

                const newMember: ProjectMember = {
                    userId: memberId,
                    roleId: memberRole,
                    joinedAt: new Date(),
                    user: {
                        userName: `${memberData.firstName || ''} ${memberData.lastName || ''}`.trim() || memberData.email || 'Unknown',
                        profilePicture: memberData.avatarUrl || ""
                    }
                };

                const updatedProject = {
                    ...currentProject,
                    members: [...(currentProject.members || []), newMember]
                };

                dispatch(setCurrentProject(updatedProject));

                if (projects.length > 0) {
                    const updatedProjects = projects.map(p =>
                        p._id === currentProject._id ? updatedProject : p
                    );
                    dispatch(setProjects(updatedProjects));
                }

                setIsMemberDropdownOpen(false);
                setSearchQuery('');
                setPreparingMember(null);
            },
            onError: (err: unknown) => {
                toast.error(getErrorMessage(err) || "Failed to add member");
            }
        });
    };

    const handleCreateIssueSubmit = (data: CreateIssueProps) => {
        createIssue(data, {
            onSuccess: () => {
                toast.success("Issue created successfully");
                setIsCreateIssueModalOpen(false);
            },
            onError: (err: unknown) => {
                toast.error(getErrorMessage(err) || "Failed to create issue");
            }
        });
    };

    const EPIC_COLORS = ["bg-blue-500", "bg-purple-500", "bg-emerald-500", "bg-amber-500", "bg-rose-500", "bg-cyan-500"];
    const TASK_DOT_COLORS = ["bg-amber-400", "bg-cyan-400", "bg-rose-400", "bg-emerald-400", "bg-violet-400", "bg-pink-400"];

    const epics: IssueItem[] = allIssues
        .filter((issue) => issue.issueType === IssueType.EPIC)
        .map((epic, _i) => ({
            ...epic,
            color: EPIC_COLORS[_i % EPIC_COLORS.length],
        }));

    const getChildTasks = (parentId: string) => {
        return allIssues.filter((issue) => issue.parentIssueId === parentId);
    };

    const getCompletedCount = (tasks: IssueItem[]) => {
        return tasks.filter(t => ['done', 'Done', 'DONE', 'completed', 'Completed'].includes(t.status || '')).length;
    };

    const handleCreateEpicSubmit = (formData: EpicFormData) => {
        if (!currentProject) return;
        createIssue({
            workspaceId: currentProject.workspaceId,
            projectId: currentProject._id,
            title: formData.title,
            issueType: IssueType.EPIC,
            description: formData.description,
            status: formData.status,
            parentIssueId: null,
            sprintId: null,
            assigneeId: null,
            startDate: formData.startDate ? new Date(formData.startDate) : null,
            endDate: formData.endDate ? new Date(formData.endDate) : null,
            attachments: formData.attachments,
        }, {
            onSuccess: () => {
                toast.success("Epic created successfully");
                setIsCreateEpicModalOpen(false);
            },
            onError: (err: unknown) => {
                toast.error(getErrorMessage(err) || "Failed to create epic");
            }
        });
    };

    const hasActiveFilter = Object.keys(activeFilter).length > 0;

    return (
        <>
            <DashboardLayout>
                <div className="flex flex-col h-full bg-[#0b0e14] text-white min-h-[calc(100vh-5rem)]">

                    {/* ── Header ── */}
                    <div className="px-4 sm:px-8 py-4 sm:py-6 border-b border-white/5">
                        {isLoadingSprints && (
                            <div className="mb-4 p-4 bg-zinc-900/20 border border-white/5 rounded-2xl animate-pulse">
                                <div className="h-4 w-32 bg-zinc-800 rounded mb-2" />
                                <div className="h-12 bg-zinc-800/50 rounded-xl" />
                            </div>
                        )}

                        {/* Row 1: Title + action buttons */}
                        <div className="flex items-center justify-between gap-3 mb-4">
                            <h1 className="text-xl sm:text-2xl font-bold">Backlog</h1>

                            <div className="flex items-center gap-2">
                                {/* Filter toggle (mobile) */}
                                <button
                                    onClick={() => setShowFilters(v => !v)}
                                    className={`sm:hidden flex items-center justify-center w-8 h-8 rounded-xl border transition-all ${hasActiveFilter ? 'bg-blue-500/10 border-blue-500/30 text-blue-400' : 'bg-white/5 border-white/5 text-zinc-400 hover:text-white'}`}
                                >
                                    <SlidersHorizontal className="w-4 h-4" />
                                </button>

                                {/* Members stack (hidden xs) */}
                                <div className="hidden sm:flex items-center -space-x-2">
                                    {currentProject?.members?.slice(0, 4).map((member) => (
                                        <div
                                            key={member.userId}
                                            className="w-7 h-7 rounded-full border-2 border-[#0b0e14] bg-zinc-800 flex items-center justify-center overflow-hidden"
                                            title={member.user?.userName}
                                        >
                                            {member.user?.profilePicture ? (
                                                <img src={member.user.profilePicture} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                <span className="text-[9px] font-bold text-zinc-400">
                                                    {member.user?.userName?.charAt(0).toUpperCase()}
                                                </span>
                                            )}
                                        </div>
                                    ))}
                                    {(currentProject?.members?.length || 0) > 4 && (
                                        <div className="w-7 h-7 rounded-full border-2 border-[#0b0e14] bg-zinc-900 flex items-center justify-center">
                                            <span className="text-[9px] font-bold text-zinc-500">+{(currentProject?.members?.length || 0) - 4}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Add member */}
                                <div className="relative">
                                    <button
                                        onClick={() => setIsMemberDropdownOpen(!isMemberDropdownOpen)}
                                        className={`w-8 h-8 rounded-full border border-dashed transition-all flex items-center justify-center ${isMemberDropdownOpen ? 'border-blue-500 bg-blue-500/10 rotate-45' : 'border-zinc-700 hover:border-blue-500 hover:bg-blue-500/5'}`}
                                        title="Add members"
                                    >
                                        <Plus className={`w-3.5 h-3.5 ${isMemberDropdownOpen ? 'text-blue-400' : 'text-zinc-500'}`} />
                                    </button>
                                    <AddMemberDropdown
                                        isOpen={isMemberDropdownOpen}
                                        preparingMember={preparingMember}
                                        onMemberSelect={handlePrepareAdd}
                                        preparingRoleId={preparingRoleId}
                                        onRoleChange={setPreparingRoleId}
                                        searchQuery={searchQuery}
                                        onSearchChange={setSearchQuery}
                                        roles={roles}
                                        members={availableMembers}
                                        isLoading={isLoadingMembers}
                                        onConfirm={handleAddMember}
                                        onCancel={() => setPreparingMember(null)}
                                        onClose={() => setIsMemberDropdownOpen(false)}
                                        isAdding={addMemberMutation.isPending}
                                    />
                                </div>

                                <div className="h-5 w-px bg-zinc-800 hidden sm:block" />

                                {/* Epic Panel toggle */}
                                <button
                                    onClick={() => setIsEpicSidebarOpen(!isEpicSidebarOpen)}
                                    className={`px-2.5 sm:px-3 py-1.5 rounded-xl text-[10px] font-bold transition-all ${isEpicSidebarOpen ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20' : 'bg-transparent border border-white/5 text-zinc-400 hover:text-white'}`}
                                >
                                    <span className="hidden sm:inline">Epic Panel</span>
                                    <span className="sm:hidden">Epics</span>
                                </button>

                                {/* Completed Sprints toggle */}
                                <button
                                    onClick={() => setShowCompletedSprints(!showCompletedSprints)}
                                    className={`px-2.5 sm:px-3 py-1.5 rounded-xl text-[10px] font-bold transition-all ${showCompletedSprints ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-transparent border border-white/5 text-zinc-400 hover:text-white'}`}
                                >
                                    <span className="hidden sm:inline">Completed Sprints</span>
                                    <span className="sm:hidden">Done</span>
                                </button>
                            </div>
                        </div>

                        {/* Row 2: Filters (always visible sm+, togglable on mobile) */}
                        <div className={`flex flex-wrap items-center gap-2 ${showFilters ? 'flex' : 'hidden sm:flex'}`}>
                            {/* Assignee filter */}
                            <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-zinc-900/50 border border-white/5 rounded-xl">
                                <Filter className="w-3 h-3 text-zinc-500 shrink-0" />
                                <select
                                    value={activeFilter.assigneeId || ''}
                                    onChange={(e) => setActiveFilter(prev => ({ ...prev, assigneeId: e.target.value || undefined }))}
                                    className="bg-transparent text-[10px] font-medium text-zinc-300 focus:outline-none min-w-[80px]"
                                >
                                    <option value="" className="bg-[#0b0e14]">All Assignees</option>
                                    {currentProject?.members?.map(m => (
                                        <option key={m.userId} value={m.userId} className="bg-[#0b0e14]">
                                            {m.user?.userName || 'Unknown'}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Type filter */}
                            <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-zinc-900/50 border border-white/5 rounded-xl">
                                <Hash className="w-3 h-3 text-zinc-500 shrink-0" />
                                <select
                                    value={activeFilter.issueType || ''}
                                    onChange={(e) => setActiveFilter(prev => ({ ...prev, issueType: e.target.value || undefined }))}
                                    className="bg-transparent text-[10px] font-medium text-zinc-300 focus:outline-none"
                                >
                                    <option value="" className="bg-[#0b0e14]">All Types</option>
                                    {Object.values(IssueType).map(type => (
                                        <option key={type} value={type} className="bg-[#0b0e14]">{type}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Date filter */}
                            <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-zinc-900/50 border border-white/5 rounded-xl">
                                <Calendar className="w-3 h-3 text-zinc-500 shrink-0" />
                                <select
                                    value={activeFilter.dateFilter || ''}
                                    onChange={(e) => setActiveFilter(prev => ({ ...prev, dateFilter: (e.target.value as GetAllIssuesFilterProps['dateFilter']) || undefined }))}
                                    className="bg-transparent text-[10px] font-medium text-zinc-300 focus:outline-none"
                                >
                                    <option value="" className="bg-[#0b0e14]">All Time</option>
                                    <option value="RECENT" className="bg-[#0b0e14]">Recent (7d)</option>
                                    <option value="DUE_SOON" className="bg-[#0b0e14]">Due Soon (3d)</option>
                                </select>
                            </div>

                            {hasActiveFilter && (
                                <button
                                    onClick={() => setActiveFilter({})}
                                    className="p-1.5 hover:bg-white/5 rounded-lg text-zinc-500 hover:text-rose-400 transition-colors"
                                    title="Clear filters"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* ── Main content: Epic sidebar + Sections ── */}
                    <div className="flex flex-col md:flex-row gap-4 p-4 sm:p-6 min-h-0 flex-1">

                        {/* Epic Sidebar — overlay on mobile, inline on desktop */}
                        {isEpicSidebarOpen && (
                            <>
                                {/* Mobile overlay backdrop */}
                                <div
                                    className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm md:hidden"
                                    onClick={() => setIsEpicSidebarOpen(false)}
                                />
                            </>
                        )}
                        <EpicSidebar
                            isOpen={isEpicSidebarOpen}
                            onClose={() => setIsEpicSidebarOpen(false)}
                            isLoading={isLoadingIssues}
                            epics={epics}
                            getChildTasks={getChildTasks}
                            getCompletedCount={getCompletedCount}
                            expandedEpicId={expandedEpic}
                            setExpandedEpicId={setExpandedEpic}
                            onIssueClick={(id) => {
                                setSelectedDrawerIssueId(id);
                                setIsIssueDrawerOpen(true);
                            }}
                            onCreateEpicClick={() => setIsCreateEpicModalOpen(true)}
                            isCreating={isCreatingIssue}
                            taskDotColors={TASK_DOT_COLORS}
                        />

                        <DndContext
                            sensors={sensors}
                            collisionDetection={pointerWithin}
                            onDragStart={handleDragStart}
                            onDragEnd={handleDragEnd}
                        >
                            <div className="flex-1 min-w-0 space-y-4">
                                {sprintsResponse?.data?.filter((s: ISprintEntity) =>
                                    showCompletedSprints ? s.status === "COMPLETED" : s.status !== "COMPLETED"
                                ).map((sprint: ISprintEntity) => (
                                    <SprintSection
                                        key={sprint._id}
                                        sprint={sprint}
                                        allSprints={sprintsResponse.data}
                                        isOpen={expandedSprints[sprint._id as string] ?? true}
                                        activeStatusDropdownId={activeStatusDropdownId}
                                        onActiveStatusDropdownChange={setActiveStatusDropdownId}
                                        onToggle={() => {
                                            setExpandedSprints(prev => ({
                                                ...prev,
                                                [sprint._id as string]: !(prev[sprint._id as string] ?? true)
                                            }));
                                        }}
                                        onCreateIssueClick={() => setIsCreateIssueModalOpen(true)}
                                        issues={allIssues.filter(i => i.sprintId === sprint._id)}
                                        allIssues={allIssues}
                                        projectMembers={currentProject?.members || []}
                                        taskDotColors={TASK_DOT_COLORS}
                                        onIssueClick={(id) => {
                                            setSelectedDrawerIssueId(id);
                                            setIsIssueDrawerOpen(true);
                                        }}
                                        onUpdateStatus={(id, status) => {
                                            updateIssue({ epicId: id, status, projectId: currentProject?._id || "" }, {
                                                onSuccess: () => toast.success(`Status updated`),
                                                onError: (err: unknown) => toast.error(getErrorMessage(err) || "Failed to update status"),
                                            });
                                        }}
                                    />
                                ))}

                                {!showCompletedSprints && (
                                    <BacklogSection
                                        isOpen={isBacklogOpen}
                                        onToggle={() => setIsBacklogOpen(!isBacklogOpen)}
                                        activeStatusDropdownId={activeStatusDropdownId}
                                        onActiveStatusDropdownChange={setActiveStatusDropdownId}
                                        issues={allIssues.filter(i => i.issueType !== IssueType.EPIC && i.issueType !== IssueType.SUBTASK && !i.sprintId)}
                                        allIssues={allIssues}
                                        onIssueClick={(id) => {
                                            setSelectedDrawerIssueId(id);
                                            setIsIssueDrawerOpen(true);
                                        }}
                                        onCreateSprintClick={handleCreateSprint}
                                        onCreateIssueClick={() => setIsCreateIssueModalOpen(true)}
                                        projectMembers={currentProject?.members || []}
                                        taskDotColors={TASK_DOT_COLORS}
                                        onUpdateStatus={(id, status) => {
                                            updateIssue({ epicId: id, status, projectId: currentProject?._id || "" }, {
                                                onSuccess: () => toast.success(`Status updated`),
                                                onError: (err: unknown) => toast.error(getErrorMessage(err) || "Failed to update status"),
                                            });
                                        }}
                                    />
                                )}
                            </div>
                            <DragOverlay dropAnimation={dropAnimation}>
                                {activeIssue ? (
                                    <DraggableIssueItem
                                        issue={activeIssue}
                                        idx={0}
                                        allIssues={allIssues}
                                        projectMembers={currentProject?.members || []}
                                        taskDotColors={TASK_DOT_COLORS}
                                        onIssueClick={() => { }}
                                        onUpdateStatus={() => { }}
                                        activeStatusDropdownId={activeStatusDropdownId}
                                        onActiveStatusDropdownChange={setActiveStatusDropdownId}
                                        isOverlay
                                    />
                                ) : null}
                            </DragOverlay>
                        </DndContext>
                    </div>
                </div>
            </DashboardLayout>

            <CreateEpicModal
                isOpen={isCreateEpicModalOpen}
                projectKey={currentProject?.key || ""}
                projectName={currentProject?.projectName || "Unknown Project"}
                onClose={() => setIsCreateEpicModalOpen(false)}
                onSubmit={handleCreateEpicSubmit}
                isLoading={isCreatingIssue}
            />

            <IssueDetailDrawer
                isOpen={isIssueDrawerOpen}
                onClose={() => {
                    setIsIssueDrawerOpen(false);
                    setSelectedDrawerIssueId(null);
                }}
                issue={selectedDrawerIssueId ? allIssues.find(e => e._id === selectedDrawerIssueId) || null : null}
                childTasks={selectedDrawerIssueId ? getChildTasks(selectedDrawerIssueId as string) : []}
                projectName={currentProject?.projectName || ""}
                projectKey={currentProject?.key || ""}
                projectId={currentProject?._id || ""}
                workspaceId={currentProject?.workspaceId || ""}
                members={currentProject?.members || []}
                onSubtaskClick={(id) => setSelectedDrawerIssueId(id)}
            />

            <CreateIssueModal
                isOpen={isCreateIssueModalOpen}
                onClose={() => setIsCreateIssueModalOpen(false)}
                onSubmit={handleCreateIssueSubmit}
                isLoading={isCreatingIssue}
                projectKey={currentProject?.key || ""}
                projectName={currentProject?.projectName || ""}
                projectId={currentProject?._id || ""}
                workspaceId={currentProject?.workspaceId || ""}
                members={currentProject?.members || []}
            />
        </>
    );
};
