import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import DashboardLayout from "@/components/Layout/DashboardLayout";
import { Search, Plus, MoreHorizontal, Paperclip, Smile, Send, Circle, MessageSquare, Trash2, CheckCheck, ChevronLeft, FileIcon } from "lucide-react";
import EmojiPicker, { Theme } from 'emoji-picker-react';
import { Button } from "@/components/ui/button";
import { useGetAllProjects } from "@/hooks/Project/ProjectHooks";
import { useChatRoom, useMessages } from "@/hooks/Chat/ChatHooks";
import { useChatSocket } from "@/hooks/useChatSocket";
import type { Project, GetAllProjectsResponse } from "@/types/project";
import type { Message } from "@/types/chat";
import { getChatUploadUrl } from "@/services/Chat/ChatService";
import axios from "axios";

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
    
    // Performance: track if mobile
    const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
    const [showChatList, setShowChatList] = useState(true);

    const [isUploading, setIsUploading] = useState(false);
    const [expandedImage, setExpandedImage] = useState<string | null>(null);
    const [downloadedFiles, setDownloadedFiles] = useState<string[]>(() => {
        const saved = localStorage.getItem("downloaded_files");
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 1024);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

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
        if (projects.length > 0 && !selectedProject && !isMobile) {
            setSelectedProject(projects[0]);
        }
    }, [projects, selectedProject, isMobile]);

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
            return "all offline";
        }

        if (onlineMemberNames.length <= 2) {
            const names = onlineMemberNames.join(", ");
            return `${names} online`;
        }

        return `${onlineMemberNames.length} members online`;
    };

    const handleProjectSelect = (project: Project) => {
        setSelectedProject(project);
        if (isMobile) {
            setShowChatList(false);
        }
    };

    if (!currentWorkspace) {
        return (
            <DashboardLayout>
                <div className="flex h-[calc(100vh-80px)] items-center justify-center bg-[#0b0e14] text-zinc-500">
                    <div className="text-center p-8">
                        <Circle className="size-12 text-zinc-800 animate-pulse mx-auto mb-4" />
                        <p className="text-lg font-medium text-zinc-400">No workspace selected</p>
                        <p className="text-xs text-zinc-600 mt-2 max-w-xs mx-auto">Please select a workspace from the sidebar to view chats.</p>
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
            <div className="flex h-[calc(100vh-64px)] lg:h-[calc(100vh-72px)] overflow-hidden bg-[#0b0e14] relative">
                
                {/* Project Chats Sidebar */}
                <div className={`
                    ${isMobile ? (showChatList ? 'flex w-full' : 'hidden') : 'flex w-80'}
                    flex-col border-r border-zinc-800/50 bg-[#0b0e14] z-10
                `}>
                    <div className="p-4 lg:p-6 flex items-center justify-between">
                        <h2 className="text-lg lg:text-xl font-bold text-white tracking-tight">Project Chats</h2>
                        <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white rounded-xl hover:bg-white/5">
                            <Plus className="size-5" />
                        </Button>
                    </div>

                    <div className="px-4 lg:px-6 mb-4 lg:mb-6">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-500" />
                            <input
                                placeholder="Search conversations..."
                                className="w-full pl-10 pr-4 py-2 bg-zinc-900/50 border border-zinc-800 focus:ring-1 focus:ring-blue-600/20 focus:border-blue-600/50 rounded-xl text-sm transition-all outline-none text-zinc-200 placeholder:text-zinc-600"
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto px-2 pb-4 space-y-1 custom-scrollbar">
                        {projectsLoading ? (
                            <div className="flex flex-col items-center justify-center p-12 space-y-4">
                                <div className="size-8 border-3 border-blue-600/20 border-t-blue-600 rounded-full animate-spin" />
                                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.2em]">Syncing...</p>
                            </div>
                        ) : projects.length === 0 ? (
                            <div className="flex flex-col items-center justify-center p-12 text-center space-y-3">
                                <div className="size-12 rounded-2xl bg-zinc-900/50 flex items-center justify-center border border-zinc-800">
                                    <MessageSquare className="size-5 text-zinc-700" />
                                </div>
                                <div>
                                    <p className="text-sm text-zinc-500 font-bold">No active chats</p>
                                    <p className="text-[10px] text-zinc-600 mt-1">Start a project to chat</p>
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
                                        onClick={() => handleProjectSelect(project)}
                                        className={`w-full flex items-center gap-3 lg:gap-4 px-3 py-3 lg:px-4 lg:py-4 rounded-2xl transition-all duration-300 group relative ${isSelected
                                            ? "bg-blue-600/10 text-white border border-blue-600/20 shadow-lg shadow-blue-600/5"
                                            : "text-zinc-400 hover:bg-zinc-800/40 hover:text-zinc-200 border border-transparent"
                                            }`}
                                    >
                                        <div className={`size-11 lg:size-12 rounded-full overflow-hidden shrink-0 border-2 transition-all duration-300 ${isSelected ? "border-blue-600" : "border-zinc-800 group-hover:border-zinc-700"
                                            } bg-zinc-900 flex items-center justify-center`}>
                                            <img
                                                src={getProjectAvatar(project.projectName)}
                                                alt={project.projectName}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="flex-1 text-left min-w-0">
                                            <div className="flex justify-between items-center mb-0.5">
                                                <span className={`font-bold text-sm lg:text-[15px] truncate ${isSelected ? "text-white" : "text-zinc-300 group-hover:text-white"}`}>
                                                    {project.projectName}
                                                </span>
                                                <span className="text-[10px] text-zinc-600 font-medium">{lastMsgTime}</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <p className="text-[11px] lg:text-xs text-zinc-500 truncate group-hover:text-zinc-400 max-w-[120px] lg:max-w-[140px]">
                                                    {isSelected ? <span className="text-blue-500 font-medium">Active now</span> : (lastMsg?.content || <span className="italic opacity-50">New project created</span>)}
                                                </p>
                                                <div className="flex items-center gap-1.5">
                                                    {typingUsers[projectId] && typingUsers[projectId].length > 0 && (
                                                        <div className="size-1.5 rounded-full bg-blue-500 animate-pulse" />
                                                    )}
                                                    {!isSelected && lastMsg && (
                                                        <div className="size-2 rounded-full bg-blue-600 shadow-lg shadow-blue-600/50" />
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        {isSelected && !isMobile && (
                                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-500 rounded-r-full" />
                                        )}
                                    </button>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* Main Chat Area */}
                <div className={`
                    ${isMobile ? (showChatList ? 'hidden' : 'flex w-full') : 'flex flex-1'}
                    flex-col bg-[#0b0e14] h-full
                `}>
                    {selectedProject ? (
                        <>
                            {/* Chat Header */}
                            <div className="h-16 lg:h-20 flex items-center justify-between px-4 lg:px-8 border-b border-zinc-800/50 z-20 bg-[#0b0e14]/95 backdrop-blur-md sticky top-0">
                                <div className="flex items-center gap-3 lg:gap-4 min-w-0">
                                    {isMobile && (
                                        <button 
                                            onClick={() => setShowChatList(true)}
                                            className="p-2 -ml-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 active:scale-95 transition-all"
                                        >
                                            <ChevronLeft className="size-5" />
                                        </button>
                                    )}
                                    <div className="size-9 lg:size-11 rounded-full overflow-hidden border border-zinc-700 bg-zinc-800 shrink-0">
                                        <img src={getProjectAvatar(selectedProject.projectName)} alt={selectedProject.projectName} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-bold text-white text-sm lg:text-lg truncate">{selectedProject.projectName}</h3>
                                            {roomLoading && <div className="size-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin shrink-0" />}
                                        </div>
                                        <div className="flex items-center gap-1.5 lg:gap-2">
                                            <div className={`size-1.5 rounded-full ${onlineUsers.size > 0 ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" : "bg-zinc-600"}`} />
                                            <p className="text-[10px] lg:text-xs text-zinc-500 truncate font-semibold">
                                                {getOnlineStatusString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1 lg:gap-2 shrink-0">
                                    <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white rounded-xl hover:bg-white/5 h-9 w-9">
                                        <MoreHorizontal className="size-5" />
                                    </Button>
                                </div>
                            </div>

                            {/* Messages Area */}
                            <div
                                ref={scrollRef}
                                className="flex-1 overflow-y-auto p-4 lg:p-8 space-y-4 lg:space-y-6 custom-scrollbar relative chat-container"
                            >
                                <div className="chat-mesh-overlay" />
                                {messagesLoading ? (
                                    <div className="flex flex-col h-full items-center justify-center space-y-4">
                                        <div className="size-8 border-3 border-blue-600/20 border-t-blue-600 rounded-full animate-spin" />
                                        <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.2em]">Syncing messages...</p>
                                    </div>
                                ) : messages.length === 0 ? (
                                    <div className="flex flex-col h-full items-center justify-center text-center space-y-6 p-8 relative z-10">
                                        <div className="size-16 lg:size-20 rounded-[2rem] bg-linear-to-br from-blue-600/20 to-purple-600/20 flex items-center justify-center border border-white/5 shadow-2xl backdrop-blur-xl">
                                            <MessageSquare className="size-8 lg:size-10 text-blue-500" />
                                        </div>
                                        <div className="space-y-2">
                                            <p className="text-xl font-bold text-white tracking-tight">No messages yet</p>
                                            <p className="text-zinc-500 text-[11px] lg:text-sm max-w-[240px] mx-auto leading-relaxed">Let's coordinate on <span className="text-blue-400 font-bold">{selectedProject.projectName}</span> here.</p>
                                        </div>
                                    </div>
                                ) : (
                                    messages.map((msg: Message) => {
                                        const isMe = msg.senderId === user?.id;
                                        const sender = (selectedProject as Project).members?.find(m => m.userId === msg.senderId);
                                        const senderName = isMe ? "You" : sender?.user?.userName || "Member";
                                        const senderAvatar = sender?.user?.profilePicture;

                                        return (
                                            <div
                                                key={msg._id}
                                                className={`flex items-end gap-2 lg:gap-4 relative z-10 ${isMe ? "flex-row-reverse" : "flex-row"} group animate-in fade-in slide-in-from-bottom-2 duration-300`}
                                            >
                                                {!isMe && (
                                                    <div className="size-8 lg:size-10 rounded-xl lg:rounded-2xl overflow-hidden border border-white/5 shrink-0 bg-zinc-900 transition-transform hover:scale-105">
                                                        <img
                                                            src={senderAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(senderName)}&background=18181b&color=71717a`}
                                                            alt={senderName}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                )}
                                                <div className={`flex flex-col gap-1 ${isMe ? "items-end" : "items-start"} max-w-[85%] lg:max-w-[70%]`}>
                                                    {!isMe && (
                                                        <span className="text-[10px] font-bold text-blue-500/80 ml-1 tracking-wider uppercase">
                                                            {senderName}
                                                        </span>
                                                    )}
                                                    <div className={`flex items-center gap-2 ${isMe ? "flex-row-reverse" : "flex-row"}`}>
                                                        <div className={`
                                                            px-4 py-2.5 lg:px-6 lg:py-4 rounded-2xl lg:rounded-[2rem] text-sm lg:text-[15px] leading-relaxed shadow-2xl backdrop-blur-xl border transition-all
                                                            ${isMe 
                                                                ? "bg-blue-600 text-white rounded-tr-none border-blue-400/20" 
                                                                : "bg-zinc-900/80 text-zinc-100 rounded-tl-none border-white/5"}
                                                            ${msg.isDeleted ? "italic opacity-50 text-[12px]!" : ""}
                                                        `}>
                                                            {msg.isDeleted ? "This message was deleted" : (
                                                                <>
                                                                    {msg.messageType === 'text' && msg.content}
                                                                    {msg.messageType === 'image' && (
                                                                        <div className="rounded-xl overflow-hidden mb-1 cursor-zoom-in" onClick={() => setExpandedImage(msg.content)}>
                                                                            <img src={msg.content} alt="img" className="max-w-full lg:max-w-[300px] h-auto" />
                                                                        </div>
                                                                    )}
                                                                    {msg.messageType === 'document' && (
                                                                            <div 
                                                                                className="flex items-center gap-3 p-3 bg-black/20 hover:bg-black/30 rounded-xl cursor-default transition-all"
                                                                                onClick={() => handleDownload(msg.content, "file")}
                                                                            >
                                                                                <div className="size-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                                                                                    {downloadedFiles.includes(msg.content) ? (
                                                                                        <CheckCheck className="size-5 text-green-400" />
                                                                                    ) : (
                                                                                        <FileIcon className="size-5 text-blue-400" />
                                                                                    )}
                                                                                </div>
                                                                                <div className="flex-1 min-w-0">
                                                                                    <p className="text-xs font-bold truncate">Attachment</p>
                                                                                    <p className={`text-[9px] font-black uppercase tracking-tighter ${downloadedFiles.includes(msg.content) ? "text-green-500/70" : "opacity-50"}`}>
                                                                                        {downloadedFiles.includes(msg.content) ? "Downloaded" : "Click to get"}
                                                                                    </p>
                                                                                </div>
                                                                            </div>
                                                                    )}
                                                                </>
                                                            )}
                                                            <div className={`flex items-center gap-1.5 mt-1.5 justify-end opacity-40`}>
                                                                <span className="text-[9px] font-bold">
                                                                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                                </span>
                                                                {isMe && !msg.isDeleted && <CheckCheck className="size-3" />}
                                                            </div>
                                                        </div>
                                                        
                                                        {isMe && !msg.isDeleted && (
                                                            <button
                                                                onClick={() => setDeleteConfirm({ messageId: msg._id })}
                                                                className="opacity-0 group-hover:opacity-100 p-2 rounded-xl text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-all border border-white/5 active:scale-95"
                                                            >
                                                                <Trash2 className="size-4" />
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>

                            {/* Input Area */}
                            <div className="p-3 lg:p-6 bg-[#0b0e14]/95 backdrop-blur-md z-20 border-t border-zinc-800/50 sticky bottom-0">
                                <div className="max-w-4xl mx-auto flex items-center gap-2 lg:gap-3">
                                    <div className="flex-1 bg-zinc-900/60 border border-zinc-800 rounded-2xl p-1 lg:p-1.5 flex items-center gap-1 transition-all focus-within:border-blue-600/50 focus-within:bg-zinc-900/80">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-zinc-500 hover:text-white rounded-xl hidden sm:flex"
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
                                            {isUploading ? <div className="size-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" /> : <Paperclip className="size-5" />}
                                        </Button>
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            onChange={handleFileSelect}
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
                                                }
                                            }}
                                            onBlur={handleBlur}
                                            placeholder="Type a message..."
                                            className="flex-1 bg-transparent border-none focus:ring-0 text-white text-sm lg:text-[15px] px-2 placeholder:text-zinc-700 h-9 lg:h-10"
                                        />
                                    </div>
                                    <Button
                                        onClick={handleSendMessage}
                                        disabled={!message.trim() || !roomId}
                                        className="bg-blue-600 hover:bg-blue-500 text-white size-10 lg:size-12 rounded-2xl shadow-xl shadow-blue-600/20 active:scale-95 shrink-0"
                                    >
                                        <Send className="size-5" />
                                    </Button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-zinc-500 p-8 text-center bg-radial-at-c from-zinc-900/20 to-[#0b0e14]">
                            <div className="size-20 rounded-[2.5rem] bg-zinc-900 flex items-center justify-center mb-6 border border-white/5">
                                <MessageSquare className="size-8 text-zinc-700" />
                            </div>
                            <h3 className="text-white font-bold text-lg">Your transmissions</h3>
                            <p className="text-xs text-zinc-600 mt-2 max-w-[200px]">Select a project from the left to start coordinating with your team.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Emoji Picker Overlay */}
            {showEmojiPicker && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm lg:bg-transparent lg:backdrop-blur-none lg:absolute lg:inset-auto lg:bottom-28 lg:left-8">
                    <div className="relative shadow-2xl rounded-2xl overflow-hidden border border-zinc-800">
                        <div className="fixed inset-0 lg:hidden" onClick={() => setShowEmojiPicker(false)} />
                        <EmojiPicker
                            onEmojiClick={handleEmojiClick}
                            theme={Theme.DARK}
                            width={isMobile ? '100%' : 300}
                            height={400}
                        />
                    </div>
                </div>
            )}

            {/* Modals & Overlays */}
            {deleteConfirm && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
                    <div className="bg-[#14171f] border border-white/10 rounded-3xl p-6 w-full max-w-sm flex flex-col gap-6 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)]">
                        <div className="flex flex-col items-center gap-4 text-center">
                            <div className="size-14 rounded-2xl bg-red-500/10 flex items-center justify-center border border-red-500/20">
                                <Trash2 className="size-7 text-red-400" />
                            </div>
                            <div>
                                <h3 className="text-white text-lg font-bold">Delete transmission?</h3>
                                <p className="text-zinc-500 text-xs sm:text-sm mt-2">This action is irreversible across the network.</p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-3 px-4 rounded-2xl bg-zinc-900 text-zinc-400 font-bold text-xs hover:bg-zinc-800 border border-white/5 transition-all">Cancel</button>
                            <button onClick={() => handleDeleteMessage(deleteConfirm.messageId)} className="flex-1 py-3 px-4 rounded-2xl bg-red-600 text-white font-bold text-xs hover:bg-red-500 shadow-lg shadow-red-600/20 transition-all">Delete</button>
                        </div>
                    </div>
                </div>
            )}

            {expandedImage && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-2xl p-4" onClick={() => setExpandedImage(null)}>
                    <img src={expandedImage} alt="Expanded" className="max-w-full max-h-full object-contain rounded-xl shadow-2xl animate-in zoom-in-95 duration-500" />
                    <button className="absolute top-6 right-6 p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white"><X className="size-6" /></button>
                </div>
            )}

            <style>{`
                .chat-container {
                    background: radial-gradient(circle at 50% 50%, #0e111a 0%, #0b0e14 100%);
                }
                .chat-mesh-overlay {
                    position: absolute;
                    inset: 0;
                    background-image: url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h40v40H0V0zm1 1h38v38H1V1z' fill='%234169e1' fill-opacity='0.02'/%3E%3C/svg%3E");
                    pointer-events: none;
                    z-index: 0;
                }
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #27272a; border-radius: 10px; }
            `}</style>
        </DashboardLayout>
    );
};

const X = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);