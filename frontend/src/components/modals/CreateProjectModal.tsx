import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    X,
    Briefcase,
    Users,
    Code,
    AlignLeft,
    Plus,
    UserPlus,
    Trash2,
    Search,
    ChevronDown
} from 'lucide-react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store/store';
import {
    useGetWorkspaceMembers,
    useGetRoles
} from '../../hooks/Workspace/WorkspaceHooks';
import { useCreateProject } from '../../hooks/Project/ProjectHooks';
import { toast } from 'react-hot-toast';
import { getErrorMessage } from '@/utils/errorHandler';
import { FRONTEND_ROUTES } from '@/constants/frontendRoutes';

interface CreateProjectModalProps {
    open: boolean;
    onClose: () => void;
}

interface SelectedMember {
    userId: string;
    roleId: string;
    email: string;
    userName: string;
    avatarUrl?: string;
}

interface WorkspaceMember {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatarUrl?: string;
}

interface ProjectRole {
    _id: string;
    name: string;
}
export const CreateProjectModal: React.FC<CreateProjectModalProps> = ({ open, onClose }) => {
    const { currentWorkspace } = useSelector((state: RootState) => state.workspace);
    const { user } = useSelector((state: RootState) => state.auth);
    const navigate = useNavigate()
    const [projectName, setProjectName] = useState('');
    const [projectKey, setProjectKey] = useState('');
    const [description, setDescription] = useState('');
    const [selectedMembers, setSelectedMembers] = useState<SelectedMember[]>([]);
    const [isMemberDropdownOpen, setIsMemberDropdownOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const { data: membersData, isLoading: isMembersLoading } = useGetWorkspaceMembers(currentWorkspace?._id || currentWorkspace?.id || '');
    const { data: rolesData } = useGetRoles();
    const createProjectMutation = useCreateProject();


    // useEffect(() => {
    //     if (projectName) {
    //         const key = projectName
    //             .split(' ')
    //             .map(word => word[0])
    //             .join('')
    //             .toUpperCase()
    //             .slice(0, 5);
    //         setProjectKey(key);
    //     }
    // }, [projectName]);

    useEffect(() => {
        if (!projectName) return;
        const words = projectName.trim().split(" ").filter(Boolean);
        let key = "";
        if (words.length === 1) {
            key = words[0].slice(0, 3);
        } else {
            const firstLetter = words[0][0];
            const secondLetters = words[1].slice(0, 2);
            key = firstLetter + secondLetters;
        }
        setProjectKey(key.toUpperCase());
    }, [projectName]);

    if (!open) return null;

    const workspaceMembers = (membersData?.data || []) as WorkspaceMember[];
    const availableRoles = (rolesData?.data || []) as ProjectRole[];

    const filteredMembers = workspaceMembers.filter((m: WorkspaceMember) => {
        const memberId = m._id;
        const isCurrentUser = memberId === user?.id;
        const isAlreadySelected = selectedMembers.some(sm => sm.userId === memberId);
        const matchesSearch = m.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            m.firstName?.toLowerCase().includes(searchQuery.toLowerCase());

        return !isCurrentUser && !isAlreadySelected && matchesSearch;
    });

    const handleAddMember = (member: WorkspaceMember) => {
        const memberId = member._id;
        const roleId = availableRoles[0]?._id || '';

        setSelectedMembers([...selectedMembers, {
            userId: memberId,
            roleId,
            email: member.email,
            userName: `${member.firstName} ${member.lastName}`,
            avatarUrl: member.avatarUrl
        }]);
        setSearchQuery('');
        setIsMemberDropdownOpen(false);
    };

    const handleRemoveMember = (userId: string) => {
        setSelectedMembers(selectedMembers.filter(m => m.userId !== userId));
    };

    const handleRoleChange = (userId: string, roleId: string) => {
        setSelectedMembers(selectedMembers.map(m =>
            m.userId === userId ? { ...m, roleId } : m
        ));
    };

    const handleSubmit = () => {
        if (!projectName.trim()) {
            toast.error("Project name is required");
            return;
        }
        if (!projectKey.trim()) {
            toast.error("Project key is required");
            return;
        }
        if (!currentWorkspace) {
            toast.error("No workspace selected");
            return;
        }

        const workspaceId = currentWorkspace?._id || currentWorkspace?.id || '';

        createProjectMutation.mutate({
            projectName,
            key: projectKey,
            description,
            workspaceId,
            members: selectedMembers.map(m => ({
                userId: m.userId,
                roleId: m.roleId
            }))
        }, {
            onSuccess: () => {
                toast.success("Project created successfully");
                onClose();
                setProjectName('');
                setProjectKey('');
                setDescription('');
                setSelectedMembers([]);
                navigate(FRONTEND_ROUTES.PROJECTS)

            },
            onError: (err: unknown) => {
                const error = getErrorMessage(err);
                toast.error(error || "Failed to create project");
            }
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-zinc-950 border border-white/10 w-full max-w-2xl max-h-[90vh] rounded-[2rem] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
                {/* Header */}
                <div className="p-6 border-b border-white/5 flex items-center justify-between bg-zinc-900/40">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500 border border-blue-500/20">
                            <Briefcase className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white tracking-tight">Create New Project</h2>
                            <p className="text-zinc-500 text-xs font-medium">Set up your project workspace and team</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-white/5 text-zinc-400 hover:text-white transition-all active:scale-95"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
                    {/* Basic Info Section */}
                    <div className="space-y-6">
                        <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                            <AlignLeft className="w-4 h-4 text-blue-500" />
                            Project Details
                        </h3>

                        <div className="grid grid-cols-3 gap-6">
                            <div className="col-span-2 space-y-2">
                                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-1">Project Name</label>
                                <div className="relative group">
                                    <input
                                        type="text"
                                        value={projectName}
                                        onChange={(e) => setProjectName(e.target.value)}
                                        placeholder="e.g. Mobile App Redesign"
                                        className="w-full bg-zinc-900/50 border border-white/5 rounded-xl px-4 py-3 text-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all placeholder:text-zinc-700 text-sm group-hover:border-white/10"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-1">Key</label>
                                <div className="relative group">
                                    <input
                                        type="text"
                                        value={projectKey}
                                        onChange={(e) => setProjectKey(e.target.value.toUpperCase())}
                                        placeholder="MAR"
                                        maxLength={10}
                                        className="w-full bg-zinc-900/50 border border-white/5 rounded-xl px-4 py-3 text-white font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all placeholder:text-zinc-700 text-sm text-center group-hover:border-white/10"
                                    />
                                    <Code className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-700" />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-1">Description</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="What's this project about?"
                                rows={3}
                                className="w-full bg-zinc-900/50 border border-white/5 rounded-xl px-4 py-3 text-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all placeholder:text-zinc-700 text-sm resize-none group-hover:border-white/10"
                            />
                        </div>
                    </div>

                    {/* Team Section */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                                <Users className="w-4 h-4 text-emerald-500" />
                                Team Members
                            </h3>
                            <div className="relative">
                                <button
                                    onClick={() => setIsMemberDropdownOpen(!isMemberDropdownOpen)}
                                    className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 text-blue-500 border border-blue-500/20 rounded-xl text-xs font-bold hover:bg-blue-500/20 transition-all"
                                >
                                    <UserPlus className="w-4 h-4" />
                                    Add Member
                                </button>

                                {isMemberDropdownOpen && (
                                    <div className="absolute top-full right-0 mt-2 w-72 bg-[#0d1016] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-20 animate-in fade-in slide-in-from-top-2">
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
                                            {isMembersLoading ? (
                                                <div className="p-4 text-center text-zinc-500 text-xs font-medium">Loading members...</div>
                                            ) : filteredMembers.length > 0 ? (
                                                filteredMembers.map((member: WorkspaceMember) => (
                                                    <button
                                                        key={member._id}
                                                        onClick={() => handleAddMember(member)}
                                                        className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 text-left transition-all group"
                                                    >
                                                        <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-[10px] font-bold text-zinc-400 group-hover:bg-blue-500 group-hover:text-white transition-colors overflow-hidden">
                                                            {member.avatarUrl ? (
                                                                <img src={member.avatarUrl} alt="" className="w-full h-full object-cover" />
                                                            ) : (
                                                                <>{member.firstName?.[0]}{member.lastName?.[0]}</>
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
                                                <div className="p-8 text-center">
                                                    <p className="text-xs font-bold text-zinc-600">No members found</p>
                                                    <p className="text-[10px] text-zinc-700 mt-1">Invite team to workspace first</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="space-y-3">
                            {/* Current User is always PM */}
                            <div className="flex items-center gap-4 p-4 bg-zinc-900/30 border border-white/5 rounded-2xl">
                                <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-blue-600/20 overflow-hidden">
                                    {user?.avatarUrl ? (
                                        <img src={user.avatarUrl} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                        <>{user?.firstName?.[0] || 'A'}{user?.lastName?.[0] || 'M'}</>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-bold text-white">{user?.firstName} {user?.lastName} (You)</p>
                                    <p className="text-xs text-zinc-500">Project Manager</p>
                                </div>
                                <div className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full">
                                    <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest text-center">Creator</span>
                                </div>
                            </div>

                            {selectedMembers.map((member) => (
                                <div key={member.userId} className="flex items-center gap-4 p-4 bg-zinc-900/30 border border-white/5 rounded-2xl group/row">
                                    <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center text-zinc-400 text-xs font-bold overflow-hidden">
                                        {member.avatarUrl ? (
                                            <img src={member.avatarUrl} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            <>{member.userName.split(' ').map(n => n[0]).join('')}</>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold text-white truncate">{member.userName}</p>
                                        <p className="text-xs text-zinc-500 truncate">{member.email}</p>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="relative group/select">
                                            <select
                                                value={member.roleId}
                                                onChange={(e) => handleRoleChange(member.userId, e.target.value)}
                                                className="bg-zinc-950 border border-white/10 rounded-lg px-3 py-1.5 text-[11px] font-bold text-white focus:outline-none focus:ring-1 focus:ring-blue-500/40 appearance-none pr-8 cursor-pointer"
                                            >
                                                {availableRoles.map((role: ProjectRole) => (
                                                    <option key={role._id} value={role._id}>{role.name}</option>
                                                ))}
                                            </select>
                                            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-zinc-500 pointer-events-none" />
                                        </div>

                                        <button
                                            onClick={() => handleRemoveMember(member.userId)}
                                            className="p-2 rounded-lg hover:bg-red-500/10 text-zinc-600 hover:text-red-400 transition-all"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}

                            {selectedMembers.length === 0 && (
                                <div className="py-12 text-center bg-zinc-900/20 rounded-[2rem] border border-white/5 border-dashed">
                                    <Users className="w-8 h-8 text-zinc-800 mx-auto mb-3" />
                                    <p className="text-xs font-bold text-zinc-600 uppercase tracking-widest">No additional members added</p>
                                    <p className="text-[10px] text-zinc-700 mt-1">Start adding your team by clicking &apos;Add Member&apos;</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-white/5 bg-zinc-900/40 flex items-center justify-end gap-4">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 rounded-xl text-xs font-bold text-zinc-500 hover:text-white transition-all active:scale-95"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={createProjectMutation.isPending}
                        className="px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-xl shadow-blue-500/20 transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none flex items-center gap-2"
                    >
                        {createProjectMutation.isPending ? (
                            <div className="animate-spin rounded-full h-3 w-3 border-2 border-white/30 border-t-white" />
                        ) : <Plus className="w-4 h-4" />}
                        {createProjectMutation.isPending ? 'Launching Project...' : 'Create Project'}
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
