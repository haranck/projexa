import { useState, useEffect, useRef } from "react";
import { useUserVerifyOtp, useUserResendOtp, useVerifyResetOtp } from "../../hooks/Auth/AuthHooks";
import { useNavigate } from "react-router-dom";
import { FRONTEND_ROUTES } from "../../constants/frontendRoutes";
import { Mail, ShieldCheck, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "../../components/ui/button";
import { toast } from "react-hot-toast";

// Helper function to extract error message
const getErrorMessage = (error: unknown, fallback: string): string => {
    if (error && typeof error === 'object' && 'response' in error) {
        const response = (error as { response?: { data?: { message?: string } } }).response;
        return response?.data?.message || fallback;
    }
    return fallback;
};

interface OTPModalProps {
    email: string;
    isOpen: boolean;
    onClose: () => void;
    purpose?: "signup" | "forgotPassword";
}

const OTPModal = ({ email, isOpen, onClose, purpose = "signup" }: OTPModalProps) => {
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [timer, setTimer] = useState(15);
    const [canResend, setCanResend] = useState(false);

    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const { mutate: verifySignupOtp, isPending: isVerifyingSignup } = useUserVerifyOtp();
    const { mutate: verifyResetOtp, isPending: isVerifyingReset } = useVerifyResetOtp();
    const { mutate: resendOtp, isPending: isResending } = useUserResendOtp();

    const isVerifying = purpose === "signup" ? isVerifyingSignup : isVerifyingReset;
    const navigate = useNavigate();

    useEffect(() => {
        if (!isOpen) return;

        setOtp(["", "", "", "", "", ""]);
        setTimer(30);
        setCanResend(false);
        setTimeout(() => {
            inputRefs.current[0]?.focus();
        }, 100);
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen || timer <= 0) {
            if (timer === 0) setCanResend(true);
            return;
        }

        const interval = setInterval(() => {
            setTimer((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [isOpen, timer]);

    const handleVerify = () => {
        const otpValue = otp.join("");
        if (otpValue.length !== 6) return;

        const verifyFn = purpose === "signup" ? verifySignupOtp : verifyResetOtp;
        const successRoute = purpose === "signup" ? FRONTEND_ROUTES.LOGIN : FRONTEND_ROUTES.RESET_PASSWORD;

        verifyFn(
            { email, otp: otpValue },
            {
                onSuccess: () => {
                    toast.success("Verification successful!");
                    navigate(successRoute, { state: { email } });
                },
                onError: (error) => {
                    toast.error(getErrorMessage(error, "Verification failed"));
                },
            }
        );
    };

    const handleResend = () => {
        if (!canResend) return;

        resendOtp({ email }, {
            onSuccess: () => {
                setTimer(30);
                setCanResend(false);
                toast.success("OTP resent successfully");
            },
            onError: (error) => {
                toast.error(getErrorMessage(error, "Failed to resend OTP"));
            },
        });
    };

    const handleChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value.slice(-1);
        setOtp(newOtp);

        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData("text").slice(0, 6).split("");
        if (pastedData.some(char => !/^\d$/.test(char))) return;

        const newOtp = [...otp];
        pastedData.forEach((char, index) => {
            if (index < 6) newOtp[index] = char;
        });
        setOtp(newOtp);
        const nextIndex = Math.min(pastedData.length, 5);
        inputRefs.current[nextIndex]?.focus();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/80 backdrop-blur-md z-100 p-4 animate-in fade-in duration-300">
            <div className="bg-[#141414]/90 border border-white/5 rounded-[2rem] shadow-[0_0_80px_rgba(0,0,0,0.8)] w-full max-w-[480px] p-10 flex flex-col items-center text-center relative overflow-hidden animate-in zoom-in-95 duration-300">

                <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />
                <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] bg-purple-500/5 rounded-full blur-[100px] pointer-events-none" />

                <h2 className="text-3xl font-extrabold tracking-tight text-white mb-8 font-display">ProJexa</h2>

                <h3 className="text-2xl font-bold text-zinc-100 tracking-tight mb-2">Verify OTP</h3>
                <p className="text-zinc-500 text-sm font-medium mb-1">We sent a 6-digit code to your email</p>

                <div className="flex items-center gap-2 text-blue-400/80 text-xs font-bold tracking-tight mb-10">
                    <Mail className="w-3.5 h-3.5" />
                    <span>{email}</span>
                </div>

                <div className="flex justify-between w-full gap-2.5 mb-10">
                    {otp.map((digit, index) => (
                        <input
                            key={index}
                            ref={(el) => { inputRefs.current[index] = el; }}
                            type="text"
                            inputMode="numeric"
                            autoComplete="one-time-code"
                            pattern="\d{1}"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleChange(index, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(index, e)}
                            onPaste={handlePaste}
                            className="w-[60px] h-[64px] bg-[#0a0a0a] border border-zinc-800/80 rounded-2xl text-center text-2xl font-black text-white focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all duration-200"
                        />
                    ))}
                </div>

                <Button
                    onClick={handleVerify}
                    disabled={isVerifying || otp.join("").length !== 6}
                    className="w-full h-12 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-2xl shadow-[0_4px_20px_rgba(59,130,246,0.3)] hover:shadow-[0_6px_25px_rgba(59,130,246,0.4)] transition-all duration-300 mb-6 active:scale-[0.98]"
                >
                    {isVerifying ? (
                        <div className="flex items-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Verifying...</span>
                        </div>
                    ) : (
                        "Verify OTP"
                    )}
                </Button>

                <div className="text-sm font-bold tracking-tight mb-12">
                    {canResend ? (
                        <button
                            onClick={handleResend}
                            className="text-white hover:text-blue-400 transition-colors"
                            disabled={isResending}
                        >
                            {isResending ? "Sending..." : "Resend OTP"}
                        </button>
                    ) : (
                        <span className="text-zinc-500">
                            Resend OTP in <span className="text-blue-500 ml-1">{timer}s</span>
                        </span>
                    )}
                </div>

                <button
                    onClick={onClose}
                    className="flex items-center gap-2 text-zinc-500 hover:text-white transition-all text-xs font-bold uppercase tracking-widest mb-10 group"
                >
                    <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                    Back to Login
                </button>

                <div className="flex items-center gap-2 text-zinc-700 text-[10px] font-bold uppercase tracking-wider">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Your connection is secure and encrypted
                </div>
            </div>
        </div>
    );
};

export default OTPModal;
