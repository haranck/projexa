import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FRONTEND_ROUTES } from '../../constants/frontendRoutes';
import {
    Bell, CheckCheck, Calendar, UserPlus, FileText,
    AlertTriangle, X, Inbox,
} from 'lucide-react';
import { useNotifications, useMarkAsRead, useMarkAllAsRead } from '../../hooks/Notification/NotificationHooks';
import { formatTimeAgo } from '../../utils/timeAgo';
import type { Notification, NotificationEventType } from '../../types/notification';
import { NOTIFICATION_EVENT_TYPES } from '../../types/notification';

interface NotificationModalProps {
    isOpen: boolean;
    onClose: () => void;
}

type Tab = 'unread' | 'all';

const getIcon = (type: NotificationEventType) => {
    switch (type) {
        case NOTIFICATION_EVENT_TYPES.ISSUE_CREATED:
        case NOTIFICATION_EVENT_TYPES.ISSUE_UPDATED:
            return <FileText className="h-4 w-4 text-orange-400" />;
        case NOTIFICATION_EVENT_TYPES.ISSUE_DELETED:
            return <AlertTriangle className="h-4 w-4 text-red-400" />;
        case NOTIFICATION_EVENT_TYPES.PROJECT_CREATED:
            return <Calendar className="h-4 w-4 text-violet-400" />;
        case NOTIFICATION_EVENT_TYPES.PROJECT_MEMBER_ADDED:
            return <UserPlus className="h-4 w-4 text-sky-400" />;
        default:
            return <Bell className="h-4 w-4 text-zinc-400" />;
    }
};

const getTitle = (type: NotificationEventType) =>
    type.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (l) => l.toUpperCase());

/* ─── Reusable notification row ─── */
const NotificationRow: React.FC<{
    notification: Notification;
    onClick: (n: Notification) => void;
    onMarkRead: (id: string, e: React.MouseEvent) => void;
}> = ({ notification, onClick, onMarkRead }) => {
    const unread = !notification.isRead;
    return (
        <div
            onClick={() => onClick(notification)}
            className={`
                group relative flex items-start gap-3 px-4 py-3.5 border-b border-white/[0.04]
                cursor-pointer transition-all duration-200 active:scale-[0.985]
                ${unread
                    ? 'bg-blue-500/[0.04] hover:bg-blue-500/[0.08]'
                    : 'hover:bg-white/[0.03]'}
            `}
        >
            {/* Unread dot accent on left edge */}
            {unread && (
                <span className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 to-blue-400/0 rounded-r" />
            )}

            {/* Icon badge */}
            <div className={`
                mt-0.5 w-9 h-9 shrink-0 rounded-xl flex items-center justify-center transition-colors duration-200
                ${unread ? 'bg-blue-500/10 group-hover:bg-blue-500/15' : 'bg-white/[0.05] group-hover:bg-white/[0.08]'}
            `}>
                {getIcon(notification.eventType)}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                    <p className={`text-[13px] font-semibold leading-tight ${unread ? 'text-white' : 'text-zinc-400'}`}>
                        {getTitle(notification.eventType)}
                    </p>
                    <span className="text-[10px] text-zinc-600 font-medium whitespace-nowrap mt-0.5">
                        {formatTimeAgo(notification.createdAt)}
                    </span>
                </div>
                <p className="text-xs text-zinc-500 mt-1 leading-relaxed line-clamp-2">
                    {notification.message}
                </p>
            </div>

            {/* Mark-as-read button */}
            {unread && (
                <button
                    onClick={(e) => onMarkRead(notification._id, e)}
                    title="Mark as read"
                    className="
                        shrink-0 mt-0.5 w-7 h-7 flex items-center justify-center rounded-lg
                        bg-blue-500/10 text-blue-400
                        hover:bg-blue-500 hover:text-white
                        active:scale-90
                        transition-all duration-200
                        shadow-[0_0_8px_rgba(59,130,246,0.15)]
                        hover:shadow-[0_0_12px_rgba(59,130,246,0.4)]
                        opacity-0 group-hover:opacity-100 focus:opacity-100
                        sm:opacity-100
                    "
                >
                    <CheckCheck className="h-3.5 w-3.5" />
                </button>
            )}
        </div>
    );
};

/* ─── Empty state ─── */
const EmptyState: React.FC<{ tab: Tab }> = ({ tab }) => (
    <div className="flex flex-col items-center justify-center gap-4 py-14 px-6 text-center">
        <div className="w-14 h-14 rounded-2xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center">
            {tab === 'unread'
                ? <Bell className="h-6 w-6 text-zinc-600" />
                : <Inbox className="h-6 w-6 text-zinc-600" />}
        </div>
        <div>
            <p className="text-sm font-bold text-zinc-300">
                {tab === 'unread' ? 'All caught up!' : 'No notifications yet'}
            </p>
            <p className="text-xs text-zinc-600 mt-1">
                {tab === 'unread'
                    ? 'You have no unread notifications.'
                    : 'Your notifications will appear here.'}
            </p>
        </div>
    </div>
);

/* ─── Main component ─── */
export const NotificationModal: React.FC<NotificationModalProps> = ({ isOpen, onClose }) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<Tab>('unread');

    const { data: notificationsResponse, isLoading } = useNotifications();
    const { mutate: markAsRead } = useMarkAsRead();
    const { mutate: markAllAsRead } = useMarkAllAsRead();

    const notifications: Notification[] = notificationsResponse?.data || [];
    const unread = notifications.filter((n) => !n.isRead);
    const unreadCount = unread.length;

    const displayed = activeTab === 'unread' ? unread : notifications;

    /* Handle click-outside (desktop) */
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
                onClose();
            }
        };
        if (isOpen) document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen, onClose]);

    /* Reset to unread tab on open */
    useEffect(() => {
        if (isOpen) setActiveTab('unread');
    }, [isOpen]);

    const handleNotificationClick = (notification: Notification) => {
        if (!notification.isRead) markAsRead(notification._id);

        if (notification.resourceType === 'issue' || notification.eventType.includes('ISSUE')) {
            navigate(FRONTEND_ROUTES.BACKLOG, { state: { selectedIssueId: notification.resourceId } });
        } else if (notification.resourceType === 'project' || notification.eventType.includes('PROJECT')) {
            navigate(FRONTEND_ROUTES.PROJECTS);
        } else if (notification.eventType.includes('EPIC')) {
            navigate(FRONTEND_ROUTES.BACKLOG, { state: { selectedIssueId: notification.resourceId } });
        }
        onClose();
    };

    const handleMarkRead = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        markAsRead(id);
    };

    if (!isOpen) return null;

    return (
        <>
            {/* ── Mobile backdrop ── */}
            <div
                className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 sm:hidden"
                onClick={onClose}
            />

            {/* ── Panel ── */}
            <div
                ref={modalRef}
                className="
                    fixed bottom-0 left-0 right-0
                    sm:absolute sm:top-full sm:bottom-auto sm:left-auto sm:right-0 sm:mt-3
                    w-full sm:w-[420px]
                    bg-[#0f1117]/98 backdrop-blur-2xl
                    border-t sm:border border-white/[0.08]
                    rounded-t-[2rem] sm:rounded-2xl
                    shadow-[0_-4px_60px_rgba(0,0,0,0.5)] sm:shadow-[0_20px_60px_rgba(0,0,0,0.5)]
                    z-50 flex flex-col
                    animate-in slide-in-from-bottom-full duration-300
                    sm:slide-in-from-bottom-0 sm:slide-in-from-top-2 sm:fade-in sm:duration-200
                "
                style={{ maxHeight: '88vh', paddingBottom: 'env(safe-area-inset-bottom)' }}
            >
                {/* ── Mobile drag handle ── */}
                <div
                    className="w-full pt-3 pb-1 flex items-center justify-center sm:hidden shrink-0 cursor-grab active:cursor-grabbing"
                    onClick={onClose}
                >
                    <div className="w-10 h-1 bg-zinc-700 rounded-full" />
                </div>

                {/* ── Header ── */}
                <div className="px-4 pt-3 pb-0 shrink-0">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <div className="relative">
                                <Bell className="h-[18px] w-[18px] text-white" />
                                {unreadCount > 0 && (
                                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-[#0f1117] animate-pulse" />
                                )}
                            </div>
                            <h3 className="font-bold text-white text-[15px]">Notifications</h3>
                            {unreadCount > 0 && (
                                <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-blue-500/20 text-blue-400 text-[10px] font-bold border border-blue-500/20">
                                    {unreadCount}
                                </span>
                            )}
                        </div>

                        <div className="flex items-center gap-2">
                            {unreadCount > 0 && (
                                <button
                                    onClick={() => markAllAsRead()}
                                    className="flex items-center gap-1 text-[11px] font-semibold text-zinc-500 hover:text-blue-400 transition-colors"
                                >
                                    <CheckCheck className="h-3.5 w-3.5" />
                                    <span className="hidden sm:inline">Mark all read</span>
                                </button>
                            )}
                            {/* Close button — mobile only */}
                            <button
                                onClick={onClose}
                                className="sm:hidden w-7 h-7 flex items-center justify-center rounded-lg bg-white/[0.05] text-zinc-500 hover:text-white transition-colors"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    </div>

                    {/* ── Tabs ── */}
                    <div className="relative flex rounded-xl bg-white/[0.04] p-1 gap-1">
                        {(['unread', 'all'] as Tab[]).map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`
                                    relative flex-1 py-2 rounded-lg text-[12px] font-semibold transition-all duration-200
                                    ${activeTab === tab
                                        ? 'bg-white/[0.08] text-white shadow-sm'
                                        : 'text-zinc-500 hover:text-zinc-300'}
                                `}
                            >
                                {tab === 'unread' ? 'Unread' : 'All'}
                                {tab === 'unread' && unreadCount > 0 && (
                                    <span className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full bg-blue-500 text-white text-[9px] font-bold">
                                        {unreadCount > 9 ? '9+' : unreadCount}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* ── List ── */}
                <div className="flex-1 overflow-y-auto mt-2 custom-scrollbar" style={{ minHeight: 0 }}>
                    {isLoading ? (
                        <div className="py-12 flex flex-col items-center justify-center gap-3">
                            <div className="w-7 h-7 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
                            <p className="text-xs text-zinc-600 font-medium">Loading…</p>
                        </div>
                    ) : displayed.length === 0 ? (
                        <EmptyState tab={activeTab} />
                    ) : (
                        <div>
                            {displayed.map((notification) => (
                                <NotificationRow
                                    key={notification._id}
                                    notification={notification}
                                    onClick={handleNotificationClick}
                                    onMarkRead={handleMarkRead}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* ── Footer ── */}
                <div className="px-4 py-3 border-t border-white/[0.05] shrink-0">
                    {activeTab === 'unread' && unreadCount > 0 && (
                        <button
                            onClick={() => setActiveTab('all')}
                            className="
                                w-full py-2.5 rounded-xl
                                bg-white/[0.04] hover:bg-white/[0.07]
                                text-zinc-400 hover:text-white
                                text-[12px] font-semibold
                                transition-all duration-200 active:scale-[0.98]
                                flex items-center justify-center gap-2
                            "
                        >
                            View all {notifications.length} notification{notifications.length !== 1 ? 's' : ''}
                        </button>
                    )}
                    {activeTab === 'all' && notifications.length > 0 && (
                        <p className="text-center text-[11px] text-zinc-700 font-medium">
                            {notifications.length} notification{notifications.length !== 1 ? 's' : ''} total
                        </p>
                    )}
                    {notifications.length === 0 && !isLoading && (
                        <p className="text-center text-[11px] text-zinc-700 font-medium">No notifications</p>
                    )}
                </div>
            </div>
        </>
    );
};
