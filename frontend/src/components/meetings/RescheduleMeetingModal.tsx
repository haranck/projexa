import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserPlus, X, Clock, Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { useGetWorkspaceMembers } from "@/hooks/Workspace/WorkspaceHooks";
import { useRescheduleMeeting } from "@/hooks/Meeting/MeetingHooks";
import toast from "react-hot-toast";
import { getErrorMessage } from "@/utils/errorHandler";
import { scheduleMeetingSchema } from "@/lib/validations/meeting.schema";
import type { ScheduleMeetingFormValues } from "@/lib/validations/meeting.schema";
import type { Meeting } from "./types";

interface WorkspaceMember {
    member: {
        _id: string;
        firstName: string;
        lastName: string;
        email: string;
        profilePicture?: string;
    };
}

interface RescheduleMeetingModalProps {
    open: boolean;
    onClose: () => void;
    meeting: Meeting;
}

const RescheduleMeetingModal = ({ open, onClose, meeting }: RescheduleMeetingModalProps) => {
    const currentWorkspace = useSelector((state: RootState) => state.workspace.currentWorkspace);
    const currentProject = useSelector((state: RootState) => state.project.currentProject);
    const { data: membersData } = useGetWorkspaceMembers(currentWorkspace?._id || "");
    const { mutate: reschedule, isPending } = useRescheduleMeeting();
    const [showMemberDropdown, setShowMemberDropdown] = useState(false);

    const projectMembers = membersData?.data?.filter((m: WorkspaceMember) => 
        currentProject?.members.some(pm => pm.userId === m?.member?._id)
    ) || [];

    const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<ScheduleMeetingFormValues>({
        resolver: zodResolver(scheduleMeetingSchema),
        defaultValues: {
            title: meeting.title,
            description: meeting.description || "",
            date: new Date(meeting.startTime).toISOString().split('T')[0],
            startTime: new Date(meeting.startTime).toTimeString().slice(0, 5),
            endTime: new Date(meeting.endTime).toTimeString().slice(0, 5),
            invitees: meeting.invitees || [],
        }
    });

    const selectedInvitees = watch("invitees");

    const onSubmit = (data: ScheduleMeetingFormValues) => {
        const startDateTime = new Date(`${data.date}T${data.startTime}`);
        const endDateTime = new Date(`${data.date}T${data.endTime}`);

        reschedule({
            meetingId: meeting.id,
            title: data.title,
            description: data.description,
            startTime: startDateTime,
            endTime: endDateTime,
            projectId: meeting.projectId,
            invitees: data.invitees,
        }, {
            onSuccess: () => {
                toast.success("Meeting rescheduled successfully");
                onClose();
            },
            onError: (error: Error) => {
                toast.error(getErrorMessage(error) || "Failed to reschedule meeting");
            }
        });
    };

    const toggleInvitee = (userId: string) => {
        const current = selectedInvitees;
        setValue("invitees", current.includes(userId) ? current.filter(id => id !== userId) : [...current, userId]);
    };

    const getMemberName = (userId: string) => {
        const workspaceMember = membersData?.data?.find((m: WorkspaceMember) => m?.member?._id === userId);
        return workspaceMember?.member ? `${workspaceMember.member.firstName} ${workspaceMember.member.lastName}` : "Team Member";
    };

    const getMemberAvatar = (userId: string) => {
        const workspaceMember = membersData?.data?.find((m: WorkspaceMember) => m?.member?._id === userId);
        return workspaceMember?.member?.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(getMemberName(userId))}&background=18181b&color=71717a`;
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-zinc-950 border border-white/10 w-full max-w-2xl max-h-[90vh] rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
                <div className="p-6 border-b border-white/5 flex items-center justify-between bg-zinc-900/40">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500 border border-blue-500/20">
                            <Clock className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white tracking-tight">Reschedule Meeting</h2>
                            <p className="text-zinc-500 text-xs font-medium">Update time, agenda, or participants</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/5 text-zinc-400 hover:text-white transition-all"><X className="w-5 h-5" /></button>
                </div>

                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                    <form id="reschedule-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-1">Meeting Title</label>
                            <input {...register("title")} className="w-full bg-zinc-900/50 border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all text-sm" />
                            {errors.title && <p className="text-red-500 text-[10px] mt-1 font-bold">{errors.title.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-1">Description</label>
                            <textarea {...register("description")} rows={3} className="w-full bg-zinc-900/50 border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all text-sm resize-none" />
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-1">Date</label>
                                <input type="date" {...register("date")} className="w-full bg-zinc-900/50 border border-white/5 rounded-xl px-3 py-3 text-white text-xs scheme-dark" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-1">Start</label>
                                <input type="time" {...register("startTime")} className="w-full bg-zinc-900/50 border border-white/5 rounded-xl px-3 py-3 text-white text-xs scheme-dark" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-1">End</label>
                                <input type="time" {...register("endTime")} className="w-full bg-zinc-900/50 border border-white/5 rounded-xl px-3 py-3 text-white text-xs scheme-dark" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-1">Attendees</label>
                            <div className="w-full bg-zinc-900/50 border border-white/5 rounded-xl p-3 flex flex-wrap gap-2 min-h-[60px] cursor-pointer relative" onClick={() => setShowMemberDropdown(!showMemberDropdown)}>
                                {selectedInvitees.map((userId) => (
                                    <div key={userId} className="flex items-center gap-2 bg-zinc-800 px-2 py-1 rounded-lg border border-white/5" onClick={(e) => { e.stopPropagation(); toggleInvitee(userId); }}>
                                        <img src={getMemberAvatar(userId)} className="size-4 rounded-full" />
                                        <span className="text-[10px] text-zinc-200 font-bold">{getMemberName(userId).split(' ')[0]}</span>
                                        <X className="size-3 text-zinc-500" />
                                    </div>
                                ))}
                                <div className="ml-auto text-blue-500 text-[10px] font-bold flex items-center gap-1"><UserPlus className="size-3" /> Add</div>
                                {showMemberDropdown && (
                                    <div className="absolute top-full left-0 w-full mt-2 bg-zinc-900 border border-white/10 rounded-xl shadow-2xl z-50 py-2 max-h-48 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                                        {projectMembers.map((m: WorkspaceMember) => (
                                            <div key={m.member._id} onClick={() => toggleInvitee(m.member._id)} className={`flex items-center gap-3 px-4 py-2 hover:bg-white/5 cursor-pointer ${selectedInvitees.includes(m.member._id) ? 'bg-blue-600/10' : ''}`}>
                                                <img src={m.member.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(m.member.firstName)}&background=18181b&color=71717a`} className="size-6 rounded-full" />
                                                <span className="text-xs text-zinc-300">{m.member.firstName} {m.member.lastName}</span>
                                                {selectedInvitees.includes(m.member._id) && <div className="ml-auto size-1.5 bg-blue-500 rounded-full" />}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </form>
                </div>

                <div className="p-6 border-t border-white/5 bg-zinc-900/40 flex items-center justify-end gap-3">
                    <Button variant="ghost" onClick={onClose} className="rounded-xl text-xs font-bold text-zinc-500 hover:text-white">Cancel</Button>
                    <Button form="reschedule-form" disabled={isPending} className="bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl px-8 shadow-xl shadow-blue-500/20 active:scale-95 transition-all text-xs">
                        {isPending ? <Loader2 className="size-3 animate-spin mr-2" /> : <Save className="size-3 mr-2" />}
                        Save Changes
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default RescheduleMeetingModal;
