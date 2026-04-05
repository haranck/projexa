import { useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import DashboardLayout from "../../../components/Layout/DashboardLayout";
import { Clock, Plus, Calendar, CheckSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import VideoCall from "../../../components/common/VideoCall";

// Import modular components
import type { Meeting } from "@/components/meetings/types";
import UpcomingMeetings from "@/components/meetings/UpcomingMeetings";
import ScheduleMeeting from "@/components/meetings/ScheduleMeeting";
import RecentMeetings from "@/components/meetings/RecentMeetings";
import RescheduleMeetingModal from "@/components/meetings/RescheduleMeetingModal";
import { useGetProjectMeetings } from "@/hooks/Meeting/MeetingHooks";
import { useGetWorkspaceMembers, useGetRoles } from "@/hooks/Workspace/WorkspaceHooks";
import { Loader2 } from "lucide-react";

interface BackendMeeting {
    _id: string;
    title: string;
    description?: string;
    startTime: string | Date;
    endTime: string | Date;
    projectId: string;
    hostId: string;
    participants: {
        userId: string;
        status: string;
        joinedAt?: string | Date;
        leftAt?: Date;
    }[];
    status: 'upcoming' | 'completed' | 'cancelled';
    currentUserStatus?: 'joined' | 'left' | 'missed' | 'invited';
}
    
export const MeetingsPage = () => {
    const user = useSelector((state: RootState) => state.auth.user);
    const currentProject = useSelector((state: RootState) => state.project.currentProject);
    const currentWorkspace = useSelector((state: RootState) => state.workspace.currentWorkspace);
    const [activeTab, setActiveTab] = useState<"upcoming" | "schedule" | "recent">("upcoming");
    const [activeMeeting, setActiveMeeting] = useState<Meeting | null>(null);
    const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
    const [meetingToReschedule, setMeetingToReschedule] = useState<Meeting | null>(null);

    const { data: meetingsData, isLoading } = useGetProjectMeetings(currentProject?._id || "");
    const { data: membersData } = useGetWorkspaceMembers(currentWorkspace?._id || "");
    const { data: rolesData } = useGetRoles();

    const isProjectManager = (() => {
        if (!currentProject || !user) return false;
        const userMember = currentProject.members.find(m => m.userId === user.id);
        if (!userMember) return false;
        if (currentProject.createdBy === user.id) return true;
        const pmRole = rolesData?.data?.find((r: { _id: string; name: string }) => r.name === "Project Manager");
        return userMember.roleId === pmRole?._id;
    })();

    const formatTime = (date: Date | string) => {
        return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const formatDate = (date: Date | string) => {
        const d = new Date(date);
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        if (d.toDateString() === today.toDateString()) return "Today";
        if (d.toDateString() === tomorrow.toDateString()) return "Tomorrow";
        return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
    };

    const getMemberInfo = (userId: string): { name: string; avatar: string } => {
        // Try workspace members first (detailed names)
        const workspaceMember = membersData?.data?.find((m: { member?: { _id: string } }) => m?.member?._id === userId);
        if (workspaceMember) {
            return {
                name: `${workspaceMember.member.firstName} ${workspaceMember.member.lastName}`,
                avatar: workspaceMember.member.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(workspaceMember.member.firstName)}&background=18181b&color=71717a`
            };
        }

        // Try project members (populated user object)
        const projectMember = currentProject?.members.find(pm => pm.userId === userId);
        if (projectMember?.user?.userName) {
            return {
                name: projectMember.user.userName,
                avatar: projectMember.user.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(projectMember.user.userName)}&background=18181b&color=71717a`
            };
        }

        return { 
            name: "Team Member", 
            avatar: `https://ui-avatars.com/api/?name=T&background=18181b&color=71717a` 
        };
    };

    const mapMeeting = (m: BackendMeeting): Meeting => {
        const host = getMemberInfo(m.hostId);
        const start = new Date(m.startTime);
        const end = new Date(m.endTime);
        const diffMs = end.getTime() - start.getTime();
        const diffMins = Math.round(diffMs / 60000);
        const duration = diffMins >= 60 ? `${Math.floor(diffMins / 60)}h ${diffMins % 60}m` : `${diffMins}m`;

        let tag = formatDate(start);
        let tagColor = "bg-blue-500/20 text-blue-400 border-blue-500/30";

        if (m.currentUserStatus === 'missed') {
            tag = "Missed";
            tagColor = "bg-red-500/10 text-red-400 border-red-500/20";
        } else if (m.status === 'completed') {
            tag = "Completed";
            tagColor = "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
        } else if (tag === "Tomorrow") {
            tagColor = "bg-purple-500/20 text-purple-400 border-purple-500/30";
        } else if (tag !== "Today") {
            tag = "Scheduled";
            tagColor = "bg-zinc-800 text-zinc-400 border-zinc-700/50";
        }

        return {
            id: m._id,
            title: m.title,
            tag,
            tagColor,
            date: formatDate(start),
            time: `${formatTime(start)} - ${formatTime(end)}`,
            duration,
            host,
            attendees: m.participants?.map((p: { userId: string }) => getMemberInfo(p.userId)) || [],
            projectId: m.projectId,
            hostId: m.hostId,
            description: m.description,
            startTime: m.startTime,
            endTime: m.endTime,
            invitees: m.participants?.map((p: { userId: string }) => p.userId) || [],
            status: m.currentUserStatus || m.status
        };
    };

    const upcomingMeetings = meetingsData?.data?.upcoming?.map(mapMeeting) || [];
    const recentMeetings = meetingsData?.data?.recent?.map(mapMeeting) || [];

    const handleJoinCall = (meeting: Meeting) => {
        setActiveMeeting(meeting);
    };

    return (
        <DashboardLayout>
            <div className="min-h-full bg-[#0b0e14] p-4 sm:p-8 overflow-y-auto custom-scrollbar">
                <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="mb-8 sm:mb-12">
                    <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-2">Meetings</h1>
                    <p className="text-zinc-500 font-medium">Coordinate and launch your project transmissions.</p>
                </div>

                {/* Tabs Navigation */}
                <div className="flex items-center justify-between mb-6 sm:mb-8 border-b border-zinc-800/50 overflow-x-auto">
                    <div className="flex gap-4 sm:gap-12 shrink-0">
                        <button
                            onClick={() => setActiveTab("upcoming")}
                            className={`flex items-center gap-2 pb-4 text-sm font-bold transition-all relative whitespace-nowrap ${activeTab === "upcoming" ? "text-blue-500" : "text-zinc-500 hover:text-zinc-300"
                                }`}
                        >
                            <Clock className="size-4" />
                            Upcoming Meetings
                            {activeTab === "upcoming" && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />}
                        </button>
                        <button
                            onClick={() => setActiveTab("schedule")}
                            className={`flex items-center gap-2 pb-4 text-sm font-bold transition-all relative whitespace-nowrap ${activeTab === "schedule" ? "text-blue-500" : "text-zinc-500 hover:text-zinc-300"
                                }`}
                        >
                            <Plus className="size-4" />
                            Schedule Meeting
                            {activeTab === "schedule" && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />}
                        </button>
                        <button
                            onClick={() => setActiveTab("recent")}
                            className={`flex items-center gap-2 pb-4 text-sm font-bold transition-all relative whitespace-nowrap ${activeTab === "recent" ? "text-blue-500" : "text-zinc-500 hover:text-zinc-300"
                                }`}
                        >
                            <CheckSquare className="size-4" />
                            Recent Meetings
                            {activeTab === "recent" && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />}
                        </button>
                    </div>
                    <div className="pb-4 shrink-0">
                        <Button variant="ghost" size="sm" className="text-zinc-500 hover:text-white">
                            <Calendar className="size-5" />
                        </Button>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="mt-4">
                    {!currentProject?._id ? (
                        <div className="flex flex-col items-center justify-center p-12 sm:p-20 text-center border-2 border-dashed border-zinc-800 rounded-3xl">
                             <p className="text-zinc-500 font-medium tracking-wide">Please select a project to view transmissions.</p>
                        </div>
                    ) : isLoading ? (
                        <div className="flex items-center justify-center p-20">
                            <Loader2 className="size-8 text-blue-500 animate-spin" />
                        </div>
                    ) : (
                        <>
                            {activeTab === "upcoming" && (
                                <UpcomingMeetings 
                                    meetings={upcomingMeetings} 
                                    onJoinCall={handleJoinCall} 
                                    onReschedule={(m) => {
                                        setMeetingToReschedule(m);
                                        setIsRescheduleModalOpen(true);
                                    }}
                                    currentUserId={user?.id || ""}
                                    isProjectManager={isProjectManager}
                                />
                            )}
                            {activeTab === "schedule" && <ScheduleMeeting />}
                            {activeTab === "recent" && <RecentMeetings meetings={recentMeetings} />}
                        </>
                    )}
                </div>
                </div>
            </div>

            {/* Video Call Overlay */}
            {activeMeeting && (
                <VideoCall 
                    meetingId={activeMeeting.id}
                    roomId={activeMeeting.id}
                    roomName={activeMeeting.title}
                    userName={user ? `${user.firstName} ${user.lastName}` : "Team Member"}
                    userEmail={user?.email || "team@projexa.com"}
                    onClose={() => setActiveMeeting(null)}
                />
            )}

            {/* Reschedule Modal */}
            {isRescheduleModalOpen && meetingToReschedule && (
                <RescheduleMeetingModal 
                    open={isRescheduleModalOpen}
                    onClose={() => {
                        setIsRescheduleModalOpen(false);
                        setMeetingToReschedule(null);
                    }}
                    meeting={meetingToReschedule}
                />
            )}

            <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #27272a;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #3f3f46;
                }
            `}</style>
        </DashboardLayout>
    );
};

export default MeetingsPage;
