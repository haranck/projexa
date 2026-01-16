import { type ReactNode } from "react";
import Sidebar from "./Sidebar";
import DashboardNavbar from "./DashboardNavbar";

interface DashboardLayoutProps {
    children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
    return (
        <div className="min-h-screen bg-[#0b0e14]">
            <Sidebar />
            <div className="pl-64">
                <DashboardNavbar />
                <main className="pt-20 min-h-screen">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
