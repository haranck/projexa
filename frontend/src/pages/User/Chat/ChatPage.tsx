import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import DashboardLayout from "@/components/Layout/DashboardLayout";
import { Search, Plus, Phone, Video, MoreHorizontal, Paperclip, Smile, Send, Circle, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGetAllProjects } from "@/hooks/Project/ProjectHooks";
import { useChatRoom, useMessages } from "@/hooks/Chat/ChatHooks";
import { useChatSocket } from "@/hooks/useChatSocket";
import type { Project, GetAllProjectsResponse } from "@/types/project";
import type { Message } from "@/types/chat";

interface ApiResponse<T> {
    data: T;
    message: string;
}

export const ChatPage = () => {
    const currentWorkspace = useSelector((state: RootState) => state.workspace.currentWorkspace);
    const user = useSelector((state: RootState) => state.auth.user);
    const scrollRef = useRef<HTMLDivElement>(null);

    const { data: projectsData, isLoading: projectsLoading } = useGetAllProjects({
        workspaceId: currentWorkspace?._id || currentWorkspace?.id || "",
        limit: 100
    });

    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [message, setMessage] = useState("");

    const projects = (projectsData as ApiResponse<GetAllProjectsResponse>)?.data?.projects || [];

    const { data: roomData, isLoading: roomLoading } = useChatRoom(selectedProject?._id || "");
    const roomId = roomData?.data?._id || (roomData as unknown as { _id?: string })?._id;

    const { data: messagesData, isLoading: messagesLoading } = useMessages(roomId || "");
    const messages = messagesData?.data || [];

    const { sendMessage } = useChatSocket(roomId, user?.id);

    useEffect(() => {
        if (projects.length > 0 && !selectedProject) {
            setSelectedProject(projects[0]);
        }
    }, [projects, selectedProject]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSendMessage = () => {
        if (!message.trim() || !user?.id || !roomId) {
            return;
        }
        sendMessage(message.trim(), user.id);
        setMessage("");
    };

    if (!currentWorkspace) {
        return (
            <DashboardLayout>
                <div className="flex h-[calc(100vh-80px)] items-center justify-center bg-[#0b0e14] text-zinc-500">
                    <div className="text-center">
                        <Circle className="size-12 text-zinc-800 animate-pulse mx-auto mb-4" />
                        <p className="text-lg font-medium text-zinc-400">No workspace selected</p>
                        <p className="text-sm text-zinc-600 mt-2">Please select a workspace from the sidebar to view chats.</p>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    const getProjectAvatar = (name: string) => {
        const colors = ["2563eb", "9333ea", "f97316", "0891b2", "db2777"];
        const color = colors[name ? name.length % colors.length : 0];
        return `https://ui-avatars.com/api/?name=${encodeURIComponent(name || "Project")}&background=${color}&color=fff&bold=true`;
    };

    return (
        <DashboardLayout>
            <div className="flex h-[calc(100vh-80px)] overflow-hidden bg-[#0b0e14]">
                {/* Project Chats Sidebar */}
                <div className="w-80 flex flex-col border-r border-zinc-800/50">
                    <div className="p-6 flex items-center justify-between">
                        <h2 className="text-xl font-bold text-white">Project Chats</h2>
                        <Button variant="ghost" size="icon-sm" className="text-zinc-400 hover:text-white">
                            <Plus className="size-5" />
                        </Button>
                    </div>

                    <div className="px-6 mb-6">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-500" />
                            <input
                                placeholder="Search chats..."
                                className="w-full pl-10 pr-4 py-2 bg-zinc-900/50 border border-zinc-800 focus:ring-1 focus:ring-blue-600/20 focus:border-blue-600/50 rounded-lg text-sm transition-all outline-none text-zinc-200 placeholder:text-zinc-600"
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto px-2 space-y-1.5 custom-scrollbar">
                        {projectsLoading ? (
                            <div className="flex flex-col items-center justify-center p-12 space-y-4">
                                <div className="size-10 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin" />
                                <p className="text-xs text-zinc-500 font-medium tracking-wide animate-pulse">Fetching projects...</p>
                            </div>
                        ) : projects.length === 0 ? (
                            <div className="flex flex-col items-center justify-center p-12 text-center space-y-3">
                                <div className="size-12 rounded-2xl bg-zinc-900/50 flex items-center justify-center border border-zinc-800">
                                    <MessageSquare className="size-6 text-zinc-700" />
                                </div>
                                <div>
                                    <p className="text-sm text-zinc-400 font-medium">No active chats</p>
                                    <p className="text-[10px] text-zinc-600 mt-1 uppercase tracking-widest">Workspace is silent</p>
                                </div>
                            </div>
                        ) : (
                            projects.map((project: Project) => {
                                const projectId = project._id;
                                const isSelected = selectedProject?._id === projectId;

                                return (
                                    <button
                                        key={projectId}
                                        onClick={() => setSelectedProject(project)}
                                        className={`w-full flex items-center gap-4 px-4 py-4 rounded-xl transition-all duration-300 group relative ${isSelected
                                            ? "bg-blue-600/10 text-white border border-blue-600/20 shadow-lg shadow-blue-600/5"
                                            : "text-zinc-400 hover:bg-zinc-800/40 hover:text-zinc-200 border border-transparent"
                                            }`}
                                    >
                                        <div className={`size-12 rounded-full overflow-hidden shrink-0 border-2 transition-transform duration-300 group-hover:scale-105 ${isSelected ? "border-blue-600 shadow-blue-600/20" : "border-zinc-800"
                                            } shadow-xl bg-zinc-900 flex items-center justify-center`}>
                                            <img
                                                src={getProjectAvatar(project.projectName)}
                                                alt={project.projectName}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(project.projectName)}&background=18181b&color=71717a`;
                                                }}
                                            />
                                        </div>
                                        <div className="flex-1 text-left min-w-0">
                                            <div className="flex justify-between items-center mb-1">
                                                <span className={`font-bold text-[15px] truncate ${isSelected ? "text-white" : "text-zinc-300 group-hover:text-white"}`}>
                                                    {project.projectName}
                                                </span>
                                                <span className="text-[10px] text-zinc-600">12:45</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <p className="text-xs text-zinc-500 truncate group-hover:text-zinc-400 max-w-[140px]">
                                                    {isSelected ? "Active in chat" : "Last message: Hey team!..."}
                                                </p>
                                                {!isSelected && (
                                                    <div className="size-2 rounded-full bg-blue-600 shadow-lg shadow-blue-600/50 mr-1 animate-pulse" />
                                                )}
                                            </div>
                                        </div>
                                        {isSelected && (
                                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-blue-500 rounded-r-full shadow-lg shadow-blue-500/50" />
                                        )}
                                    </button>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* Main Chat Area */}
                <div className="flex-1 flex flex-col bg-[#0b0e14]">
                    {selectedProject ? (
                        <>
                            {/* Chat Header */}
                            <div className="h-20 flex items-center justify-between px-8 border-b border-zinc-800/50 z-10 bg-[#0b0e14]/95 backdrop-blur-md">
                                <div className="flex items-center gap-4">
                                    <div className="size-11 rounded-full overflow-hidden border border-zinc-700 bg-zinc-800">
                                        <img src={getProjectAvatar(selectedProject.projectName)} alt={selectedProject.projectName} className="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <Circle className={`size-2 fill-green-500 text-green-500 ${roomLoading ? "opacity-20" : "animate-pulse"}`} />
                                            <h3 className="font-bold text-white text-lg">{selectedProject.projectName}</h3>
                                            {roomLoading && <div className="size-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin ml-1" />}
                                        </div>
                                        <p className="text-xs text-zinc-500">{(selectedProject as Project).members?.length || 0} members • Active now</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white hover:bg-zinc-800/50">
                                        <Phone className="size-5" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white hover:bg-zinc-800/50">
                                        <Video className="size-5" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white hover:bg-zinc-800/50">
                                        <MoreHorizontal className="size-5" />
                                    </Button>
                                </div>
                            </div>

                            {/* Messages Area with Special Background */}
                            <div
                                ref={scrollRef}
                                className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar relative chat-background"
                            >
                                {messagesLoading ? (
                                    <div className="flex flex-col h-full items-center justify-center space-y-4">
                                        <div className="size-10 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin" />
                                        <p className="text-sm text-zinc-500 font-medium">Loading history...</p>
                                    </div>
                                ) : messages.length === 0 ? (
                                    <div className="flex flex-col h-full items-center justify-center text-center space-y-4 p-8">
                                        <div className="size-16 rounded-3xl bg-zinc-900/50 flex items-center justify-center border border-zinc-800">
                                            <MessageSquare className="size-8 text-zinc-700" />
                                        </div>
                                        <div>
                                            <p className="text-lg font-bold text-zinc-400">Silence is golden</p>
                                            <p className="text-sm text-zinc-600 mt-1 max-w-[250px]">Be the first to say hello to your team in this project!</p>
                                        </div>
                                    </div>
                                ) : (
                                    messages.map((msg: Message) => {
                                        const isMe = msg.senderId === user?.id;
                                        const sender = (selectedProject as Project).members?.find(m => m.userId === msg.senderId);
                                        const senderName = isMe ? "You" : sender?.user?.userName || "Team Member";
                                        const senderAvatar = sender?.user?.profilePicture;

                                        return (
                                            <div key={msg._id} className={`flex items-end gap-3 ${isMe ? "flex-row-reverse" : "flex-row"}`}>
                                                {!isMe && (
                                                    <div className="size-10 rounded-full overflow-hidden border border-zinc-800 shrink-0 bg-zinc-900 flex items-center justify-center shadow-xl">
                                                        <img
                                                            src={senderAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(senderName)}&background=18181b&color=71717a`}
                                                            alt={senderName}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                )}
                                                <div className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                                                    {!isMe && (
                                                        <span className="text-[11px] font-bold text-blue-400 mb-1 ml-1 tracking-wide">
                                                            {senderName}
                                                        </span>
                                                    )}
                                                    <div className={`max-w-[450px] px-5 py-3 rounded-2xl text-[15px] leading-relaxed shadow-lg relative ${isMe
                                                        ? "bg-blue-600 text-white rounded-br-none"
                                                        : "bg-zinc-800 text-zinc-200 rounded-bl-none border border-white/5"
                                                        }`}>
                                                        {msg.content}
                                                        <div className={`flex items-center gap-1.5 mt-1.5 justify-end opacity-60`}>
                                                            <span className="text-[10px] font-medium font-mono lowercase">
                                                                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                            </span>
                                                            {isMe && <span className="text-[10px] italic font-mono">✓✓</span>}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>

                            {/* Input Area */}
                            <div className="p-6 bg-[#0b0e14]/95 backdrop-blur-md z-10 border-t border-zinc-800/50">
                                <div className="max-w-6xl mx-auto flex items-center gap-3">
                                    <div className="flex-1 bg-zinc-900/60 border border-zinc-800 rounded-2xl p-1.5 flex items-center gap-2 transition-all duration-300 focus-within:border-blue-600/50 focus-within:bg-zinc-900/80 focus-within:shadow-lg focus-within:shadow-blue-600/5">
                                        <Button variant="ghost" size="icon" className="text-zinc-500 hover:text-white rounded-xl">
                                            <Smile className="size-5" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="text-zinc-500 hover:text-white rounded-xl">
                                            <Paperclip className="size-5" />
                                        </Button>
                                        <input
                                            value={message}
                                            onChange={(e) => setMessage(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter" && !e.shiftKey) {
                                                    e.preventDefault();
                                                    handleSendMessage();
                                                }
                                            }}
                                            placeholder="Message..."
                                            className="flex-1 bg-transparent border-none focus:ring-0 text-white text-[15px] px-2 placeholder:text-zinc-600 h-10"
                                        />
                                    </div>
                                    <Button
                                        onClick={handleSendMessage}
                                        disabled={!message.trim() || !roomId}
                                        className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:bg-zinc-800 text-white size-12 rounded-2xl transition-all duration-200 shadow-xl shadow-blue-600/20 active:scale-95 shrink-0"
                                    >
                                        <Send className="size-5" />
                                    </Button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-zinc-500">
                            Select a project to start chatting
                        </div>
                    )}
                </div>
            </div>

            <style>{`
                .chat-background {
                    background-color: #0b0e14;
                    background-image: 
                        linear-gradient(rgba(11, 14, 20, 0.9), rgba(11, 14, 20, 0.9)),
                        url("https://w0.peakpx.com/wallpaper/508/606/wallpaper-whatsapp-dark-mode-doodle-background.jpg");
                    background-size: 400px;
                    background-repeat: repeat;
                }
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



