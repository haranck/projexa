import DashboardLayout from "@/components/Layout/DashboardLayout";

export const MeetingsPage = () => {
    return (
        <DashboardLayout>
            <div className="p-8">
                <h1 className="text-3xl font-bold text-white mb-4">Meetings</h1>
                <p className="text-zinc-400">Schedule and manage your meetings.</p>
            </div>
        </DashboardLayout>
    );
};
