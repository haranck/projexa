import { useState } from "react";
import { TrendingUp, Plus, Layout, Sparkles, Command } from "lucide-react";
import { Button } from "../../../components/ui/button";
import DashboardLayout from "../../../components/Layout/DashboardLayout";
import { CreateProjectModal } from "../../../components/modals/CreateProjectModal";

export const HomePage = () => {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    return (
        <DashboardLayout>
            <div className="relative min-h-[calc(100vh-5rem)] flex items-center justify-center px-6 overflow-hidden">
                <div className="absolute top-1/4 -left-20 w-80 h-80 bg-blue-600/10 blur-[100px] rounded-full" />
                <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-purple-600/10 blur-[100px] rounded-full" />

                <div className="relative z-10 text-center space-y-10 max-w-2xl">
                    <div className="flex justify-center">
                        <div className="group relative">
                            <div className="absolute -inset-1 bg-linear-to-r from-blue-600 to-purple-600 rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
                            <div className="relative w-28 h-28 rounded-3xl bg-[#0b0e14] border border-white/10 flex items-center justify-center shadow-2xl">
                                <TrendingUp className="h-14 w-14 text-blue-500 animate-pulse" />
                                <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                                    <Sparkles className="w-4 h-4 text-white" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-zinc-400 text-xs font-bold uppercase tracking-widest mb-2">
                            Welcome to Projexa
                        </div>
                        <h1 className="text-5xl font-black text-white tracking-tight leading-tight">
                            Your workspace is <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-purple-500">ready for liftoff</span>.
                        </h1>
                        <p className="text-zinc-500 text-lg font-medium max-w-lg mx-auto leading-relaxed">
                            Create your first project to start tracking tasks, managing sprints, and collaborating with your team in real-time.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Button
                            className="bg-blue-600 hover:bg-blue-500 text-white h-14 px-10 rounded-2xl text-base font-bold shadow-xl shadow-blue-500/20 transition-all hover:scale-105 active:scale-95 flex items-center gap-3"
                            onClick={() => setIsCreateModalOpen(true)}
                        >
                            <Plus className="w-5 h-5" />
                            Create Project
                        </Button>
                    </div>

                    <div className="pt-8 flex items-center justify-center gap-8 text-zinc-600">
                        <div className="flex items-center gap-2">
                            <Command className="w-4 h-4" />
                            <span className="text-xs font-bold uppercase tracking-widest">Team ProJexa</span>
                        </div>
                        <div className="w-1 h-1 rounded-full bg-zinc-800" />
                        <div className="flex items-center gap-2">
                            <Layout className="w-4 h-4" />
                            <span className="text-xs font-bold uppercase tracking-widest">Kanban Boards</span>
                        </div>
                    </div>
                </div>
            </div>

            <CreateProjectModal
                open={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
            />
        </DashboardLayout>
    );
};
