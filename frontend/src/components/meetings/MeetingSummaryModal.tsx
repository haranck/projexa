import { useEffect, useState } from "react";
import { X, Loader2, CheckCircle2, AlertCircle, FileText, Lightbulb, Gavel, ListChecks, User, Calendar, RefreshCw } from "lucide-react";
import type { MeetingSummary } from "./types";
import { getMeetingSummary } from "../../services/Meeting/meetingService";

interface MeetingSummaryModalProps {
    meetingId: string;
    meetingTitle: string;
    onClose: () => void;
}

const StatusBadge = ({ status }: { status: MeetingSummary["status"] }) => {
    const config = {
        pending:    { icon: <Loader2 className="size-3.5 animate-spin" />, label: "Pending",    cls: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
        processing: { icon: <Loader2 className="size-3.5 animate-spin" />, label: "Processing", cls: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
        completed:  { icon: <CheckCircle2 className="size-3.5" />,          label: "Completed",  cls: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
        failed:     { icon: <AlertCircle className="size-3.5" />,            label: "Failed",     cls: "bg-red-500/10 text-red-400 border-red-500/20" },
    };
    const { icon, label, cls } = config[status];
    return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${cls}`}>
            {icon}{label}
        </span>
    );
};

const Section = ({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) => (
    <div className="space-y-3">
        <div className="flex items-center gap-2">
            <span className="text-violet-400">{icon}</span>
            <h4 className="text-sm font-bold text-zinc-300 uppercase tracking-widest">{title}</h4>
        </div>
        {children}
    </div>
);

const MeetingSummaryModal = ({ meetingId, meetingTitle, onClose }: MeetingSummaryModalProps) => {
    const [summary, setSummary] = useState<MeetingSummary | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [pollingCount, setPollingCount] = useState(0);

    const fetchSummary = async () => {
        try {
            const response = await getMeetingSummary(meetingId);
            setSummary(response.data as MeetingSummary);
        } catch {
            setError("Failed to fetch meeting summary.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSummary();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [meetingId]);

    // Auto-poll while pending or processing (every 8 seconds, max 15 polls)
    useEffect(() => {
        if (!summary) return;
        if (summary.status === "completed" || summary.status === "failed") return;
        if (pollingCount >= 15) return;

        const timer = setTimeout(async () => {
            setPollingCount((c) => c + 1);
            await fetchSummary();
        }, 8000);

        return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [summary, pollingCount]);

    const isProcessing = summary?.status === "pending" || summary?.status === "processing";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <div
                className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-zinc-950 border border-zinc-800/60 shadow-2xl"
                style={{ scrollbarWidth: "thin", scrollbarColor: "#3f3f46 transparent" }}
            >
                {/* Header */}
                <div className="sticky top-0 z-10 flex items-start justify-between gap-4 p-6 pb-5 bg-zinc-950 border-b border-zinc-800/50">
                    <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                            <div className="flex size-8 items-center justify-center rounded-xl bg-violet-500/10 border border-violet-500/20">
                                <FileText className="size-4 text-violet-400" />
                            </div>
                            <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">AI Summary</span>
                        </div>
                        <h2 className="text-lg font-bold text-white leading-snug">{meetingTitle}</h2>
                        {summary && (
                            <div className="flex items-center gap-3">
                                <StatusBadge status={summary.status} />
                                {isProcessing && (
                                    <span className="text-xs text-zinc-500 animate-pulse">Auto-refreshing…</span>
                                )}
                            </div>
                        )}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                        <button
                            onClick={fetchSummary}
                            className="flex size-8 items-center justify-center rounded-xl text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/60 transition-all"
                            title="Refresh"
                        >
                            <RefreshCw className="size-4" />
                        </button>
                        <button
                            onClick={onClose}
                            className="flex size-8 items-center justify-center rounded-xl text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/60 transition-all"
                        >
                            <X className="size-4" />
                        </button>
                    </div>
                </div>

                {/* Body */}
                <div className="p-6 space-y-6">
                    {/* Loading state */}
                    {loading && (
                        <div className="flex flex-col items-center justify-center py-16 gap-4">
                            <Loader2 className="size-8 text-violet-400 animate-spin" />
                            <p className="text-sm text-zinc-500">Loading summary…</p>
                        </div>
                    )}

                    {/* Error state */}
                    {error && !loading && (
                        <div className="flex flex-col items-center justify-center py-12 gap-3">
                            <AlertCircle className="size-8 text-red-400" />
                            <p className="text-sm text-red-400">{error}</p>
                        </div>
                    )}

                    {/* Processing / Pending state */}
                    {!loading && !error && isProcessing && (
                        <div className="flex flex-col items-center justify-center py-14 gap-4">
                            <div className="relative">
                                <div className="size-16 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
                                    <Loader2 className="size-7 text-violet-400 animate-spin" />
                                </div>
                                <div className="absolute -inset-1 rounded-2xl bg-violet-500/10 animate-ping" />
                            </div>
                            <div className="text-center space-y-1">
                                <p className="text-sm font-semibold text-zinc-300">AI is generating your summary</p>
                                <p className="text-xs text-zinc-500">This usually takes 30–60 seconds. The page will auto-refresh.</p>
                            </div>
                        </div>
                    )}

                    {/* Failed state */}
                    {!loading && !error && summary?.status === "failed" && (
                        <div className="flex flex-col items-center justify-center py-12 gap-3">
                            <AlertCircle className="size-8 text-red-400" />
                            <p className="text-sm font-semibold text-red-400">Summary generation failed</p>
                            {summary.errorMessage && (
                                <p className="text-xs text-zinc-500 text-center max-w-sm">{summary.errorMessage}</p>
                            )}
                        </div>
                    )}

                    {/* Completed summary */}
                    {!loading && !error && summary?.status === "completed" && (
                        <div className="space-y-6">
                            {/* Overview */}
                            {summary.summary && (
                                <Section icon={<FileText className="size-4" />} title="Overview">
                                    <p className="text-sm text-zinc-400 leading-relaxed bg-zinc-900/50 rounded-2xl p-4 border border-zinc-800/40">
                                        {summary.summary}
                                    </p>
                                </Section>
                            )}

                            {/* Key Points */}
                            {summary.keyPoints.length > 0 && (
                                <Section icon={<Lightbulb className="size-4" />} title="Key Points">
                                    <ul className="space-y-2">
                                        {summary.keyPoints.map((point, i) => (
                                            <li key={i} className="flex items-start gap-3 text-sm text-zinc-400">
                                                <span className="mt-1 shrink-0 size-5 rounded-full bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-[10px] font-bold text-violet-400">
                                                    {i + 1}
                                                </span>
                                                {point}
                                            </li>
                                        ))}
                                    </ul>
                                </Section>
                            )}

                            {/* Decisions */}
                            {summary.decisions.length > 0 && (
                                <Section icon={<Gavel className="size-4" />} title="Decisions Made">
                                    <ul className="space-y-2">
                                        {summary.decisions.map((decision, i) => (
                                            <li key={i} className="flex items-start gap-3 p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10 text-sm text-zinc-400">
                                                <CheckCircle2 className="size-4 text-emerald-400 mt-0.5 shrink-0" />
                                                {decision}
                                            </li>
                                        ))}
                                    </ul>
                                </Section>
                            )}

                            {/* Action Items */}
                            {summary.actionItems.length > 0 && (
                                <Section icon={<ListChecks className="size-4" />} title="Action Items">
                                    <div className="space-y-2">
                                        {summary.actionItems.map((item, i) => (
                                            <div key={i} className="p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800/40 space-y-2">
                                                <p className="text-sm font-medium text-zinc-300">{item.task}</p>
                                                <div className="flex items-center gap-4">
                                                    {item.assignee && (
                                                        <span className="flex items-center gap-1.5 text-xs text-zinc-500">
                                                            <User className="size-3 text-zinc-600" />
                                                            {item.assignee}
                                                        </span>
                                                    )}
                                                    {item.dueDate && (
                                                        <span className="flex items-center gap-1.5 text-xs text-zinc-500">
                                                            <Calendar className="size-3 text-zinc-600" />
                                                            {item.dueDate}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </Section>
                            )}

                            {/* No content fallback */}
                            {!summary.summary && summary.keyPoints.length === 0 && summary.decisions.length === 0 && summary.actionItems.length === 0 && (
                                <div className="text-center py-10 text-zinc-500 text-sm">
                                    No content was extracted from this meeting.
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MeetingSummaryModal;
