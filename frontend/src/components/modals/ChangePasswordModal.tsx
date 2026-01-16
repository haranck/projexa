import { useState } from "react";
import { useVerifyPassword, useResetPassword } from "../../hooks/Auth/AuthHooks";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { ShieldCheck, Lock, Eye, EyeOff, Loader2, X, AlertCircle, CheckCircle2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { getErrorMessage } from "../../utils/errorHandler";

interface ChangePasswordModalProps {
    open: boolean;
    onClose: () => void;
}

type Step = "verify" | "reset" | "success";

export const ChangePasswordModal = ({ open, onClose }: ChangePasswordModalProps) => {
    const user = useSelector((state: RootState) => state.auth.user);
    const [step, setStep] = useState<Step>("verify");
    const [password, setPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const { mutate: verifyPassword, isPending: isVerifying } = useVerifyPassword();
    const { mutate: resetPassword, isPending: isResetting } = useResetPassword();

    const resetFields = () => {
        setStep("verify");
        setPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setShowPassword(false);
    };

    const handleClose = () => {
        resetFields();
        onClose();
    };

    const handleVerify = async () => {
        if (!password) {
            toast.error("Please enter your current password");
            return;
        }

        verifyPassword({ password }, {
            onSuccess: () => {
                setStep("reset");
            },
            onError: (error) => {
                toast.error(getErrorMessage(error, "Invalid password"));
            },
        });
    };

    const handleReset = async () => {
        if (newPassword.length < 6) {
            toast.error("Password must be at least 6 characters");
            return;
        }
        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        if (!user?.email) {
            toast.error("User email not found");
            return;
        }

        resetPassword({
            email: user.email,
            password: newPassword,
            confirmPassword
        }, {
            onSuccess: () => {
                setStep("success");
                setTimeout(handleClose, 2000);
            },
            onError: (error) => {
                toast.error(getErrorMessage(error, "Failed to update password"));
            },
        });
    };

    if (!open) return null;

    const renderStep = () => {
        switch (step) {
            case "verify":
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                        <div className="text-center space-y-2">
                            <div className="mx-auto w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                                <ShieldCheck className="w-6 h-6 text-blue-500" />
                            </div>
                            <h2 className="text-xl font-bold text-white">Security Verification</h2>
                            <p className="text-zinc-500 text-sm">Please verify your current password to continue</p>
                        </div>

                        <div className="space-y-4">
                            <div className="relative group">
                                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-blue-500 transition-colors" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Current Password"
                                    className="w-full bg-zinc-900/50 border border-white/5 rounded-xl px-10 py-3 text-sm focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all placeholder:text-zinc-600"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
                                />
                                <button
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 hover:bg-white/5 rounded-md text-zinc-500 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>

                            <button
                                onClick={handleVerify}
                                disabled={isVerifying}
                                className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 text-white py-3 rounded-xl font-bold text-sm transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2"
                            >
                                {isVerifying ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Verifying...
                                    </>
                                ) : "Continue"}
                            </button>
                        </div>
                    </div>
                );

            case "reset":
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                        <div className="text-center space-y-2">
                            <div className="mx-auto w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                                <Lock className="w-6 h-6 text-emerald-500" />
                            </div>
                            <h2 className="text-xl font-bold text-white">New Password</h2>
                            <p className="text-zinc-500 text-sm">Set a strong password for your account</p>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-3">
                                <div className="relative group">
                                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-emerald-500 transition-colors" />
                                    <input
                                        type="password"
                                        placeholder="New Password"
                                        className="w-full bg-zinc-900/50 border border-white/5 rounded-xl px-10 py-3 text-sm focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all placeholder:text-zinc-600"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                    />
                                </div>
                                <div className="relative group">
                                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-emerald-500 transition-colors" />
                                    <input
                                        type="password"
                                        placeholder="Confirm New Password"
                                        className="w-full bg-zinc-900/50 border border-white/5 rounded-xl px-10 py-3 text-sm focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all placeholder:text-zinc-600"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleReset()}
                                    />
                                </div>
                            </div>

                            <div className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/10 flex items-start gap-3">
                                <AlertCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                                <p className="text-[11px] text-zinc-400 leading-relaxed font-medium">
                                    Must be at least 6 characters. Use a mix of letters, numbers and symbols for better security.
                                </p>
                            </div>

                            <button
                                onClick={handleReset}
                                disabled={isResetting}
                                className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-600/50 text-white py-3 rounded-xl font-bold text-sm transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
                            >
                                {isResetting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Saving...
                                    </>
                                ) : "Update Password"}
                            </button>
                        </div>
                    </div>
                );

            case "success":
                return (
                    <div className="py-8 text-center space-y-4 animate-in fade-in zoom-in duration-300">
                        <div className="mx-auto w-16 h-16 rounded-3xl bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                            <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-xl font-bold text-white">Password Updated!</h3>
                            <p className="text-zinc-500 text-sm">Your security settings have been saved.</p>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={handleClose}
            />

            <div className="relative w-full max-w-[420px] bg-zinc-950 border border-white/10 rounded-[2rem] p-8 shadow-2xl overflow-hidden group">
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/10 blur-[80px] group-hover:bg-blue-500/20 transition-all duration-700" />
                <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-emerald-500/10 blur-[80px] group-hover:bg-emerald-500/20 transition-all duration-700" />

                <button
                    onClick={handleClose}
                    className="absolute right-6 top-6 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-500 hover:text-white transition-all border border-white/5"
                >
                    <X className="w-4 h-4" />
                </button>

                {renderStep()}
            </div>
        </div>
    );
};

