import { useState, useEffect, useCallback, useRef } from "react";
import { X, Plus, Paperclip, Link as LinkIcon, User, Check, Loader2, FileText, Trash2 } from "lucide-react";
import { useUpdateEpic, useDeleteIssue } from "@/hooks/Issues/IssueHooks";
import { getAttachmentUploadUrl, uploadFileToS3 } from "@/services/Issue/IssueService";
import type { IAttachement } from "@/services/Issue/IssueService";
import { toast } from "react-hot-toast";

interface ChildTask {
    _id: string;
    title: string;
    issueType: string;
    status?: string;
}

interface EpicData {
    _id: string;
    title: string;
    description?: string;
    startDate?: string | Date | null;
    endDate?: string | Date | null;
    color: string;
    attachments?: Array<{ type: "file" | "link"; url: string; fileName?: string }>;
    status?: string;
}

interface EpicDetailDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    epic: EpicData | null;
    childTasks: ChildTask[];
}

const WORK_TYPE_STYLES: Record<string, { label: string; bg: string; text: string }> = {
    story: { label: "Story", bg: "bg-emerald-500/15", text: "text-emerald-400" },
    task: { label: "Task", bg: "bg-blue-500/15", text: "text-blue-400" },
    bug: { label: "Bug", bg: "bg-red-500/15", text: "text-red-400" },
    subtask: { label: "Subtask", bg: "bg-violet-500/15", text: "text-violet-400" },
};

function getTypeBadge(issueType: string) {
    const style = WORK_TYPE_STYLES[issueType.toLowerCase()] ?? {
        label: issueType,
        bg: "bg-zinc-500/15",
        text: "text-zinc-400",
    };
    return style;
}

function formatDate(d?: string | Date | null): string {
    if (!d) return "";
    const date = new Date(d as string);
    if (isNaN(date.getTime())) return "";
    return date.toISOString().split("T")[0];
}

const ATTACHMENT_TABS = ["File", "Link"] as const;

export const EpicDetailDrawer = ({ isOpen, onClose, epic, childTasks }: EpicDetailDrawerProps) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [status, setStatus] = useState("TODO");
    const [activeAttachTab, setActiveAttachTab] = useState<(typeof ATTACHMENT_TABS)[number]>("File");
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [checkedTasks, setCheckedTasks] = useState<Set<string>>(new Set());

    // Attachment state logic
    const [attachments, setAttachments] = useState<IAttachement[]>([]);
    const [isUploadingFile, setIsUploadingFile] = useState(false);
    const [isAddingLink, setIsAddingLink] = useState(false);
    const [linkUrl, setLinkUrl] = useState("");
    const [linkName, setLinkName] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { mutate: updateEpic, isPending: isUpdatingEpic } = useUpdateEpic();
    const { mutate: deleteEpic, isPending: isDeletingEpic } = useDeleteIssue();

    const handleUpdateEpic = () => {
        if (!epic?._id) return;
        updateEpic({
            epicId: epic._id,
            title,
            description,
            status,
            startDate: startDate ? new Date(startDate) : null,
            endDate: endDate ? new Date(endDate) : null,
            attachments,
        }, {
            onSuccess: () => {
                toast.success("Epic updated successfully");
            },
            onError: (err) => {
                toast.error("Failed to update epic");
                console.error(err);
            }
        });
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploadingFile(true);
        try {
            const res = await getAttachmentUploadUrl(file.type);
            const presignedUrl: string = res.data?.uploadUrl || res.data?.url || res.uploadUrl || res.url;
            if (!presignedUrl) throw new Error("Failed to get upload URL");

            const publicUrl = await uploadFileToS3(presignedUrl, file);
            const finalUrl = res.data?.fileUrl || res.fileUrl || publicUrl;

            setAttachments(prev => [
                ...prev,
                { type: "file", url: finalUrl, fileName: file.name }
            ]);
            toast.success(`${file.name} uploaded`);
        } catch (err: unknown) {
            console.error('File upload error:', err);
            toast.error("File upload failed");
        } finally {
            setIsUploadingFile(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    const handleAddLink = () => {
        if (!linkUrl.trim()) {
            toast.error("URL is required");
            return;
        }

        let formattedUrl = linkUrl.trim();
        if (!/^https?:\/\//i.test(formattedUrl)) {
            formattedUrl = 'https://' + formattedUrl;
        }

        setAttachments(prev => [
            ...prev,
            { type: "link", url: formattedUrl, fileName: linkName.trim() || linkUrl }
        ]);

        setLinkUrl("");
        setLinkName("");
        setIsAddingLink(false);
        toast.success("Link added");
    };

    const removeAttachment = (index: number) => {
        setAttachments(prev => prev.filter((_, i) => i !== index));
    };

    const handleDeleteEpic = () => {
        if (!epic?._id) return;
        deleteEpic(epic._id, {
            onSuccess: () => {
                toast.success("Epic deleted successfully");
                onClose();
            },
            onError: () => {
                toast.error("Failed to delete epic");
                setShowDeleteConfirm(false);
            }
        });
    };

    useEffect(() => {
        if (epic) {
            setTitle(epic.title || "");
            setDescription(epic.description || "");
            setStartDate(formatDate(epic.startDate));
            setEndDate(formatDate(epic.endDate));
            setStatus(epic.status || "TODO");
            setAttachments((epic.attachments || []) as IAttachement[]);
            setCheckedTasks(new Set());
        }
    }, [epic]);

    // ESC key handler
    const handleKeyDown = useCallback(
        (e: KeyboardEvent) => {
            if (e.key === "Escape" && isOpen) onClose();
        },
        [isOpen, onClose]
    );

    useEffect(() => {
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [handleKeyDown]);

    // Prevent body scroll when open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    const toggleTask = (id: string) => {
        setCheckedTasks((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    // Static child work items for now (if no real child tasks exist, show sample data)
    const displayTasks: ChildTask[] =
        childTasks.length > 0
            ? childTasks
            : [
                { _id: "static-1", title: "Design login screen", issueType: "Story", status: "Todo" },
                { _id: "static-2", title: "Implement OAuth flow", issueType: "Task", status: "In Progress" },
                { _id: "static-3", title: "Write unit tests for auth", issueType: "Task", status: "Done" },
            ];

    const epicColor = epic?.color || "bg-blue-500";

    // Map tailwind bg class to a hex for the indicator dot
    const dotColorMap: Record<string, string> = {
        "bg-blue-500": "#3b82f6",
        "bg-purple-500": "#a855f7",
        "bg-emerald-500": "#10b981",
        "bg-amber-500": "#f59e0b",
        "bg-rose-500": "#f43f5e",
        "bg-cyan-500": "#06b6d4",
    };
    const dotHex = dotColorMap[epicColor] || "#3b82f6";

    return (
        <>
            {/* Overlay */}
            <div
                className={`fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                    }`}
                onClick={onClose}
            />

            {/* Drawer Panel */}
            <div
                className={`fixed top-0 right-0 z-50 h-full w-[460px] max-w-[90vw] bg-[#0f1117] border-l border-white/10 shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "translate-x-full"
                    }`}
            >
                {/* ── Header ── */}
                <div className="flex items-center justify-between px-7 py-5 border-b border-white/5">
                    <div className="flex items-center gap-3">
                        <div
                            className="w-3 h-3 rounded-full shrink-0"
                            style={{ backgroundColor: dotHex }}
                        />
                        <h2 className="text-sm font-bold text-white tracking-tight">Epic Details</h2>
                    </div>
                    <div className="flex items-center gap-2">
                        {showDeleteConfirm ? (
                            <div className="flex items-center gap-1 animate-in fade-in slide-in-from-right-2">
                                <span className="text-[10px] font-bold text-red-500 mr-1">Confirm?</span>
                                <button
                                    onClick={handleDeleteEpic}
                                    disabled={isDeletingEpic}
                                    className="p-1 px-2 rounded-lg bg-red-500 hover:bg-red-600 text-white text-[10px] font-bold transition-all flex items-center gap-1"
                                >
                                    {isDeletingEpic ? <Loader2 className="w-3 h-3 animate-spin" /> : "Yes"}
                                </button>
                                <button
                                    onClick={() => setShowDeleteConfirm(false)}
                                    className="p-1 px-2 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 text-[10px] font-bold transition-all"
                                >
                                    No
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => setShowDeleteConfirm(true)}
                                className="p-1.5 rounded-lg hover:bg-red-500/10 text-zinc-500 hover:text-red-400 transition-all"
                                title="Delete Epic"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        )}
                        <button
                            onClick={onClose}
                            className="p-1.5 rounded-lg hover:bg-white/5 text-zinc-500 hover:text-white transition-all"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* ── Scrollable Content ── */}
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    <div className="px-7 py-6 space-y-6">
                        {/* Status Chips */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                                Status
                            </label>
                            <div className="flex gap-2">
                                {["TODO", "IN_PROGRESS", "DONE"].map((s) => (
                                    <button
                                        key={s}
                                        onClick={() => setStatus(s)}
                                        className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all border ${status === s
                                            ? s === "TODO"
                                                ? "bg-zinc-500/10 border-zinc-500/50 text-zinc-400"
                                                : s === "IN_PROGRESS"
                                                    ? "bg-blue-500/10 border-blue-500/50 text-blue-400"
                                                    : "bg-emerald-500/10 border-emerald-500/50 text-emerald-400"
                                            : "bg-transparent border-white/5 text-zinc-600 hover:border-white/10"
                                            }`}
                                    >
                                        {s.replace("_", " ")}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Epic Name */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                                Epic Name
                            </label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full bg-white/4 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all"
                                placeholder="Epic name"
                            />
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                                Description
                            </label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={4}
                                className="w-full bg-white/4 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all resize-none"
                                placeholder="Add a description..."
                            />
                        </div>

                        {/* Dates */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                                    Start Date
                                </label>
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="w-full bg-white/4 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all scheme-dark"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                                    End Date
                                </label>
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="w-full bg-white/4 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all scheme-dark"
                                />
                            </div>
                        </div>

                        {/* ── Divider ── */}
                        <div className="border-t border-white/5" />

                        {/* ── Child Work Items ── */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xs font-bold text-white tracking-tight">Child Work Items</h3>
                                <span className="text-[10px] font-bold text-zinc-600">
                                    {checkedTasks.size}/{displayTasks.length}
                                </span>
                            </div>

                            <div className="space-y-1">
                                {displayTasks.map((task) => {
                                    const badge = getTypeBadge(task.issueType);
                                    const isChecked = checkedTasks.has(task._id);

                                    return (
                                        <div
                                            key={task._id}
                                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/3 transition-colors group"
                                        >
                                            {/* Checkbox */}
                                            <button
                                                onClick={() => toggleTask(task._id)}
                                                className={`w-4.5 h-4.5 rounded-md border flex items-center justify-center shrink-0 transition-all ${isChecked
                                                    ? "bg-blue-500 border-blue-500"
                                                    : "border-zinc-600 hover:border-zinc-400"
                                                    }`}
                                            >
                                                {isChecked && <Check className="w-3 h-3 text-white" />}
                                            </button>

                                            {/* Title */}
                                            <span
                                                className={`text-[12px] flex-1 truncate transition-all ${isChecked ? "line-through text-zinc-600" : "text-zinc-300"
                                                    }`}
                                            >
                                                {task.title}
                                            </span>

                                            {/* Type Badge */}
                                            <span
                                                className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${badge.bg} ${badge.text} uppercase shrink-0`}
                                            >
                                                {badge.label}
                                            </span>

                                            {/* Assignee Avatar */}
                                            <div className="w-5 h-5 rounded-full bg-zinc-700 flex items-center justify-center shrink-0">
                                                <User className="w-3 h-3 text-zinc-500" />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Create Subtask Button */}
                            <button className="flex items-center gap-2 text-[11px] font-semibold text-blue-400 hover:text-blue-300 transition-colors px-3 py-2 rounded-lg hover:bg-blue-500/5">
                                <Plus className="w-3.5 h-3.5" />
                                Create subtask
                            </button>
                        </div>

                        {/* ── Divider ── */}
                        <div className="border-t border-white/5" />

                        {/* ── Attachments ── */}
                        <div className="space-y-3">
                            <h3 className="text-xs font-bold text-white tracking-tight">Attachments</h3>

                            {/* Tabs */}
                            <div className="flex gap-1 bg-white/3 rounded-xl p-1">
                                {ATTACHMENT_TABS.map((tab) => {
                                    const Icon = tab === "File" ? Paperclip : LinkIcon;
                                    return (
                                        <button
                                            key={tab}
                                            onClick={() => setActiveAttachTab(tab)}
                                            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-[11px] font-semibold transition-all flex-1 justify-center ${activeAttachTab === tab
                                                ? "bg-white/8 text-white shadow-sm"
                                                : "text-zinc-500 hover:text-zinc-300"
                                                }`}
                                        >
                                            <Icon className="w-3.5 h-3.5" />
                                            {tab}
                                        </button>
                                    );
                                })}
                            </div>

                            <div
                                className="border border-dashed border-white/10 rounded-xl p-6 flex flex-col items-center justify-center gap-2 hover:border-white/20 transition-colors cursor-pointer"
                                onClick={() => {
                                    if (activeAttachTab === "File") fileInputRef.current?.click();
                                    else setIsAddingLink(true);
                                }}
                            >
                                <div className="p-2 rounded-xl bg-white/4">
                                    {isUploadingFile ? (
                                        <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />
                                    ) : (
                                        <>
                                            {activeAttachTab === "File" && <Paperclip className="w-5 h-5 text-zinc-500" />}
                                            {activeAttachTab === "Link" && <LinkIcon className="w-5 h-5 text-zinc-500" />}
                                        </>
                                    )}
                                </div>
                                <p className="text-[11px] text-zinc-500">
                                    {activeAttachTab === "Link" ? "Paste a link to attach" : isUploadingFile ? "Uploading..." : `Drop ${activeAttachTab.toLowerCase()}s here or click to browse`}
                                </p>
                                <button className="mt-1 px-4 py-1.5 rounded-lg bg-white/6 border border-white/10 text-[10px] font-bold text-zinc-300 hover:bg-white/10 transition-all">
                                    {isUploadingFile ? "Uploading..." : `Add ${activeAttachTab}`}
                                </button>
                            </div>

                            {/* Add Link Form */}
                            {isAddingLink && activeAttachTab === "Link" && (
                                <div className="p-4 bg-white/5 border border-white/10 rounded-xl space-y-3 animate-in fade-in slide-in-from-top-2">
                                    <input
                                        type="text"
                                        value={linkUrl}
                                        onChange={(e) => setLinkUrl(e.target.value)}
                                        placeholder="Paste URL here..."
                                        className="w-full bg-[#0d1016] border border-white/5 rounded-lg px-3 py-2 text-[11px] text-white focus:outline-none focus:border-blue-500/40"
                                    />
                                    <input
                                        type="text"
                                        value={linkName}
                                        onChange={(e) => setLinkName(e.target.value)}
                                        placeholder="Display Name (Optional)"
                                        className="w-full bg-[#0d1016] border border-white/5 rounded-lg px-3 py-2 text-[11px] text-white focus:outline-none focus:border-blue-500/40"
                                    />
                                    <div className="flex gap-2">
                                        <button
                                            type="button"
                                            onClick={() => setIsAddingLink(false)}
                                            className="flex-1 py-2 text-[10px] font-bold text-zinc-500 hover:text-white bg-white/5 rounded-lg transition-all"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleAddLink}
                                            className="flex-1 py-2 bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-bold rounded-lg transition-all"
                                        >
                                            Add Link
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Hidden File Input */}
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileUpload}
                                className="hidden"
                            />

                            {/* Existing attachments */}
                            {attachments.length > 0 && (
                                <div className="space-y-2">
                                    {attachments.map((att, i) => (
                                        <div
                                            key={i}
                                            className="flex items-center gap-3 px-3 py-2 rounded-xl bg-white/3 border border-white/5 group transition-all"
                                        >
                                            {att.type === 'file' ? (
                                                <FileText className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                                            ) : (
                                                <LinkIcon className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                            )}
                                            <a
                                                href={att.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex-1 text-[11px] text-zinc-300 truncate hover:text-blue-400 transition-colors"
                                            >
                                                {att.fileName || att.url}
                                            </a>
                                            <button
                                                type="button"
                                                onClick={() => removeAttachment(i)}
                                                className="p-1 rounded-lg text-zinc-600 hover:text-red-400 hover:bg-red-400/10 transition-all opacity-0 group-hover:opacity-100"
                                            >
                                                <X className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* ── Footer ── */}
                <div className="px-7 py-5 border-t border-white/5 bg-[#0c0e14] flex items-center gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 py-3 rounded-xl border border-white/10 text-zinc-400 text-xs font-bold hover:bg-white/5 transition-all"
                    >
                        Cancel
                    </button>
                    <button className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-lg shadow-blue-500/20 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
                        onClick={() => {
                            handleUpdateEpic();
                        }}
                        disabled={isUpdatingEpic || isUploadingFile}
                    >
                        {isUpdatingEpic ? (
                            <span className="flex items-center gap-2 justify-center">
                                <Loader2 className="w-3.5 h-3.5 animate-spin" /> Updating...
                            </span>
                        ) : "Update Epic"}
                    </button>
                </div>
            </div>
        </>
    );
};
