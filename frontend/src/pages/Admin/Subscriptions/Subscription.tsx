import { Plus, Check, Layout, Package, Sparkles, Loader2 } from "lucide-react"
import { useState } from "react"
import { AddPlanModal } from "@/components/modals/AddPlanModal"
import { useGetPlans } from "@/hooks/Admin/AdminHooks"

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

export const Subscription = () => {
    const { data, isLoading } = useGetPlans()
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)

    if (isLoading) {
        return (
            <div className="flex h-[60vh] flex-col items-center justify-center space-y-4">
                <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
                <p className="text-zinc-400 font-medium animate-pulse tracking-wide">Fetching subscription tiers...</p>
            </div>
        )
    }

    const plans = data?.data?.data || []

    return (
        <div className="p-8 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-1.5">
                    <div className="flex items-center gap-2 mb-1">
                        <div className="p-1.5 bg-blue-500/10 rounded-lg">
                            <Package className="h-4 w-4 text-blue-500" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500/80">Subscription Management</span>
                    </div>
                    <h1 className="text-4xl font-extrabold tracking-tight text-white">Platform <span className="text-blue-500">Plans</span></h1>
                    <p className="text-zinc-500 font-medium max-w-lg leading-relaxed">
                        Strategize and manage scalable pricing structures for different team sizes.
                    </p>
                </div>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center gap-2.5 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-2xl font-bold transition-all duration-300 shadow-lg shadow-blue-600/20 active:scale-95 border border-blue-400/20 group"
                >
                    <Plus className="h-5 w-5 group-hover:rotate-90 transition-transform duration-300" />
                    New Subscription
                </button>
            </div>

            {plans.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 bg-[#0d0d0d] rounded-[2.5rem] border border-white/5 border-dashed space-y-6">
                    <div className="p-5 bg-zinc-900/50 rounded-2xl border border-white/5">
                        <Layout className="h-12 w-12 text-zinc-700" />
                    </div>
                    <div className="text-center space-y-2">
                        <p className="text-zinc-300 font-bold text-lg">No Plans Available</p>
                        <p className="text-zinc-500 text-sm max-w-[280px]">Your platform doesn&apos;t have any subscription tiers yet.</p>
                    </div>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="text-blue-500 hover:text-blue-400 font-bold text-sm flex items-center gap-1.5 transition-colors"
                    >
                        Define First Tier <Plus className="h-4 w-4" />
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {plans.map((plan: Plan) => (
                        <div
                            key={plan.id || plan._id}
                            className={`
                                relative group bg-[#0d0d0d] rounded-[2.5rem] p-8 
                                transition-all duration-500 hover:-translate-y-2 
                                border ${plan.isActive ? 'border-blue-500/40 shadow-[0_0_25px_rgba(59,130,246,0.1)]' : 'border-white/5'}
                                hover:border-blue-500/30
                            `}
                        >
                            {plan.isActive && (
                                <div className="absolute top-6 right-8 px-3 py-1 bg-blue-500/10 border border-blue-500/30 rounded-full">
                                    <span className="text-[9px] font-black uppercase tracking-widest text-blue-500 flex items-center gap-1.5">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                                        Verified Tier
                                    </span>
                                </div>
                            )}

                            <div className="space-y-8 h-full flex flex-col pt-4">
                                <div className="space-y-4">
                                    <h3 className="text-xl font-black text-zinc-100 uppercase tracking-[0.15em] leading-tight">
                                        {plan.name}
                                    </h3>
                                    <div className="flex items-baseline gap-1.5">
                                        <span className="text-4xl font-black text-white">$ {plan.price}</span>
                                        <span className="text-zinc-500 text-xs font-bold tracking-widest uppercase opacity-60">/{plan.interval}</span>
                                    </div>
                                </div>

                                <div className="space-y-4 pt-8 border-t border-white/5">
                                    <div className="flex justify-between items-center group/item text-sm">
                                        <span className="text-zinc-500 text-[10px] font-black uppercase tracking-widest group-hover/item:text-zinc-300 transition-colors">Max Members</span>
                                        <span className="text-zinc-100 font-bold">{plan.maxMembers === -1 ? 'Unlimited' : plan.maxMembers}</span>
                                    </div>
                                    <div className="flex justify-between items-center group/item text-sm">
                                        <span className="text-zinc-500 text-[10px] font-black uppercase tracking-widest group-hover/item:text-zinc-300 transition-colors">Max Projects</span>
                                        <span className="text-zinc-100 font-bold">{plan.maxProjects === -1 ? 'Unlimited' : plan.maxProjects}</span>
                                    </div>
                                </div>

                                <div className="space-y-4 flex-1 pt-8 border-t border-white/5">
                                    <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] mb-4">Tier Capabilities</p>
                                    <div className="space-y-3.5">
                                        {plan.features.slice(0, 5).map((feature, index) => (
                                            <div key={index} className="flex items-center gap-3.5 group/feature">
                                                <div className="shrink-0 w-5 h-5 rounded-full bg-blue-500/5 border border-blue-500/10 flex items-center justify-center group-hover/feature:border-blue-500/40 transition-all duration-300">
                                                    <Check className="h-3 w-3 text-blue-500" />
                                                </div>
                                                <span className="text-sm font-medium text-zinc-400 group-hover/feature:text-zinc-200 transition-colors">{feature}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <button className="w-full bg-[#111] hover:bg-zinc-800 text-zinc-400 hover:text-white py-4 rounded-2xl font-bold border border-white/5 transition-all duration-300 active:scale-95 flex items-center justify-center gap-2 group/btn">
                                    Configure Tier
                                    <Sparkles className="h-3.5 w-3.5 opacity-0 group-hover/btn:opacity-100 transition-all duration-300 text-blue-400" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <AddPlanModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
            />
        </div>
    )
}


