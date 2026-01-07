import { ForgotPasswordForm } from "../../components/Auth/ForgotPasswordForm"
import { useForgotPassword } from "../../hooks/Auth/AuthHooks"
import type { ForgotSchemaType } from "../../lib/validations/forgot.schema"
import { toast } from "react-hot-toast"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import OTPModal from "../../components/modals/OtpModal"
import { useState } from "react"

export const ForgotPassword = () => {
    const { mutate: forgotPassword, isPending } = useForgotPassword()
    const [isOtpModalOpen, setIsOtpModalOpen] = useState(false)
    const [userEmail, setUserEmail] = useState("")

    const handleForgotPassword = (data: ForgotSchemaType) => {
        setUserEmail(data.email)
        forgotPassword(data, {
            onSuccess: () => {
                toast.success("Reset OTP sent to your email")
                setIsOtpModalOpen(true)
            },
            onError: (error) => {
                console.error("Forgot Password failed:", error)
                toast.error("Forgot Password failed. Please try again.")
            }
        })
    }

    return (
        <div className="h-screen relative flex flex-col items-center justify-center overflow-hidden bg-[#0a0a0a] p-4 font-sans">
            {/* Background Glows */}
            <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[20%] right-[-10%] w-[60%] h-[60%] bg-purple-500/10 rounded-full blur-[140px]" />
                <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-blue-400/5 rounded-full blur-[100px]" />
            </div>

            <div className="relative z-10 w-full flex justify-center">
                <Card className="w-full max-w-[460px] border-white/5 bg-[#141414]/80 backdrop-blur-xl shadow-[0_0_50px_rgba(0,0,0,0.5)] rounded-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-500">
                    <CardHeader className="text-center pb-2 pt-8 space-y-0.5">
                        <CardTitle className="flex justify-center -mt-12 ml-4 -mb-12">
                            <img
                                src="/logo.png"
                                alt="ProJexa Logo"
                                className="h-28 w-auto object-contain"
                            />
                        </CardTitle>
                        <h2 className="text-xl font-bold text-zinc-100 tracking-tight leading-tight">
                            Forgot Password
                        </h2>
                        <p className="text-zinc-500 text-xs font-medium">
                            Enter your email to reset your password
                        </p>
                    </CardHeader>

                    <CardContent className="space-y-4 px-8 pb-8 pt-4">
                        <ForgotPasswordForm onSubmit={handleForgotPassword} loading={isPending} />
                    </CardContent>
                </Card>
            </div>

            <OTPModal
                email={userEmail}
                isOpen={isOtpModalOpen}
                onClose={() => setIsOtpModalOpen(false)}
                purpose="forgotPassword"
            />
        </div>
    )
}
