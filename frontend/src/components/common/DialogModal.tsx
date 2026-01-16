import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Shield, ShieldOff } from "lucide-react"
import type { User } from "@/types/user";

interface DialogModalProps {
    isDialogOpen: boolean;
    setIsDialogOpen: (open: boolean) => void;
    selectedUser: User | null;
    isProcessing: boolean;
    confirmAction: () => void;
}

export const DialogModal = ({
    isDialogOpen,
    setIsDialogOpen,
    selectedUser,
    isProcessing,
    confirmAction
}: DialogModalProps) => {
    if (!selectedUser) return null;

    const isBlocked = selectedUser.isBlocked;

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="bg-[#141414] border-white/10 text-zinc-100 rounded-3xl overflow-hidden backdrop-blur-2xl max-w-[400px]">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold flex items-center gap-3">
                        <div className={`p-2 rounded-xl ${isBlocked ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                            {isBlocked ? <Shield className="h-6 w-6" /> : <ShieldOff className="h-6 w-6" />}
                        </div>
                        {isBlocked ? "Unblock User Access?" : "Confirm User Block?"}
                    </DialogTitle>
                    <DialogDescription className="text-zinc-400 pt-3 font-medium text-sm leading-relaxed">
                        Are you sure you want to {isBlocked ? "restore access for" : "restrict access for"} <span className="text-zinc-100 font-bold whitespace-nowrap">{selectedUser.firstName} {selectedUser.lastName}</span>?
                        <br />
                        {!isBlocked && "They will be immediately logged out and barred from platform utilities."}
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="gap-2 sm:gap-2 mt-8">
                    <Button
                        variant="ghost"
                        onClick={() => setIsDialogOpen(false)}
                        className="flex-1 rounded-xl hover:bg-white/5 text-zinc-400 font-bold uppercase text-[10px] tracking-widest h-11"
                        disabled={isProcessing}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={confirmAction}
                        className={`flex-1 rounded-xl font-bold uppercase text-[10px] tracking-widest shadow-lg h-11 transition-all ${isBlocked
                            ? "bg-emerald-600 hover:bg-emerald-500 text-white"
                            : "bg-red-600 hover:bg-red-500 text-white"
                            }`}
                        disabled={isProcessing}
                    >
                        {isProcessing ? "Processing..." : (isBlocked ? "Confirm Unblock" : "Confirm Block")}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
