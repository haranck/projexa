import { useState } from "react";
import DashboardLayout from "@/components/Layout/DashboardLayout";
import {
    Plus,
    ChevronDown,
    MoreHorizontal,
    ChevronRight,
    X,
    Search,
    Loader2
} from "lucide-react";
import type { RootState } from "@/store/store";
import { useSelector, useDispatch } from 'react-redux';
import { useGetWorkspaceMembers, useGetRoles } from '../../../hooks/Workspace/WorkspaceHooks';
import { useAddProjectMember } from '../../../hooks/Project/ProjectHooks';
import { toast } from 'react-hot-toast';
import { getErrorMessage } from '@/utils/errorHandler';
import type { User } from '../../../types/user';
import { setCurrentProject, setProjects } from "@/store/slice/projectSlice";
import type { ProjectMember } from "@/types/project";

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
    const dispatch = useDispatch();

    const { currentProject, projects } = useSelector((state: RootState) => state.project);

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

                // Sync with global projects list if it exists
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

    const epics = [
        { id: '1', name: 'User Authentication', count: '1/1', color: 'bg-blue-500', startDate: 'Jan 15, 2024', endDate: 'Feb 28, 2024', task: 'OAuth integration' },
        { id: '2', name: 'Dashboard Redesign', count: '2/5', color: 'bg-purple-500' },
        { id: '3', name: 'API Integration', count: '0/2', color: 'bg-emerald-500' }
    ];

    return (
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

                            <div className="relative ml-4">
                                <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-bold hover:bg-emerald-500/20 transition-all active:scale-95"
                                    onClick={() => {
                                        setIsMemberDropdownOpen(!isMemberDropdownOpen);
                                        if (!isMemberDropdownOpen) setPreparingMember(null);
                                    }}
                                >
                                    <Plus className="w-3.5 h-3.5" />
                                    Add Members
                                </button>

                                {isMemberDropdownOpen && (
                                    <div className="absolute top-full left-0 mt-2 w-72 bg-[#0d1016] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
                                        {preparingMember ? (
                                            /* Step 2: Role Selection */
                                            <div className="p-4 space-y-4 animate-in slide-in-from-right-2 duration-200 text-left">
                                                <div className="flex items-center gap-3 p-3 bg-zinc-900/40 rounded-xl border border-white/5">
                                                    <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center text-[10px] font-bold text-white overflow-hidden">
                                                        {preparingMember.avatarUrl ? (
                                                            <img src={preparingMember.avatarUrl} alt="" className="w-full h-full object-cover" />
                                                        ) : (
                                                            <>{preparingMember.firstName?.charAt(0) || preparingMember.email.charAt(0).toUpperCase()}</>
                                                        )}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-xs font-bold text-white truncate">{preparingMember.firstName} {preparingMember.lastName}</p>
                                                        <p className="text-[10px] text-zinc-500 truncate">{preparingMember.email}</p>
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-1">Select Role</label>
                                                    <select
                                                        value={preparingRoleId}
                                                        onChange={(e) => setPreparingRoleId(e.target.value)}
                                                        className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-2.5 text-xs font-bold text-white focus:outline-none focus:ring-1 focus:ring-blue-500/40"
                                                    >
                                                        {roles.map((role) => (
                                                            <option key={role._id} value={role._id}>
                                                                {role.name.toUpperCase()}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>

                                                <div className="flex items-center gap-2 pt-2">
                                                    <button
                                                        onClick={() => setPreparingMember(null)}
                                                        className="flex-1 py-2 text-[10px] font-bold text-zinc-500 hover:text-white transition-colors"
                                                    >
                                                        Back
                                                    </button>
                                                    <button
                                                        onClick={handleAddMember}
                                                        disabled={addMemberMutation.isPending}
                                                        className="flex-2 py-2 bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-bold rounded-lg shadow-lg shadow-blue-600/20 transition-all active:scale-95 disabled:opacity-50"
                                                    >
                                                        {addMemberMutation.isPending ? 'Adding...' : 'Confirm Addition'}
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            /* Step 1: Search Members */
                                            <>
                                                <div className="p-3 border-b border-white/5 bg-zinc-900/40">
                                                    <div className="relative">
                                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" />
                                                        <input
                                                            type="text"
                                                            value={searchQuery}
                                                            onChange={(e) => setSearchQuery(e.target.value)}
                                                            placeholder="Search workspace members..."
                                                            className="w-full bg-zinc-950 border border-white/5 rounded-lg pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500/40"
                                                            autoFocus
                                                        />
                                                    </div>
                                                </div>
                                                <div className="max-h-60 overflow-y-auto custom-scrollbar p-1">
                                                    {isLoadingMembers ? (
                                                        <div className="p-4 text-center text-zinc-500 text-xs font-medium flex items-center justify-center gap-2">
                                                            <Loader2 className="w-3 h-3 animate-spin" />
                                                            Loading...
                                                        </div>
                                                    ) : availableMembers.length > 0 ? (
                                                        availableMembers.map((member: User) => (
                                                            <button
                                                                key={member._id}
                                                                onClick={() => handlePrepareAdd(member)}
                                                                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 text-left transition-all group"
                                                            >
                                                                <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-[10px] font-bold text-zinc-400 group-hover:bg-blue-500 group-hover:text-white transition-colors overflow-hidden">
                                                                    {member.avatarUrl ? (
                                                                        <img src={member.avatarUrl} alt="" className="w-full h-full object-cover" />
                                                                    ) : (
                                                                        <>{member.firstName?.charAt(0) || member.email.charAt(0).toUpperCase()}</>
                                                                    )}
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <p className="text-xs font-bold text-white truncate">{member.firstName} {member.lastName}</p>
                                                                    <p className="text-[10px] text-zinc-500 truncate">{member.email}</p>
                                                                </div>
                                                                <Plus className="w-4 h-4 text-zinc-700 group-hover:text-blue-500 transition-colors" />
                                                            </button>
                                                        ))
                                                    ) : (
                                                        <div className="p-8 text-center text-zinc-600 space-y-1">
                                                            <p className="text-xs font-bold">No members found</p>
                                                            <p className="text-[10px]">All team members are already in the project</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                )}

                                {/* <AddMemberModal
                                    isOpen={isMemberDropdownOpen}
                                    onClose={() => setIsMemberDropdownOpen(false)}
                                    preparingMember={preparingMember}
                                    preparingRoleId={preparingRoleId}
                                    setPreparingMember={setPreparingMember}
                                    setPreparingRoleId={setPreparingRoleId}
                                    handleAddMember={handleAddMember}
                                    isLoadingMembers={isLoadingMembers}
                                    availableMembers={availableMembers}
                                    handlePrepareAdd={handlePrepareAdd}
                                    isLoading={addMemberMutation.isPending}
                                /> */}
                            </div>
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

                                    <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                                        {epics.map((epic) => (
                                            <div key={epic.id} className="space-y-2">
                                                <div
                                                    className={`p-5 rounded-3xl border transition-all cursor-pointer ${expandedEpic === epic.id ? 'bg-[#1a1d26] border-blue-500/20 shadow-lg' : 'bg-white/2 border-white/5 hover:border-white/10'}`}
                                                    onClick={() => setExpandedEpic(expandedEpic === epic.id ? null : epic.id)}
                                                >
                                                    <div className="flex items-center justify-between mb-2">
                                                        <div className="flex items-center gap-3">
                                                            <div className={`w-3 h-3 rounded-[3px] shadow-sm ${epic.color}`} />
                                                            <span className="text-xs font-extrabold text-white tracking-tight">{epic.name}</span>
                                                        </div>
                                                        <div className="flex items-center gap-3">
                                                            <span className="text-[10px] font-bold text-zinc-700">{epic.count}</span>
                                                            <ChevronDown className={`w-3.5 h-3.5 text-zinc-700 transition-transform ${expandedEpic === epic.id ? 'rotate-180' : ''}`} />
                                                        </div>
                                                    </div>

                                                    {expandedEpic === epic.id && (
                                                        <div className="pt-6 space-y-6 animate-in fade-in duration-300">
                                                            <div className="grid grid-cols-2 gap-6">
                                                                <div>
                                                                    <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-2">Start Date</p>
                                                                    <p className="text-[11px] font-bold text-zinc-500">{epic.startDate || 'Not set'}</p>
                                                                </div>
                                                                <div>
                                                                    <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-2">End Date</p>
                                                                    <p className="text-[11px] font-bold text-zinc-500">{epic.endDate || 'Not set'}</p>
                                                                </div>
                                                            </div>

                                                            <button className="w-full py-2.5 rounded-xl bg-transparent border border-blue-500/20 text-blue-400 text-[10px] font-black hover:bg-blue-500/5 hover:border-blue-500/40 transition-all flex items-center justify-center">
                                                                View all details
                                                            </button>

                                                            <div className="space-y-3 pt-2">
                                                                <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Tasks</p>
                                                                {epic.task && (
                                                                    <div className="flex items-center gap-3 p-4 bg-zinc-950/40 rounded-2xl border border-white/5 group hover:border-white/10 transition-colors">
                                                                        <div className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.3)]" />
                                                                        <span className="text-[11px] font-bold text-zinc-400 group-hover:text-zinc-200 transition-colors">{epic.task}</span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="p-6 border-t border-white/5 bg-zinc-900/10">
                                        <button className="w-full py-3.5 rounded-2xl bg-transparent border border-blue-500/30 text-blue-400 text-xs font-black hover:bg-blue-500/5 transition-all active:scale-95 flex items-center justify-center gap-2 shadow-lg shadow-blue-500/5">
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
    );
};
