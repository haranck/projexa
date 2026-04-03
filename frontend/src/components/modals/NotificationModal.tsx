import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FRONTEND_ROUTES } from '../../constants/frontendRoutes';
import { Bell, CheckCheck, Calendar, ExternalLink, UserPlus, FileText, AlertTriangle, X } from 'lucide-react';
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
        const handleClickOutside = (event: MouseEvent | TouchEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        if (isOpen) {
            // Delay so the open-trigger click doesn't immediately close
            const t = setTimeout(() => {
                document.addEventListener('mousedown', handleClickOutside);
                document.addEventListener('touchstart', handleClickOutside, { passive: true });
            }, 50);
            return () => {
                clearTimeout(t);
                document.removeEventListener('mousedown', handleClickOutside);
                document.removeEventListener('touchstart', handleClickOutside);
            };
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('touchstart', handleClickOutside);
        };
    }, [isOpen, onClose]);

    // Lock body scroll on mobile when open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

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
        <>
            {/* Full-screen backdrop — sits behind modal, above page content */}
            <div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm"
                style={{ zIndex: 998 }}
                onClick={onClose}
            />

            {/* Modal panel */}
            <div
                ref={modalRef}
                style={{ zIndex: 999, maxHeight: '88vh' }}
                className={[
                    'fixed flex flex-col overflow-hidden',
                    // Mobile: bottom sheet
                    'bottom-0 left-0 right-0 w-full rounded-t-[2rem]',
                    'border-t border-white/10',
                    // Desktop: dropdown below bell
                    'sm:bottom-auto sm:left-auto sm:right-6 sm:top-[72px]',
                    'sm:w-[400px] sm:rounded-2xl sm:border',
                    // Background
                    'bg-[#14171f]',
                    'shadow-2xl',
                ].join(' ')}
            >
                {/* Mobile drag handle */}
                <div
                    className="w-full flex items-center justify-center pt-3 pb-1 sm:hidden shrink-0 cursor-pointer select-none"
                    onClick={onClose}
                >
                    <div className="w-10 h-1 bg-zinc-600 rounded-full" />
                </div>

                {/* Header */}
                <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-2.5">
                        <div className="relative">
                            <Bell className="h-5 w-5 text-white" />
                            {unreadCount > 0 && (
                                <span className="absolute -top-1 -right-1 w-2 h-2 bg-rose-500 rounded-full animate-pulse" />
                            )}
                        </div>
                        <h3 className="font-bold text-white text-sm">Notifications</h3>
                        {unreadCount > 0 && (
                            <span className="ml-1 text-[10px] font-bold bg-blue-500/15 text-blue-400 px-2 py-0.5 rounded-full">
                                {unreadCount} new
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        {unreadCount > 0 && (
                            <button
                                onClick={() => markAllAsRead()}
                                className="flex items-center gap-1.5 text-[11px] font-bold text-zinc-400 hover:text-white transition-colors group"
                            >
                                <CheckCheck className="h-3.5 w-3.5 group-hover:scale-110 transition-transform" />
                                <span className="hidden sm:inline">Mark all read</span>
                                <span className="sm:hidden">Read all</span>
                            </button>
                        )}
                        {/* Close button visible on mobile */}
                        <button
                            onClick={onClose}
                            className="sm:hidden p-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-zinc-400 hover:text-white ml-1"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                </div>

                {/* Scrollable notification list */}
                <div
                    className="flex-1 overflow-y-auto overscroll-contain"
                    style={{ maxHeight: 'calc(88vh - 150px)' }}
                >
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
                                    className={`group relative px-5 py-4 border-b border-white/5 transition-all cursor-pointer active:bg-white/5 hover:bg-white/[0.02] ${!notification.isRead ? 'bg-blue-500/[0.03]' : ''}`}
                                >
                                    <div className="flex gap-3 sm:gap-4">
                                        <div className={`mt-0.5 w-9 h-9 shrink-0 rounded-xl flex items-center justify-center transition-colors ${!notification.isRead ? 'bg-blue-500/10' : 'bg-white/5'}`}>
                                            {getIcon(notification.eventType)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between gap-2">
                                                <p className={`text-sm font-bold truncate ${!notification.isRead ? 'text-white' : 'text-zinc-400'}`}>
                                                    {getTitle(notification.eventType)}
                                                </p>
                                                <span className="text-[10px] text-zinc-500 font-medium whitespace-nowrap shrink-0">
                                                    {formatTimeAgo(notification.createdAt)}
                                                </span>
                                            </div>
                                            <p className="text-xs text-zinc-500 mt-1 leading-relaxed line-clamp-2">
                                                {notification.message}
                                            </p>
                                        </div>
                                        {!notification.isRead && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    markAsRead(notification._id);
                                                }}
                                                className="mt-1 w-7 h-7 shrink-0 flex items-center justify-center rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white transition-all duration-300 group/btn shadow-[0_0_8px_rgba(59,130,246,0.15)] hover:shadow-[0_0_12px_rgba(59,130,246,0.4)]"
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
                <div
                    className="p-3 border-t border-white/5 shrink-0"
                    style={{ paddingBottom: 'max(12px, env(safe-area-inset-bottom))' }}
                >
                    <button className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 active:bg-white/10 text-zinc-400 hover:text-white text-xs font-bold transition-all flex items-center justify-center gap-2 group active:scale-[0.98]">
                        See All Notifications
                        <ExternalLink className="h-3 w-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </button>
                </div>
            </div>
        </>
    );
};
