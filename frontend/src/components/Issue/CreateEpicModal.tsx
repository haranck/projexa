import { useState, useRef } from "react";
import { X, Upload, Loader2, FileText, Link as LinkIcon, Globe, User, ArrowLeft } from "lucide-react";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import { getAttachmentUploadUrl, uploadFileToS3, IssueStatus } from "@/services/Issue/IssueService";
import type { IAttachement } from "@/services/Issue/IssueService";
import type { RootState } from "@/store/store";

interface CreateEpicModalProps {
    isOpen: boolean;
    projectName: string;
    onClose: () => void;
    onSubmit: (data: EpicFormData) => void;
    isLoading: boolean;
}

export interface EpicFormData {
    title: string;
    description: string;
    status: string;
    startDate: string;
    endDate: string;
    attachments: IAttachement[];
}

const EPIC_COLORS = [
    "bg-blue-500", "bg-purple-500", "bg-emerald-500",
    "bg-amber-500", "bg-rose-500", "bg-cyan-500",
];

export const CreateEpicModal = ({ isOpen, projectName, onClose, onSubmit, isLoading }: CreateEpicModalProps) => {
    const { user } = useSelector((state: RootState) => state.auth);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState<string>(IssueStatus.TODO);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [attachments, setAttachments] = useState<IAttachement[]>([]);
    const [isUploadingFile, setIsUploadingFile] = useState(false);

    // Link attachment state
    const [isAddingLink, setIsAddingLink] = useState(false);
    const [linkUrl, setLinkUrl] = useState("");
    const [linkName, setLinkName] = useState("");

    const [selectedColor] = useState(EPIC_COLORS[0]);
    const fileInputRef = useRef<HTMLInputElement>(null);

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
            console.error('error :', err);
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
            toast.error("Epic name is required");
            return;
        }
        onSubmit({ title, description, status, startDate, endDate, attachments });
    };

    const handleClose = () => {
        setTitle("");
        setDescription("");
        setStatus(IssueStatus.TODO);
        setStartDate("");
        setEndDate("");
        setAttachments([]);
        setIsAddingLink(false);
        setLinkUrl("");
        setLinkName("");
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
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
                        <h2 className="text-lg font-bold text-white">Create New Epic</h2>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-8 overflow-y-auto custom-scrollbar">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-zinc-500">
                            Project <span className="text-rose-500">*</span>
                        </label>
                        <div className="w-full bg-[#14171f] border border-white/5 rounded-xl px-4 py-3 text-sm text-zinc-300 cursor-not-allowed">
                            {projectName}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-zinc-500">
                            Epic Name <span className="text-rose-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g : Wishlist"
                            className="w-full bg-[#14171f] border border-white/5 rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-700 focus:outline-none focus:ring-1 focus:ring-blue-500/40 transition-all"
                            autoFocus
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-zinc-500">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Describe the goals and scope of this epic..."
                            rows={5}
                            className="w-full bg-[#14171f] border border-white/5 rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-700 focus:outline-none focus:ring-1 focus:ring-blue-500/40 resize-none transition-all leading-relaxed"
                        />
                    </div>

                    <div className="flex flex-col gap-6">
                        <div className="flex justify-end items-center gap-4">
                            <label className="text-xs font-bold text-zinc-500">Status</label>
                            <div className="relative group min-w-[140px]">
                                <select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                    className="w-full bg-[#14171f] border border-white/5 rounded-xl pl-4 pr-10 py-2.5 text-xs text-white font-bold tracking-tight appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500/20"
                                >
                                    <option value={IssueStatus.TODO}>TODO</option>
                                    <option value={IssueStatus.IN_PROGRESS}>IN PROGRESS</option>
                                    <option value={IssueStatus.DONE}>DONE</option>
                                </select>
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                    <Globe className="w-3.5 h-3.5 text-zinc-600" />
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 justify-between pt-4 border-t border-white/5">
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Assignee (Created By)</label>
                                <div className="flex items-center gap-3">
                                    {user?.avatarUrl ? (
                                        <img src={user.avatarUrl} className="w-8 h-8 rounded-full border border-white/10" alt="" />
                                    ) : (
                                        <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center border border-white/10">
                                            <User className="w-4 h-4 text-blue-400" />
                                        </div>
                                    )}
                                    <div className="flex flex-col">
                                        <span className="text-xs text-zinc-200 font-bold">{user?.firstName} {user?.lastName}</span>
                                        <span className="text-[9px] text-zinc-500">{user?.email}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-1 text-right">
                                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Issue Type</label>
                                <div className="flex items-center gap-2 justify-end">
                                    <div className={`w-3 h-3 rounded-[3px] ${selectedColor}`} />
                                    <span className="text-xs text-zinc-300 font-bold uppercase tracking-tighter">Epic</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-8 pt-4 border-t border-white/5">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-zinc-500">Start Date</label>
                            <div className="relative">
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    placeholder="DD-MM-YYYY"
                                    className="w-full bg-[#14171f] border border-white/5 rounded-xl px-4 py-3 text-sm text-zinc-300 focus:outline-none focus:ring-1 focus:ring-blue-500/40 scheme-dark"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-zinc-500">End Date</label>
                            <div className="relative">
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    placeholder="DD-MM-YYYY"
                                    className="w-full bg-[#14171f] border border-white/5 rounded-xl px-4 py-3 text-sm text-zinc-300 focus:outline-none focus:ring-1 focus:ring-blue-500/40 scheme-dark"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-white/5">
                        <label className="text-xs font-bold text-zinc-500">Attachments</label>

                        {attachments.length > 0 && (
                            <div className="space-y-2">
                                {attachments.map((att, i) => (
                                    <div key={i} className="flex items-center gap-3 px-4 py-3 bg-[#1a1d26] border border-white/5 rounded-xl group">
                                        {att.type === 'file' ? (
                                            <FileText className="w-4 h-4 text-blue-400 shrink-0" />
                                        ) : (
                                            <Globe className="w-4 h-4 text-emerald-400 shrink-0" />
                                        )}
                                        <span className="flex-1 text-xs text-zinc-300 truncate font-medium">{att.fileName || att.url}</span>
                                        <button
                                            type="button"
                                            onClick={() => removeAttachment(i)}
                                            className="p-1.5 rounded-lg text-zinc-600 hover:text-red-400 hover:bg-red-400/10 transition-all opacity-0 group-hover:opacity-100"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Explicit Attachment Options */}
                        <div className="flex items-center gap-4">
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={isUploadingFile}
                                className="flex-1 flex items-center justify-center gap-3 py-3 bg-[#1a1d26] border border-dashed border-white/10 rounded-xl text-xs font-bold text-zinc-500 hover:border-blue-500/30 hover:text-blue-400 transition-all"
                            >
                                {isUploadingFile ? (
                                    <><Loader2 className="w-4 h-4 animate-spin" /> Uploading...</>
                                ) : (
                                    <><Upload className="w-4 h-4" /> Upload File (S3)</>
                                )}
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsAddingLink(!isAddingLink)}
                                className={`flex-1 flex items-center justify-center gap-3 py-3 border rounded-xl text-xs font-bold transition-all ${isAddingLink ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-[#1a1d26] border-dashed border-white/10 text-zinc-500 hover:border-emerald-500/30 hover:text-emerald-400'}`}
                            >
                                <LinkIcon className="w-4 h-4" />
                                {isAddingLink ? 'Cancel URL' : 'Add URL (Link)'}
                            </button>
                        </div>

                        {/* Add Link Form */}
                        {isAddingLink && (
                            <div className="p-5 bg-[#1a1d26] border border-emerald-500/20 rounded-xl space-y-4 animate-in fade-in slide-in-from-top-2">
                                <input
                                    type="text"
                                    value={linkUrl}
                                    onChange={(e) => setLinkUrl(e.target.value)}
                                    placeholder="Paste URL here..."
                                    className="w-full bg-[#0d1016] border border-white/5 rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500/40"
                                />
                                <input
                                    type="text"
                                    value={linkName}
                                    onChange={(e) => setLinkName(e.target.value)}
                                    placeholder="Display Name (e.g. Documentation)"
                                    className="w-full bg-[#0d1016] border border-white/5 rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500/40"
                                />
                                <button
                                    type="button"
                                    onClick={handleAddLink}
                                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg transition-all"
                                >
                                    Confirm Link (Save to DB)
                                </button>
                            </div>
                        )}

                        <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileUpload} />
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-4 pt-8 border-t border-white/5 shrink-0">
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
                            className="flex-2 py-3 bg-blue-600 hover:bg-blue-500 text-white text-xs font-extrabold rounded-xl shadow-lg shadow-blue-600/20 transition-all active:scale-95 disabled:opacity-50"
                        >
                            {isLoading ? (
                                <span className="flex items-center gap-2 justify-center">
                                    <Loader2 className="w-4 h-4 animate-spin" /> Creating Epic...
                                </span>
                            ) : "Create Epic"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
