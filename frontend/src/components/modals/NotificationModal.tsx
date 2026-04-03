import React, { useRef, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
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
    /** Pass the bell button's bounding rect so the desktop dropdown aligns to it */
    anchorRect?: DOMRect | null;
}

type Tab = 'unread' | 'all';

/* ─── helpers ─── */
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

/* ─── Notification row ─── */
const NotificationRow: React.FC<{
    notification: Notification;
    onClick: (n: Notification) => void;
    onMarkRead: (id: string, e: React.MouseEvent) => void;
}> = ({ notification, onClick, onMarkRead }) => {
    const unread = !notification.isRead;
    return (
        <div
            onClick={() => onClick(notification)}
            style={{ WebkitTapHighlightColor: 'transparent' }}
            className={[
                'group relative flex items-start gap-3 px-4 py-4',
                'border-b border-white/5 cursor-pointer select-none',
                'transition-colors duration-150 active:bg-white/6',
                unread ? 'bg-blue-500/5' : '',
            ].join(' ')}
        >
            {/* left accent stripe */}
            {unread && (
                <span className="absolute left-0 top-3 bottom-3 w-[3px] bg-blue-500 rounded-r-full" />
            )}

            {/* icon badge */}
            <div className={[
                'mt-0.5 w-9 h-9 shrink-0 rounded-xl flex items-center justify-center',
                unread ? 'bg-blue-500/10' : 'bg-white/6',
            ].join(' ')}>
                {getIcon(notification.eventType)}
            </div>

            {/* text */}
            <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                    <p className={`text-[13px] font-semibold leading-snug ${unread ? 'text-white' : 'text-zinc-400'}`}>
                        {getTitle(notification.eventType)}
                    </p>
                    <span className="text-[10px] text-zinc-600 font-medium whitespace-nowrap pt-0.5 shrink-0">
                        {formatTimeAgo(notification.createdAt)}
                    </span>
                </div>
                <p className="text-[12px] text-zinc-500 mt-1 leading-relaxed">
                    {notification.message}
                </p>
            </div>

            {/* mark-read btn */}
            {unread && (
                <button
                    onClick={(e) => onMarkRead(notification._id, e)}
                    title="Mark as read"
                    className={[
                        'shrink-0 mt-0.5 w-8 h-8 flex items-center justify-center rounded-lg',
                        'bg-blue-500/10 text-blue-400 active:scale-90',
                        'transition-all duration-200',
                        // always visible on mobile, hover-only on desktop
                        'sm:opacity-0 sm:group-hover:opacity-100 sm:focus:opacity-100',
                    ].join(' ')}
                >
                    <CheckCheck className="h-3.5 w-3.5" />
                </button>
            )}
        </div>
    );
};

/* ─── Empty state ─── */
const EmptyState: React.FC<{ tab: Tab }> = ({ tab }) => (
    <div className="flex flex-col items-center justify-center gap-4 py-16 px-6 text-center">
        <div className="w-14 h-14 rounded-2xl bg-white/4 border border-white/6 flex items-center justify-center">
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

/* ─── Main Modal ─── */
export const NotificationModal: React.FC<NotificationModalProps> = ({
    isOpen,
    onClose,
    anchorRect,
}) => {
    const panelRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<Tab>('unread');
    const [isMobile, setIsMobile] = useState(false);

    const { data: notificationsResponse, isLoading } = useNotifications();
    const { mutate: markAsRead } = useMarkAsRead();
    const { mutate: markAllAsRead } = useMarkAllAsRead();

    const notifications: Notification[] = notificationsResponse?.data || [];
    const unread = notifications.filter((n) => !n.isRead);
    const unreadCount = unread.length;
    const displayed = activeTab === 'unread' ? unread : notifications;

    /* detect mobile and lock scroll */
    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 640);
        check();
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, []);

    useEffect(() => {
        if (isOpen && isMobile) {
            document.body.style.overflow = 'hidden';
            return () => { document.body.style.overflow = ''; };
        }
    }, [isOpen, isMobile]);

    /* click-outside */
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
                onClose();
            }
        };
        if (isOpen) {
            // slight delay so the open click doesn't immediately close
            const t = setTimeout(() => document.addEventListener('mousedown', handler), 10);
            return () => { clearTimeout(t); document.removeEventListener('mousedown', handler); };
        }
        return () => document.removeEventListener('mousedown', handler);
    }, [isOpen, onClose]);

    /* reset tab on open */
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

    /* Desktop dropdown position — align right edge to bell button */
    const desktopStyle: React.CSSProperties = anchorRect
        ? {
            position: 'fixed',
            top: anchorRect.bottom + 10,
            right: window.innerWidth - anchorRect.right,
            width: 420,
            maxHeight: 540,
        }
        : {
            position: 'fixed',
            top: 72,
            right: 16,
            width: 420,
            maxHeight: 540,
        };

    /* ─── Panel content (shared between mobile and desktop) ─── */
    const panelContent = (
        <>
            {/* drag handle — mobile only */}
            <div
                className="sm:hidden w-full py-3 flex justify-center shrink-0"
                onClick={onClose}
            >
                <div className="w-10 h-1 rounded-full bg-zinc-700" />
            </div>

            {/* ── Header ── */}
            <div className="px-4 pb-3 shrink-0">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <Bell className="h-[18px] w-[18px] text-white" />
                            {unreadCount > 0 && (
                                <span className="absolute -top-1 -right-1 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-[#0d0f16] animate-pulse" />
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
                                className="flex items-center gap-1.5 text-[11px] font-semibold text-zinc-500 hover:text-blue-400 active:text-blue-300 transition-colors"
                            >
                                <CheckCheck className="h-3.5 w-3.5" />
                                <span>Mark all read</span>
                            </button>
                        )}
                        <button
                            onClick={onClose}
                            className="sm:hidden w-8 h-8 flex items-center justify-center rounded-xl bg-white/[0.06] text-zinc-400 active:bg-white/10 transition-colors"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                </div>

                {/* ── Tabs ── */}
                <div className="flex rounded-xl bg-white/5 p-1 gap-1">
                    {(['unread', 'all'] as Tab[]).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            style={{ WebkitTapHighlightColor: 'transparent' }}
                            className={[
                                'flex-1 flex items-center justify-center gap-1.5',
                                'py-2.5 rounded-lg text-[13px] font-semibold select-none',
                                'transition-all duration-200',
                                activeTab === tab
                                    ? 'bg-white/9 text-white'
                                    : 'text-zinc-500 hover:text-zinc-300',
                            ].join(' ')}
                        >
                            {tab === 'unread' ? 'Unread' : 'All'}
                            {tab === 'unread' && unreadCount > 0 && (
                                <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-blue-500 text-white text-[9px] font-bold">
                                    {unreadCount > 9 ? '9+' : unreadCount}
                                </span>
                            )}
                            {tab === 'all' && notifications.length > 0 && (
                                <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-white/10 text-zinc-400 text-[9px] font-bold">
                                    {notifications.length}
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            <div className="h-px bg-white/[0.05] shrink-0" />

            {/* ── Scrollable list ── */}
            <div
                className="flex-1 overflow-y-auto overscroll-contain"
                style={{ WebkitOverflowScrolling: 'touch' as React.CSSProperties['WebkitOverflowScrolling'] }}
            >
                {isLoading ? (
                    <div className="py-16 flex flex-col items-center justify-center gap-3">
                        <div className="w-7 h-7 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
                        <p className="text-xs text-zinc-600 font-medium">Loading notifications…</p>
                    </div>
                ) : displayed.length === 0 ? (
                    <EmptyState tab={activeTab} />
                ) : (
                    displayed.map((n) => (
                        <NotificationRow
                            key={n._id}
                            notification={n}
                            onClick={handleNotificationClick}
                            onMarkRead={handleMarkRead}
                        />
                    ))
                )}
            </div>

            {/* ── Footer ── */}
            <div className="shrink-0 px-4 py-3 border-t border-white/5">
                {activeTab === 'unread' && unreadCount > 0 ? (
                    <button
                        onClick={() => setActiveTab('all')}
                        style={{ WebkitTapHighlightColor: 'transparent' }}
                        className="w-full py-3 rounded-xl bg-white/4 active:bg-white/8 text-zinc-400 text-[13px] font-semibold transition-colors flex items-center justify-center gap-2"
                    >
                        View all {notifications.length} notification{notifications.length !== 1 ? 's' : ''}
                    </button>
                ) : (
                    <p className="text-center text-[11px] text-zinc-700 font-medium py-1">
                        {notifications.length > 0
                            ? `${notifications.length} notification${notifications.length !== 1 ? 's' : ''} total`
                            : 'No notifications'}
                    </p>
                )}
            </div>
        </>
    );

    /* ─── Render via portal so it escapes navbar stacking context ─── */
    return createPortal(
        <>
            {/* Mobile backdrop covers entire viewport */}
            {isMobile && (
                <div
                    className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300"
                    style={{ zIndex: 9998 }}
                    onClick={onClose}
                />
            )}

            {isMobile ? (
                /* ── MOBILE: Bottom Sheet ── */
                <div
                    ref={panelRef}
                    className="
                        fixed bottom-0 left-0 right-0 z-9999 flex flex-col
                        bg-[#0d0f16] border-t border-white/10 rounded-t-[32px]
                        shadow-[0_-12px_48px_rgba(0,0,0,0.8)]
                        animate-in slide-in-from-bottom duration-300 ease-out
                    "
                    style={{
                        height: '84vh',
                        paddingBottom: 'env(safe-area-inset-bottom, 24px)',
                    }}
                >
                    {panelContent}
                </div>
            ) : (
                /* ── DESKTOP: Dropdown ── */
                <div
                    ref={panelRef}
                    className="
                        fixed z-9999 flex flex-col
                        bg-[#0d0f16] border border-white/5 rounded-2xl
                        shadow-[0_24px_64px_-12px_rgba(0,0,0,0.6)]
                        animate-in fade-in zoom-in-95 duration-200
                    "
                    style={{ ...desktopStyle }}
                >
                    {panelContent}
                </div>
            )}
        </>,
        document.body
    );
};
