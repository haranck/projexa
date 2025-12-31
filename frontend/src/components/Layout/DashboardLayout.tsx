import { type ReactNode } from "react";
import Sidebar from "./Sidebar";
import DashboardNavbar from "./DashboardNavbar";

interface DashboardLayoutProps {
    children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
    return (
        <div className="min-h-screen bg-[#0b0e14]">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content Area */}
            <div className="pl-64">
                {/* Navbar */}
                <DashboardNavbar />

                {/* Page Content */}
                <main className="pt-20 min-h-screen">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
