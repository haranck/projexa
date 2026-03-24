import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import DashboardLayout from "@/components/Layout/DashboardLayout";
import { Search, Plus, MoreHorizontal, Paperclip, Smile, Send, Circle, MessageSquare, Trash2, CheckCheck } from "lucide-react";
import EmojiPicker, { Theme } from 'emoji-picker-react';
import { Button } from "@/components/ui/button";
import { useGetAllProjects } from "@/hooks/Project/ProjectHooks";
import { useChatRoom, useMessages } from "@/hooks/Chat/ChatHooks";
import { useChatSocket } from "@/hooks/useChatSocket";
import type { Project, GetAllProjectsResponse } from "@/types/project";
import type { Message } from "@/types/chat";
import { getChatUploadUrl } from "@/services/Chat/ChatService";
import axios from "axios";
import { FileIcon, Download } from "lucide-react";

interface ApiResponse<T> {
    data: T;
    message: string;
}

export const ChatPage = () => {
    const currentWorkspace = useSelector((state: RootState) => state.workspace.currentWorkspace);
    const user = useSelector((state: RootState) => state.auth.user);
    const scrollRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [expandedImage, setExpandedImage] = useState<string | null>(null);
    const [downloadedFiles, setDownloadedFiles] = useState<string[]>(() => {
        const saved = localStorage.getItem("downloaded_files");
        return saved ? JSON.parse(saved) : [];
    });

    const { data: projectsData, isLoading: projectsLoading } = useGetAllProjects({
        workspaceId: currentWorkspace?._id || currentWorkspace?.id || "",
        limit: 100
    });

    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [message, setMessage] = useState("");
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState<{ messageId: string } | null>(null);
    const [isTyping, setIsTyping] = useState(false);

    const projects = (projectsData as ApiResponse<GetAllProjectsResponse>)?.data?.projects || [];

    const { data: roomData, isLoading: roomLoading } = useChatRoom(selectedProject?._id || "");
    const roomId = roomData?.data?._id || (roomData as unknown as { _id?: string })?._id;

    const allProjectIds = projects.map(p => p._id);
    const { sendMessage, deleteMessage, markAsRead, startTyping, stopTyping, typingUsers, onlineUsers } = useChatSocket(roomId, user?.id, allProjectIds, selectedProject?._id);

    useEffect(() => {
        return () => {
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }
        };
    }, []);

    const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMessage(e.target.value);

        if (!isTyping) {
            setIsTyping(true);
            startTyping(selectedProject?._id);
        }

        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        typingTimeoutRef.current = setTimeout(() => {
            setIsTyping(false);
            stopTyping(selectedProject?._id);
        }, 3000);
    };

    const handleBlur = () => {
        if (isTyping) {
            setIsTyping(false);
            stopTyping(selectedProject?._id);
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }
        }
    };

    const { data: messagesData, isLoading: messagesLoading } = useMessages(roomId || "");
    const messages = messagesData?.data || [];

    const sortedProjects = [...projects].sort((a, b) => {
        const timeA = a.lastMessage?.createdAt ? new Date(a.lastMessage.createdAt).getTime() : 0;
        const timeB = b.lastMessage?.createdAt ? new Date(b.lastMessage.createdAt).getTime() : 0;
        return timeB - timeA;
    });

    useEffect(() => {
        if (messages.length > 0 && user?.id && roomId) {
            messages.forEach((msg: Message) => {
                if (!msg.readBy?.includes(user.id) && !msg.isDeleted) {
                    markAsRead(msg._id);
                }
            });
        }
    }, [messages, user?.id, roomId, markAsRead]);

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
        setShowEmojiPicker(false);
    };

    const handleEmojiClick = (emojiData: { emoji: string }) => {
        setMessage(prev => prev + emojiData.emoji);
    };

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !roomId || !user?.id) return;

        try {
            setIsUploading(true);
            const response = await getChatUploadUrl(roomId, file.type);
            const { uploadUrl, fileUrl } = response.data;

            await axios.put(uploadUrl, file, {
                headers: {
                    "Content-Type": file.type,
                },
            });

            let messageType: Message['messageType'] = 'document';
            if (file.type.startsWith('image/')) messageType = 'image';
            else if (file.type.startsWith('video/')) messageType = 'video';

            sendMessage(fileUrl, user.id, messageType);
        } catch (error) {
            console.error("File upload failed:", error);
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    const handleDownload = (url: string, filename: string) => {
        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        setDownloadedFiles(prev => {
            if (prev.includes(url)) return prev;
            const updated = [...prev, url];
            localStorage.setItem("downloaded_files", JSON.stringify(updated));
            return updated;
        });
    };

    const handleDeleteMessage = (messageId: string) => {
        deleteMessage(messageId);
        setDeleteConfirm(null);
    };

    const getOnlineStatusString = () => {
        if (!selectedProject || !onlineUsers) return "";

        const onlineMemberNames = selectedProject.members
            ?.filter(m => m.userId !== user?.id && onlineUsers.has(m.userId))
            .map(m => m.user?.userName || "Team Member") || [];

        if (onlineMemberNames.length === 0) {
            return "all are offline";
        }

        if (onlineMemberNames.length <= 4) {
            const names = onlineMemberNames.join(", ");
            return `${names} is online`;
        }

        const firstFour = onlineMemberNames.slice(0, 4).join(", ");
        const restCount = onlineMemberNames.length - 4;
        return `${firstFour} and ${restCount} others is online`;
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
                            sortedProjects.map((project: Project) => {
                                const projectId = project._id;
                                const isSelected = selectedProject?._id === projectId;
                                const lastMsg = project.lastMessage;
                                const lastMsgTime = lastMsg?.createdAt ? new Date(lastMsg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "";

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
                                                <span className="text-[10px] text-zinc-600">{lastMsgTime}</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <p className="text-xs text-zinc-500 truncate group-hover:text-zinc-400 max-w-[140px]">
                                                    {isSelected ? "Active in chat" : (lastMsg?.content || "No messages yet")}
                                                </p>
                                                <div className="flex items-center gap-1">
                                                    {typingUsers[projectId] && typingUsers[projectId].length > 0 && (
                                                        <span className="text-[10px] text-blue-500 animate-pulse font-bold bg-blue-500/10 px-1.5 py-0.5 rounded-full truncate max-w-[80px]">
                                                            {project.members?.find(m => m.userId === typingUsers[projectId][0])?.user?.userName || "Someone"} typing...
                                                        </span>
                                                    )}
                                                    {!isSelected && lastMsg && (
                                                        <div className="size-2 rounded-full bg-blue-600 shadow-lg shadow-blue-600/50 mr-1 animate-pulse" />
                                                    )}
                                                </div>
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
                                        <div className="flex items-center gap-2">
                                            {selectedProject?._id && typingUsers[selectedProject._id]?.length > 0 ? (
                                                <p className="text-xs text-blue-400 animate-pulse font-medium">
                                                    {(selectedProject as Project).members?.find(m => String(m.userId) === String(typingUsers[selectedProject._id][0]))?.user?.userName || "Someone"} is typing...
                                                </p>
                                            ) : (
                                                <div className="flex items-center gap-1.5">
                                                    <div className={`size-1.5 rounded-full ${onlineUsers.size > 1 || (onlineUsers.size === 1 && onlineUsers.has(String(user?.id || ""))) ? "bg-green-500 animate-pulse" : "bg-zinc-600"}`} />
                                                    <p className="text-xs text-zinc-500 transition-all duration-300 hover:text-zinc-400 cursor-default">
                                                        {getOnlineStatusString()}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    {/* <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white hover:bg-zinc-800/50">
                                        <Phone className="size-5" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white hover:bg-zinc-800/50">
                                        <Video className="size-5" />
                                    </Button> */}
                                    <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white hover:bg-zinc-800/50">
                                        <MoreHorizontal className="size-5" />
                                    </Button>
                                </div>
                            </div>

                            {/* Messages Area with Special Background */}
                            <div
                                ref={scrollRef}
                                className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar relative chat-container"
                            >
                                <div className="chat-mesh-overlay" />
                                {messagesLoading ? (
                                    <div className="flex flex-col h-full items-center justify-center space-y-4">
                                        <div className="size-10 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin" />
                                        <p className="text-sm text-zinc-500 font-medium tracking-widest uppercase">Syncing protocol...</p>
                                    </div>
                                ) : messages.length === 0 ? (
                                    <div className="flex flex-col h-full items-center justify-center text-center space-y-6 p-8 relative z-10">
                                        <div className="size-20 rounded-[2.5rem] bg-linear-to-br from-blue-600/20 to-purple-600/20 flex items-center justify-center border border-white/10 shadow-2xl backdrop-blur-xl animate-bounce-subtle">
                                            <MessageSquare className="size-10 text-blue-500" />
                                        </div>
                                        <div className="space-y-2">
                                            <p className="text-2xl font-black text-white tracking-tight">Transmission Silence</p>
                                            <p className="text-zinc-500 text-sm max-w-[280px] mx-auto leading-relaxed">The project frequency is currently quiet. Initiate the first communication pulse.</p>
                                        </div>
                                    </div>
                                ) : (
                                    messages.map((msg: Message) => {
                                        const isMe = msg.senderId === user?.id;
                                        const sender = (selectedProject as Project).members?.find(m => m.userId === msg.senderId);
                                        const senderName = isMe ? "You" : sender?.user?.userName || "Team Member";
                                        const senderAvatar = sender?.user?.profilePicture;

                                        return (
                                            <div
                                                key={msg._id}
                                                className={`flex items-end gap-4 relative z-10 ${isMe ? "flex-row-reverse" : "flex-row"} group`}
                                            >
                                                {!isMe && (
                                                    <div className="size-10 rounded-2xl overflow-hidden border border-white/10 shrink-0 bg-zinc-900/50 flex items-center justify-center shadow-2xl backdrop-blur-md transition-transform hover:scale-110">
                                                        <img
                                                            src={senderAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(senderName)}&background=18181b&color=71717a`}
                                                            alt={senderName}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                )}
                                                <div className={`flex flex-col gap-1.5 ${isMe ? "items-end" : "items-start"}`}>
                                                    {!isMe && (
                                                        <span className="text-[10px] font-black text-blue-500 ml-1 tracking-widest uppercase opacity-80">
                                                            {senderName}
                                                        </span>
                                                    )}
                                                    <div className={`flex items-center gap-2 ${isMe ? "flex-row-reverse" : "flex-row"}`}>
                                                        {isMe && !msg.isDeleted && (
                                                            <div className="opacity-0 group-hover:opacity-100 transition-all duration-200">
                                                                <button
                                                                    onClick={() => setDeleteConfirm({ messageId: msg._id })}
                                                                    className="p-2 rounded-full text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-all border border-white/5 bg-zinc-900/50 backdrop-blur-sm shadow-xl"
                                                                    title="Delete message"
                                                                >
                                                                    <Trash2 className="size-4" />
                                                                </button>
                                                            </div>
                                                        )}
                                                        {/* Message bubble */}
                                                        {msg.isDeleted ? (
                                                            <div className={`max-w-[500px] px-5 py-3 rounded-[2rem] text-[13px] leading-relaxed shadow border border-dashed ${isMe
                                                                ? "bg-zinc-800/40 border-zinc-700/50 rounded-tr-none"
                                                                : "bg-zinc-900/40 border-zinc-700/30 rounded-tl-none"
                                                                }`}>
                                                                <span className="text-zinc-500 italic">This message was deleted</span>
                                                                <div className="flex items-center gap-2 mt-1 justify-end opacity-40">
                                                                    <span className="text-[9px] font-mono tracking-tighter text-zinc-600">
                                                                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <div className={`max-w-[500px] px-6 py-4 rounded-[2rem] text-[15px] leading-relaxed shadow-2xl backdrop-blur-xl border transition-all hover:bg-opacity-90 ${isMe
                                                                ? "bg-linear-to-br from-blue-600 to-blue-700 text-white rounded-tr-none border-blue-400/20"
                                                                : "bg-zinc-900/80 text-zinc-100 rounded-tl-none border-white/5"
                                                                }`}>
                                                                {msg.messageType === 'text' && msg.content}
                                                                {msg.messageType === 'image' && (
                                                                    <div className="rounded-2xl overflow-hidden border border-white/5 mb-1 group/img relative shadow-2xl">
                                                                        <img
                                                                            src={msg.content}
                                                                            alt="Attachment"
                                                                            className="max-w-[240px] max-h-[320px] object-cover cursor-zoom-in transition-transform duration-500 group-hover/img:scale-105"
                                                                            onClick={() => setExpandedImage(msg.content)}
                                                                        />
                                                                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                                                                            <Search className="size-6 text-white/70" />
                                                                        </div>
                                                                    </div>
                                                                )}
                                                                {msg.messageType === 'video' && (
                                                                    <video src={msg.content} controls className="max-w-[300px] rounded-2xl mb-1 shadow-2xl border border-white/5" />
                                                                )}
                                                                {msg.messageType === 'document' && (
                                                                    <div
                                                                        className="flex items-center gap-4 p-4 bg-zinc-800/50 hover:bg-zinc-800/80 rounded-2xl mb-1 cursor-pointer transition-all border border-white/5 group/file"
                                                                        onClick={() => {
                                                                            if (downloadedFiles.includes(msg.content)) {
                                                                                window.open(msg.content, '_blank');
                                                                            } else {
                                                                                handleDownload(msg.content, msg.content.split('/').pop() || 'file');
                                                                            }
                                                                        }}
                                                                    >
                                                                        <div className="size-12 rounded-xl bg-blue-600/20 flex items-center justify-center border border-blue-600/20 group-hover/file:bg-blue-600/30 transition-colors">
                                                                            <FileIcon className="size-6 text-blue-400" />
                                                                        </div>
                                                                        <div className="flex-1 min-w-0">
                                                                            <p className="text-sm font-bold text-zinc-100 truncate">{msg.content.split('/').pop()}</p>
                                                                            <p className="text-[10px] text-zinc-500 font-mono mt-0.5 uppercase tracking-tighter">
                                                                                {downloadedFiles.includes(msg.content) ? "Click to open transmission" : "Click to download transmission"}
                                                                            </p>
                                                                        </div>
                                                                        {!downloadedFiles.includes(msg.content) && (
                                                                            <div className="opacity-0 group-hover/file:opacity-100 transition-opacity">
                                                                                <Download className="size-4 text-zinc-400" />
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                )}
                                                                <div className={`flex items-center gap-2 mt-2 justify-end opacity-50`}>
                                                                    <span className="text-[9px] font-bold font-mono tracking-tighter">
                                                                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                                    </span>
                                                                    {isMe && (
                                                                        <div className="flex -space-x-1">
                                                                            <CheckCheck
                                                                                className={`size-3.5 ${(msg.readBy?.length || 0) >= (roomData?.data?.members?.length || selectedProject.members?.length || 0)
                                                                                    ? "text-blue-900"
                                                                                    : "text-zinc-900"
                                                                                    }`}
                                                                            />
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>

                            {/* Input Area */}
                            <div className="p-6 bg-[#0b0e14]/95 backdrop-blur-md z-10 border-t border-zinc-800/50 relative">
                                {selectedProject?._id && typingUsers[selectedProject._id]?.length > 0 && (
                                    <div className="absolute -top-7 left-10 px-3 py-1 flex items-center gap-2 transition-all duration-300 animate-in fade-in slide-in-from-bottom-1">
                                        <div className="flex gap-1">
                                            <span className="size-1 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                                            <span className="size-1 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                            <span className="size-1 bg-blue-500 rounded-full animate-bounce" />
                                        </div>
                                        <p className="text-[11px] text-blue-400 font-medium">
                                            {(selectedProject as Project).members?.find(m => m.userId === typingUsers[selectedProject._id][0])?.user?.userName || "Someone"} is typing
                                        </p>
                                    </div>
                                )}
                                {showEmojiPicker && (
                                    <div className="absolute bottom-full mb-4 left-6 z-50">
                                        <div className="relative">
                                            <div
                                                className="fixed inset-0"
                                                onClick={() => setShowEmojiPicker(false)}
                                            />
                                            <div className="relative z-10 shadow-2xl border border-zinc-800 rounded-2xl overflow-hidden">
                                                <EmojiPicker
                                                    onEmojiClick={handleEmojiClick}
                                                    theme={Theme.DARK}
                                                    width={350}
                                                    height={400}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <div className="max-w-6xl mx-auto flex items-center gap-3">
                                    <div className="flex-1 bg-zinc-900/60 border border-zinc-800 rounded-2xl p-1.5 flex items-center gap-2 transition-all duration-300 focus-within:border-blue-600/50 focus-within:bg-zinc-900/80 focus-within:shadow-lg focus-within:shadow-blue-600/5">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className={`text-zinc-500 hover:text-white rounded-xl ${showEmojiPicker ? "text-blue-500 bg-blue-500/10" : ""}`}
                                            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                        >
                                            <Smile className="size-5" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-zinc-500 hover:text-white rounded-xl"
                                            onClick={() => fileInputRef.current?.click()}
                                            disabled={isUploading}
                                        >
                                            {isUploading ? (
                                                <div className="size-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                                            ) : (
                                                <Paperclip className="size-5" />
                                            )}
                                        </Button>
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            onChange={handleFileSelect}
                                            placeholder="."
                                            className="hidden"
                                        />
                                        <input
                                            value={message}
                                            onChange={handleMessageChange}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter" && !e.shiftKey) {
                                                    e.preventDefault();
                                                    handleSendMessage();
                                                    setIsTyping(false);
                                                    stopTyping(selectedProject?._id);
                                                    if (typingTimeoutRef.current) {
                                                        clearTimeout(typingTimeoutRef.current);
                                                    }
                                                }
                                            }}
                                            onBlur={handleBlur}
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

            {/* Delete Confirmation Modal */}
            {deleteConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
                    <div className="bg-zinc-900 border border-zinc-700/60 rounded-2xl shadow-2xl p-6 w-80 flex flex-col gap-5">
                        <div className="flex flex-col gap-1.5">
                            <div className="flex items-center gap-3">
                                <div className="size-9 rounded-xl bg-red-500/10 flex items-center justify-center border border-red-500/20">
                                    <Trash2 className="size-4 text-red-400" />
                                </div>
                                <h3 className="text-white font-bold text-base">Delete Message?</h3>
                            </div>
                            <p className="text-zinc-500 text-sm mt-1 pl-12">Everyone in the chat will see this message was deleted.</p>
                        </div>
                        <div className="flex flex-col gap-2">
                            <button
                                onClick={() => handleDeleteMessage(deleteConfirm.messageId)}
                                className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-sm font-semibold transition-all active:scale-95 flex items-center justify-center gap-2"
                            >
                                <Trash2 className="size-4" />
                                Delete for Everyone
                            </button>
                            <button
                                onClick={() => setDeleteConfirm(null)}
                                className="w-full py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm font-medium transition-all active:scale-95"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Image Expansion Modal */}
            {expandedImage && (
                <div
                    className="fixed inset-0 z-100 flex items-center justify-center bg-black/95 backdrop-blur-xl transition-all duration-300 animate-in fade-in"
                    onClick={() => setExpandedImage(null)}
                >
                    <button
                        className="absolute top-8 right-8 text-zinc-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full"
                        onClick={() => setExpandedImage(null)}
                    >
                        <Plus className="size-8 rotate-45" />
                    </button>
                    <img
                        src={expandedImage}
                        alt="Expanded attachment"
                        className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg shadow-2xl animate-in zoom-in-95 duration-300"
                        onClick={(e) => e.stopPropagation()}
                    />
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-4">
                        <Button
                            variant="secondary"
                            className="bg-white/10 hover:bg-white/20 text-white border-white/10 backdrop-blur-md rounded-xl"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleDownload(expandedImage, expandedImage.split('/').pop() || 'image');
                            }}
                        >
                            <Download className="size-4 mr-2" />
                            Download
                        </Button>
                    </div>
                </div>
            )}

            <style>{`
                .chat-container {
                    background: radial-gradient(circle at 50% 50%, #1a1c2e 0%, #0b0e14 100%);
                    position: relative;
                    isolation: isolate;
                }
                .chat-mesh-overlay {
                    position: absolute;
                    inset: 0;
                    background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%234169e1' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
                    opacity: 0.5;
                    pointer-events: none;
                    z-index: 0;
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
                @keyframes bounce-subtle {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }
                .animate-bounce-subtle {
                    animation: bounce-subtle 3s ease-in-out infinite;
                }
            `}</style>
        </DashboardLayout>
    );
};