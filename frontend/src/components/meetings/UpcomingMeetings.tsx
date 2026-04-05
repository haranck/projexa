import { Calendar, Clock, Video, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Meeting } from "./types";

interface UpcomingMeetingsProps {
    meetings: Meeting[];
    onJoinCall: (meeting: Meeting) => void;
    onReschedule: (meeting: Meeting) => void;
    currentUserId: string;
    isProjectManager: boolean;
}

const UpcomingMeetings = ({ meetings, onJoinCall, onReschedule, currentUserId, isProjectManager }: UpcomingMeetingsProps) => {
    return (
        <div className="space-y-4 max-w-5xl">
            {meetings.map((meeting) => {
                const canEdit = meeting.hostId === currentUserId || isProjectManager;

                return (
                    <div key={meeting.id} className="group bg-zinc-900/40 border border-zinc-800/50 hover:border-blue-500/30 rounded-3xl p-6 transition-all duration-300 hover:bg-zinc-900/60 shadow-xl backdrop-blur-sm">
                        <div className="flex items-center justify-between">
                            <div className="flex flex-col gap-4 flex-1">
                                <div className="flex items-center gap-3">
                                    <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">{meeting.title}</h3>
                                    <span className={`px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${meeting.tagColor}`}>
                                        {meeting.tag}
                                    </span>
                                </div>
                                
                                <div className="flex items-center gap-6 text-zinc-500 text-xs font-medium">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="size-3.5" />
                                        <span>{meeting.date}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Clock className="size-3.5" />
                                        <span>{meeting.time} <span className="text-zinc-700 mx-1">•</span> {meeting.duration}</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 mt-2">
                                    <div className="flex items-center gap-2 bg-zinc-800/50 px-3 py-1.5 rounded-xl border border-white/5">
                                        <img src={meeting.host.avatar} alt={meeting.host.name} className="size-5 rounded-full ring-2 ring-zinc-900" />
                                        <span className="text-[11px] text-zinc-300 font-bold">Host: {meeting.host.name}</span>
                                    </div>
                                    <div className="flex items-center gap-3 ml-4">
                                        <span className="text-[11px] text-zinc-500 font-bold uppercase tracking-widest">Participants:</span>
                                        <div className="flex -space-x-2">
                                            {meeting.attendees.slice(0, 5).map((attendee, i) => (
                                                <img 
                                                    key={i} 
                                                    src={attendee.avatar} 
                                                    title={attendee.name}
                                                    className="size-7 rounded-full border-2 border-zinc-900 ring-1 ring-white/10 cursor-help" 
                                                    alt={attendee.name}
                                                />
                                            ))}
                                            {meeting.attendees.length > 5 && (
                                                <div className="size-7 rounded-full bg-zinc-800 border-2 border-zinc-900 flex items-center justify-center text-[10px] text-zinc-500 font-bold">
                                                    +{meeting.attendees.length - 5}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <Button 
                                    onClick={() => onJoinCall(meeting)}
                                    className="bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl px-6 h-11 flex items-center gap-2 shadow-lg shadow-blue-600/20 active:scale-95 transition-all text-sm uppercase tracking-widest"
                                >
                                    <Video className="size-4" />
                                    Join Call
                                </Button>
                                {canEdit && (
                                    <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        onClick={() => onReschedule(meeting)}
                                        className="text-zinc-600 hover:text-white hover:bg-zinc-800 rounded-xl size-11"
                                    >
                                        <Pencil className="size-5" />
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default UpcomingMeetings;
