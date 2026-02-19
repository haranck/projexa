import React, { useState } from 'react';
import {
    X,
    Users,
    Trash2,
    Shield,
    Loader2,
    UserPlus,
    Plus,
    Search
} from 'lucide-react';
import { useGetWorkspaceMembers, useGetRoles } from '../../hooks/Workspace/WorkspaceHooks';
import { useRemoveProjectMember, useUpdateProjectMemberRole, useAddProjectMember } from '../../hooks/Project/ProjectHooks';
import { toast } from 'react-hot-toast';
import { getErrorMessage } from '@/utils/errorHandler';
import type { Project } from '../../types/project';
import type { User } from '../../types/user';

interface Role {
    _id: string;
    name: string;
}

interface ProjectMembersModalProps {
    open: boolean;
    onClose: () => void;
    project: Project | null;
}

export const ProjectMembersModal: React.FC<ProjectMembersModalProps> = ({ open, onClose, project }) => {
    const [isMemberDropdownOpen, setIsMemberDropdownOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [preparingMember, setPreparingMember] = useState<User | null>(null);
    const [preparingRoleId, setPreparingRoleId] = useState<string>('');

    const { data: workspaceMembersResponse, isLoading: isLoadingMembers } = useGetWorkspaceMembers(project?.workspaceId || '');
    const { data: rolesResponse, isLoading: isLoadingRoles } = useGetRoles();

    const removeMemberMutation = useRemoveProjectMember();
    const updateRoleMutation = useUpdateProjectMemberRole();
    const addMemberMutation = useAddProjectMember();

    if (!open || !project) return null;

    const workspaceMembers: User[] = workspaceMembersResponse?.data || [];
    const roles: Role[] = rolesResponse?.data || [];

    const projectMemberIds = project.members.map(m => m.userId);
    const currentProjectMembers = workspaceMembers.filter(member => member._id && projectMemberIds.includes(member._id));

    // Members who can be added (workspace members not in project)
    const availableMembers = workspaceMembers.filter(m =>
        m._id &&
        !projectMemberIds.includes(m._id) &&
        (m.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            m.email.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const handleUpdateRole = (userId: string, roleId: string) => {
        updateRoleMutation.mutate({
            projectId: project._id,
            userId,
            roleId
        }, {
            onSuccess: () => {
                toast.success("Member role updated");
            },
            onError: (err) => {
                toast.error(getErrorMessage(err) || "Failed to update role");
            }
        });
    };

    const handleRemoveMember = (userId: string) => {
        removeMemberMutation.mutate({
            projectId: project._id,
            userId
        }, {
            onSuccess: () => {
                toast.success("Member removed from project");
            },
            onError: (err) => {
                toast.error(getErrorMessage(err) || "Failed to remove member");
            }
        });
    };

    const handlePrepareAdd = (member: User) => {
        setPreparingMember(member);
        setPreparingRoleId(roles[0]?._id || '');
    };

    const handleAddMember = () => {
        if (!preparingMember?._id || !preparingRoleId) {
            toast.error("Please select a member and role");
            return;
        }

        addMemberMutation.mutate({
            projectId: project._id,
            userId: preparingMember._id,
            roleId: preparingRoleId
        }, {
            onSuccess: () => {
                toast.success("Member added to project");
                setIsMemberDropdownOpen(false);
                setSearchQuery('');
                setPreparingMember(null);
            },
            onError: (err) => {
                toast.error(getErrorMessage(err) || "Failed to add member");
            }
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-zinc-950 border border-white/10 w-full max-w-2xl rounded-[2rem] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
                {/* Header */}
                <div className="p-6 border-b border-white/5 flex items-center justify-between bg-zinc-900/40">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500 border border-blue-500/20">
                            <Users className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white tracking-tight">Project Members</h2>
                            <p className="text-zinc-500 text-xs font-medium">{project.projectName}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {/* Add Member Button + Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => {
                                    setIsMemberDropdownOpen(!isMemberDropdownOpen);
                                    if (!isMemberDropdownOpen) setPreparingMember(null);
                                }}
                                className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-xl text-xs font-bold hover:bg-emerald-500/20 transition-all active:scale-95"
                            >
                                <UserPlus className="w-4 h-4" />
                                Add Member
                            </button>

                            {isMemberDropdownOpen && (
                                <div className="absolute top-full right-0 mt-2 w-72 bg-[#0d1016] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-20 animate-in fade-in slide-in-from-top-2">
                                    {preparingMember ? (
                                        /* Step 2: Role Selection */
                                        <div className="p-4 space-y-4 animate-in slide-in-from-right-2 duration-200">
                                            <div className="flex items-center gap-3 p-3 bg-zinc-900/40 rounded-xl border border-white/5">
                                                <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center text-[10px] font-bold text-white">
                                                    {preparingMember.firstName?.charAt(0) || preparingMember.email.charAt(0).toUpperCase()}
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
                                                    <div className="p-4 text-center text-zinc-500 text-xs font-medium">Loading...</div>
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
                        </div>

                        <button
                            onClick={onClose}
                            className="p-2 rounded-lg hover:bg-white/5 text-zinc-400 hover:text-white transition-all active:scale-95"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 max-h-[60vh] custom-scrollbar">
                    {isLoadingMembers || isLoadingRoles ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-4">
                            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                            <p className="text-zinc-500 text-sm font-medium">Loading members...</p>
                        </div>
                    ) : currentProjectMembers.length === 0 ? (
                        <div className="text-center py-20 grayscale opacity-50">
                            <Users className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
                            <p className="text-zinc-400 font-medium">No members found in this project</p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {currentProjectMembers.map((member: User) => {
                                const projectMemberData = project.members.find(m => m.userId === member._id);
                                return (
                                    <div
                                        key={member._id}
                                        className="group flex items-center justify-between p-4 rounded-2xl bg-zinc-900/40 hover:bg-zinc-900/60 border border-white/5 transition-all"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-sm overflow-hidden text-center">
                                                {member.avatarUrl ? (
                                                    <img src={member.avatarUrl} alt="" className="w-full h-full object-cover" />
                                                ) : (
                                                    <>{member.firstName?.charAt(0) || member.email.charAt(0).toUpperCase()}</>
                                                )}
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-bold text-white">
                                                    {member.firstName} {member.lastName}
                                                </h4>
                                                <p className="text-xs text-zinc-500">{member.email}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            {/* Role Select */}
                                            <div className="relative group/select">
                                                <select
                                                    value={projectMemberData?.roleId}
                                                    onChange={(e) => member._id && handleUpdateRole(member._id, e.target.value)}
                                                    className="appearance-none bg-zinc-950 border border-white/10 rounded-xl px-4 py-2.5 text-[11px] font-bold text-zinc-400 focus:outline-none focus:ring-1 focus:ring-blue-500/40 hover:border-white/20 transition-all cursor-pointer pr-10 min-w-[130px] shadow-lg shadow-black/20"
                                                >
                                                    {roles.map((role) => (
                                                        <option key={role._id} value={role._id}>
                                                            {role.name.toUpperCase()}
                                                        </option>
                                                    ))}
                                                </select>
                                                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none text-zinc-600 group-hover/select:text-blue-500 transition-colors">
                                                    <div className="w-px h-4 bg-white/5 mr-1" />
                                                    <Shield className="w-3.5 h-3.5" />
                                                </div>
                                            </div>

                                            {/* Delete Button */}
                                            <button
                                                onClick={() => member._id && handleRemoveMember(member._id)}
                                                disabled={removeMemberMutation.isPending}
                                                className="p-2.5 rounded-xl bg-zinc-950 hover:bg-red-500/10 text-zinc-600 hover:text-red-500 border border-white/5 hover:border-red-500/20 transition-all active:scale-95 disabled:opacity-50 shadow-lg shadow-black/20"
                                                title="Remove from project"
                                            >
                                                {removeMemberMutation.isPending ? (
                                                    <Loader2 className="w-4 h-4 animate-spin text-red-500" />
                                                ) : (
                                                    <Trash2 className="w-4 h-4" />
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-white/5 bg-zinc-900/40 flex items-center justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-xl text-xs font-bold transition-all active:scale-95"
                    >
                        Close
                    </button>
                </div>
            </div>

            <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.1);
                }
            `}</style>
        </div>
    );
};
