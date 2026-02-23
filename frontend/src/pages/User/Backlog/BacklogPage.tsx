import { useState } from "react";
import DashboardLayout from "@/components/Layout/DashboardLayout";
import { Plus, ChevronDown, MoreHorizontal, ChevronRight, X, Loader2 } from "lucide-react";
import { AddMemberDropdown } from "@/components/Project/AddMemberDropdown";
import { CreateEpicModal } from "@/components/Issue/CreateEpicModal";
import type { EpicFormData } from "@/components/Issue/CreateEpicModal";
import { EpicDetailDrawer } from "@/components/Issue/EpicDetailDrawer";
import type { RootState } from "@/store/store";
import { useSelector, useDispatch } from 'react-redux';
import { useGetWorkspaceMembers, useGetRoles } from '../../../hooks/Workspace/WorkspaceHooks';
import { useAddProjectMember } from '../../../hooks/Project/ProjectHooks';
import { toast } from 'react-hot-toast';
import { getErrorMessage } from '@/utils/errorHandler';
import type { User } from '../../../types/user';
import { setCurrentProject, setProjects } from "@/store/slice/projectSlice";
import type { ProjectMember } from "@/types/project";
import { useCreateIssue, useGetAllIssues } from "@/hooks/Issues/IssueHooks";
import { IssueType } from "@/services/Issue/IssueService";

interface Role {
    _id: string;
    name: string;
}

export const BacklogPage = () => {
    const [isSprintOpen, setIsSprintOpen] = useState(true);
    const [isBacklogOpen, setIsBacklogOpen] = useState(true);
    const [expandedEpic, setExpandedEpic] = useState<string | null>(null);
    const [isEpicSidebarOpen, setIsEpicSidebarOpen] = useState(true);
    const [isMemberDropdownOpen, setIsMemberDropdownOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [preparingMember, setPreparingMember] = useState<User | null>(null);
    const [preparingRoleId, setPreparingRoleId] = useState<string>('');
    const [isCreateEpicModalOpen, setIsCreateEpicModalOpen] = useState(false);
    const [isEpicDrawerOpen, setIsEpicDrawerOpen] = useState(false);
    const [selectedDrawerEpicId, setSelectedDrawerEpicId] = useState<string | null>(null);
    const dispatch = useDispatch();

    const { currentProject, projects } = useSelector((state: RootState) => state.project);

    const { mutate: createIssue, isPending: isCreatingEpic } = useCreateIssue();
    const { data: issuesResponse, isLoading: isLoadingIssues } = useGetAllIssues(currentProject?._id || '');
    const { data: workspaceMembersResponse, isLoading: isLoadingMembers } = useGetWorkspaceMembers(currentProject?.workspaceId || '');
    const { data: rolesResponse } = useGetRoles();
    const addMemberMutation = useAddProjectMember();

    const workspaceMembers: User[] = workspaceMembersResponse?.data || [];
    const roles: Role[] = rolesResponse?.data || [];

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

    const handleAddMember = () => {
        if (!currentProject) return;
        if (!preparingMember?._id || !preparingRoleId) {
            toast.error("Please select a member and role");
            return;
        }

        addMemberMutation.mutate({
            projectId: currentProject._id,
            userId: preparingMember._id,
            roleId: preparingRoleId
        }, {
            onSuccess: () => {
                toast.success("Member added to project");

                const newMember: ProjectMember = {
                    userId: preparingMember._id as string,
                    roleId: preparingRoleId,
                    joinedAt: new Date(),
                    user: {
                        userName: `${preparingMember.firstName || ''} ${preparingMember.lastName || ''}`.trim() || preparingMember.email,
                        profilePicture: preparingMember.avatarUrl || ""
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

    interface IssueItem {
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
        status?: string;
    }

    const EPIC_COLORS = ["bg-blue-500", "bg-purple-500", "bg-emerald-500", "bg-amber-500", "bg-rose-500", "bg-cyan-500"];
    const TASK_DOT_COLORS = ["bg-amber-400", "bg-cyan-400", "bg-rose-400", "bg-emerald-400", "bg-violet-400", "bg-pink-400"];
    const allIssues = (issuesResponse?.data || []) as IssueItem[];
    const epics: IssueItem[] = allIssues
        .filter((issue) => issue.issueType === IssueType.EPIC)
        .map((epic, _i) => ({
            ...epic,
            color: EPIC_COLORS[_i % EPIC_COLORS.length],
        }));

    const getEpicTasks = (epicId: string) => {
        return allIssues.filter(
            (issue) => issue.parentIssueId === epicId && issue.issueType !== IssueType.EPIC
        );
    };

    const getCompletedCount = (tasks: IssueItem[]) => {
        return tasks.filter(t => t.status === 'done' || t.status === 'Done' || t.status === 'DONE' || t.status === 'completed' || t.status === 'Completed').length;
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

    return (
        <>
            <DashboardLayout>
                <div className="flex flex-col h-full bg-[#0b0e14] text-white min-h-[calc(100vh-5rem)]">
                    {/* Header Section */}
                    <div className="px-8 py-6">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-4">
                                <h1 className="text-2xl font-bold">Backlog</h1>
                                <button className="px-3 py-1 bg-zinc-900/50 border border-white/5 rounded-lg text-[10px] font-bold text-zinc-400 hover:text-white transition-colors uppercase tracking-wider">
                                    Completed sprint
                                </button>
                            </div>
                            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-all shadow-[0_0_15px_rgba(37,99,235,0.4)] active:scale-95">
                                create Issue
                            </button>
                        </div>

                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center">
                                <div className="flex -space-x-2">
                                    {currentProject?.members?.map((member, i) => (
                                        <div key={i} title={member.user?.userName} className=" w-8 h-8 rounded-full border-2 border-[#0b0e14] bg-zinc-800 flex items-center justify-center text-[10px] font-bold text-zinc-400 overflow-hidden">
                                            {member.user?.profilePicture ? (
                                                <img src={member.user.profilePicture} alt={member.user.userName} className="w-full h-full object-cover" />
                                            ) : (
                                                <span>{member.user?.userName?.charAt(0).toUpperCase() || '?'}</span>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                <AddMemberDropdown
                                    isMemberDropdownOpen={isMemberDropdownOpen}
                                    setIsMemberDropdownOpen={setIsMemberDropdownOpen}
                                    preparingMember={preparingMember}
                                    setPreparingMember={setPreparingMember}
                                    preparingRoleId={preparingRoleId}
                                    setPreparingRoleId={setPreparingRoleId}
                                    searchQuery={searchQuery}
                                    setSearchQuery={setSearchQuery}
                                    roles={roles}
                                    availableMembers={availableMembers}
                                    isLoadingMembers={isLoadingMembers}
                                    handlePrepareAdd={handlePrepareAdd}
                                    handleAddMember={handleAddMember}
                                    isAddingMember={addMemberMutation.isPending}
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setIsEpicSidebarOpen(!isEpicSidebarOpen)}
                                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-[10px] font-bold transition-all ${isEpicSidebarOpen ? 'bg-zinc-800 border-white/20 text-white' : 'bg-zinc-900 border-white/10 text-zinc-500 hover:bg-zinc-800'}`}
                                >
                                    <span>Epic</span>
                                    <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isEpicSidebarOpen ? 'rotate-180' : ''}`} />
                                </button>
                                <button className="p-2 rounded-lg bg-zinc-900 border border-white/10 hover:bg-zinc-800 transition-colors">
                                    <MoreHorizontal className="w-4 h-4 text-zinc-500" />
                                </button>
                            </div>
                        </div>

                        <div className="flex gap-6">
                            {/* Epic Sidebar */}
                            {isEpicSidebarOpen && (
                                <div className="w-80 shrink-0 animate-in slide-in-from-left duration-300">
                                    <div className="bg-[#14171f] rounded-[2rem] border border-white/10 overflow-hidden flex flex-col h-[calc(100vh-14rem)] sticky top-6 shadow-2xl">
                                        <div className="px-6 py-5 border-b border-white/5 flex items-center justify-between">
                                            <div className="relative group/epic-title">
                                                <h3 className="font-bold text-sm tracking-tight text-white mb-1 px-1">Epic</h3>
                                                <div className="absolute -bottom-5 left-1 w-8 h-[2px] bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)] rounded-full" />
                                            </div>
                                            <button
                                                onClick={() => setIsEpicSidebarOpen(false)}
                                                className="p-1.5 rounded-lg hover:bg-white/5 text-zinc-600 hover:text-white transition-all"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>

                                        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                                            {isLoadingIssues ? (
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
                                                    const epicTasks = getEpicTasks(epic._id as string);
                                                    const completedCount = getCompletedCount(epicTasks);
                                                    const totalCount = epicTasks.length;
                                                    const isExpanded = expandedEpic === (epic._id as string);

                                                    return (
                                                        <div key={epic._id as string}>
                                                            <div
                                                                className={`rounded-2xl border transition-all cursor-pointer ${isExpanded
                                                                    ? 'bg-[#1a1d26] border-white/10 shadow-lg'
                                                                    : 'bg-white/2 border-white/5 hover:border-white/10'
                                                                    }`}
                                                                onClick={() => setExpandedEpic(isExpanded ? null : (epic._id as string))}
                                                            >
                                                                {/* Epic Header */}
                                                                <div className="flex items-center justify-between px-5 py-4">
                                                                    <div className="flex items-center gap-3 min-w-0">
                                                                        <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${epic.color}`} />
                                                                        <span className="text-[13px] font-bold text-white tracking-tight truncate">{epic.title as string}</span>
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
                                                                                    setSelectedDrawerEpicId(epic._id as string);
                                                                                    setIsEpicDrawerOpen(true);
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
                                                                                            key={task._id as string}
                                                                                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/3 transition-colors"
                                                                                        >
                                                                                            <div className={`w-2 h-2 rounded-full shrink-0 ${TASK_DOT_COLORS[ti % TASK_DOT_COLORS.length]}`} />
                                                                                            <span className="text-[12px] text-zinc-300 truncate">{task.title as string}</span>
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
                                                onClick={() => setIsCreateEpicModalOpen(true)}
                                                disabled={isCreatingEpic}
                                                className="w-full py-3.5 rounded-2xl bg-transparent border border-blue-500/30 text-blue-400 text-xs font-black hover:bg-blue-500/5 transition-all active:scale-95 flex items-center justify-center gap-2 shadow-lg shadow-blue-500/5 disabled:opacity-50"
                                            >
                                                <Plus className="w-4 h-4" />
                                                Create epic
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Main Content Areas */}
                            <div className="flex-1 space-y-6">
                                {/* Sprint Section */}
                                <div className="bg-[#14171f] rounded-[2rem] border border-white/5 overflow-hidden">
                                    <div
                                        className="flex items-center justify-between px-6 py-4 bg-white/2 cursor-pointer hover:bg-white/4 transition-colors"
                                        onClick={() => setIsSprintOpen(!isSprintOpen)}
                                    >
                                        <div className="flex items-center gap-3">
                                            <button className="p-1 hover:bg-white/10 rounded transition-colors text-zinc-500">
                                                {isSprintOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
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

                                    {isSprintOpen && (
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
                                        <button className="flex items-center gap-2 text-[10px] font-bold text-zinc-500 hover:text-white transition-colors group">
                                            <div className="p-1 rounded bg-zinc-800 group-hover:bg-blue-600 transition-colors">
                                                <Plus className="w-3 h-3 text-white" />
                                            </div>
                                            Create issue
                                        </button>
                                    </div>
                                </div>

                                {/* Backlog Section */}
                                <div className="bg-[#14171f] rounded-[2rem] border border-white/5 overflow-hidden">
                                    <div
                                        className="flex items-center justify-between px-6 py-4 bg-white/2 cursor-pointer hover:bg-white/4 transition-colors"
                                        onClick={() => setIsBacklogOpen(!isBacklogOpen)}
                                    >
                                        <div className="flex items-center gap-3">
                                            <button className="p-1 hover:bg-white/10 rounded transition-colors text-zinc-500">
                                                {isBacklogOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                                            </button>
                                            <span className="font-bold text-sm tracking-tight">Backlog</span>
                                            <span className="text-xs font-medium text-zinc-600">(0 issues)</span>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center gap-1.5">
                                                <div className="w-4 h-1.5 bg-zinc-800 rounded-full" />
                                                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                                                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                                            </div>
                                            <button
                                                className="px-4 py-1.5 text-[10px] font-bold bg-emerald-500 hover:bg-emerald-400 text-white rounded-lg transition-colors shadow-lg shadow-emerald-500/20 active:scale-95"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                Create Sprint
                                            </button>
                                            <button className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-zinc-500">
                                                <MoreHorizontal className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>

                                    {isBacklogOpen && (
                                        <div className="p-6 bg-[#0e1117]/50 min-h-[120px] flex flex-col items-center justify-center border-y border-white/5 border-dashed mx-6 my-2 rounded-2xl">
                                            <div className="text-center">
                                                <p className="text-xs font-bold text-zinc-700">
                                                    Backlog is empty, or create new issues
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                    <div className="p-4 px-6">
                                        <button className="flex items-center gap-2 text-[10px] font-bold text-zinc-500 hover:text-white transition-colors group">
                                            <div className="p-1 rounded bg-zinc-800 group-hover:bg-blue-600 transition-colors">
                                                <Plus className="w-3 h-3 text-white" />
                                            </div>
                                            Create issue
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </DashboardLayout>

            <CreateEpicModal
                isOpen={isCreateEpicModalOpen}
                projectName={currentProject?.projectName || "Unknown Project"}
                onClose={() => setIsCreateEpicModalOpen(false)}
                onSubmit={handleCreateEpicSubmit}
                isLoading={isCreatingEpic}
            />

            <EpicDetailDrawer
                isOpen={isEpicDrawerOpen}
                onClose={() => {
                    setIsEpicDrawerOpen(false);
                    setSelectedDrawerEpicId(null);
                }}
                epic={selectedDrawerEpicId ? epics.find(e => e._id === selectedDrawerEpicId) || null : null}
                childTasks={selectedDrawerEpicId ? getEpicTasks(selectedDrawerEpicId) : []}
            />
        </>
    );
};
