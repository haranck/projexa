import { useState } from "react";
import DashboardLayout from "@/components/Layout/DashboardLayout";
import { Plus } from "lucide-react";
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
import { IssueType } from "@/services/Issue/IssueService";
import type { CreateIssueProps } from "@/services/Issue/IssueService";

import { EpicSidebar } from "./components/EpicSidebar";
import { SprintSection } from "./components/SprintSection";
import { BacklogSection } from "./components/BacklogSection";

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
    status?: string;
    assigneeId?: string | null;
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
    const [isCreateIssueModalOpen, setIsCreateIssueModalOpen] = useState(false);
    const [isIssueDrawerOpen, setIsIssueDrawerOpen] = useState(false);
    const [selectedDrawerIssueId, setSelectedDrawerIssueId] = useState<string | null>(null);
    const dispatch = useDispatch();

    const { currentProject, projects } = useSelector((state: RootState) => state.project);

    const { mutate: createIssue, isPending: isCreatingIssue } = useCreateIssue();
    const { mutate: updateIssue } = useUpdateEpic();
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

    const handleCreateIssueSubmit = (data: CreateIssueProps) => {
        createIssue(data, {
            onSuccess: () => {
                toast.success("Issue created successfully");
                setIsCreateIssueModalOpen(false);
            },
            onError: (err) => {
                toast.error("Failed to create issue");
                console.error(err);
            }
        });
    };

    const EPIC_COLORS = ["bg-blue-500", "bg-purple-500", "bg-emerald-500", "bg-amber-500", "bg-rose-500", "bg-cyan-500"];
    const TASK_DOT_COLORS = ["bg-amber-400", "bg-cyan-400", "bg-rose-400", "bg-emerald-400", "bg-violet-400", "bg-pink-400"];
    const allIssues = (issuesResponse?.data || []) as IssueItem[];
    const epics: IssueItem[] = allIssues
        .filter((issue) => issue.issueType === IssueType.EPIC)
        .map((epic, _i) => ({
            ...epic,
            color: EPIC_COLORS[_i % EPIC_COLORS.length],
        }));

    const getChildTasks = (parentId: string) => {
        return allIssues.filter(
            (issue) => issue.parentIssueId === parentId
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
                                    {currentProject?.projectName}
                                </button>
                            </div>

                            <div className="flex items-center gap-6">
                                {/* Search */}
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Search backlog..."
                                        className="w-64 bg-zinc-900/50 border border-white/5 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-blue-500/50 transition-all"
                                    />
                                </div>

                                {/* Members Stack */}
                                <div className="flex items-center">
                                    <div className="flex -space-x-2 mr-4">
                                        {currentProject?.members?.slice(0, 5).map((member) => (
                                            <div
                                                key={member.userId}
                                                className="w-8 h-8 rounded-full border-2 border-[#0b0e14] bg-zinc-800 flex items-center justify-center overflow-hidden"
                                                title={member.user?.userName}
                                            >
                                                {member.user?.profilePicture ? (
                                                    <img src={member.user.profilePicture} alt="" className="w-full h-full object-cover" />
                                                ) : (
                                                    <span className="text-[10px] font-bold text-zinc-400">
                                                        {member.user?.userName?.charAt(0).toUpperCase()}
                                                    </span>
                                                )}
                                            </div>
                                        ))}
                                        {(currentProject?.members?.length || 0) > 5 && (
                                            <div className="w-8 h-8 rounded-full border-2 border-[#0b0e14] bg-zinc-900 flex items-center justify-center">
                                                <span className="text-[10px] font-bold text-zinc-500">
                                                    +{(currentProject?.members?.length || 0) - 5}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="relative">
                                        <button
                                            onClick={() => setIsMemberDropdownOpen(!isMemberDropdownOpen)}
                                            className={`w-8 h-8 rounded-full border border-dashed transition-all flex items-center justify-center ${isMemberDropdownOpen ? 'border-blue-500 bg-blue-500/10 rotate-45' : 'border-zinc-700 hover:border-blue-500 hover:bg-blue-500/5 hover:scale-110'}`}
                                            title="Add members"
                                        >
                                            <Plus className={`w-4 h-4 ${isMemberDropdownOpen ? 'text-blue-400' : 'text-zinc-500 hover:text-blue-500'}`} />
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
                                            onCancel={() => {
                                                setPreparingMember(null);
                                            }}
                                            onClose={() => setIsMemberDropdownOpen(false)}
                                            isAdding={addMemberMutation.isPending}
                                        />
                                    </div>
                                </div>

                                <div className="h-6 w-px bg-zinc-800" />

                                <button
                                    onClick={() => setIsEpicSidebarOpen(!isEpicSidebarOpen)}
                                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${isEpicSidebarOpen ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20' : 'bg-transparent border border-white/5 text-zinc-400 hover:text-white'}`}
                                >
                                    Epic Panel
                                </button>
                            </div>
                        </div>

                        <div className="flex gap-6">
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

                            {/* Main Content Areas */}
                            <div className="flex-1 space-y-6">
                                <SprintSection
                                    isOpen={isSprintOpen}
                                    onToggle={() => setIsSprintOpen(!isSprintOpen)}
                                    onCreateIssueClick={() => setIsCreateIssueModalOpen(true)}
                                />

                                <BacklogSection
                                    isOpen={isBacklogOpen}
                                    onToggle={() => setIsBacklogOpen(!isBacklogOpen)}
                                    issues={allIssues.filter(i => i.issueType !== IssueType.EPIC && i.issueType !== IssueType.SUBTASK)}
                                    allIssues={allIssues}
                                    onIssueClick={(id) => {
                                        setSelectedDrawerIssueId(id);
                                        setIsIssueDrawerOpen(true);
                                    }}
                                    onCreateSprintClick={() => toast.success("Create Sprint flow coming soon")}
                                    onCreateIssueClick={() => setIsCreateIssueModalOpen(true)}
                                    projectMembers={currentProject?.members || []}
                                    taskDotColors={TASK_DOT_COLORS}
                                    onUpdateStatus={(id, status) => {
                                        updateIssue({
                                            epicId: id,
                                            status,
                                            projectId: currentProject?._id || "",
                                        }, {
                                            onSuccess: () => {
                                                toast.success(`Status updated to ${status.replace("_", " ")}`);
                                            },
                                            onError: (err: unknown) => {
                                                toast.error("Failed to update status");
                                                console.error(err);
                                            }
                                        });
                                    }}
                                />
                            </div>
                        </div>
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
                childTasks={selectedDrawerIssueId ? getChildTasks(selectedDrawerIssueId) : []}
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
