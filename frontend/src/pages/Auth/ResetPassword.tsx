import { ResetPasswordForm } from '../../components/Auth/ResetPasswordForm'
import { useNavigate, useLocation } from 'react-router-dom'
import { useResetPassword } from '../../hooks/Auth/AuthHooks'
import type { ResetPasswordSchemaType } from '../../lib/validations/reset.schema'
import { toast } from 'react-hot-toast'
import { FRONTEND_ROUTES } from '../../constants/frontendRoutes'
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { useEffect } from 'react'

export const ResetPassword = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const { mutate: resetPassword, isPending } = useResetPassword()
    const email = location.state?.email

    useEffect(() => {
        if (!email) {
            toast.error("Invalid session. Please try again.")
            navigate(FRONTEND_ROUTES.FORGOT_PASSWORD)
        }
    }, [email, navigate])

    const handleResetPassword = (data: ResetPasswordSchemaType) => {
        if (!email) return;

        resetPassword({ ...data, email }, {
            onSuccess: () => {
                toast.success("Password changed successfully!")
                navigate(FRONTEND_ROUTES.LOGIN)
            },
            onError: (error) => {
                console.error("Reset Password failed:", error)
                toast.error("Reset Password failed. Please try again.")
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
                        <CardTitle className="text-3xl font-extrabold tracking-tight text-white mb-1 font-display leading-tight">
                            ProJexa
                        </CardTitle>
                        <h2 className="text-xl font-bold text-zinc-100 tracking-tight leading-tight">
                            Reset Password
                        </h2>
                        <p className="text-zinc-500 text-xs font-medium">
                            Enter your new password below
                        </p>
                    </CardHeader>

                    <CardContent className="space-y-4 px-8 pb-8 pt-4">
                        <ResetPasswordForm onSubmit={handleResetPassword} loading={isPending} />
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
