import React, { useState } from 'react';
import {
    X,
    Shield,
    Edit2,
    Trash2,
    Plus,
    Check,
    AlertCircle,
    Save
} from 'lucide-react';
import {
    useGetRoles,
    useCreateRole,
    useUpdateRole,
    useDeleteRole
} from '../../hooks/Workspace/WorkspaceHooks';
import { toast } from 'react-hot-toast';
import { getErrorMessage } from '@/utils/errorHandler';
import { ConfirmationModal } from '../common/ConfirmationModal';

const AVAILABLE_PERMISSIONS = [
    { key: "CREATE_EPIC", label: "Create Epic" },
    { key: "COMPLETE_SPRINT", label: "Complete Sprint" },
    { key: "CREATE_SPRINT", label: "Create Sprint" },
    { key: "ASSIGN_TASK", label: "Assign Task" },
    { key: "CREATE_TASK", label: "Create Task" },
    { key: "UPDATE_TASK", label: "Update Task" }
];

interface RoleManagementModalProps {
    open: boolean;
    onClose: () => void;
}

interface IRole {
    _id: string;
    name: string;
    permissions: string[];
}

const RoleManagementModal: React.FC<RoleManagementModalProps> = ({ open, onClose }) => {
    const { data: rolesData, isLoading: isRolesLoading, refetch } = useGetRoles();
    const createRoleMutation = useCreateRole();
    const updateRoleMutation = useUpdateRole();
    const deleteRoleMutation = useDeleteRole();

    const [newRoleName, setNewRoleName] = useState('');
    const [newRolePermissions, setNewRolePermissions] = useState<string[]>([]);
    const [editingRoleId, setEditingRoleId] = useState<string | null>(null);
    const [editRoleName, setEditRoleName] = useState('');
    const [editRolePermissions, setEditRolePermissions] = useState<string[]>([]);

    // Deletion confirmation state
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [roleToDelete, setRoleToDelete] = useState<IRole | null>(null);

    if (!open) return null;

    const handleCreateRole = () => {
        if (!newRoleName.trim()) {
            toast.error("Role name cannot be empty");
            return;
        }
        if (newRolePermissions.length === 0) {
            toast.error("Please select at least one permission");
            return;
        }

        createRoleMutation.mutate({
            name: newRoleName,
            permissions: newRolePermissions
        }, {
            onSuccess: () => {
                toast.success("Role created successfully");
                setNewRoleName('');
                setNewRolePermissions([]);
                refetch();
            },
            onError: (err: unknown) => {
                const error = getErrorMessage(err);
                toast.error(error || "Failed to create role");
            }
        });
    };

    const handleStartEdit = (role: IRole) => {
        setEditingRoleId(role._id);
        setEditRoleName(role.name);
        setEditRolePermissions(role.permissions);
    };

    const handleSaveEdit = (roleId: string) => {
        if (!editRoleName.trim()) {
            toast.error("Role name cannot be empty");
            return;
        }
        if (editRolePermissions.length === 0) {
            toast.error("Please select at least one permission");
            return;
        }

        updateRoleMutation.mutate({
            roleId,
            name: editRoleName,
            permissions: editRolePermissions
        }, {
            onSuccess: () => {
                toast.success("Role updated successfully");
                setEditingRoleId(null);
                refetch();
            },
            onError: (err: unknown) => {
                const error = getErrorMessage(err);
                toast.error(error || "Failed to update role");
            }
        });
    };

    const handleDeleteClick = (role: IRole) => {
        setRoleToDelete(role);
        setIsDeleteDialogOpen(true);
    };

    const handleConfirmDelete = () => {
        if (!roleToDelete) return;

        deleteRoleMutation.mutate(roleToDelete._id, {
            onSuccess: () => {
                toast.success("Role deleted successfully");
                setIsDeleteDialogOpen(false);
                setRoleToDelete(null);
                refetch();
            },
            onError: (err: unknown) => {
                const error = getErrorMessage(err);
                toast.error(error || "Failed to delete role");
            }
        });
    };

    const togglePermission = (permissions: string[], setPermissions: (p: string[]) => void, key: string) => {
        if (permissions.includes(key)) {
            setPermissions(permissions.filter(p => p !== key));
        } else {
            setPermissions([...permissions, key]);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-zinc-950 border border-white/10 w-full max-w-4xl max-h-[85vh] rounded-[2rem] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
                {/* Header */}
                <div className="p-6 border-b border-white/5 flex items-center justify-between bg-zinc-900/40">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500 border border-blue-500/20">
                            <Shield className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white tracking-tight">Manage Roles & Permissions</h2>
                            <p className="text-zinc-500 text-xs font-medium">Define access levels for your team members</p>
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
                <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
                    {/* Existing Roles Grid */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <span className="w-1 h-5 bg-blue-500 rounded-full" />
                                Existing Roles
                            </h3>
                            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-2 py-0.5 bg-zinc-900 rounded-full border border-white/5">
                                {rolesData?.data?.length || 0} Total
                            </span>
                        </div>

                        {isRolesLoading ? (
                            <div className="flex items-center justify-center py-10">
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500" />
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {rolesData?.data?.map((role: IRole) => (
                                    <div
                                        key={role._id}
                                        className="group relative bg-[#0a0c10] border border-white/5 rounded-2xl p-5 transition-all duration-300 hover:border-blue-500/30 hover:bg-[#0d1016] flex flex-col min-h-[180px]"
                                    >
                                        {/* Actions Overlay */}
                                        <div className="absolute top-4 right-4 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                            {editingRoleId === role._id ? (
                                                <>
                                                    <button
                                                        onClick={() => handleSaveEdit(role._id)}
                                                        className="p-1.5 rounded-md bg-blue-500 text-white hover:bg-blue-600 transition-all shadow-lg shadow-blue-500/20"
                                                    >
                                                        <Save className="w-3.5 h-3.5" />
                                                    </button>
                                                    <button
                                                        onClick={() => setEditingRoleId(null)}
                                                        className="p-1.5 rounded-md bg-white/10 text-zinc-400 hover:text-white transition-all"
                                                    >
                                                        <X className="w-3.5 h-3.5" />
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <button
                                                        onClick={() => handleStartEdit(role)}
                                                        className="p-1.5 rounded-md bg-white/5 text-zinc-400 hover:text-blue-400 hover:bg-blue-500/10 transition-all"
                                                    >
                                                        <Edit2 className="w-3.5 h-3.5" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteClick(role)}
                                                        className="p-1.5 rounded-md bg-white/5 text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </button>
                                                </>
                                            )}
                                        </div>

                                        <div className="space-y-4 flex-1">
                                            {editingRoleId === role._id ? (
                                                <input
                                                    type="text"
                                                    value={editRoleName}
                                                    onChange={(e) => setEditRoleName(e.target.value)}
                                                    className="bg-zinc-950 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/40 w-full"
                                                    placeholder="Role Name"
                                                />
                                            ) : (
                                                <h4 className="text-base font-bold text-white tracking-tight uppercase">
                                                    {role.name}
                                                </h4>
                                            )}

                                            <ul className="space-y-2.5">
                                                {AVAILABLE_PERMISSIONS.map((perm) => {
                                                    const isSelected = editingRoleId === role._id
                                                        ? editRolePermissions.includes(perm.key)
                                                        : role.permissions.includes(perm.key);

                                                    if (editingRoleId !== role._id && !isSelected) return null;

                                                    return (
                                                        <li
                                                            key={perm.key}
                                                            className="flex items-center gap-2 group/item"
                                                        >
                                                            {editingRoleId === role._id ? (
                                                                <button
                                                                    onClick={() => togglePermission(editRolePermissions, setEditRolePermissions, perm.key)}
                                                                    className={`flex items-center gap-2 w-full text-left transition-all ${isSelected ? 'text-blue-400' : 'text-zinc-600'}`}
                                                                >
                                                                    <div className={`w-1.5 h-1.5 rounded-full transition-all ${isSelected ? 'bg-blue-500 shadow-[0_0_6px_rgba(59,130,246,0.6)]' : 'bg-zinc-800'}`} />
                                                                    <span className="text-[11px] font-medium tracking-wide">{perm.label}</span>
                                                                </button>
                                                            ) : (
                                                                <>
                                                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_6px_rgba(59,130,246,0.6)]" />
                                                                    <span className="text-[11px] font-medium text-zinc-400 tracking-wide">{perm.label}</span>
                                                                </>
                                                            )}
                                                        </li>
                                                    );
                                                })}
                                            </ul>
                                        </div>
                                    </div>
                                ))}
                                {rolesData?.data?.length === 0 && (
                                    <div className="col-span-full text-center py-12 bg-zinc-900/20 rounded-2xl border border-white/5 border-dashed">
                                        <AlertCircle className="w-8 h-8 text-zinc-700 mx-auto mb-3" />
                                        <p className="text-zinc-500 text-xs font-medium">No roles found. Create one below.</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Create New Role */}
                    <div className="pt-6 border-t border-white/5 space-y-6">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            <span className="w-1 h-5 bg-emerald-500 rounded-full" />
                            Create New Role
                        </h3>

                        <div className="bg-zinc-900/30 border border-white/5 rounded-2xl p-6 space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-1">Role Name</label>
                                <input
                                    type="text"
                                    value={newRoleName}
                                    onChange={(e) => setNewRoleName(e.target.value)}
                                    placeholder="e.g. Project Lead"
                                    className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-3 text-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all placeholder:text-zinc-800 text-sm"
                                />
                            </div>

                            <div className="space-y-4">
                                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-1">Assign Permissions</label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                    {AVAILABLE_PERMISSIONS.map((perm) => (
                                        <button
                                            key={perm.key}
                                            onClick={() => togglePermission(newRolePermissions, setNewRolePermissions, perm.key)}
                                            className={`flex items-center gap-3 p-3.5 rounded-xl border transition-all duration-300 group
                                                ${newRolePermissions.includes(perm.key)
                                                    ? 'bg-blue-500/10 border-blue-500/30 text-blue-400'
                                                    : 'bg-zinc-950/50 border-white/5 text-zinc-500 hover:border-white/10 hover:bg-zinc-900/50'
                                                }`}
                                        >
                                            <div className={`w-4 h-4 rounded-md border-2 flex items-center justify-center transition-all duration-300
                                                ${newRolePermissions.includes(perm.key)
                                                    ? 'bg-blue-500 border-blue-500'
                                                    : 'border-white/10 group-hover:border-white/20'
                                                }`}
                                            >
                                                {newRolePermissions.includes(perm.key) && <Check className="w-3 h-3 text-zinc-950 stroke-[4px]" />}
                                            </div>
                                            <span className="text-[11px] font-bold uppercase tracking-wider">{perm.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
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
                        onClick={handleCreateRole}
                        disabled={createRoleMutation.isPending}
                        className="px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-xl shadow-blue-500/20 transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none flex items-center gap-2"
                    >
                        {createRoleMutation.isPending ? (
                            <div className="animate-spin rounded-full h-3 w-3 border-2 border-white/30 border-t-white" />
                        ) : <Plus className="w-4 h-4" />}
                        {createRoleMutation.isPending ? 'Processing...' : 'Add Custom Role'}
                    </button>
                </div>
            </div>

            <ConfirmationModal
                isOpen={isDeleteDialogOpen}
                onClose={() => {
                    setIsDeleteDialogOpen(false);
                    setRoleToDelete(null);
                }}
                onConfirm={handleConfirmDelete}
                title="Delete Role"
                description={`Are you sure you want to delete the "${roleToDelete?.name}" role? This action cannot be undone.`}
                confirmText="Delete Role"
                variant="danger"
                isLoading={deleteRoleMutation.isPending}
            />

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

export default RoleManagementModal;
