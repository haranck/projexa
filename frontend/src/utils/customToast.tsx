import toast from 'react-hot-toast';
import { Bell, X } from 'lucide-react';

interface NotificationData {
    title?: string;
    message: string;
}

export const showNotificationToast = (notification: NotificationData) => {
    toast.custom((t) => (
        <div
            className={`${t.visible ? 'animate-enter' : 'animate-leave'
                } max-w-md w-full bg-[#1A1C1E] shadow-2xl rounded-2xl pointer-events-auto flex ring-1 ring-white/10 overflow-hidden border border-white/5 backdrop-blur-xl`}
            style={{
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 20px rgba(59, 130, 246, 0.1)'
            }}
        >
            <div className="flex-1 w-0 p-4">
                <div className="flex items-start">
                    <div className="shrink-0 pt-0.5">
                        <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                            <Bell className="h-5 w-5 text-blue-400" />
                        </div>
                    </div>
                    <div className="ml-3 flex-1">
                        <p className="text-sm font-semibold text-white/90">
                            {notification.title || "New Notification"}
                        </p>
                        <p className="mt-1 text-xs text-white/60 leading-relaxed line-clamp-2">
                            {notification.message}
                        </p>
                    </div>
                </div>
            </div>
            <div className="flex border-l border-white/5">
                <button
                    onClick={() => toast.dismiss(t.id)}
                    className="w-full border border-transparent rounded-none rounded-r-2xl p-4 flex items-center justify-center text-sm font-medium text-white/40 hover:text-white/80 hover:bg-white/5 transition-colors focus:outline-none"
                    aria-label="Close"
                >
                    <X className="h-4 w-4" />
                </button>
            </div>
        </div>
    ), {
        duration: 5000,
        position: 'top-right',
    });
};
