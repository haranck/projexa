import React from 'react';
import { AlertTriangle, Trash2 } from 'lucide-react';

interface DeleteConfirmationModalProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    projectName: string;
    isDeleting: boolean;
}

export const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
    open,
    onClose,
    onConfirm,
    projectName,
    isDeleting
}) => {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-zinc-950 border border-white/10 w-full max-w-md rounded-[2rem] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
                <div className="p-6 text-center space-y-4">
                    <div className="w-12 h-12 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto border border-red-500/20">
                        <AlertTriangle className="w-6 h-6 text-red-500" />
                    </div>

                    <div>
                        <h2 className="text-xl font-bold text-white tracking-tight">Delete Project?</h2>
                        <p className="text-zinc-500 text-sm mt-2">
                            Are you sure you want to delete <span className="text-white font-bold">{projectName}</span>?
                            This action cannot be undone and all data associated with this project will be lost.
                        </p>
                    </div>
                </div>

                <div className="p-6 border-t border-white/5 bg-zinc-900/40 flex items-center justify-center gap-4">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 rounded-xl text-xs font-bold text-zinc-500 hover:text-white transition-all active:scale-95"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isDeleting}
                        className="px-8 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-xl shadow-red-500/20 transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none flex items-center gap-2"
                    >
                        {isDeleting ? (
                            <div className="animate-spin rounded-full h-3 w-3 border-2 border-white/30 border-t-white" />
                        ) : <Trash2 className="w-4 h-4" />}
                        {isDeleting ? 'Deleting...' : 'Delete Project'}
                    </button>
                </div>
            </div>
        </div>
    );
};
