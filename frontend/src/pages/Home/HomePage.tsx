import { TrendingUp } from "lucide-react";
import { Button } from "../../components/ui/button";
import DashboardLayout from "../../components/Layout/DashboardLayout";

export const HomePage = () => {
    return (
        <DashboardLayout>
            <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4">
                <div className="text-center space-y-6 max-w-md">
                    {/* Icon */}
                    <div className="flex justify-center">
                        <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 flex items-center justify-center border border-white/10">
                            <TrendingUp className="h-12 w-12 text-blue-500" />
                        </div>
                    </div>

                    {/* Text */}
                    <div className="space-y-3">
                        <h2 className="text-2xl font-bold text-white">
                            No project selected
                        </h2>
                        <p className="text-zinc-400 text-sm">
                            Select a project from the top navigation to view analytics and board details.
                        </p>
                    </div>

                    {/* CTA Button */}
                    <Button className="bg-[#3b82f6] hover:bg-[#2563eb] text-white h-11 px-8">
                        Create Project
                    </Button>
                </div>
            </div>
        </DashboardLayout>
    );
};
