import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { IssueType } from "@/services/Issue/IssueService";
import type { IssueItem } from "@/utils/filterIssues";
import type { Project, ProjectMember } from "@/types/project";

interface BoardCardProps {
    issue: IssueItem;
    allIssues: IssueItem[];
    currentProject: Project | null;
    onIssueClick: (id: string) => void;
}

export const BoardCard = ({ issue, allIssues, currentProject, onIssueClick }: BoardCardProps) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({
        id: issue._id,
    });

    const style = {
        transform: CSS.Translate.toString(transform),
        transition,
        opacity: isDragging ? 0.3 : undefined,
    };

    const assignee = currentProject?.members?.find((m: ProjectMember) => m.userId === issue.assigneeId);

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            onClick={() => onIssueClick(issue._id)}
            className="bg-[#161b22] border border-zinc-800 rounded-xl p-4 hover:border-zinc-700 cursor-grab active:cursor-grabbing transition-all group relative"
        >
            <div className={`absolute left-0 top-4 bottom-4 w-1 ${issue.issueType === IssueType.BUG ? "bg-rose-500" :
                issue.issueType === IssueType.STORY ? "bg-emerald-500" : "bg-blue-500"
                } rounded-r-full`} />

            <div className="pl-3">
                <div className="flex items-center gap-2 mb-2">
                    {issue.parentIssueId && (
                        <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 rounded text-[10px] font-bold uppercase tracking-tight">
                            {allIssues.find(e => e._id === issue.parentIssueId)?.title || "Epic"}
                        </span>
                    )}
                </div>

                <h3 className="text-sm font-semibold mb-6 group-hover:text-blue-400 transition-colors line-clamp-2">
                    {issue.title}
                </h3>

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <span className="text-[10px] font-bold text-zinc-500 uppercase">{issue.key}</span>
                        <span className="text-[10px] font-bold text-zinc-500">{issue.issueType}</span>
                    </div>
                    {issue.assigneeId && (
                        <div className="w-6 h-6 rounded-full border border-zinc-800 overflow-hidden">
                            {assignee?.user?.profilePicture ? (
                                <img
                                    src={assignee.user.profilePicture}
                                    className="w-full h-full object-cover"
                                    alt=""
                                />
                            ) : (
                                <div className="w-full h-full bg-zinc-700 flex items-center justify-center text-[8px]">
                                    {assignee?.user?.userName?.charAt(0)}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
