import { TrendingUp } from "lucide-react";
import { Button } from "../../components/ui/button";
import DashboardLayout from "../../components/Layout/DashboardLayout";
import {toast} from "react-hot-toast";

export const HomePage = () => {
    const handleClick = () =>{
        toast.success("Project created successfully");
    }
    return (
        <DashboardLayout>
            <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4">
                <div className="text-center space-y-6 max-w-md">
                    <div className="flex justify-center">
                        <div className="w-24 h-24 rounded-2xl bg-linear-gradient-to-br from-blue-500/10 to-purple-500/10 flex items-center justify-center border border-white/10">
                            <TrendingUp className="h-12 w-12 text-blue-500" />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <h2 className="text-2xl font-bold text-white">
                            No project selected
                        </h2>
                        <p className="text-zinc-400 text-sm">
                            Select a project from the top navigation to view analytics and board details.
                        </p>
                    </div>  

                    <Button className="bg-[#3b82f6] hover:bg-[#2563eb] text-white h-11 px-8" onClick={handleClick}>
                        Create Project
                    </Button>
                </div>
            </div>
        </DashboardLayout>
    );
};
