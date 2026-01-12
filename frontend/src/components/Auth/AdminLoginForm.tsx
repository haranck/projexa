import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { toast } from 'react-hot-toast';
import { adminLoginSchema, type AdminLoginSchemaType } from "../../lib/validations/adminLogin.schema";
import { FRONTEND_ROUTES } from '../../constants/frontendRoutes';
import { useAdminLogin } from '../../hooks/Auth/AuthHooks';
import { useNavigate } from 'react-router-dom';
import { setAccessToken } from '../../store/slice/tokenSlice';
import { useDispatch } from 'react-redux';
import { setAuthUser } from '../../store/slice/authSlice';
import { ERROR_MESSAGES } from '../../constants/errorMessages';
import { Form, FormField, FormItem, FormControl, FormMessage } from '../ui/form'
import { Input } from '../ui/input'
import { Button } from '../ui/button';
import { Loader2 } from 'lucide-react';

export const AdminLoginForm = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { mutate: adminLogin, isPending: isLoggingIn } = useAdminLogin()

    const form = useForm<AdminLoginSchemaType>({
        resolver: zodResolver(adminLoginSchema),
        defaultValues: {
            email: '',
            password: ''
        }
    })

    const onSubmit = (data: AdminLoginSchemaType) => {
        adminLogin(data, {
            onSuccess: (response) => {
                if (response?.data) {
                    dispatch(setAccessToken(response.data.accessToken))
                    dispatch(setAuthUser(response.data.user))
                    toast.success("Admin login successful!")
                    navigate(FRONTEND_ROUTES.ADMIN_DASHBOARD)
                }
            },
            onError: (error) => {
                console.error("Admin Login Failed:", error)
                toast.error(ERROR_MESSAGES.INVALID_CREDENTIALS)
            }
        })
    }

    return (
        <Card className="w-full max-w-[460px] border-white/5 bg-[#141414]/80 backdrop-blur-xl shadow-[0_0_50px_rgba(0,0,0,0.5)] rounded-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-500">
            <CardHeader className="text-center pb-2 pt-8 space-y-0.5">
                <CardTitle className="flex justify-center -mt-12 -mb-12">
                    <img
                        src="/logo.png"
                        alt="ProJexa Logo"
                        className="h-28 w-auto object-contain"
                    />
                </CardTitle>
                <h2 className="text-xl font-bold text-zinc-100 tracking-tight leading-tight">
                    Admin Portal
                </h2>
                <p className="text-zinc-500 text-xs font-medium">
                    Secure access for platform administration
                </p>
            </CardHeader>

            <CardContent className="space-y-4 px-8 pb-8 pt-4">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            placeholder="Admin Email"
                                            type="email"
                                            className="h-10 bg-[#1a1a1a] border-zinc-800/80 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 rounded-xl text-xs transition-all placeholder:text-zinc-600 font-medium"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage className="text-[9px] mt-1" />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            placeholder="Admin Password"
                                            type="password"
                                            className="h-10 bg-[#1a1a1a] border-zinc-800/80 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 rounded-xl text-xs transition-all placeholder:text-zinc-600 font-medium"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage className="text-[9px] mt-1" />
                                </FormItem>
                            )}
                        />

                        <Button
                            type="submit"
                            className="w-full h-10 text-xs font-bold bg-[#4dabf7] hover:bg-[#339af0] text-white rounded-xl transition-all duration-300 shadow-[0_4px_15px_rgba(59,130,246,0.25)] hover:shadow-[0_6px_20px_rgba(59,130,246,0.35)] mt-3 active:scale-[0.98]"
                            disabled={isLoggingIn}
                        >
                            {isLoggingIn && <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />}
                            {isLoggingIn ? "Authenticating..." : "Admin Login"}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}

