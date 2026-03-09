import { ChevronDown, User as UserIcon, Check, FileText, Bug, AlertCircle } from "lucide-react";
import type { IssueItem } from "../BacklogPage";
import type { ProjectMember } from "@/types/project";
import { toast } from "react-hot-toast";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface DraggableIssueItemProps {
    issue: IssueItem;
    idx: number;
    projectMembers: ProjectMember[];
    taskDotColors: string[];
    onIssueClick: (id: string) => void;
    onUpdateStatus: (issueId: string, status: string) => void;
    allIssues: IssueItem[]; // Needed for subtask check
    activeStatusDropdownId: string | null;
    onActiveStatusDropdownChange: (id: string | null) => void;
    isOverlay?: boolean;
}

export const DraggableIssueItem = ({
    issue,
    idx,
    projectMembers,
    taskDotColors,
    onIssueClick,
    onUpdateStatus,
    allIssues,
    activeStatusDropdownId,
    onActiveStatusDropdownChange,
    isOverlay = false,
}: DraggableIssueItemProps) => {

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: issue._id,
    });

    const style = {
        transform: CSS.Translate.toString(transform),
        transition,
        zIndex: isDragging ? 50 : undefined,
        opacity: isDragging ? 0.3 : 1,
    };

    const checkSubtasksDone = (parentId: string) => {
        const subtasks = allIssues.filter(i => i.parentIssueId === parentId);
        if (subtasks.length === 0) return true;
        return subtasks.every(s => s.status?.toUpperCase() === "DONE");
    };

    const handleStatusChange = (e: React.MouseEvent, newStatus: string) => {
        e.stopPropagation();
        if (newStatus.toUpperCase() === "DONE") {
            if (!checkSubtasksDone(issue._id)) {
                toast.error("Finish all subtasks before moving to done", {
                    icon: <AlertCircle className="w-4 h-4 text-rose-500" />,
                    style: {
                        background: '#1a1c22',
                        color: '#fff',
                        border: '1px solid rgba(255,255,255,0.05)',
                        fontSize: '11px',
                        fontWeight: 'bold',
                    }
                });
                onActiveStatusDropdownChange(null);
                return;
            }
        }
        onUpdateStatus(issue._id, newStatus);
        onActiveStatusDropdownChange(null);
    };

    const getTypeIcon = (type: string) => {
        switch (type.toLowerCase()) {
            case 'story': return <FileText className="w-3 h-3 text-emerald-400" />;
            case 'bug': return <Bug className="w-3 h-3 text-rose-400" />;
            default: return <Check className="w-3 h-3 text-blue-400" />;
        }
    };

    return (
        <div
            ref={setNodeRef}
            style={isOverlay ? undefined : style}
            {...attributes}
            {...listeners}
            onClick={() => onIssueClick(issue._id)}
            className={`flex items-center gap-4 px-6 py-3 hover:bg-white/5 transition-all cursor-pointer group rounded-xl border border-transparent ${isDragging ? 'bg-zinc-800/50 border-white/5 opacity-30 shadow-2xl' : 'hover:border-white/5 hover:translate-x-1'} ${isOverlay ? 'bg-[#1a1c22] border-blue-500/50 shadow-2xl scale-[1.02] opacity-100 cursor-grabbing' : ''}`}
        >
            <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className={`w-2.5 h-2.5 rounded-full shrink-0 shadow-sm ${taskDotColors[idx % taskDotColors.length]}`} />
                <div className="w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center shrink-0 border border-white/5">
                    {getTypeIcon(issue.issueType)}
                </div>
                <div className="flex flex-col min-w-0">
                    <span className="text-xs font-semibold text-zinc-200 truncate leading-tight">{issue.title}</span>
                    <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider">
                        {issue.issueType}
                    </span>
                </div>
            </div>
            <div className="flex items-center gap-4 shrink-0" onClick={(e) => e.stopPropagation()}>
                {/* Status Dropdown */}
                <div className="relative">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onActiveStatusDropdownChange(activeStatusDropdownId === issue._id ? null : issue._id);
                        }}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-all flex items-center gap-2 ${issue.status?.toUpperCase() === "TODO"
                            ? "bg-zinc-500/10 border-zinc-500/20 text-zinc-400"
                            : issue.status?.toUpperCase() === "IN_PROGRESS"
                                ? "bg-blue-500/10 border-blue-500/20 text-blue-400"
                                : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                            }`}
                    >
                        {issue.status?.toUpperCase().replace("_", " ") || "TODO"}
                        <ChevronDown className={`w-3 h-3 transition-transform ${activeStatusDropdownId === issue._id ? 'rotate-180' : ''}`} />
                    </button>

                    {activeStatusDropdownId === issue._id && (
                        <div className="absolute top-full right-0 mt-2 z-100 bg-[#1a1c22] border border-white/10 rounded-xl shadow-2xl py-1.5 min-w-[130px] animate-in fade-in slide-in-from-top-1">
                            {["TODO", "IN_PROGRESS", "DONE"].map((s) => (
                                <button
                                    key={s}
                                    onClick={(e) => handleStatusChange(e, s)}
                                    className={`w-full px-4 py-2 transition-all text-left text-[10px] font-bold uppercase flex items-center justify-between hover:bg-white/5 ${issue.status?.toUpperCase() === s ? 'text-white bg-white/5' : 'text-zinc-500'}`}
                                >
                                    {s.replace("_", " ")}
                                    {issue.status?.toUpperCase() === s && <Check className="w-3 h-3 text-emerald-500" />}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <span className="text-[10px] font-bold text-zinc-500 bg-white/5 px-2.5 py-1 rounded-lg border border-white/5 min-w-[60px] text-center">
                    {issue.key}
                </span>
                <div className="w-7 h-7 rounded-full bg-zinc-800 flex items-center justify-center overflow-hidden border border-white/10 ring-2 ring-transparent group-hover:ring-white/5 transition-all">
                    {issue.assigneeId && projectMembers.find(m => m.userId === issue.assigneeId)?.user?.profilePicture ? (
                        <img
                            src={projectMembers.find(m => m.userId === issue.assigneeId)?.user?.profilePicture}
                            alt=""
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full bg-zinc-900 flex items-center justify-center text-[10px] font-bold text-zinc-600 capitalize">
                            {issue.assigneeId && projectMembers.find(m => m.userId === issue.assigneeId)?.user?.userName?.charAt(0) || <UserIcon className="w-3.5 h-3.5" />}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

