import DashboardLayout from "../../../components/Layout/DashboardLayout";
import { useNavigate } from "react-router-dom";
import type { RootState } from "@/store/store";
import { useUserLogout } from "@/hooks/Auth/AuthHooks";
import { useProfileImageUploadUrl } from "@/hooks/User/UserHooks";
import { useUpdateProfileImage } from "@/hooks/User/UserHooks";
import { useDispatch, useSelector } from "react-redux";
import { clearAccessToken } from "@/store/slice/tokenSlice";
import { clearAuth, updateAvatar } from "@/store/slice/authSlice";
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

export const UserProfile = () => {
    const navigate = useNavigate();
    const user = useSelector((state: RootState) => state.auth.user)
    const dispatch = useDispatch()
    const { mutate: logoutUser } = useUserLogout()
    const [open, setOpen] = useState(false)
    const { mutate: profileImageUploadUrl } = useProfileImageUploadUrl()
    const { mutate: updateProfileImage } = useUpdateProfileImage()

    const handleLogout = () => {
        logoutUser(undefined, {
            onSettled: () => {
                dispatch(clearAuth());
                dispatch(clearAccessToken())
                navigate(FRONTEND_ROUTES.LOGIN)
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

                <div className="relative overflow-hidden bg-linear-to-br from-blue-600/20 to-indigo-600/20 border border-white/10 rounded-3xl p-8 backdrop-blur-sm group">


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
                    {[
                        { label: 'Workspaces', value: '3', icon: LayoutDashboard, color: 'text-blue-400', bg: 'bg-blue-400/5' },
                        { label: 'Owned', value: '1', icon: Briefcase, color: 'text-emerald-400', bg: 'bg-emerald-400/5' },
                        { label: 'Member Of', value: '2', icon: Users, color: 'text-purple-400', bg: 'bg-purple-400/5' },
                    ].map((stat, i) => (
                        <div key={i} className="flex items-center gap-4 p-5 rounded-2xl bg-zinc-900/50 border border-white/5 hover:border-white/10 transition-colors">
                            <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                                <stat.icon className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{stat.value}</p>
                                <p className="text-xs text-zinc-500 font-medium uppercase tracking-wider">{stat.label}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Workspaces Section */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between px-1">
                            <h3 className="text-lg font-bold flex items-center gap-2">
                                <LayoutDashboard className="w-4 h-4 text-blue-500" />
                                My Workspaces
                            </h3>
                            <button className="text-xs font-bold text-blue-500 hover:text-blue-400 transition-colors">View All</button>
                        </div>

                        <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-6 space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center font-bold text-lg text-white">M</div>
                                    <div>
                                        <h4 className="font-bold">MySpace</h4>
                                        <p className="text-[11px] text-zinc-500 font-medium">Professional Plan • Created Jan 2024</p>
                                    </div>
                                </div>
                                <span className="px-2.5 py-1 text-[10px] font-bold rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Active</span>
                            </div>

                            <div className="grid grid-cols-3 gap-2 py-4 border-y border-white/5">
                                <div>
                                    <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest mb-1">Plan</p>
                                    <p className="text-sm font-semibold">Pro</p>
                                </div>
                                <div>
                                    <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest mb-1">Renewal</p>
                                    <p className="text-sm font-semibold">Monthly</p>
                                </div>
                                <div>
                                    <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest mb-1">Renewal Path</p>
                                    <p className="text-sm font-semibold">Feb &apos;25</p>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button className="flex-1 py-2.5 text-xs font-bold rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all">Manage Plan</button>
                                <button className="flex-1 py-2.5 text-xs font-bold rounded-xl bg-red-500/5 hover:bg-red-500/10 text-red-500/70 border border-red-500/10 transition-all">Cancel</button>
                            </div>
                        </div>
                    </div>

                    {/* Settings List */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between px-1">
                            <h3 className="text-lg font-bold flex items-center gap-2">
                                <SettingsIcon className="w-4 h-4 text-zinc-500" />
                                Preferences
                            </h3>
                        </div>

                        <div className="bg-zinc-900/50 border border-white/5 rounded-2xl overflow-hidden divide-y divide-white/5">
                            {[
                                { title: 'Security & Access', desc: 'Password and settings', icon: Shield },
                                { title: 'Personal Information', desc: 'Avatar, name, and contact details', icon: Edit3 },
                                { title: 'Workspace Roles', desc: 'Permissions and team access', icon: Users },
                            ].map((item, i) => (
                                <button key={i} className="w-full flex items-center justify-between p-4 px-5 hover:bg-white/5 transition-all text-left group"
                                    onClick={() => {
                                        if (item.title === 'Security & Access') {
                                            setOpen(true)
                                        }
                                        else if (item.title === 'Personal Information') {
                                            navigate('/profile/personal-info')
                                        }
                                    }}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="p-2.5 rounded-xl bg-zinc-800/50 text-zinc-400 group-hover:text-blue-500 transition-colors border border-white/5">
                                            <item.icon className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm">{item.title}</p>
                                            <p className="text-[11px] text-zinc-500 font-medium">{item.desc}</p>
                                        </div>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-zinc-700 group-hover:text-white transition-colors" />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
                <ChangePasswordModal open={open} onClose={() => setOpen(false)} />
            </div>
        </DashboardLayout>
    );
};
