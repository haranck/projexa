import { useState, useEffect, useCallback, useRef } from "react";
import { X, Plus, Paperclip, Link as LinkIcon, User, Check, Loader2, FileText, Trash2, ChevronDown, ArrowLeft, AlertCircle } from "lucide-react";
import { useUpdateEpic, useDeleteIssue, useCreateIssue } from "@/hooks/Issues/IssueHooks";
import { getAttachmentUploadUrl, uploadFileToS3 } from "@/services/Issue/IssueService";
import { CreateIssueModal } from "./CreateIssueModal";
import type { IAttachement, CreateIssueProps } from "@/services/Issue/IssueService";
import type { ProjectMember } from "@/types/project";
import { toast } from "react-hot-toast";

interface ChildTask {
    _id: string;
    title: string;
    issueType: string;
    status?: string;
    assigneeId?: string | null;
}

interface IssueData {
    _id: string;
    title: string;
    description?: string;
    startDate?: string | Date | null;
    endDate?: string | Date | null;
    color?: string;
    attachments?: Array<{ type: "file" | "link"; url: string; fileName?: string }>;
    status?: string;
    key?: string;
    issueType: string;
    assigneeId?: string | null;
    parentIssueId?: string | null;
}

interface IssueDetailDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    issue: IssueData | null;
    childTasks: ChildTask[];
    projectName: string;
    projectId: string;
    workspaceId: string;
    members: ProjectMember[];
    projectKey: string;
    onSubtaskClick?: (subtaskId: string) => void;
}

const WORK_TYPE_STYLES: Record<string, { label: string; bg: string; text: string }> = {
    story: { label: "Story", bg: "bg-emerald-500/15", text: "text-emerald-400" },
    task: { label: "Task", bg: "bg-blue-500/15", text: "text-blue-400" },
    bug: { label: "Bug", bg: "bg-red-500/15", text: "text-red-400" },
    subtask: { label: "Subtask", bg: "bg-violet-500/15", text: "text-violet-400" },
    epic: { label: "Epic", bg: "bg-blue-500/15", text: "text-blue-400" },
};

function getTypeBadge(issueType: string) {
    const style = WORK_TYPE_STYLES[issueType?.toLowerCase()] ?? {
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

export const IssueDetailDrawer = ({
    isOpen,
    onClose,
    issue,
    childTasks,
    projectName,
    projectId,
    workspaceId,
    members,
    projectKey,
    onSubtaskClick
}: IssueDetailDrawerProps) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [status, setStatus] = useState("TODO");
    const [assigneeId, setAssigneeId] = useState<string | null>(null);
    const [isAssigneeDropdownOpen, setIsAssigneeDropdownOpen] = useState(false);
    const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
    const [activeAttachTab, setActiveAttachTab] = useState<(typeof ATTACHMENT_TABS)[number]>("File");
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [isCreateChildModalOpen, setIsCreateChildModalOpen] = useState(false);
    const [openSubtaskStatusId, setOpenSubtaskStatusId] = useState<string | null>(null);

    const [attachments, setAttachments] = useState<IAttachement[]>([]);
    const [isUploadingFile, setIsUploadingFile] = useState(false);
    const [isAddingLink, setIsAddingLink] = useState(false);
    const [linkUrl, setLinkUrl] = useState("");
    const [linkName, setLinkName] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { mutate: updateIssue, isPending: isUpdatingIssue } = useUpdateEpic();
    const { mutate: deleteIssueMutation, isPending: isDeletingIssue } = useDeleteIssue();
    const { mutate: createIssue, isPending: isCreatingIssue } = useCreateIssue();

    const handleUpdateIssue = (newStatus?: string) => {
        if (!issue?._id) return;
        const statusToUpdate = newStatus || status;

        if (statusToUpdate.toUpperCase() === "DONE") {
            const hasIncompleteSubtasks = childTasks.some(t => t.status?.toUpperCase() !== "DONE");
            if (hasIncompleteSubtasks) {
                toast.error("Finish all subtasks before moving to done", {
                    icon: <AlertCircle className="w-4 h-4 text-rose-500" />,
                });
                return;
            }
        }

        if (newStatus) setStatus(newStatus);

        updateIssue({
            epicId: issue._id,
            title,
            description,
            status: statusToUpdate,
            assigneeId,
            startDate: startDate ? new Date(startDate) : null,
            endDate: endDate ? new Date(endDate) : null,
            attachments,
            projectId,
        }, {
            onSuccess: () => {
                toast.success("Issue updated successfully");
            },
            onError: (err) => {
                toast.error("Failed to update issue");
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

    const handleCreateChildSubmit = (data: CreateIssueProps) => {
        createIssue(data, {
            onSuccess: () => {
                toast.success("Issue created successfully");
                setIsCreateChildModalOpen(false);
            },
            onError: (err) => {
                toast.error("Failed to create issue");
                console.error(err);
            }
        });
    };

    const handleUpdateSubtaskStatus = (subtask: ChildTask, newStatus: string) => {
        updateIssue({
            epicId: subtask._id,
            status: newStatus,
            projectId,
        }, {
            onSuccess: () => {
                toast.success(`Subtask status updated to ${newStatus.replace("_", " ")}`);
                setOpenSubtaskStatusId(null);
            },
            onError: (err) => {
                toast.error("Failed to update subtask status");
                console.error(err);
            }
        });
    };

    const handleDeleteIssue = () => {
        if (!issue?._id) return;
        deleteIssueMutation({ issueId: issue._id, projectId }, {
            onSuccess: () => {
                toast.success("Issue deleted successfully");
                onClose();
            },
            onError: () => {
                toast.error("Failed to delete issue");
                setShowDeleteConfirm(false);
            }
        });
    };

    useEffect(() => {
        if (issue) {
            setTitle(issue.title || "");
            setDescription(issue.description || "");
            setStartDate(formatDate(issue.startDate));
            setEndDate(formatDate(issue.endDate));
            setStatus(issue.status || "TODO");
            setAssigneeId(issue.assigneeId || null);
            setAttachments((issue.attachments || []) as IAttachement[]);
        }
    }, [issue]);

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

    const displayTasks: ChildTask[] = childTasks;

    const issueColor = issue?.color || "bg-blue-500";
    const issueType = issue?.issueType || "task";

    const dotColorMap: Record<string, string> = {
        "bg-blue-500": "#3b82f6",
        "bg-purple-500": "#a855f7",
        "bg-emerald-500": "#10b981",
        "bg-amber-500": "#f59e0b",
        "bg-rose-500": "#f43f5e",
        "bg-cyan-500": "#06b6d4",
    };
    const dotHex = dotColorMap[issueColor] || "#3b82f6";

    return (
        <>
            <div
                className={`fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                    }`}
                onClick={onClose}
            />

            <div
                className={`fixed top-0 right-0 z-50 h-full w-[460px] max-w-[90vw] bg-[#0f1117] border-l border-white/10 shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "translate-x-full"
                    }`}
            >
                <div className="flex items-center justify-between px-7 py-5 border-b border-white/5">
                    <div className="flex flex-col gap-1">
                        {issue?.parentIssueId && (
                            <button
                                onClick={() => onSubtaskClick?.(issue.parentIssueId!)}
                                className="flex items-center gap-1 text-[10px] font-bold text-blue-400 hover:text-blue-300 transition-colors uppercase tracking-wider mb-1 group"
                            >
                                <ArrowLeft className="w-3 h-3 group-hover:-translate-x-0.5 transition-transform" />
                                Back to Parent
                            </button>
                        )}
                        <div className="flex items-center gap-3">
                            <div
                                className="w-3 h-3 rounded-full shrink-0"
                                style={{ backgroundColor: dotHex }}
                            />
                            <h2 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                                {issueType.charAt(0).toUpperCase() + issueType.slice(1).toLowerCase()} Details
                                <span className="text-[11px] font-semibold text-zinc-500 bg-white/5 px-2 py-0.5 rounded border border-white/5">
                                    {issue?.key || projectKey}
                                </span>
                            </h2>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {showDeleteConfirm ? (
                            <div className="flex items-center gap-1 animate-in fade-in slide-in-from-right-2">
                                <span className="text-[10px] font-bold text-red-500 mr-1">Confirm?</span>
                                <button
                                    onClick={handleDeleteIssue}
                                    disabled={isDeletingIssue}
                                    className="p-1 px-2 rounded-lg bg-red-500 hover:bg-red-600 text-white text-[10px] font-bold transition-all flex items-center gap-1"
                                >
                                    {isDeletingIssue ? <Loader2 className="w-3 h-3 animate-spin" /> : "Yes"}
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
                                title="Delete"
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
                        {/* Improved Status Dropdown */}
                        <div className="space-y-2 relative">
                            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                                Status
                            </label>
                            <div className="relative">
                                <button
                                    onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
                                    className={`w-full flex items-center justify-between border rounded-xl px-4 py-2.5 transition-all group ${status === "TODO"
                                        ? "bg-zinc-500/10 border-zinc-500/30 text-zinc-400"
                                        : status === "IN_PROGRESS"
                                            ? "bg-blue-500/10 border-blue-500/30 text-blue-400"
                                            : "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                                        }`}
                                >
                                    <span className="text-[11px] font-bold uppercase tracking-wider">
                                        {status.replace("_", " ")}
                                    </span>
                                    <ChevronDown className={`w-4 h-4 transition-transform ${isStatusDropdownOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {isStatusDropdownOpen && (
                                    <div className="absolute top-full left-0 right-0 mt-2 z-70 bg-[#1a1c22] border border-white/10 rounded-xl shadow-2xl py-2 animate-in fade-in slide-in-from-top-2">
                                        {["TODO", "IN_PROGRESS", "DONE"].map((s) => (
                                            <button
                                                key={s}
                                                onClick={() => {
                                                    setIsStatusDropdownOpen(false);
                                                    handleUpdateIssue(s);
                                                }}
                                                className={`w-full px-4 py-2 transition-all text-left text-[11px] font-bold uppercase tracking-wider flex items-center justify-between hover:bg-white/5 ${status === s ? 'text-white bg-white/5' : 'text-zinc-500'}`}
                                            >
                                                <span>{s.replace("_", " ")}</span>
                                                {status === s && <Check className="w-3.5 h-3.5 text-emerald-500" />}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Assignee Selection */}
                        <div className="space-y-2 relative">
                            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                                Assignee
                            </label>
                            <div className="relative">
                                <button
                                    onClick={() => setIsAssigneeDropdownOpen(!isAssigneeDropdownOpen)}
                                    className="w-full flex items-center justify-between bg-white/4 border border-white/10 rounded-xl px-4 py-2.5 hover:border-white/20 transition-all group"
                                >
                                    <div className="flex items-center gap-3">
                                        {assigneeId ? (
                                            <>
                                                <div className="w-7 h-7 rounded-full overflow-hidden border border-white/10 shrink-0">
                                                    {members.find(m => m.userId === assigneeId)?.user?.profilePicture ? (
                                                        <img
                                                            src={members.find(m => m.userId === assigneeId)?.user?.profilePicture}
                                                            alt=""
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full bg-zinc-800 flex items-center justify-center text-[10px] font-bold text-zinc-400 capitalize">
                                                            {members.find(m => m.userId === assigneeId)?.user?.userName?.charAt(0) || "U"}
                                                        </div>
                                                    )}
                                                </div>
                                                <span className="text-[13px] text-zinc-300 font-medium">
                                                    {members.find(m => m.userId === assigneeId)?.user?.userName || "Unknown User"}
                                                </span>
                                            </>
                                        ) : (
                                            <>
                                                <div className="w-7 h-7 rounded-full bg-white/5 border border-dashed border-white/10 flex items-center justify-center shrink-0">
                                                    <User className="w-3.5 h-3.5 text-zinc-600" />
                                                </div>
                                                <span className="text-[13px] text-zinc-500 font-medium italic">Unassigned</span>
                                            </>
                                        )}
                                    </div>
                                    <ChevronDown className={`w-4 h-4 text-zinc-500 transition-transform ${isAssigneeDropdownOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {isAssigneeDropdownOpen && (
                                    <div className="absolute top-full left-0 right-0 mt-2 z-60 bg-[#1a1c22] border border-white/10 rounded-xl shadow-2xl py-2 max-h-[220px] overflow-y-auto custom-scrollbar animate-in fade-in slide-in-from-top-2">
                                        <button
                                            onClick={() => {
                                                setAssigneeId(null);
                                                setIsAssigneeDropdownOpen(false);
                                            }}
                                            className="w-full flex items-center gap-3 px-4 py-2 hover:bg-white/5 transition-all text-left"
                                        >
                                            <div className="w-7 h-7 rounded-full bg-white/5 border border-dashed border-white/10 flex items-center justify-center">
                                                <X className="w-3.5 h-3.5 text-zinc-600" />
                                            </div>
                                            <span className="text-[13px] text-zinc-500 italic">No Assignee</span>
                                        </button>
                                        <div className="h-px bg-white/5 my-1" />
                                        {members.map((member) => (
                                            <button
                                                key={member.userId}
                                                onClick={() => {
                                                    setAssigneeId(member.userId);
                                                    setIsAssigneeDropdownOpen(false);
                                                }}
                                                className="w-full flex items-center gap-3 px-4 py-2 hover:bg-white/5 transition-all text-left overflow-hidden"
                                            >
                                                <div className="w-7 h-7 rounded-full overflow-hidden border border-white/10 shrink-0">
                                                    {member.user?.profilePicture ? (
                                                        <img
                                                            src={member.user.profilePicture}
                                                            alt=""
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full bg-blue-500/20 flex items-center justify-center text-[10px] font-bold text-blue-400 capitalize">
                                                            {member.user?.userName?.charAt(0) || "U"}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex flex-col min-w-0">
                                                    <span className="text-[13px] text-zinc-300 font-medium truncate">
                                                        {member.user?.userName || "Unknown User"}
                                                    </span>
                                                </div>
                                                {assigneeId === member.userId && (
                                                    <Check className="w-4 h-4 text-emerald-500 ml-auto shrink-0" />
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Title */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                                {issueType.charAt(0).toUpperCase() + issueType.slice(1).toLowerCase()} {issueType === "EPIC" ? "Name" : "Title"}
                            </label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full bg-white/4 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all"
                                placeholder="Title"
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

                        {/* ── Child Work Items / Subtasks ── */}
                        {(issueType === "EPIC" || issueType === "STORY" || issueType === "TASK") && (
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xs font-bold text-white tracking-tight">
                                        {issueType === "EPIC" ? "Child Work Items" : "Subtasks"}
                                    </h3>
                                    <span className="text-[10px] font-bold text-zinc-600">
                                        {displayTasks.filter(t => t.status?.toUpperCase() === "DONE").length}/{displayTasks.length}
                                    </span>
                                </div>

                                <div className="space-y-1">
                                    {displayTasks.map((task) => {
                                        const badge = getTypeBadge(task.issueType);

                                        return (
                                            <div
                                                key={task._id}
                                                className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/3 transition-colors group"
                                            >
                                                {/* Type Icon (Replacing Checkbox) */}
                                                <div className={`w-4.5 h-4.5 rounded-md flex items-center justify-center shrink-0 border border-white/5 bg-white/5`}>
                                                    {task.issueType?.toLowerCase() === "story" && <FileText className="w-2.5 h-2.5 text-emerald-400" />}
                                                    {task.issueType?.toLowerCase() === "task" && <Check className="w-2.5 h-2.5 text-blue-400" />}
                                                    {task.issueType?.toLowerCase() === "bug" && <Trash2 className="w-2.5 h-2.5 text-red-400" />}
                                                    {task.issueType?.toLowerCase() === "subtask" && <Plus className="w-2.5 h-2.5 text-violet-400" />}
                                                </div>

                                                {/* Subtask Row - Clickable for details */}
                                                <div
                                                    className="flex-1 min-w-0 cursor-pointer"
                                                    onClick={() => onSubtaskClick?.(task._id)}
                                                >
                                                    <span
                                                        className={`text-[12px] block truncate transition-all ${task.status?.toUpperCase() === "DONE" ? "line-through text-zinc-600" : "text-zinc-300 group-hover:text-blue-400"
                                                            }`}
                                                    >
                                                        {task.title}
                                                    </span>
                                                </div>

                                                {/* Type Badge */}
                                                <span
                                                    className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${badge.bg} ${badge.text} uppercase shrink-0`}
                                                >
                                                    {badge.label}
                                                </span>

                                                {/* Status Dropdown for Subtask */}
                                                <div className="relative">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setOpenSubtaskStatusId(openSubtaskStatusId === task._id ? null : task._id);
                                                        }}
                                                        className={`px-2 py-1 rounded text-[9px] font-bold border transition-all flex items-center gap-1 ${task.status?.toUpperCase() === "TODO"
                                                            ? "bg-zinc-500/10 border-zinc-500/20 text-zinc-400"
                                                            : task.status?.toUpperCase() === "IN_PROGRESS"
                                                                ? "bg-blue-500/10 border-blue-500/20 text-blue-400"
                                                                : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                                                            }`}
                                                    >
                                                        {task.status?.toUpperCase().replace("_", " ") || "TODO"}
                                                        <ChevronDown className="w-2.5 h-2.5" />
                                                    </button>

                                                    {openSubtaskStatusId === task._id && (
                                                        <div className="absolute top-full right-0 mt-1 z-80 bg-[#1a1c22] border border-white/10 rounded-lg shadow-2xl py-1 min-w-[100px] animate-in fade-in slide-in-from-top-1">
                                                            {["TODO", "IN_PROGRESS", "DONE"].map((s) => (
                                                                <button
                                                                    key={s}
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleUpdateSubtaskStatus(task, s);
                                                                    }}
                                                                    className={`w-full px-3 py-1.5 transition-all text-left text-[9px] font-bold uppercase flex items-center justify-between hover:bg-white/5 ${task.status?.toUpperCase() === s ? 'text-white bg-white/5' : 'text-zinc-500'}`}
                                                                >
                                                                    {s.replace("_", " ")}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Assignee Avatar */}
                                                <div className="w-6 h-6 rounded-full overflow-hidden border border-white/10 shrink-0 flex items-center justify-center bg-zinc-800">
                                                    {task.assigneeId && members.find(m => m.userId === task.assigneeId)?.user?.profilePicture ? (
                                                        <img
                                                            src={members.find(m => m.userId === task.assigneeId)?.user?.profilePicture}
                                                            alt=""
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <User className="w-3.5 h-3.5 text-zinc-600" />
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Create Subtask Button */}
                                <button
                                    onClick={() => setIsCreateChildModalOpen(true)}
                                    className="flex items-center gap-2 text-[11px] font-semibold text-blue-400 hover:text-blue-300 transition-colors px-3 py-2 rounded-lg hover:bg-blue-500/5"
                                >
                                    <Plus className="w-3.5 h-3.5" />
                                    {issueType === "EPIC" ? "Create child work item" : "Create subtask"}
                                </button>
                            </div>
                        )}

                        {/* ── Divider ── */}
                        {(issueType === "EPIC" || issueType === "STORY" || issueType === "TASK") && <div className="border-t border-white/5" />}

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

                <div className="px-7 py-5 border-t border-white/5 bg-[#0c0e14] flex items-center gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 py-3 rounded-xl border border-white/10 text-zinc-400 text-xs font-bold hover:bg-white/5 transition-all"
                    >
                        Cancel
                    </button>
                    <button className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-lg shadow-blue-500/20 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
                        onClick={() => {
                            handleUpdateIssue();
                        }}
                        disabled={isUpdatingIssue || isUploadingFile}
                    >
                        {isUpdatingIssue ? (
                            <span className="flex items-center gap-2 justify-center">
                                <Loader2 className="w-3.5 h-3.5 animate-spin" /> Updating...
                            </span>
                        ) : "Update"}
                    </button>
                </div>
            </div>

            <CreateIssueModal
                isOpen={isCreateChildModalOpen}
                onClose={() => setIsCreateChildModalOpen(false)}
                onSubmit={handleCreateChildSubmit}
                isLoading={isCreatingIssue}
                projectName={projectName}
                projectId={projectId}
                workspaceId={workspaceId}
                members={members}
                projectKey={projectKey}
                initialParentId={issue?._id}
                initialParentName={issue?.title}
                parentIssueType={issue?.issueType}
            />
        </>
    );
};
