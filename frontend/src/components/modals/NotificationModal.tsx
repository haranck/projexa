import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FRONTEND_ROUTES } from '../../constants/frontendRoutes';
import { Bell, CheckCheck, Calendar, ExternalLink, UserPlus, FileText, AlertTriangle } from 'lucide-react';
import { useNotifications, useMarkAsRead, useMarkAllAsRead } from '../../hooks/Notification/NotificationHooks';
import { formatTimeAgo } from '../../utils/timeAgo';
import type { Notification, NotificationEventType } from '../../types/notification';
import { NOTIFICATION_EVENT_TYPES } from '../../types/notification';

interface NotificationModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({ isOpen, onClose }) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    const { data: notificationsResponse, isLoading } = useNotifications();
    const { mutate: markAsRead } = useMarkAsRead();
    const { mutate: markAllAsRead } = useMarkAllAsRead();


    const handleNotificationClick = (notification: Notification) => {
        if (!notification.isRead) {
            markAsRead(notification._id);
        }

        if (notification.resourceType === 'issue' || notification.eventType.includes('ISSUE')) {
            navigate(FRONTEND_ROUTES.BACKLOG, { state: { selectedIssueId: notification.resourceId } });
        } else if (notification.resourceType === 'project' || notification.eventType.includes('PROJECT')) {
            navigate(FRONTEND_ROUTES.PROJECTS);
        } else if (notification.eventType.includes('EPIC')) {
            navigate(FRONTEND_ROUTES.BACKLOG, { state: { selectedIssueId: notification.resourceId } });
        }

        onClose();
    };

    const notifications: Notification[] = notificationsResponse?.data || [];
    const unreadCount = notifications.filter((n) => !n.isRead).length;

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const getIcon = (type: NotificationEventType) => {
        switch (type) {
            case NOTIFICATION_EVENT_TYPES.ISSUE_CREATED:
            case NOTIFICATION_EVENT_TYPES.ISSUE_UPDATED:
                return <FileText className="h-4 w-4 text-orange-400" />;
            case NOTIFICATION_EVENT_TYPES.ISSUE_DELETED:
                return <AlertTriangle className="h-4 w-4 text-red-500" />;
            case NOTIFICATION_EVENT_TYPES.PROJECT_CREATED:
                return <Calendar className="h-4 w-4 text-purple-400" />;
            case NOTIFICATION_EVENT_TYPES.PROJECT_MEMBER_ADDED:
                return <UserPlus className="h-4 w-4 text-blue-400" />;
            default:
                return <Bell className="h-4 w-4 text-zinc-400" />;
        }
    };

    const getTitle = (type: NotificationEventType) => {
        return type.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
    };

    return (
        <div
            ref={modalRef}
            className="absolute top-full right-0 mt-3 w-96 bg-[#14171f] border border-white/5 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 z-50 flex flex-col"
            style={{ maxHeight: '80vh' }}
        >
            {/* Header */}
            <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between bg-white/2">
                <div className="flex items-center gap-2.5">
                    <div className="relative">
                        <Bell className="h-5 w-5 text-white" />
                        {unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 w-2 h-2 bg-rose-500 rounded-full animate-pulse" />
                        )}
                    </div>
                    <h3 className="font-bold text-white text-sm">Notifications</h3>
                </div>
                {unreadCount > 0 && (
                    <button
                        onClick={() => markAllAsRead()}
                        className="flex items-center gap-1.5 text-[11px] font-bold text-zinc-400 hover:text-white transition-colors group"
                    >
                        <CheckCheck className="h-3.5 w-3.5 group-hover:scale-110 transition-transform" />
                        Mark all read
                    </button>
                )}
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto custom-scrollbar max-h-[400px]">
                {isLoading ? (
                    <div className="p-8 flex flex-col items-center justify-center gap-3">
                        <div className="w-8 h-8 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
                        <p className="text-xs text-zinc-500 font-medium">Loading notifications...</p>
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="p-12 flex flex-col items-center justify-center text-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center">
                            <Bell className="h-6 w-6 text-zinc-600" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-zinc-400">All caught up!</p>
                            <p className="text-xs text-zinc-500 mt-1">No new notifications for you.</p>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col">
                        {notifications.map((notification) => (
                            <div
                                key={notification._id}
                                onClick={() => handleNotificationClick(notification)}
                                className={`group relative px-5 py-4 border-b border-white/5 transition-all cursor-pointer hover:bg-white/2 ${!notification.isRead ? 'bg-blue-500/2' : ''}`}
                            >
                                <div className="flex gap-4">
                                    <div className={`mt-0.5 w-9 h-9 shrink-0 rounded-xl flex items-center justify-center transition-colors ${!notification.isRead ? 'bg-blue-500/10' : 'bg-white/5'}`}>
                                        {getIcon(notification.eventType)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between gap-2">
                                            <p className={`text-sm font-bold truncate ${!notification.isRead ? 'text-white' : 'text-zinc-400'}`}>
                                                {getTitle(notification.eventType)}
                                            </p>
                                            <span className="text-[10px] text-zinc-500 font-medium whitespace-nowrap">
                                                {formatTimeAgo(notification.createdAt)}
                                            </span>
                                        </div>
                                        <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                                            {notification.message}
                                        </p>
                                    </div>
                                    {!notification.isRead && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                markAsRead(notification._id);
                                            }}
                                            className="mt-1 w-7 h-7 flex items-center justify-center rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white transition-all duration-300 group/btn shadow-[0_0_8px_rgba(59,130,246,0.15)] hover:shadow-[0_0_12px_rgba(59,130,246,0.4)]"
                                            title="Mark as read"
                                        >
                                            <CheckCheck className="h-4 w-4 transform group-hover/btn:scale-110" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="p-3 bg-white/2 border-t border-white/5">
                <button className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white text-xs font-bold transition-all flex items-center justify-center gap-2 group">
                    See All Notifications
                    <ExternalLink className="h-3 w-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </button>
            </div>
        </div>
    );
};
