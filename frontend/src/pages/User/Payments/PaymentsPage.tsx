import DashboardLayout from "../../../components/Layout/DashboardLayout";

export const PaymentsPage = () => {
    return (
        <DashboardLayout>
            <div className="p-8">
                <h1 className="text-3xl font-bold text-white mb-4">Payments</h1>
                <p className="text-zinc-400">Manage your payments.</p>
            </div>
        </DashboardLayout>
    );
};
