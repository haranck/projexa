import { useNavigate } from "react-router-dom"
import ForgotPasswordForm from "@/components/Auth/ForgotPasswordForm"
import { useForgotPassword } from "@/hooks/Auth/AuthHooks"

export const ForgotPassword = () => {
    const navigate = useNavigate()
    const { mutate: forgotPassword, isLoading } = useForgotPassword()

    const handleForgotPassword = (email: string) => {
        forgotPassword(email, {
            onSuccess: () => {
                
            }
        })
    }

    return (
        <div>ForgotPassword</div>
    )
}
