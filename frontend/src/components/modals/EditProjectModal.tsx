import React, { useState, useEffect } from 'react';
import {
    X,
    Briefcase,
    Code,
    AlignLeft,
    Check
} from 'lucide-react';
import { useUpdateProject } from '../../hooks/Project/ProjectHooks';
import { toast } from 'react-hot-toast';
import { getErrorMessage } from '@/utils/errorHandler';
import type { Project } from '../../types/project';

interface EditProjectModalProps {
    open: boolean;
    onClose: () => void;
    project: Project | null;
}

export const EditProjectModal: React.FC<EditProjectModalProps> = ({ open, onClose, project }) => {
    const [projectName, setProjectName] = useState('');
    const [projectKey, setProjectKey] = useState('');
    const [description, setDescription] = useState('');

    const updateProjectMutation = useUpdateProject();

    useEffect(() => {
        if (project) {
            setProjectName(project.projectName);
            setProjectKey(project.key);
            setDescription(project.description);
        }
    }, [project]);

    if (!open || !project) return null;

    const handleSubmit = () => {
        if (!projectName.trim()) {
            toast.error("Project name is required");
            return;
        }
        if (!projectKey.trim()) {
            toast.error("Project key is required");
            return;
        }

        updateProjectMutation.mutate({
            projectId: project._id,
            projectName,
            key: projectKey,
            description
        }, {
            onSuccess: () => {
                toast.success("Project updated successfully");
                onClose();
            },
            onError: (err: unknown) => {
                const error = getErrorMessage(err);
                toast.error(error || "Failed to update project");
            }
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-zinc-950 border border-white/10 w-full max-w-lg rounded-[2rem] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
                {/* Header */}
                <div className="p-6 border-b border-white/5 flex items-center justify-between bg-zinc-900/40">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500 border border-blue-500/20">
                            <Briefcase className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white tracking-tight">Edit Project</h2>
                            <p className="text-zinc-500 text-xs font-medium">Update project details</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-white/5 text-zinc-400 hover:text-white transition-all active:scale-95"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
                    <div className="space-y-6">
                        <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                            <AlignLeft className="w-4 h-4 text-blue-500" />
                            Project Details
                        </h3>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-1">Project Name</label>
                                <div className="relative group">
                                    <input
                                        type="text"
                                        value={projectName}
                                        onChange={(e) => setProjectName(e.target.value)}
                                        placeholder="e.g. Mobile App Redesign"
                                        className="w-full bg-zinc-900/50 border border-white/5 rounded-xl px-4 py-3 text-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all placeholder:text-zinc-700 text-sm group-hover:border-white/10"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-1">Key</label>
                                <div className="relative group">
                                    <input
                                        type="text"
                                        value={projectKey}
                                        onChange={(e) => setProjectKey(e.target.value.toUpperCase())}
                                        placeholder="MAR"
                                        maxLength={10}
                                        className="w-full bg-zinc-900/50 border border-white/5 rounded-xl px-4 py-3 text-white font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all placeholder:text-zinc-700 text-sm group-hover:border-white/10"
                                    />
                                    <Code className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-700" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-1">Description</label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="What's this project about?"
                                    rows={4}
                                    className="w-full bg-zinc-900/50 border border-white/5 rounded-xl px-4 py-3 text-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all placeholder:text-zinc-700 text-sm resize-none group-hover:border-white/10"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-white/5 bg-zinc-900/40 flex items-center justify-end gap-4">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 rounded-xl text-xs font-bold text-zinc-500 hover:text-white transition-all active:scale-95"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={updateProjectMutation.isPending}
                        className="px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-xl shadow-blue-500/20 transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none flex items-center gap-2"
                    >
                        {updateProjectMutation.isPending ? (
                            <div className="animate-spin rounded-full h-3 w-3 border-2 border-white/30 border-t-white" />
                        ) : <Check className="w-4 h-4" />}
                        {updateProjectMutation.isPending ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>
        </div>
    );
};
