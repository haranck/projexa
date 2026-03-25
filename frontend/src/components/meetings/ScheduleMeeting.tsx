import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Calendar, UserPlus, X, Clock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { useGetWorkspaceMembers } from "@/hooks/Workspace/WorkspaceHooks";
import { useScheduleMeeting } from "@/hooks/Meeting/MeetingHooks";
import toast from "react-hot-toast";

const scheduleMeetingSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    description: z.string().optional(),
    date: z.string().min(1, "Date is required"),
    startTime: z.string().min(1, "Start time is required"),
    endTime: z.string().min(1, "End time is required"),
    invitees: z.array(z.string()).min(1, "Select at least one attendee"),
});

type ScheduleMeetingFormValues = z.infer<typeof scheduleMeetingSchema>;

const ScheduleMeeting = () => {
    const currentProject = useSelector((state: RootState) => state.project.currentProject);
    const currentWorkspace = useSelector((state: RootState) => state.workspace.currentWorkspace);
    const user = useSelector((state: RootState) => state.auth.user);
    
    const { data: membersData } = useGetWorkspaceMembers(currentWorkspace?._id || "");
    const { mutate: schedule, isPending } = useScheduleMeeting();

    const [showMemberDropdown, setShowMemberDropdown] = useState(false);

    const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<ScheduleMeetingFormValues>({
        resolver: zodResolver(scheduleMeetingSchema),
        defaultValues: {
            invitees: [],
        }
    });

    const selectedInvitees = watch("invitees");

    useEffect(() => {
        if (currentProject?.members && selectedInvitees.length === 0) {
            const memberIds = currentProject.members.map(m => m.userId);
            setValue("invitees", memberIds);
        }
    }, [currentProject, setValue]);

    const onSubmit = (data: ScheduleMeetingFormValues) => {
        if (!currentProject?._id || !user?.id) {
            toast.error("Project or User context missing");
            return;
        }

        const startDateTime = new Date(`${data.date}T${data.startTime}`);
        const endDateTime = new Date(`${data.date}T${data.endTime}`);

        schedule({
            title: data.title,
            description: data.description,
            startTime: startDateTime,
            endTime: endDateTime,
            projectId: currentProject._id,
            hostId: user.id,
            invitees: data.invitees,
        }, {
            onSuccess: () => {
                toast.success("Meeting scheduled successfully");
                reset();
            },
            onError: (error: Error) => {
                toast.error(error.message || "Failed to schedule meeting");
            }
        });
    };

    const toggleInvitee = (userId: string) => {
        const current = selectedInvitees;
        if (current.includes(userId)) {
            setValue("invitees", current.filter(id => id !== userId));
        } else {
            setValue("invitees", [...current, userId]);
        }
    };

    const getMemberName = (userId: string) => {
        const workspaceMember = membersData?.data?.find((m: { member?: { _id: string, firstName: string, lastName: string } }) => m?.member?._id === userId);
        if (workspaceMember?.member) return `${workspaceMember.member.firstName} ${workspaceMember.member.lastName}`;
        
        const projectMember = currentProject?.members.find(pm => pm.userId === userId);
        if (projectMember?.user?.userName) return projectMember.user.userName;
        
        return "Loading...";
    };

    const getMemberAvatar = (userId: string) => {
        const workspaceMember = membersData?.data?.find((m: { member?: { _id: string, profilePicture?: string } }) => m?.member?._id === userId);
        if (workspaceMember?.member?.profilePicture) return workspaceMember.member.profilePicture;
        
        const projectMember = currentProject?.members.find(pm => pm.userId === userId);
        if (projectMember?.user?.profilePicture) return projectMember.user.profilePicture;
        
        return `https://ui-avatars.com/api/?name=${encodeURIComponent(getMemberName(userId))}&background=18181b&color=71717a`;
    };

    const projectMembers = membersData?.data?.filter((m: { member?: { _id: string } }) => 
        currentProject?.members.some(pm => pm.userId === m?.member?._id)
    ) || [];

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="bg-zinc-900/40 border border-zinc-800/80 rounded-[2.5rem] p-10 max-w-4xl shadow-2xl backdrop-blur-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 blur-[100px] pointer-events-none" />
            
            <h2 className="text-2xl font-black text-white mb-8">Schedule New Meeting</h2>
            
            <div className="space-y-8">
                <div className="space-y-2">
                    <label className="text-xs font-black text-zinc-500 uppercase tracking-widest ml-1">Meeting Title</label>
                    <input 
                        {...register("title")}
                        className={`w-full bg-zinc-950/50 border ${errors.title ? 'border-red-500/50' : 'border-zinc-800'} rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-1 focus:ring-blue-600/50 focus:border-blue-600 transition-all placeholder:text-zinc-700`}
                        placeholder="e.g., Weekly Sync"
                    />
                    {errors.title && <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider ml-1">{errors.title.message}</p>}
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-black text-zinc-500 uppercase tracking-widest ml-1">Description</label>
                    <textarea 
                        {...register("description")}
                        className="w-full bg-zinc-950/50 border border-zinc-800 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-1 focus:ring-blue-600/50 focus:border-blue-600 transition-all h-32 resize-none placeholder:text-zinc-700"
                        placeholder="Add meeting agenda..."
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-black text-zinc-500 uppercase tracking-widest ml-1">Date</label>
                        <div className="relative">
                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-zinc-600" />
                            <input 
                                type="date" 
                                {...register("date")}
                                className={`w-full bg-zinc-950/50 border ${errors.date ? 'border-red-500/50' : 'border-zinc-800'} rounded-2xl pl-12 pr-5 py-4 text-white focus:outline-none focus:ring-1 focus:ring-blue-600/50 focus:border-blue-600 transition-all scheme-dark`} 
                            />
                        </div>
                        {errors.date && <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider ml-1">{errors.date.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-black text-zinc-500 uppercase tracking-widest ml-1">Start Time</label>
                        <input 
                            type="time" 
                            {...register("startTime")}
                            className={`w-full bg-zinc-950/50 border ${errors.startTime ? 'border-red-500/50' : 'border-zinc-800'} rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-1 focus:ring-blue-600/50 focus:border-blue-600 transition-all scheme-dark`} 
                        />
                        {errors.startTime && <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider ml-1">{errors.startTime.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-black text-zinc-500 uppercase tracking-widest ml-1">End Time</label>
                        <input 
                            type="time" 
                            {...register("endTime")}
                            className={`w-full bg-zinc-950/50 border ${errors.endTime ? 'border-red-500/50' : 'border-zinc-800'} rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-1 focus:ring-blue-600/50 focus:border-blue-600 transition-all scheme-dark`} 
                        />
                        {errors.endTime && <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider ml-1">{errors.endTime.message}</p>}
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-black text-zinc-500 uppercase tracking-widest ml-1">Attendees</label>
                    <div className="w-full bg-zinc-950/50 border border-zinc-800 rounded-2xl px-4 py-3 flex flex-wrap gap-2 items-center min-h-[60px] cursor-pointer relative" onClick={() => setShowMemberDropdown(!showMemberDropdown)}>
                        {selectedInvitees.length === 0 && <span className="text-zinc-700 text-xs ml-2">Click to add members...</span>}
                        {selectedInvitees.map((userId) => (
                            <div key={userId} className="flex items-center gap-2 bg-zinc-800/80 px-3 py-1.5 rounded-xl border border-white/5" onClick={(e) => { e.stopPropagation(); toggleInvitee(userId); }}>
                                <img src={getMemberAvatar(userId)} className="size-5 rounded-full" alt="" />
                                <span className="text-[11px] text-zinc-200 font-bold">{getMemberName(userId)}</span>
                                <X className="size-3 text-zinc-500 cursor-pointer hover:text-red-400" />
                            </div>
                        ))}
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-blue-500 hover:bg-blue-500/10 transition-colors text-[11px] font-bold uppercase tracking-wider ml-auto">
                            <UserPlus className="size-3.5" />
                            Add
                        </div>

                        {showMemberDropdown && projectMembers.length > 0 && (
                            <div className="absolute top-full left-0 w-full mt-2 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl z-50 py-2 max-h-60 overflow-y-auto custom-scrollbar" onClick={(e) => e.stopPropagation()}>
                                {projectMembers.map((m: { member: { _id: string, firstName: string, lastName: string, email: string, profilePicture?: string } }) => (
                                    <div 
                                        key={m.member._id} 
                                        onClick={() => toggleInvitee(m.member._id)}
                                        className={`flex items-center gap-3 px-5 py-3 hover:bg-white/5 transition-colors cursor-pointer ${selectedInvitees.includes(m.member._id) ? 'bg-blue-600/10' : ''}`}
                                    >
                                        <img src={m.member.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(m.member.firstName)}&background=18181b&color=71717a`} className="size-8 rounded-full" />
                                        <div className="flex flex-col">
                                            <span className="text-xs text-white font-bold">{m.member.firstName} {m.member.lastName}</span>
                                            <span className="text-[10px] text-zinc-500 font-medium">{m.member.email}</span>
                                        </div>
                                        {selectedInvitees.includes(m.member._id) && <div className="ml-auto size-2 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]" />}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    {errors.invitees && <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider ml-1">{errors.invitees.message}</p>}
                </div>

                <div className="flex justify-end pt-4">
                    <Button 
                        type="submit"
                        disabled={isPending}
                        className="bg-blue-600 hover:bg-blue-500 text-white font-black rounded-2xl px-10 h-14 shadow-2xl shadow-blue-600/30 active:scale-95 transition-all text-sm uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed group"
                    >
                        {isPending ? <Loader2 className="size-4 animate-spin" /> : "Schedule Meeting"}
                        {!isPending && <Clock className="size-4 ml-2 group-hover:scale-110 transition-transform" />}
                    </Button>
                </div>
            </div>
        </form>
    );
};

export default ScheduleMeeting;
