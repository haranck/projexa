import { Plus, Search, Loader2 } from "lucide-react";
import type { User } from "@/types/user";

interface Role {
    _id: string;
    name: string;
}

interface AddMemberDropdownProps {
    isMemberDropdownOpen: boolean;
    setIsMemberDropdownOpen: (open: boolean) => void;
    preparingMember: User | null;
    setPreparingMember: (member: User | null) => void;
    preparingRoleId: string;
    setPreparingRoleId: (roleId: string) => void;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    roles: Role[];
    availableMembers: User[];
    isLoadingMembers: boolean;
    handlePrepareAdd: (member: User) => void;
    handleAddMember: () => void;
    isAddingMember: boolean;
}

export const AddMemberDropdown = ({
    isMemberDropdownOpen,
    setIsMemberDropdownOpen,
    preparingMember,
    setPreparingMember,
    preparingRoleId,
    setPreparingRoleId,
    searchQuery,
    setSearchQuery,
    roles,
    availableMembers,
    isLoadingMembers,
    handlePrepareAdd,
    handleAddMember,
    isAddingMember,
}: AddMemberDropdownProps) => {
    return (
        <div className="relative ml-4">
            <button
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-bold hover:bg-emerald-500/20 transition-all active:scale-95"
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
                                    disabled={isAddingMember}
                                    className="flex-2 py-2 bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-bold rounded-lg shadow-lg shadow-blue-600/20 transition-all active:scale-95 disabled:opacity-50"
                                >
                                    {isAddingMember ? 'Adding...' : 'Confirm Addition'}
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
        </div>
    );
};
