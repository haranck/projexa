import DashboardLayout from "@/components/Layout/DashboardLayout";

export const ChatPage = () => {
    return (
        <DashboardLayout>
            <div className="p-8">
                <h1 className="text-3xl font-bold text-white mb-4">Chat</h1>
                <p className="text-zinc-400">Chat with your team members.</p>
            </div>
        </DashboardLayout>
    );
};
