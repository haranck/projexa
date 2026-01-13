import { Outlet } from "react-router-dom";
import { AdminSidebar } from "./AdminSidebar";
import { AdminDashboardNavbar } from "./AdminDashboardNavbar";

export const AdminDashboardLayout = () => {
    return (
        <div className="min-h-screen bg-[#0A0A0A] text-white font-sans selection:bg-blue-500/30">
            <AdminSidebar />
            <div className="pl-64 flex flex-col min-h-screen">
                <AdminDashboardNavbar />
                <main className="flex-1 p-8 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};
