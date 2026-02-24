import { Search, Loader2, Plus } from "lucide-react";
import type { User } from "@/types/user";

interface Role {
    _id: string;
    name: string;
}

interface AddMemberDropdownProps {
    isOpen: boolean;
    onClose: () => void;
    preparingMember: User | null;
    onMemberSelect: (member: User) => void;
    preparingRoleId: string;
    onRoleChange: (roleId: string) => void;
    searchQuery: string;
    onSearchChange: (query: string) => void;
    roles: Role[];
    members: User[];
    isLoading: boolean;
    onConfirm: () => void;
    onCancel: () => void;
    isAdding?: boolean;
}

export const AddMemberDropdown = ({
    isOpen,
    onClose,
    preparingMember,
    onMemberSelect,
    preparingRoleId,
    onRoleChange,
    searchQuery,
    onSearchChange,
    roles,
    members,
    isLoading,
    onConfirm,
    onCancel,
    isAdding = false,
}: AddMemberDropdownProps) => {
    if (!isOpen) return null;

    return (
        <div className="absolute top-full right-0 mt-2 w-80 bg-[#0d1016] border border-white/10 rounded-[2rem] shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 origin-top-right">
            {preparingMember ? (
                /* Step 2: Role Selection */
                <div className="p-6 space-y-5 animate-in slide-in-from-right-2 duration-200 text-left">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-1">Assign Role</span>
                        <button
                            onClick={onClose}
                            className="p-1 hover:bg-white/5 rounded-lg text-zinc-500 hover:text-white transition-colors"
                        >
                            <Plus className="w-3.5 h-3.5 rotate-45" />
                        </button>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-zinc-900/40 rounded-2xl border border-white/5">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-xs font-bold text-blue-400 overflow-hidden">
                            {preparingMember.avatarUrl ? (
                                <img src={preparingMember.avatarUrl} alt="" className="w-full h-full object-cover" />
                            ) : (
                                <>{preparingMember.firstName?.charAt(0) || preparingMember.email.charAt(0).toUpperCase()}</>
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-[13px] font-bold text-white truncate">{preparingMember.firstName} {preparingMember.lastName}</p>
                            <p className="text-[11px] text-zinc-500 truncate">{preparingMember.email}</p>
                        </div>
                    </div>

                    <div className="space-y-2.5">
                        <select
                            value={preparingRoleId}
                            onChange={(e) => onRoleChange(e.target.value)}
                            className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-3 text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all appearance-none cursor-pointer"
                        >
                            {roles.map((role) => (
                                <option key={role._id} value={role._id} className="bg-zinc-900">
                                    {role.name.toUpperCase()}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                        <button
                            onClick={onCancel}
                            className="flex-1 py-3 text-[11px] font-bold text-zinc-400 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                        >
                            Back
                        </button>
                        <button
                            onClick={onConfirm}
                            disabled={isAdding}
                            className="flex-2 py-3 bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-bold rounded-xl shadow-lg shadow-blue-600/20 transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100"
                        >
                            {isAdding ? (
                                <div className="flex items-center justify-center gap-2">
                                    <Loader2 className="w-3 h-3 animate-spin" />
                                    <span>Adding...</span>
                                </div>
                            ) : (
                                "Add to Project"
                            )}
                        </button>
                    </div>
                </div>
            ) : (
                /* Step 1: Search Members */
                <>
                    <div className="p-4 border-b border-white/5 bg-zinc-900/40">
                        <div className="flex items-center justify-between mb-3 px-1">
                            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Find Workspace Members</span>
                            <button
                                onClick={onClose}
                                className="p-1 hover:bg-white/5 rounded-lg text-zinc-500 hover:text-white transition-colors"
                            >
                                <Plus className="w-3.5 h-3.5 rotate-45" />
                            </button>
                        </div>
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => onSearchChange(e.target.value)}
                                placeholder="Search workspace members..."
                                className="w-full bg-zinc-950 border border-white/5 rounded-xl pl-11 pr-4 py-3 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                                autoFocus
                            />
                        </div>
                    </div>
                    <div className="max-h-72 overflow-y-auto p-2 space-y-1 custom-scrollbar">
                        {isLoading ? (
                            <div className="p-10 text-center text-zinc-500 text-xs font-medium flex flex-col items-center justify-center gap-3">
                                <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
                                Loading members...
                            </div>
                        ) : members.length > 0 ? (
                            members.map((member: User) => (
                                <button
                                    key={member._id}
                                    onClick={() => onMemberSelect(member)}
                                    className="w-full flex items-center gap-3 p-3 rounded-[1.25rem] hover:bg-white/5 text-left transition-all group"
                                >
                                    <div className="w-10 h-10 rounded-xl bg-zinc-800 border border-white/5 flex items-center justify-center text-xs font-bold text-zinc-400 group-hover:bg-blue-500 group-hover:text-white group-hover:border-blue-400/50 transition-all overflow-hidden shrink-0">
                                        {member.avatarUrl ? (
                                            <img src={member.avatarUrl} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            <>{member.firstName?.charAt(0) || member.email.charAt(0).toUpperCase()}</>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[13px] font-bold text-white truncate group-hover:text-blue-100 transition-colors">{member.firstName} {member.lastName}</p>
                                        <p className="text-[11px] text-zinc-500 truncate">{member.email}</p>
                                    </div>
                                    <Plus className="w-4 h-4 text-zinc-700 group-hover:text-blue-400 transition-colors shrink-0" />
                                </button>
                            ))
                        ) : (
                            <div className="p-12 text-center space-y-2">
                                <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-white/5 flex items-center justify-center mx-auto mb-4">
                                    <Search className="w-6 h-6 text-zinc-700" />
                                </div>
                                <p className="text-xs font-bold text-zinc-500">No members found</p>
                                <p className="text-[10px] text-zinc-700">Try a different search or check workspace</p>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};
