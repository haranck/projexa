import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Info } from "lucide-react"

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description: string;
    confirmText?: string;
    cancelText?: string;
    variant?: 'danger' | 'success' | 'warning';
    isLoading?: boolean;
}

export const ConfirmationModal = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    confirmText = "Confirm",
    cancelText = "Cancel",
    variant = 'warning',
    isLoading = false
}: ConfirmationModalProps) => {

    const getIcon = () => {
        switch (variant) {
            case 'danger':
                return <AlertTriangle className="h-6 w-6 text-red-500" />;
            case 'success':
                return <Info className="h-6 w-6 text-emerald-500" />;
            case 'warning':
            default:
                return <AlertTriangle className="h-6 w-6 text-orange-500" />;
        }
    }

    const getIconBg = () => {
        switch (variant) {
            case 'danger': return 'bg-red-500/10';
            case 'success': return 'bg-emerald-500/10';
            case 'warning': default: return 'bg-orange-500/10';
        }
    }

    const getButtonColor = () => {
        switch (variant) {
            case 'danger': return 'bg-red-600 hover:bg-red-500';
            case 'success': return 'bg-emerald-600 hover:bg-emerald-500';
            case 'warning': default: return 'bg-orange-600 hover:bg-orange-500';
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-[#141414] border-white/10 text-zinc-100 rounded-3xl overflow-hidden backdrop-blur-2xl max-w-[400px]">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold flex items-center gap-3">
                        <div className={`p-2 rounded-xl ${getIconBg()}`}>
                            {getIcon()}
                        </div>
                        {title}
                    </DialogTitle>
                    <DialogDescription className="text-zinc-400 pt-3 font-medium text-sm leading-relaxed">
                        {description}
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="gap-2 sm:gap-2 mt-8">
                    <Button
                        variant="ghost"
                        onClick={onClose}
                        className="flex-1 rounded-xl hover:bg-white/5 text-zinc-400 font-bold uppercase text-[10px] tracking-widest h-11"
                        disabled={isLoading}
                    >
                        {cancelText}
                    </Button>
                    <Button
                        onClick={onConfirm}
                        className={`flex-1 rounded-xl font-bold uppercase text-[10px] tracking-widest shadow-lg h-11 transition-all text-white ${getButtonColor()}`}
                        disabled={isLoading}
                    >
                        {isLoading ? "Processing..." : confirmText}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
