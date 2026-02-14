import DashboardLayout from "../../../components/Layout/DashboardLayout";
import { useNavigate } from "react-router-dom";
import type { RootState } from "@/store/store";
import { useUserLogout } from "@/hooks/Auth/AuthHooks";
import { useProfileImageUploadUrl } from "@/hooks/User/UserHooks";
import { useUpdateProfileImage } from "@/hooks/User/UserHooks";
import { useDispatch, useSelector } from "react-redux";
import { clearAccessToken } from "@/store/slice/tokenSlice";
import { clearAuth, updateAvatar } from "@/store/slice/authSlice";
import { setCurrentWorkspace } from "@/store/slice/workspaceSlice";
import { FRONTEND_ROUTES } from "@/constants/frontendRoutes";
import { toast } from "react-hot-toast";
import { ChangePasswordModal } from "@/components/modals/ChangePasswordModal"
import {
    LogOut,
    Shield,
    Settings as SettingsIcon,
    LayoutDashboard,
    Users,
    ChevronRight,
    Briefcase,
    Calendar,
    Edit3
} from "lucide-react";
import { useState } from "react";
import axios from "axios";
import EditProfileModal from "@/components/modals/EditProfileModal";
import RoleManagementModal from "@/components/modals/RoleManagementModal";
import { useGetUserWorkspaces } from "@/hooks/Workspace/WorkspaceHooks";


export const UserProfile = () => {
    const navigate = useNavigate();
    const user = useSelector((state: RootState) => state.auth.user)
    const dispatch = useDispatch()
    const { mutate: logoutUser } = useUserLogout()
    const [isChangePasswordOpen, setChangePasswordOpen] = useState(false)
    const [isEditProfileOpen, setEditProfileOpen] = useState(false);
    const [isRoleModalOpen, setRoleModalOpen] = useState(false);
    const { mutate: profileImageUploadUrl } = useProfileImageUploadUrl()
    const { mutate: updateProfileImage } = useUpdateProfileImage()
    const { data: workspacesData, isLoading } = useGetUserWorkspaces();

    const workspaceStats = (() => {
        const workspaces = workspacesData?.data || [];
        const owned = workspaces.filter((w: { ownerId?: string }) => w.ownerId === user?.id).length;
        const total = workspaces.length;
        const member = total - owned;

        return [
            { label: 'Workspaces', value: total.toString(), icon: LayoutDashboard, color: 'text-blue-400', bg: 'bg-blue-400/5' },
            { label: 'Owned', value: owned.toString(), icon: Briefcase, color: 'text-emerald-400', bg: 'bg-emerald-400/5' },
            { label: 'Member Of', value: member.toString(), icon: Users, color: 'text-purple-400', bg: 'bg-purple-400/5' },
        ];
    })();
    console.log('workspacesData', workspacesData)


    const handleLogout = () => {
        logoutUser(undefined, {
            onSettled: () => {
                dispatch(clearAuth());
                dispatch(clearAccessToken())
                navigate(FRONTEND_ROUTES.LANDING, { replace: true })
            }
        })
    }

    const handleProfileImageChange = async (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            profileImageUploadUrl(file.type, {
                onSuccess: async (res) => {
                    const { uploadUrl, imageUrl } = res.data;

                    try {
                        const uploadResponse = await axios.put(uploadUrl, file, {
                            headers: {
                                "Content-Type": file.type,
                            },
                        });

                        if (uploadResponse.status !== 200) throw new Error("Failed to upload to S3");

                        updateProfileImage({
                            userId: user!.id,
                            profileImage: imageUrl,
                        }, {
                            onSuccess: (updateRes) => {
                                dispatch(updateAvatar(updateRes.data.avatarUrl));
                                toast.success("Profile image updated successfully");
                            },
                            onError: () => {
                                toast.error("Failed to update profile image in database");
                            }
                        });
                    } catch (uploadError) {
                        console.error("S3 Upload failed", uploadError);
                        toast.error("Failed to upload image to storage");
                    }
                },
                onError: () => {
                    toast.error("Failed to get upload authorization");
                }
            });
        } catch (error) {
            console.error("Profile image upload failed", error);
            toast.error("An unexpected error occurred during upload");
        }
    };

    return (
        <DashboardLayout>
            <div className="max-w-6xl mx-auto p-8 space-y-10 text-white pb-20">

                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
                        <p className="text-zinc-500 text-sm">Manage your account preferences and settings</p>
                    </div>
                </div>

                <div className="relative overflow-hidden bg-linear-to-br from-blue-1000/20 to-indigo-600/20 border border-white/10 rounded-3xl p-8 backdrop-blur-sm group">


                    <div className="relative flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
                        <div className="relative group w-24 h-24">
                            <div className="w-24 h-24 rounded-2xl bg-white/10 flex items-center justify-center text-3xl font-bold overflow-hidden border border-white/20 shadow-2xl ring-4 ring-white/5">
                                {user?.avatarUrl ? (
                                    <img
                                        src={user.avatarUrl}
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <span className="text-blue-400">
                                        {(user?.firstName?.[0] || 'A')}
                                        {(user?.lastName?.[0] || 'M')}
                                    </span>
                                )}
                            </div>

                            <label
                                htmlFor="profile-upload"
                                className="absolute inset-0 flex items-center justify-center rounded-2xl
                                 bg-black/60 opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                            >
                                <Edit3 className="w-5 h-5 text-white" />
                            </label>

                            <input
                                id="profile-upload"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleProfileImageChange}
                            />
                        </div>


                        <div className="flex-1 space-y-2">
                            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                                {user?.firstName} {user?.lastName}
                                <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full uppercase tracking-wider">
                                    Online
                                </span>
                            </h2>
                            <p className="text-zinc-400 font-medium">{user?.email}</p>
                            <p className="text-zinc-400 font-medium">{user?.phone}</p>
                            <div className="flex flex-wrap items-center gap-4 pt-2">
                                <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                                    <Shield className="w-3.5 h-3.5" />
                                    <span>Verified Account</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                                    <Calendar className="w-3.5 h-3.5" />
                                    <span>Joined Jan 2024</span>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/20 transition-all font-semibold text-sm"
                        >
                            <LogOut className="w-4 h-4" />
                            Logout Session
                        </button>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {workspaceStats.map((stat, i) => (
                        <div key={i} className="flex items-center gap-4 p-5 rounded-2xl bg-zinc-900/50 border border-white/5 hover:border-white/10 transition-colors">
                            <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                                <stat.icon className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">
                                    {isLoading ? (
                                        <span className="animate-pulse bg-zinc-700 h-6 w-8 block rounded-md"></span>
                                    ) : (
                                        stat.value
                                    )}
                                </p>
                                <p className="text-xs text-zinc-500 font-medium uppercase tracking-wider">{stat.label}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex flex-col gap-12">
                    {/* Workspaces Section */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between px-1">
                            <h3 className="text-xl font-bold flex items-center gap-3">
                                <span className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
                                    <LayoutDashboard className="w-5 h-5" />
                                </span>
                                My Workspaces
                            </h3>
                            <p className="text-sm text-zinc-500 font-medium">{workspacesData?.data?.length || 0} Workspaces</p>
                        </div>

                        <div className="space-y-4">
                            {workspacesData?.data?.map((workspace: {
                                _id: string;
                                id?: string;
                                name: string;
                                createdAt: string;
                                subscriptionId?: {
                                    status: string;
                                    endDate: string;
                                    planId?: {
                                        name: string;
                                        interval: string;
                                    }
                                }
                            }) => {
                                const plan = workspace.subscriptionId?.planId;
                                const subscription = workspace.subscriptionId;
                                const renewalDate = subscription?.endDate ? new Date(subscription.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A';
                                const planName = plan?.name || 'Free Plan';
                                const interval = plan?.interval || 'Lifetime';

                                return (
                                    <div
                                        key={workspace._id || workspace.id}
                                        className="relative group/card bg-linear-to-b from-zinc-900/80 to-zinc-950 border border-white/5 rounded-3xl p-6 transition-all duration-300 hover:border-white/10 hover:shadow-2xl hover:shadow-blue-500/5"
                                    >
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                            <div
                                                className="flex items-center gap-5 cursor-pointer flex-1"
                                            >
                                                <div className="w-14 h-14 rounded-2xl bg-zinc-800 flex items-center justify-center font-bold text-xl text-white group-hover/card:bg-blue-600 transition-all duration-300 shadow-inner">
                                                    {workspace.name?.[0]?.toUpperCase() || 'W'}
                                                </div>
                                                <div className="space-y-1">
                                                    <h4 className="text-lg font-bold group-hover/card:text-blue-400 transition-colors">{workspace.name}</h4>
                                                    <div className="flex items-center gap-2">
                                                        <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-white/5 text-zinc-400 border border-white/10">
                                                            {planName}
                                                        </span>
                                                        <span className="text-xs text-zinc-600">•</span>
                                                        <span className="text-[11px] text-zinc-500 font-medium">
                                                            Created {new Date(workspace.createdAt).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap items-center gap-8 md:px-12 md:border-x border-white/5">
                                                <div className="min-w-[80px]">
                                                    <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest mb-1.5">Renewal</p>
                                                    <p className="text-sm font-semibold capitalize text-zinc-300">{interval}</p>
                                                </div>
                                                <div className="min-w-[100px]">
                                                    <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest mb-1.5">Next Bill</p>
                                                    <p className="text-sm font-semibold text-zinc-300">{renewalDate}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest mb-1.5">Status</p>
                                                    <span className="px-2.5 py-1 text-[10px] font-bold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                                        {subscription?.status || 'Active'}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex gap-3">
                                                <button
                                                    onClick={() => {
                                                        dispatch(setCurrentWorkspace({
                                                            _id: workspace._id,
                                                            id: workspace.id,
                                                            name: workspace.name
                                                        }));
                                                        navigate(FRONTEND_ROUTES.PAYMENTS);
                                                    }}
                                                    className="px-6 py-2.5 text-xs font-bold rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all whitespace-nowrap active:scale-95"
                                                >
                                                    Manage Plan
                                                </button>

                                            </div>
                                        </div>
                                    </div>
                                );
                            })}

                            {(!workspacesData?.data || workspacesData.data.length === 0) && (
                                <div className="text-center p-12 bg-zinc-900/30 rounded-3xl border border-white/5 border-dashed">
                                    <p className="text-zinc-500 text-sm">No workspaces found.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Settings List */}
                    <div className="space-y-6 pt-4">
                        <div className="flex items-center justify-between px-1">
                            <h3 className="text-xl font-bold flex items-center gap-3">
                                <span className="p-2 rounded-lg bg-zinc-800 text-zinc-400">
                                    <SettingsIcon className="w-5 h-5" />
                                </span>
                                Preferences
                            </h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {[
                                { title: 'Security & Access', desc: 'Password and settings', icon: Shield, color: 'hover:border-blue-500/20' },
                                { title: 'Personal Information', desc: 'Profile and contact details', icon: Edit3, color: 'hover:border-purple-500/20' },
                                { title: 'Manage Roles', desc: 'Permissions and team access', icon: Users, color: 'hover:border-emerald-500/20' },
                            ].map((item, i) => (
                                <button
                                    key={i}
                                    className={`relative group flex flex-col items-start p-6 bg-zinc-900/50 border border-white/5 rounded-3xl transition-all duration-300 hover:bg-white/5 ${item.color} text-left text-white`}
                                    onClick={() => {
                                        if (item.title === 'Security & Access') {
                                            setChangePasswordOpen(true)
                                        }
                                        else if (item.title === 'Personal Information') {
                                            setEditProfileOpen(true)
                                        }
                                        else if (item.title === 'Manage Roles') {
                                            setRoleModalOpen(true)
                                        }
                                    }}
                                >
                                    <div className="mb-4 p-3 rounded-2xl bg-zinc-800/50 text-zinc-400 group-hover:text-blue-500 group-hover:scale-110 transition-all duration-300 border border-white/5">
                                        <item.icon className="w-6 h-6" />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="font-bold text-base flex items-center gap-2">
                                            {item.title}
                                            <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300" />
                                        </p>
                                        <p className="text-xs text-zinc-500 font-medium leading-relaxed">{item.desc}</p>
                                    </div>

                                    <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-blue-500/0 group-hover:bg-blue-500/20 transition-all" />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
                <ChangePasswordModal open={isChangePasswordOpen} onClose={() => setChangePasswordOpen(false)} />
                <EditProfileModal open={isEditProfileOpen} onClose={() => setEditProfileOpen(false)} />
                <RoleManagementModal open={isRoleModalOpen} onClose={() => setRoleModalOpen(false)} />

            </div>
        </DashboardLayout>
    );
};
