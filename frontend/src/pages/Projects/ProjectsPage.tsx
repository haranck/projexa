import DashboardLayout from "@/components/Layout/DashboardLayout";

export const ProjectsPage = () => {
    return (
        <DashboardLayout>
            <div className="p-8">
                <h1 className="text-3xl font-bold text-white mb-4">Projects</h1>
                <p className="text-zinc-400">Your projects will appear here.</p>
            </div>
        </DashboardLayout>
    );
};
