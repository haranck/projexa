import DashboardLayout from "@/components/Layout/DashboardLayout";

export const BoardPage = () => {
    return (
        <DashboardLayout>
            <div className="p-8">
                <h1 className="text-3xl font-bold text-white mb-4">Board</h1>
                <p className="text-zinc-400">Visualize your tasks on the Kanban board.</p>
            </div>
        </DashboardLayout>
    );
};
