import { Calendar, Clock } from "lucide-react";
import type { Meeting } from "./types";


interface RecentMeetingsProps {
    meetings: Meeting[];
}

const RecentMeetings = ({ meetings }: RecentMeetingsProps) => {
    return (
        <div className="space-y-4 max-w-5xl">
            {meetings.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-20 text-center border-2 border-dashed border-zinc-800 rounded-3xl">
                    <p className="text-zinc-500 font-medium tracking-wide">No recent transmissions found for this sector.</p>
                </div>
            ) : (
                meetings.map((meeting) => (
                    <div key={meeting.id} className="group bg-zinc-900/40 border border-zinc-800/50 hover:border-zinc-700/50 rounded-3xl p-6 transition-all duration-300 hover:bg-zinc-900/60 shadow-xl backdrop-blur-sm">
                    <div className="flex flex-col gap-5">
                        <div className="flex items-center gap-4">
                            <h3 className="text-xl font-bold text-white group-hover:text-zinc-300 transition-colors">{meeting.title}</h3>
                            <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${meeting.tagColor}`}>
                                {meeting.tag}
                            </span>
                        </div>
                        
                        <div className="flex items-center gap-6 text-zinc-500 text-xs font-medium">
                            <div className="flex items-center gap-2">
                                <Calendar className="size-4 text-zinc-600" />
                                <span>{meeting.date}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="size-4 text-zinc-600" />
                                <span>{meeting.time} <span className="text-zinc-800 mx-1">•</span> {meeting.duration}</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-3">
                                <span className="text-[11px] text-zinc-500 font-bold uppercase tracking-widest">Host:</span>
                                <div className="flex items-center gap-2 bg-zinc-800/30 px-3 py-1.5 rounded-xl border border-white/5">
                                    <img src={meeting.host.avatar} alt={meeting.host.name} className="size-6 rounded-full ring-2 ring-zinc-900" />
                                    <span className="text-[11px] text-zinc-300 font-bold">{meeting.host.name}</span>
                                </div>
                            </div>

                            <div className="h-4 w-px bg-zinc-800/50 mx-2" />

                            <div className="flex items-center gap-3">
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
                                        <div className="size-7 rounded-full bg-zinc-800/50 border-2 border-zinc-900 flex items-center justify-center text-[10px] text-zinc-500 font-bold">
                                            +{meeting.attendees.length - 5}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                ))
            )}
        </div>
    );
};

export default RecentMeetings;
