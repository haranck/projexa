import React from "react";
import { X, FileText, CheckCircle2, AlertCircle, MessageSquare } from "lucide-react";
import type { Meeting } from "./types";

interface MeetingSummaryModalProps {
    meeting: Meeting;
    onClose: () => void;
}

const MeetingSummaryModal: React.FC<MeetingSummaryModalProps> = ({ meeting, onClose }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-zinc-900/90 border border-zinc-800 rounded-[2.5rem] w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col animate-in zoom-in-95 duration-300">
                
                {/* Header */}
                <div className="p-8 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/50">
                    <div>
                        <h2 className="text-3xl font-black text-white tracking-tight leading-none mb-2">{meeting.title}</h2>
                        <div className="flex items-center gap-3 text-zinc-500 text-sm font-bold uppercase tracking-widest">
                            <span className="flex items-center gap-1.5"><FileText className="size-4" /> AI Summary Report</span>
                            <span className="text-zinc-800">•</span>
                            <span>{meeting.date}</span>
                        </div>
                    </div>
                    <button 
                        onClick={onClose}
                        className="bg-zinc-800/50 hover:bg-zinc-800 p-3 rounded-2xl border border-white/5 transition-all group"
                    >
                        <X className="size-6 text-zinc-500 group-hover:text-white" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar space-y-10">
                    
                    {/* Summary Section */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 text-blue-500">
                            <div className="size-8 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                                <MessageSquare className="size-4" />
                            </div>
                            <h3 className="text-lg font-black uppercase tracking-wider">Executive Summary</h3>
                        </div>
                        <div className="bg-zinc-800/20 rounded-3xl p-6 border border-white/5">
                            <p className="text-zinc-300 leading-relaxed font-medium">
                                {meeting.summary || "This meeting is being processed by our AI systems. Please check back shortly for a comprehensive overview."}
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Action Items */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 text-emerald-500">
                                <div className="size-8 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                                    <CheckCircle2 className="size-4" />
                                </div>
                                <h3 className="text-lg font-black uppercase tracking-wider">Action Items</h3>
                            </div>
                            <div className="bg-zinc-800/20 rounded-3xl p-6 border border-white/5 min-h-[160px]">
                                {meeting.summaryMetadata?.actionItems && meeting.summaryMetadata.actionItems.length > 0 ? (
                                    <ul className="space-y-3">
                                        {meeting.summaryMetadata.actionItems.map((item, i) => (
                                            <li key={i} className="flex gap-3 text-zinc-400 font-bold text-sm">
                                                <span className="text-emerald-500/50">•</span>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-zinc-600 font-bold italic text-sm">No action items detected.</p>
                                )}
                            </div>
                        </div>

                        {/* Decisions */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 text-purple-500">
                                <div className="size-8 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
                                    <AlertCircle className="size-4" />
                                </div>
                                <h3 className="text-lg font-black uppercase tracking-wider">Key Decisions</h3>
                            </div>
                            <div className="bg-zinc-800/20 rounded-3xl p-6 border border-white/5 min-h-[160px]">
                                {meeting.summaryMetadata?.decisions && meeting.summaryMetadata.decisions.length > 0 ? (
                                    <ul className="space-y-3">
                                        {meeting.summaryMetadata.decisions.map((item, i) => (
                                            <li key={i} className="flex gap-3 text-zinc-400 font-bold text-sm">
                                                <span className="text-purple-500/50">•</span>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-zinc-600 font-bold italic text-sm">No critical decisions recorded.</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Transcript Section */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 text-zinc-400">
                            <div className="size-8 rounded-xl bg-zinc-800/50 flex items-center justify-center border border-white/5">
                                <FileText className="size-4" />
                            </div>
                            <h3 className="text-lg font-black uppercase tracking-wider">Full Transcript</h3>
                        </div>
                        <div className="bg-black/20 rounded-3xl p-8 border border-white/5 max-h-[300px] overflow-y-auto custom-scrollbar">
                            <p className="text-zinc-500 font-medium whitespace-pre-wrap leading-relaxed text-sm">
                                {meeting.transcript || "Transcript is still being generated. Communication records will appear here once processed."}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-zinc-800 flex justify-end bg-zinc-900/50">
                    <button 
                        onClick={onClose}
                        className="bg-zinc-800 hover:bg-zinc-700 text-white font-black text-xs uppercase tracking-widest px-8 py-3 rounded-2xl transition-all border border-white/5"
                    >
                        Close Mission Report
                    </button>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
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
            ` }} />
        </div>
    );
};

export default MeetingSummaryModal;
