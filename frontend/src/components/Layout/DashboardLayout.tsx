import { type ReactNode } from "react";
import Sidebar from "./Sidebar";
import DashboardNavbar from "./DashboardNavbar";

interface DashboardLayoutProps {
    children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#0f0f23] to-[#0a0a0a]">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content Area */}
            <div className="pl-60">
                {/* Navbar */}
                <DashboardNavbar />

                {/* Page Content */}
                <main className="pt-16 min-h-screen">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
