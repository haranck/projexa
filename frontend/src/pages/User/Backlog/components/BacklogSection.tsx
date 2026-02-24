import { ChevronDown, ChevronRight, MoreHorizontal, User as UserIcon, Plus, Check, FileText, Bug, AlertCircle } from "lucide-react";
import type { IssueItem } from "../BacklogPage";
import type { ProjectMember } from "@/types/project";
import { useState } from "react";
import { toast } from "react-hot-toast";

interface BacklogSectionProps {
    isOpen: boolean;
    onToggle: () => void;
    issues: IssueItem[];
    allIssues: IssueItem[];
    onIssueClick: (id: string) => void;
    onCreateSprintClick: () => void;
    onCreateIssueClick: () => void;
    projectMembers: ProjectMember[];
    taskDotColors: string[];
    onUpdateStatus: (issueId: string, status: string) => void;
}

export const BacklogSection = ({
    isOpen,
    onToggle,
    issues,
    onIssueClick,
    onCreateSprintClick,
    onCreateIssueClick,
    projectMembers,
    taskDotColors,
    allIssues,
    onUpdateStatus,
}: BacklogSectionProps) => {
    const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

    const checkSubtasksDone = (parentId: string) => {
        const subtasks = allIssues.filter(i => i.parentIssueId === parentId);
        if (subtasks.length === 0) return true;
        return subtasks.every(s => s.status?.toUpperCase() === "DONE");
    };

    const handleStatusChange = (e: React.MouseEvent, issue: IssueItem, newStatus: string) => {
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
                setOpenDropdownId(null);
                return;
            }
        }
        onUpdateStatus(issue._id, newStatus);
        setOpenDropdownId(null);
    };

    const getTypeIcon = (type: string) => {
        switch (type.toLowerCase()) {
            case 'story': return <FileText className="w-3 h-3 text-emerald-400" />;
            case 'bug': return <Bug className="w-3 h-3 text-rose-400" />;
            default: return <Check className="w-3 h-3 text-blue-400" />;
        }
    };
    return (
        <div className="bg-[#14171f] rounded-[2rem] border border-white/5 overflow-hidden">
            <div
                className="flex items-center justify-between px-6 py-4 bg-white/2 cursor-pointer hover:bg-white/4 transition-colors"
                onClick={onToggle}
            >
                <div className="flex items-center gap-3">
                    <button className="p-1 hover:bg-white/10 rounded transition-colors text-zinc-500">
                        {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </button>
                    <span className="font-bold text-sm tracking-tight">Backlog</span>
                    <span className="text-xs font-medium text-zinc-600">({issues.length} issues)</span>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5">
                        <div className="w-4 h-1.5 bg-zinc-800 rounded-full" />
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                    </div>
                    <button
                        className="px-4 py-1.5 text-[10px] font-bold bg-emerald-500 hover:bg-emerald-400 text-white rounded-lg transition-colors shadow-lg shadow-emerald-500/20 active:scale-95"
                        onClick={(e) => {
                            e.stopPropagation();
                            onCreateSprintClick();
                        }}
                    >
                        Create Sprint
                    </button>
                    <button className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-zinc-500">
                        <MoreHorizontal className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {isOpen && (
                <div className="min-h-[120px] divide-y divide-white/5 transition-all duration-300">
                    {issues.length > 0 ? (
                        issues.map((issue, idx) => (
                            <div
                                key={issue._id}
                                onClick={() => onIssueClick(issue._id)}
                                className="flex items-center gap-4 px-6 py-3 hover:bg-white/2 transition-colors cursor-pointer group"
                            >
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                    <div className={`w-2 h-2 rounded-full shrink-0 ${taskDotColors[idx % taskDotColors.length]}`} />
                                    {/* Issue Type Icon */}
                                    <div className="w-5 h-5 rounded bg-white/5 flex items-center justify-center shrink-0">
                                        {getTypeIcon(issue.issueType)}
                                    </div>
                                    <span className="text-xs font-medium text-zinc-300 truncate">{issue.title}</span>
                                    <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-tight ml-1">
                                        {issue.issueType}
                                    </span>
                                </div>
                                <div className="flex items-center gap-4 shrink-0">
                                    {/* Status Dropdown */}
                                    <div className="relative">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setOpenDropdownId(openDropdownId === issue._id ? null : issue._id);
                                            }}
                                            className={`px-3 py-1 rounded-lg text-[10px] font-bold border transition-all flex items-center gap-2 ${issue.status?.toUpperCase() === "TODO"
                                                ? "bg-zinc-500/10 border-zinc-500/20 text-zinc-400"
                                                : issue.status?.toUpperCase() === "IN_PROGRESS"
                                                    ? "bg-blue-500/10 border-blue-500/20 text-blue-400"
                                                    : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                                                }`}
                                        >
                                            {issue.status?.toUpperCase().replace("_", " ") || "TODO"}
                                            <ChevronDown className={`w-3 h-3 transition-transform ${openDropdownId === issue._id ? 'rotate-180' : ''}`} />
                                        </button>

                                        {openDropdownId === issue._id && (
                                            <div className="absolute top-full right-0 mt-2 z-50 bg-[#1a1c22] border border-white/10 rounded-xl shadow-2xl py-1.5 min-w-[120px] animate-in fade-in slide-in-from-top-1">
                                                {["TODO", "IN_PROGRESS", "DONE"].map((s) => (
                                                    <button
                                                        key={s}
                                                        onClick={(e) => handleStatusChange(e, issue, s)}
                                                        className={`w-full px-4 py-1.5 transition-all text-left text-[10px] font-bold uppercase flex items-center justify-between hover:bg-white/5 ${issue.status?.toUpperCase() === s ? 'text-white bg-white/5' : 'text-zinc-500'}`}
                                                    >
                                                        {s.replace("_", " ")}
                                                        {issue.status?.toUpperCase() === s && <Check className="w-3 h-3 text-emerald-500" />}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <span className="text-[10px] font-bold text-zinc-500 bg-white/5 px-2 py-0.5 rounded border border-white/5">
                                        {issue.key}
                                    </span>
                                    <div className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center overflow-hidden border border-white/5">
                                        {issue.assigneeId && projectMembers.find(m => m.userId === issue.assigneeId)?.user?.profilePicture ? (
                                            <img
                                                src={projectMembers.find(m => m.userId === issue.assigneeId)?.user?.profilePicture}
                                                alt=""
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-zinc-900 flex items-center justify-center text-[10px] font-bold text-zinc-600 capitalize">
                                                {issue.assigneeId && projectMembers.find(m => m.userId === issue.assigneeId)?.user?.userName?.charAt(0) || <UserIcon className="w-3 h-3" />}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="p-6 bg-[#0e1117]/50 flex flex-col items-center justify-center border-y border-white/5 border-dashed mx-6 my-2 rounded-2xl">
                            <p className="text-xs font-bold text-zinc-700">
                                Backlog is empty, or create new issues
                            </p>
                        </div>
                    )}
                </div>
            )}
            <div className="p-4 px-6">
                <button
                    onClick={onCreateIssueClick}
                    className="flex items-center gap-2 text-[10px] font-bold text-zinc-500 hover:text-white transition-colors group"
                >
                    <div className="p-1 rounded bg-zinc-800 group-hover:bg-blue-600 transition-colors">
                        <Plus className="w-3 h-3 text-white" />
                    </div>
                    Create issue
                </button>
            </div>
        </div>
    );
};
