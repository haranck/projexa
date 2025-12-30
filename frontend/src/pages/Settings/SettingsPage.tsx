import DashboardLayout from "@/components/Layout/DashboardLayout";

export const SettingsPage = () => {
    return (
        <DashboardLayout>
            <div className="p-8">
                <h1 className="text-3xl font-bold text-white mb-4">Settings</h1>
                <p className="text-zinc-400">Manage your account settings.</p>
            </div>
        </DashboardLayout>
    );
};
