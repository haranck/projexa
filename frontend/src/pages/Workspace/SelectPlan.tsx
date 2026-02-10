import { useLocation, useNavigate } from "react-router-dom"
import { useState } from "react"
import { useGetPlans, useCreateCheckoutSession, useUpgradePlan } from "@/hooks/Workspace/WorkspaceHooks"
import { Package, Check, Loader2, ArrowRight } from "lucide-react"
import { toast } from "react-hot-toast"
import { FRONTEND_ROUTES } from "@/constants/frontendRoutes"
import { getErrorMessage } from "@/utils/errorHandler"

interface Plan {
    id: string;
    _id?: string;
    name: string;
    price: number;
    interval: 'monthly' | 'yearly';
    maxMembers: number;
    maxProjects: number;
    features: string[];
    isActive: boolean;
}

export const SelectPlan = () => {
    const { state } = useLocation()
    const navigate = useNavigate()

    const workspaceName = state?.workspaceName
    const workspaceId = state?.workspaceId
    const isUpgrade = state?.isUpgrade || false

    const { data, isLoading } = useGetPlans()
    const { mutate: createCheckout, isPending: isCheckoutPending } = useCreateCheckoutSession()
    const { mutate: upgradePlan } = useUpgradePlan()

    const [selectedPlanId, setSelectedPlanId] = useState<string>("")

    if (!workspaceName) {
        navigate(FRONTEND_ROUTES.WORKSPACE.CREATE_WORKSPACE)
        return null
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center space-y-4">
                <Loader2 className="h-10 w-10 animate-spin text-[#00ff88]" />
                <p className="text-zinc-400 font-medium animate-pulse tracking-wide">Fetching subscription tiers...</p>
            </div>
        )
    }

    const plans = data?.plans || []

    const handleSelectPlan = (plan: Plan) => {
        const planId = plan.id || plan._id || ""
        setSelectedPlanId(planId)

        if (isUpgrade && workspaceId) {
            upgradePlan({ workspaceId, newPriceId: planId }, {
                onSuccess: (res: unknown) => {
                    toast.success("Redirecting to payment...")
                    const response = res as { data: string };
                    if (response?.data) {
                        window.location.href = response.data
                    } else {
                        toast.error("Failed to initiate upgrade")
                    }
                },
                onError: (error: unknown) => {
                    const err = getErrorMessage(error)
                    console.error("Upgrade Plan Failed:", err)
                    toast.error(err)
                    setSelectedPlanId("")
                }
            })
            return;
        }

        createCheckout(
            {
                workspaceName,
                planId,
                successUrl: `${window.location.origin}${FRONTEND_ROUTES.WORKSPACE.PAYMENT_SUCCESS}`,
                cancelUrl: `${window.location.origin}${FRONTEND_ROUTES.WORKSPACE.PAYMENT_CANCEL}`
            },
            {
                onSuccess: (res) => {
                    if (res?.data) {
                        window.location.href = res.data
                    } else {
                        console.error("Invalid response from checkout session:", res);
                        toast.error("Failed to create checkout session")
                    }
                },
                onError: (error: unknown) => {
                    console.error("Select Plan Failed:", error)
                    toast.error("Failed to select plan. Please try again.")
                    setSelectedPlanId("")
                }
            }
        )
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a] p-8 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 relative overflow-hidden">
            {/* Background Glows */}
            <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[20%] right-[-10%] w-[60%] h-[60%] bg-[#00ff88]/10 rounded-full blur-[140px]" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto space-y-12">
                {/* Header */}
                <div className="flex flex-col items-center text-center space-y-4">
                    <div className="flex items-center gap-2 mb-1">
                        <div className="p-1.5 bg-[#00ff88]/10 rounded-lg">
                            <Package className="h-4 w-4 text-[#00ff88]" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#00ff88]/80">Step 2: Choose Your Power</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white max-w-2xl leading-tight">
                        Select a plan for <span className="text-[#00ff88]">{workspaceName}</span>
                    </h1>
                    <p className="text-zinc-500 font-medium max-w-lg leading-relaxed">
                        Scale your team with the perfect infrastructure. Choose a tier that fits your needs.
                    </p>
                </div>

                {plans.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 bg-[#0d0d0d] rounded-[2.5rem] border border-white/5 border-dashed space-y-6">
                        <p className="text-zinc-300 font-bold text-lg">No Plans Available</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-12">
                        {plans.map((plan: Plan) => (
                            <div
                                key={plan.id || plan._id}
                                className={`
                                    relative group bg-[#0d0d0d] rounded-[2.5rem] p-8 
                                    transition-all duration-500 hover:-translate-y-2 
                                    border ${plan.isActive ? 'border-zinc-800' : 'border-red-500/20 opacity-75'}
                                    hover:border-[#00ff88]/30 hover:shadow-[0_0_40px_rgba(0,255,136,0.05)]
                                    flex flex-col
                                `}
                            >
                                {plan.price > 1000 && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-[#00ff88] rounded-full text-black text-[10px] font-black uppercase tracking-widest shadow-[0_0_20px_rgba(0,255,136,0.4)]">
                                        Most Popular
                                    </div>
                                )}

                                <div className="space-y-6 flex-1">
                                    <div className="space-y-2">
                                        <h3 className="text-xl font-black text-zinc-100 uppercase tracking-[0.15em] leading-tight group-hover:text-[#00ff88] transition-colors">
                                            {plan.name}
                                        </h3>
                                        <div className="flex items-baseline gap-1.5">
                                            <span className="text-4xl font-black text-white">₹{plan.price}</span>
                                            <span className="text-zinc-500 text-xs font-bold tracking-widest uppercase opacity-60">/{plan.interval}</span>
                                        </div>
                                    </div>

                                    <div className="space-y-4 pt-6 border-t border-white/5">
                                        <div className="flex justify-between items-center group/item text-sm">
                                            <span className="text-zinc-500 text-[10px] font-black uppercase tracking-widest group-hover/item:text-zinc-300 transition-colors">Max Members</span>
                                            <span className="text-zinc-100 font-bold">{plan.maxMembers === -1 ? 'Unlimited' : plan.maxMembers}</span>
                                        </div>
                                        <div className="flex justify-between items-center group/item text-sm">
                                            <span className="text-zinc-500 text-[10px] font-black uppercase tracking-widest group-hover/item:text-zinc-300 transition-colors">Max Projects</span>
                                            <span className="text-zinc-100 font-bold">{plan.maxProjects === -1 ? 'Unlimited' : plan.maxProjects}</span>
                                        </div>
                                    </div>

                                    <div className="space-y-4 pt-6 border-t border-white/5">
                                        <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] mb-4">Plan Highlights</p>
                                        <div className="space-y-3.5">
                                            {plan.features.slice(0, 5).map((feature, index) => (
                                                <div key={index} className="flex items-center gap-3.5 group/feature">
                                                    <div className="shrink-0 w-5 h-5 rounded-full bg-[#00ff88]/5 border border-[#00ff88]/10 flex items-center justify-center group-hover/feature:border-[#00ff88]/40 transition-all duration-300">
                                                        <Check className="h-3 w-3 text-[#00ff88]" />
                                                    </div>
                                                    <span className="text-sm font-medium text-zinc-400 group-hover/feature:text-zinc-200 transition-colors line-clamp-1">{feature}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <button
                                    disabled={isCheckoutPending}
                                    onClick={() => handleSelectPlan(plan)}
                                    className="w-full mt-8 bg-zinc-900 hover:bg-[#00ff88] text-white hover:text-black py-4 rounded-2xl font-bold border border-white/5 transition-all duration-500 active:scale-95 flex items-center justify-center gap-2 group/btn disabled:opacity-50"
                                >
                                    {isCheckoutPending && selectedPlanId === (plan.id || plan._id) ? (
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                    ) : (
                                        <>
                                            {isCheckoutPending ? "Processing..." : "Choose Plan"}
                                            {!isCheckoutPending && <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />}
                                        </>
                                    )}
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
