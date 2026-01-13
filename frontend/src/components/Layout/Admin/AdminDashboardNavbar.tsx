import { Bell, Settings, ChevronDown, LogOut } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useAdminLogout } from "@/hooks/Admin/AdminHooks";
import { clearAccessToken } from "@/store/slice/tokenSlice";
import { clearAuth } from "@/store/slice/authSlice";
import { FRONTEND_ROUTES } from "@/constants/frontendRoutes";
import { toast } from "react-hot-toast";

export const AdminDashboardNavbar = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { mutate: logoutAdmin } = useAdminLogout();

    const handleLogout = () => {
        logoutAdmin(undefined, {
            onSettled:() =>{
                dispatch(clearAccessToken());
                dispatch(clearAuth())
                toast.success("Logged out successfully");
                navigate(FRONTEND_ROUTES.ADMIN_LOGIN)
            }
        });
    };

    return (
        <div className="h-16 border-b border-[#1F1F1F] flex items-center justify-end px-8 bg-[#0A0A0A]">
            <div className="flex items-center gap-6">
                <button className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-full transition-colors relative">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-[#0A0A0A]"></span>
                </button>

                <button className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-full transition-colors">
                    <Settings className="w-5 h-5" />
                </button>

                <div className="relative">
                    <div
                        className="flex items-center gap-3 pl-6 border-l border-[#1F1F1F] cursor-pointer"
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    >
                        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
                            A
                        </div>
                        <ChevronDown className={`w-4 h-4 text-zinc-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                    </div>

                    {isDropdownOpen && (
                        <div className="absolute right-0 top-12 w-48 bg-[#141414] border border-[#1F1F1F] rounded-xl shadow-xl py-1 z-50 animate-in fade-in zoom-in-95 duration-200">
                            <button
                                onClick={handleLogout}
                                className="w-full px-4 py-2.5 text-sm text-red-400 hover:bg-[#1F1F1F] hover:text-red-300 flex items-center gap-2 transition-colors"
                            >
                                <LogOut className="w-4 h-4" />
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
