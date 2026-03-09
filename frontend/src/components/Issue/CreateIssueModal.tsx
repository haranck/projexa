import { useState, useRef, useEffect } from "react";
import { X, Upload, Loader2, FileText, Link as LinkIcon, Globe, ArrowLeft, ChevronDown } from "lucide-react";
import { toast } from "react-hot-toast";
import { getAttachmentUploadUrl, uploadFileToS3, IssueStatus, IssueType } from "@/services/Issue/IssueService";
import type { IAttachement, CreateIssueProps } from "@/services/Issue/IssueService";
import type { ProjectMember } from "@/types/project";

interface CreateIssueModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: CreateIssueProps) => void;
    isLoading: boolean;
    projectName: string;
    projectId: string;
    workspaceId: string;
    members: ProjectMember[];
    projectKey: string;
    initialParentId?: string | null;
    initialParentName?: string;
    initialIssueType?: string;
    parentIssueType?: string | null;
}

const ISSUE_TYPES = [
    { value: IssueType.STORY, label: "Story", color: "bg-emerald-500" },
    { value: IssueType.TASK, label: "Task", color: "bg-blue-500" },
    { value: IssueType.BUG, label: "Bug", color: "bg-red-500" },
    { value: IssueType.SUBTASK, label: "Subtask", color: "bg-violet-500" },
];

export const CreateIssueModal = ({
    isOpen,
    onClose,
    onSubmit,
    isLoading,
    projectName,
    projectId,
    workspaceId,
    members,
    projectKey,
    initialParentId = null,
    initialParentName = "",
    initialIssueType = IssueType.STORY,
    parentIssueType = null
}: CreateIssueModalProps) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [issueType, setIssueType] = useState<string>(initialIssueType);
    const [status, setStatus] = useState<string>(IssueStatus.TODO);
    const [assigneeId, setAssigneeId] = useState<string>("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [attachments, setAttachments] = useState<IAttachement[]>([]);
    const [isUploadingFile, setIsUploadingFile] = useState(false);

    // Link attachment state
    const [isAddingLink, setIsAddingLink] = useState(false);
    const [linkUrl, setLinkUrl] = useState("");
    const [linkName, setLinkName] = useState("");

    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen) {
            if (initialParentId) {
                if (parentIssueType === IssueType.EPIC) {
                    setIssueType(IssueType.STORY);
                } else {
                    setIssueType(IssueType.SUBTASK);
                }
            } else {
                setIssueType(initialIssueType);
            }
        }
    }, [isOpen, initialParentId, initialIssueType, parentIssueType]);

    const isTypeFixed = !!initialParentId && parentIssueType !== IssueType.EPIC;

    const filteredIssueTypes = ISSUE_TYPES.filter(type => {
        if (!initialParentId) {
            // Root issues can't be subtasks
            return type.value !== IssueType.SUBTASK;
        }
        if (parentIssueType === IssueType.EPIC) {
            // Epic children can be Story, Task, Bug but not Subtask
            return type.value !== IssueType.SUBTASK;
        }
        // Subtask, Task, Bug children must be subtasks
        return type.value === IssueType.SUBTASK;
    });

    if (!isOpen) return null;

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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) {
            toast.error("Issue title is required");
            return;
        }
        onSubmit({
            workspaceId,
            projectId,
            title,
            description,
            issueType: issueType as IssueType,
            status,
            assigneeId: assigneeId || null,
            parentIssueId: initialParentId,
            startDate: startDate ? new Date(startDate) : null,
            endDate: endDate ? new Date(endDate) : null,
            attachments
        });
    };

    const handleClose = () => {
        setTitle("");
        setDescription("");
        setIssueType(initialIssueType);
        setStatus(IssueStatus.TODO);
        setAssigneeId("");
        setStartDate("");
        setEndDate("");
        setAttachments([]);
        setIsAddingLink(false);
        setLinkUrl("");
        setLinkName("");
        onClose();
    };

    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-[#0d1016]/80 backdrop-blur-md"
                onClick={handleClose}
            />

            <div className="relative w-full max-w-2xl bg-[#0d1016] border border-white/10 rounded-2xl shadow-2xl animate-in fade-in zoom-in-95 duration-200 overflow-hidden flex flex-col max-h-[90vh]">
                <div className="flex items-center justify-between px-8 py-6 border-b border-white/5 shrink-0">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={handleClose}
                            className="p-1.5 rounded-lg hover:bg-white/5 text-zinc-400 hover:text-white transition-all"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <h2 className="text-lg font-bold text-white">Create New Issue
                            <span className="ml-3 text-[13px] font-semibold text-zinc-500 bg-white/5 px-2 py-0.5 rounded border border-white/5">{projectKey}</span>
                        </h2>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6 overflow-y-auto custom-scrollbar">
                    {/* Project & Parent Info */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Project</label>
                            <div className="w-full bg-[#14171f] border border-white/5 rounded-xl px-4 py-2.5 text-xs text-zinc-400 capitalize">
                                {projectName}
                            </div>
                        </div>
                        {initialParentId && (
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Parent Epic/Issue</label>
                                <div className="w-full bg-[#14171f] border border-white/5 rounded-xl px-4 py-2.5 text-xs text-blue-400 font-bold truncate">
                                    {initialParentName || "Epic"}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Title */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                            Issue Title <span className="text-rose-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="What needs to be done?"
                            className="w-full bg-[#14171f] border border-white/5 rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-700 focus:outline-none focus:ring-1 focus:ring-blue-500/40 transition-all font-medium"
                            autoFocus
                        />
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Add more details about this issue..."
                            rows={4}
                            className="w-full bg-[#14171f] border border-white/5 rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-700 focus:outline-none focus:ring-1 focus:ring-blue-500/40 resize-none transition-all leading-relaxed"
                        />
                    </div>

                    {/* Type, Status, Assignee */}
                    <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Issue Type</label>
                            <div className="relative">
                                {isTypeFixed ? (
                                    <div className="w-full bg-[#14171f] border border-white/5 rounded-xl px-4 py-2.5 text-xs text-violet-400 font-bold flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-violet-500" />
                                        Subtask
                                    </div>
                                ) : (
                                    <>
                                        <select
                                            value={issueType}
                                            onChange={(e) => setIssueType(e.target.value)}
                                            className="w-full bg-[#14171f] border border-white/5 rounded-xl pl-4 pr-10 py-2.5 text-xs text-white font-bold appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500/20"
                                        >
                                            {filteredIssueTypes.map(type => (
                                                <option key={type.value} value={type.value}>{type.label}</option>
                                            ))}
                                        </select>
                                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-600 pointer-events-none" />
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Status</label>
                            <div className="relative">
                                <select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                    className="w-full bg-[#14171f] border border-white/5 rounded-xl pl-4 pr-10 py-2.5 text-xs text-white font-bold appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500/20"
                                >
                                    <option value={IssueStatus.TODO}>TODO</option>
                                    <option value={IssueStatus.IN_PROGRESS}>IN PROGRESS</option>
                                    <option value={IssueStatus.DONE}>DONE</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-600 pointer-events-none" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Assignee</label>
                            <div className="relative">
                                <select
                                    value={assigneeId}
                                    onChange={(e) => setAssigneeId(e.target.value)}
                                    className="w-full bg-[#14171f] border border-white/5 rounded-xl pl-4 pr-10 py-2.5 text-xs text-white font-bold appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500/20"
                                >
                                    <option value="">Unassigned</option>
                                    {members.map(member => (
                                        <option key={member.userId} value={member.userId}>
                                            {member.user?.userName || member.userId}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-600 pointer-events-none" />
                            </div>
                        </div>
                    </div>

                    {/* Dates */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Start Date</label>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="w-full bg-[#14171f] border border-white/5 rounded-xl px-4 py-2.5 text-xs text-zinc-300 focus:outline-none focus:ring-1 focus:ring-blue-500/40 scheme-dark"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">End Date</label>
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="w-full bg-[#14171f] border border-white/5 rounded-xl px-4 py-2.5 text-xs text-zinc-300 focus:outline-none focus:ring-1 focus:ring-blue-500/40 scheme-dark"
                            />
                        </div>
                    </div>

                    {/* Attachments */}
                    <div className="space-y-3">
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Attachments</label>

                        {attachments.length > 0 && (
                            <div className="grid grid-cols-2 gap-2">
                                {attachments.map((att, i) => (
                                    <div key={i} className="flex items-center gap-3 px-3 py-2 bg-[#1a1d26] border border-white/5 rounded-xl group/att">
                                        {att.type === 'file' ? (
                                            <FileText className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                                        ) : (
                                            <Globe className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                        )}
                                        <span className="flex-1 text-[10px] text-zinc-300 truncate font-medium">{att.fileName || att.url}</span>
                                        <button
                                            type="button"
                                            onClick={() => removeAttachment(i)}
                                            className="p-1 rounded-lg text-zinc-600 hover:text-red-400 hover:bg-red-400/10 transition-all opacity-0 group-hover/att:opacity-100"
                                        >
                                            <X className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={isUploadingFile}
                                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[#1a1d26] border border-dashed border-white/10 rounded-xl text-[10px] font-bold text-zinc-500 hover:border-blue-500/30 hover:text-blue-400 transition-all"
                            >
                                {isUploadingFile ? (
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                ) : (
                                    <>
                                        <Upload className="w-3.5 h-3.5" />
                                        Add File
                                    </>
                                )}
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsAddingLink(!isAddingLink)}
                                className={`flex-1 flex items-center justify-center gap-2 py-2.5 border rounded-xl text-[10px] font-bold transition-all ${isAddingLink ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-[#1a1d26] border-dashed border-white/10 text-zinc-500 hover:border-emerald-500/30 hover:text-emerald-400'}`}
                            >
                                <LinkIcon className="w-3.5 h-3.5" />
                                {isAddingLink ? 'Cancel' : 'Add Link'}
                            </button>
                        </div>

                        {isAddingLink && (
                            <div className="p-4 bg-[#1a1d26] border border-emerald-500/20 rounded-xl space-y-3 animate-in fade-in slide-in-from-top-2">
                                <input
                                    type="text"
                                    value={linkUrl}
                                    onChange={(e) => setLinkUrl(e.target.value)}
                                    placeholder="Paste URL here..."
                                    className="w-full bg-[#0d1016] border border-white/5 rounded-lg px-3 py-2 text-[11px] text-white focus:outline-none focus:border-emerald-500/40"
                                />
                                <input
                                    type="text"
                                    value={linkName}
                                    onChange={(e) => setLinkName(e.target.value)}
                                    placeholder="Display Name (Optional)"
                                    className="w-full bg-[#0d1016] border border-white/5 rounded-lg px-3 py-2 text-[11px] text-white focus:outline-none focus:border-emerald-500/40"
                                />
                                <button
                                    type="button"
                                    onClick={handleAddLink}
                                    className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold rounded-lg transition-all"
                                >
                                    Confirm Link
                                </button>
                            </div>
                        )}

                        <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileUpload} />
                    </div>

                    {/* Submit Section */}
                    <div className="flex items-center gap-3 pt-6 border-t border-white/5 shrink-0">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="flex-1 py-3 text-xs font-bold text-zinc-500 hover:text-white bg-[#14171f] border border-white/5 rounded-xl hover:bg-white/5 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading || isUploadingFile || !title.trim()}
                            className="flex-[1.5] py-3 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-blue-600/20 transition-all active:scale-95 disabled:opacity-50"
                        >
                            {isLoading ? (
                                <span className="flex items-center gap-2 justify-center">
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" /> Creating...
                                </span>
                            ) : "Create Issue"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
