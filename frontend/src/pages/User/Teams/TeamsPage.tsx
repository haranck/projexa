import { Calendar, MoreVertical, Mail } from "lucide-react";
import DashboardLayout from "../../../components/Layout/DashboardLayout";
import { useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { useGetUserWorkspaces, useGetWorkspaceMembers } from "../../../hooks/Workspace/WorkspaceHooks";
import type { Workspace } from "@/types/workspace";
import { useInviteMembers } from "../../../hooks/Workspace/WorkspaceHooks";
import { toast } from "react-hot-toast";
import { getErrorMessage } from "@/utils/errorHandler";

interface Members {
    _id: string;
    email: string;
    role: string;
    firstName: string;
    lastName: string;
    avatarUrl: string;
    createdAt: string;
}

export const TeamsPage = () => {

    const [email, setEmail] = useState<string>("")
    const currentWorkspace = useSelector((state: RootState) => state.workspace.currentWorkspace)
    const { data: workspacesData } = useGetUserWorkspaces();
    const workspaceId = currentWorkspace?._id || currentWorkspace?.id || '';
    const selectedWorkspace = workspacesData?.data?.find((ws: Workspace) =>
        (ws._id === workspaceId) || (ws.id === workspaceId)
    );
    const { mutate: inviteMember, isPending: isInviting } = useInviteMembers();
    const { data: membersData, isLoading: isLoadingMembers } = useGetWorkspaceMembers(workspaceId);

    const handleInvite = () => {
        if (!email) return toast.error("Please enter an email");
        inviteMember({
            workspaceId: selectedWorkspace?._id || '',
            email: email,
        }, {
            onSuccess: () => {
                toast.success("Member invited successfully");
                setEmail("");
            },
            onError: (error) => {
                const err = getErrorMessage(error)
                console.log('Failed invite member', err)
                toast.error(err || "Failed to invite member");
            }
        })
    };


    return (
        <DashboardLayout>
            <div className="p-8 max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Teams & Members</h1>
                    <p className="text-zinc-400">Manage your team members and their roles here.</p>
                </div>

                {/* Invite Members Section */}
                <div className="bg-[#0A0A0A] border border-zinc-800/50 rounded-2xl p-6 md:p-8">
                    <div className="mb-6">
                        <h2 className="text-lg font-semibold text-white mb-1">Invite Members</h2>
                        <p className="text-sm text-zinc-400">
                            Add up to 5 members to your team.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                                Email
                            </label>
                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="flex-1 bg-[#050505] border border-zinc-800 rounded-lg flex items-center px-4 py-3 transition-colors focus-within:border-zinc-700">
                                    <Mail className="w-5 h-5 text-zinc-500 mr-3" />
                                    <input
                                        type="email"
                                        placeholder="member@company.com"
                                        className="bg-transparent border-none outline-none text-zinc-300 w-full placeholder:text-zinc-600"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                                <div className="flex gap-3">
                                    <button
                                        onClick={handleInvite}
                                        disabled={isInviting}
                                        className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20 transition-all font-medium text-sm whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                    >
                                        {isInviting ? 'Sending...' : 'Send Invitation'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Existing Members Section */}
                <div className="bg-[#0A0A0A] border border-zinc-800/50 rounded-2xl overflow-hidden">
                    <div className="p-6 md:p-8 border-b border-zinc-800/50">
                        <h2 className="text-lg font-semibold text-white">Existing Members</h2>
                    </div>

                    <div className="divide-y divide-zinc-800/50">
                        {isLoadingMembers ? (
                            <div className="p-8 text-center text-zinc-500">Loading members...</div>
                        ) : membersData?.data?.length === 0 ? (
                            <div className="p-8 text-center text-zinc-500">No members found</div>
                        ) : (
                            membersData?.data?.map((member: Members) => {
                                const isOwner = selectedWorkspace?.ownerId === member._id;
                                return (
                                    <div
                                        key={member._id}
                                        className="p-4 md:p-6 flex flex-col md:flex-row items-center justify-between gap-4 hover:bg-zinc-900/30 transition-colors group"
                                    >
                                        <div className="flex items-center gap-4 w-full md:w-auto">
                                            <div className="relative">
                                                <img
                                                    src={member.avatarUrl || `https://ui-avatars.com/api/?name=${member.firstName}+${member.lastName}&background=random`}
                                                    alt={member.firstName}
                                                    className="w-12 h-12 rounded-full object-cover border-2 border-zinc-800 group-hover:border-zinc-700 transition-colors"
                                                />
                                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#0A0A0A]"></div>
                                            </div>
                                            <div>
                                                <h3 className="text-white font-medium">{member.firstName} {member.lastName}</h3>
                                                <p className="text-sm text-zinc-500">{member.email}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-medium border ${isOwner ? 'text-purple-400 bg-purple-400/10 border-purple-400/20' : 'text-slate-400 bg-slate-400/10 border-slate-400/20'}`}
                                            >
                                                {isOwner ? 'Owner' : 'Member'}
                                            </span>

                                            <div className="flex items-center gap-2 text-zinc-500 text-sm">
                                                <Calendar className="w-4 h-4" />
                                                <span>{new Date(member.createdAt).toLocaleDateString()}</span>
                                            </div>

                                            <button className="p-2 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-lg transition-all">
                                                <MoreVertical className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                )
                            })
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};
