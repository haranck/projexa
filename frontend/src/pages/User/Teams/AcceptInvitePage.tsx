import React, { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useAcceptInvite, useCompleteProfile } from '../../../hooks/Workspace/WorkspaceHooks'
import { useDispatch } from 'react-redux'
import { setAccessToken } from '../../../store/slice/tokenSlice'
import { setAuthUser } from '../../../store/slice/authSlice'
import type { AuthUser } from '../../../store/slice/authSlice'
import { FRONTEND_ROUTES } from '../../../constants/frontendRoutes'
import { toast } from 'react-hot-toast'
import { Loader2, User, Lock, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react'
import type { AcceptInviteResponseDTO } from '../../../types/invite'
import { getErrorMessage } from '@/utils/errorHandler'

interface AcceptInviteAPIResponse {
    message: string;
    data: AcceptInviteResponseDTO;
}

interface CompleteProfileAPIResponse {
    message: string;
    data: AcceptInviteResponseDTO['user'];
}

export const AcceptInvitePage = () => {
    const [searchParams] = useSearchParams()
    const token = searchParams.get('token')
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const [showProfileForm, setShowProfileForm] = useState(false)
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        password: ''
    })

    const { data: inviteResponse, isLoading: isInviting, isError: inviteError } = useAcceptInvite(token || '')
    const { mutate: completeProfile, isPending: isCompleting } = useCompleteProfile()

    useEffect(() => {
        const inviteData = inviteResponse as unknown as AcceptInviteAPIResponse;
        if (inviteData?.data) {
            const data = inviteData.data
            // Save tokens immediately
            dispatch(setAccessToken(data.accessToken))

            // Check if profile is complete (strictly check if firstName and lastName exist)
            const user = data.user
            if (!user.firstName || !user.lastName) {
                setShowProfileForm(true)
            } else {
                handleSuccess(user as AuthUser)
            }
        }
    }, [inviteResponse, dispatch])

    const handleSuccess = (user: Partial<AuthUser>) => {
        // Ensure user matches AuthUser interface
        const authUser: AuthUser = {
            id: user.id || '',
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            email: user.email || '',
            phone: user.phone || '',
            isEmailVerified: user.isEmailVerified ?? true,
            avatarUrl: user.avatarUrl,
            hasWorkspace: true
        }
        dispatch(setAuthUser(authUser))
        toast.success("Joined workspace successfully!")
        navigate(FRONTEND_ROUTES.HOME)
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!formData.firstName || !formData.lastName || !formData.password) {
            toast.error("Please fill all fields")
            return
        }

        const loadingToast = toast.loading("Completing your profile...")
        completeProfile(formData, {
            onSuccess: (response: unknown) => {
                toast.dismiss(loadingToast)
                const apiResponse = response as CompleteProfileAPIResponse;
                handleSuccess(apiResponse.data)
            },
            onError: (err: unknown) => {
                const error =  getErrorMessage(err)
                console.log(error)
                toast.dismiss(loadingToast)
                toast.error(error || "Failed to complete profile")
            }
        })
    }

    if (isInviting) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground space-y-6">
                <div className="relative">
                    <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-150 animate-pulse" />
                    <Loader2 className="w-16 h-16 animate-spin text-primary relative z-10" />
                </div>
                <div className="text-center space-y-2">
                    <h2 className="text-xl font-semibold tracking-tight">Validating Invitation</h2>
                    <p className="text-muted-foreground animate-pulse">Checking your access to the workspace...</p>
                </div>
            </div>
        )
    }

    if (inviteError || !token) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-background p-6">
                <div className="w-full max-w-md glass-card p-10 text-center space-y-6 animate-fade-in">
                    <div className="mx-auto w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center">
                        <AlertCircle className="w-8 h-8 text-destructive" />
                    </div>
                    <div className="space-y-2">
                        <h1 className="text-2xl font-bold tracking-tight">Access Denied</h1>
                        <p className="text-muted-foreground">
                            This invitation link is either invalid, expired, or has already been used.
                        </p>
                    </div>
                    <button
                        onClick={() => navigate(FRONTEND_ROUTES.LOGIN)}
                        className="w-full btn-gradient py-3.5 rounded-xl font-medium flex items-center justify-center gap-2 group"
                    >
                        Back to Login
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </button>
                </div>
            </div>
        )
    }

    if (showProfileForm) {
        return (
            <div className="flex items-center justify-center min-h-screen p-6 bg-background relative overflow-hidden">
                {/* Background ambient glow */}
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 blur-[100px] rounded-full" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/5 blur-[100px] rounded-full" />

                <div className="w-full max-w-md space-y-8 relative z-10 animate-fade-in">
                    <div className="text-center space-y-3">
                        <div className="inline-flex items-center justify-center px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-xs font-semibold text-primary uppercase tracking-wider mb-2">
                            Invitaton Accepted
                        </div>
                        <h1 className="text-4xl font-extrabold tracking-tight text-foreground">Welcome to ProjeXa</h1>
                        <p className="text-muted-foreground text-lg">Set up your profile to jump right into the workspace</p>
                    </div>

                    <div className="glass-card p-8 rounded-3xl space-y-8">
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">First Name</label>
                                    <div className="relative group">
                                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-primary transition-colors" />
                                        <input
                                            type="text"
                                            value={formData.firstName}
                                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                            className="w-full pl-11 pr-4 py-3.5 input-dark rounded-2xl outline-none"
                                            placeholder="John"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Last Name</label>
                                    <div className="relative group">
                                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-primary transition-colors" />
                                        <input
                                            type="text"
                                            value={formData.lastName}
                                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                            className="w-full pl-11 pr-4 py-3.5 input-dark rounded-2xl outline-none"
                                            placeholder="Doe"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Create Password</label>
                                <div className="relative group">
                                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-primary transition-colors" />
                                    <input
                                        type="password"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className="w-full pl-11 pr-4 py-3.5 input-dark rounded-2xl outline-none"
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>
                                <p className="text-[10px] text-muted-foreground ml-1 italic">
                                    Minimum 8 characters with at least one number.
                                </p>
                            </div>

                            <button
                                type="submit"
                                disabled={isCompleting}
                                className="w-full py-4 btn-gradient rounded-2xl font-bold flex items-center justify-center gap-3 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
                            >
                                {isCompleting ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <>
                                        Complete & Join Workspace
                                        <CheckCircle2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="pt-4 text-center">
                            <p className="text-zinc-500 text-sm">
                                By joining, you agree to ProjeXa&apos;s <span className="link-accent cursor-pointer">Terms of Service</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return null
}
