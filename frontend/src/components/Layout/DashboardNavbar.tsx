import { useState } from "react";
import { Search, Bell, Settings as SettingsIcon, ChevronDown, LogOut, User } from "lucide-react";
import { Input } from "../ui/input";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearAuth } from "@/store/slice/authSlice";
import { clearAccessToken } from "@/store/slice/tokenSlice";
import type { RootState } from "@/store/store";
import { FRONTEND_ROUTES } from "@/constants/frontendRoutes";

const DashboardNavbar = () => {
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector((state: RootState) => state.auth.user);

    const handleLogout = () => {
        dispatch(clearAuth());
        dispatch(clearAccessToken());
        navigate(FRONTEND_ROUTES.LOGIN);
    };

    return (
        <nav className="fixed top-0 left-60 right-0 z-30 h-16 bg-[#0a0a0a]/80 backdrop-blur-lg border-b border-white/5">
            <div className="flex items-center justify-between h-full px-6">
                {/* Left Section - Workspace & Project Selectors */}
                <div className="flex items-center gap-4">
                    {/* Workspace Selector */}
                    <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/10">
                        <span className="text-sm text-white">My Space</span>
                        <ChevronDown className="h-4 w-4 text-zinc-400" />
                    </button>

                    {/* Project Selector */}
                    <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/10">
                        <span className="text-sm text-zinc-400">select project</span>
                        <ChevronDown className="h-4 w-4 text-zinc-400" />
                    </button>
                </div>

                {/* Right Section - Search & Actions */}
                <div className="flex items-center gap-4">
                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                        <Input
                            type="text"
                            placeholder="Search..."
                            className="pl-9 w-64 h-9 bg-white/5 border-white/10 text-white placeholder:text-zinc-500 focus:border-blue-500/50"
                        />
                    </div>

                    {/* Notification Bell */}
                    <button className="relative p-2 rounded-lg hover:bg-white/5 transition-colors">
                        <Bell className="h-5 w-5 text-zinc-400" />
                        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                    </button>

                    {/* Settings */}
                    <button className="p-2 rounded-lg hover:bg-white/5 transition-colors">
                        <SettingsIcon className="h-5 w-5 text-zinc-400" />
                    </button>

                    {/* User Avatar & Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                            className="flex items-center gap-2 p-1 rounded-lg hover:bg-white/5 transition-colors"
                        >
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-semibold">
                                {user?.firstName?.[0]}{user?.lastName?.[0]}
                            </div>
                            <ChevronDown className="h-4 w-4 text-zinc-400" />
                        </button>

                        {/* Dropdown Menu */}
                        {isUserMenuOpen && (
                            <div className="absolute right-0 mt-2 w-56 bg-[#1a1a2e] border border-white/10 rounded-lg shadow-xl py-2">
                                <div className="px-4 py-3 border-b border-white/10">
                                    <p className="text-sm font-medium text-white">
                                        {user?.firstName} {user?.lastName}
                                    </p>
                                    <p className="text-xs text-zinc-500">{user?.email}</p>
                                </div>

                                <button className="flex items-center gap-3 w-full px-4 py-2 text-sm text-zinc-300 hover:bg-white/5 transition-colors">
                                    <User className="h-4 w-4" />
                                    <span>Profile</span>
                                </button>

                                <button className="flex items-center gap-3 w-full px-4 py-2 text-sm text-zinc-300 hover:bg-white/5 transition-colors">
                                    <SettingsIcon className="h-4 w-4" />
                                    <span>Settings</span>
                                </button>

                                <div className="border-t border-white/10 mt-2 pt-2">
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-400 hover:bg-white/5 transition-colors"
                                    >
                                        <LogOut className="h-4 w-4" />
                                        <span>Logout</span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default DashboardNavbar;
