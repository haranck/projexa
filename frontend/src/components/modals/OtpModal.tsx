import { useState, useEffect, useRef } from "react";
import { useUserVerifyOtp, useUserResendOtp } from "../../hooks/Auth/AuthHooks";
import { useNavigate } from "react-router-dom";
import { FRONTEND_ROUTES } from "../../constants/frontendRoutes";
import { Mail, ShieldCheck, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
// import { toast } from "react-toastify";

interface OTPModalProps {
    email: string;
    isOpen: boolean;
    onClose: () => void;
}

const OTPModal = ({ email, isOpen, onClose }: OTPModalProps) => {
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [timer, setTimer] = useState(15);
    const [canResend, setCanResend] = useState(false);

    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const { mutate: verifyOtp, isPending: isVerifying } = useUserVerifyOtp();
    const { mutate: resendOtp, isPending: isResending } = useUserResendOtp();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isOpen) return;

        setOtp(["", "", "", "", "", ""]);
        setTimer(15);
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

        verifyOtp(
            { email, otp: otpValue },
            {
                onSuccess: () => {
                    navigate(FRONTEND_ROUTES.LOGIN);
                },
                onError: (error) => {
                    console.log('error form modale')
                    toast.error((error as any).response?.data?.message || "Verification failed");

                },
            }
        );
    };

    const handleResend = () => {
        if (!canResend) return;

        resendOtp(email, {
            onSuccess: () => {
                setTimer(30);
                setCanResend(false);
                console.log('helloo')
                toast.success("OTP resent successfully");
            },
            onError: (error) => {
                console.log('error signup failed')
                toast.error((error as any).response?.data?.message || "Failed to resend OTP");
            },
        });
    };

    const handleChange = (index: number, value: string) => {
        if (isNaN(Number(value))) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < 3) {
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
        if (pastedData.some(char => isNaN(Number(char)))) return;

        const newOtp = [...otp];
        pastedData.forEach((char, index) => {
            if (index < 6) newOtp[index] = char;
        });
        setOtp(newOtp);
        inputRefs.current[Math.min(pastedData.length, 6)]?.focus();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 p-4 animate-fade-in">
            <div className="bg-[#0a0a0a] border border-zinc-800 rounded-2xl shadow-2xl w-full max-w-md p-8 flex flex-col items-center text-center relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-blue-500/10 rounded-full blur-[50px] pointer-events-none" />

                <h2 className="font-display text-2xl font-bold text-white mb-2 z-10">ProJexa</h2>
                <h3 className="text-xl font-semibold text-zinc-100 mb-2 z-10">Verify OTP</h3>

                <p className="text-zinc-500 text-sm mb-1 z-10">We sent a 6-digit code to your email</p>
                <div className="flex items-center gap-2 text-blue-500 text-sm mb-8 z-10">
                    <Mail className="w-4 h-4" />
                    <span>{email}</span>
                </div>

                <div className="flex gap-6 mb-8 z-10">
                    {otp.map((digit, index) => (
                        <input
                            key={index}
                            ref={(el) => { inputRefs.current[index] = el; }}
                            type="text"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleChange(index, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(index, e)}
                            onPaste={handlePaste}
                            className="w-14 h-14 bg-[#121212] border border-zinc-700/50 rounded-xl text-center text-2xl font-bold text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 outline-none transition-all"
                        />
                    ))}
                </div>

                <Button
                    onClick={handleVerify}
                    disabled={isVerifying || otp.join("").length !== 6}
                    className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-lg shadow-blue-900/20 transition-all mb-6 z-10"
                >
                    {isVerifying ? (
                        <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Verifying...
                        </>
                    ) : (
                        "Verify OTP"
                    )}
                </Button>

                <div className="text-sm text-zinc-500 mb-8 z-10">
                    {canResend ? (
                        <button
                            onClick={handleResend}
                            className="text-white hover:text-blue-400 hover:underline font-medium transition-colors"
                            disabled={isResending}
                        >
                            {isResending ? "Sending..." : "Resend OTP"}
                        </button>
                    ) : (
                        <span>
                            Resend OTP in <span className="text-white font-mono">{timer}s</span>
                        </span>
                    )}
                </div>

                <button
                    onClick={onClose}
                    className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-sm mb-8 z-10"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Login
                </button>

                <div className="flex items-center gap-2 text-zinc-600 text-xs z-10">
                    <ShieldCheck className="w-3 h-3" />
                    Your connection is secure and encrypted
                </div>
            </div>
        </div>
    );
};

export default OTPModal;
