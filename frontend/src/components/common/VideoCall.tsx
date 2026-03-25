import { JaaSMeeting } from '@jitsi/react-sdk';
import { X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useEffect } from 'react';
import { useJoinMeeting, useLeaveMeeting } from '@/hooks/Meeting/MeetingHooks';

interface VideoCallProps {
    meetingId: string;
    roomId: string;
    roomName: string;
    userName: string;
    userEmail: string;
    onClose: () => void;
}

const VideoCall = ({ meetingId, roomId, roomName, userName, userEmail, onClose }: VideoCallProps) => {
    const { mutate: joinMeeting } = useJoinMeeting();
    const { mutate: leaveMeeting } = useLeaveMeeting();

    useEffect(() => {
        joinMeeting(meetingId);
    }, [meetingId, joinMeeting]);

    const handleClose = () => {
        leaveMeeting(meetingId);
        onClose();
    };
    const JAAS_APP_ID = "vpaas-magic-cookie-ef558a1b4a5d43e6bcf8bb62ffff89b4";

    return (
        <div className="fixed inset-0 z-50 bg-[#0b0e14] flex flex-col animate-in fade-in duration-300">
            {/* Call Header */}
            <div className="h-16 border-b border-zinc-800 flex items-center justify-between px-8 bg-[#0b0e14]/95 backdrop-blur-md">
                <div className="flex items-center gap-3">
                    <div className="size-2 rounded-full bg-red-500 animate-pulse" />
                    <h2 className="text-white font-bold tracking-tight">
                        {roomName} — <span className="text-zinc-500 font-medium">Production Session</span>
                    </h2>
                </div>
                <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleClose}
                    className="text-zinc-400 hover:text-white hover:bg-red-500/10 border border-zinc-800 hover:border-red-500/50 transition-all gap-2"
                >
                    <X className="size-4" />
                    Leave Meeting
                </Button>
            </div>

            <div className="flex-1 relative bg-[#0b0e14] flex flex-col items-center justify-center p-4 md:p-8">
                <div className="w-full max-w-6xl h-full bg-black rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/5 ring-1 ring-white/10">
                    <JaaSMeeting
                        appId={JAAS_APP_ID}
                        roomName={`Projexa_${roomId}`}
                        configOverwrite={{
                            prejoinPageEnabled: false,
                            disableDeepLinking: true,
                            startWithAudioMuted: true,
                            toolbarButtons: [
                                'microphone', 'camera', 'closedcaptions', 'desktop', 'fullscreen',
                                'fodeviceselection', 'hangup', 'profile', 'chat', 'settings', 'raisehand',
                                'videoquality', 'filmstrip', 'tileview', 'videobackgroundblur'
                            ],
                        }}
                        interfaceConfigOverwrite={{
                            SHOW_JITSI_WATERMARK: false,
                            HIDE_DEEP_LINKING_LOGO: true,
                        }}
                        userInfo={{
                            displayName: userName,
                            email: userEmail
                        }}
                        onReadyToClose={handleClose}
                        getIFrameRef={(iframeRef) => {
                            iframeRef.style.height = '100%';
                            iframeRef.style.width = '100%';
                            iframeRef.style.border = 'none';
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default VideoCall;
