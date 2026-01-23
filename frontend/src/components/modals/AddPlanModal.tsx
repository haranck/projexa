import { X, Plus, Trash2, Loader2, Sparkles, Users, Layers, ShieldCheck, DollarSign, Calendar } from "lucide-react"
import { useState, useEffect } from "react"
import toast from "react-hot-toast"
import { useCreatePlan, useUpdatePlan } from "@/hooks/Admin/AdminHooks"
import { getErrorMessage } from "@/utils/errorHandler";

interface Plan {
    id: string;
    _id?: string;
    name: string;
    price: number;
    interval: string;
    maxMembers: number;
    maxProjects: number;
    features: string[];
    isActive: boolean;
}

interface AddPlanModalProps {
    isOpen: boolean;
    onClose: () => void;
    plan?: Plan;
}

export const AddPlanModal = ({ isOpen, onClose, plan }: AddPlanModalProps) => {
    const { mutateAsync: createPlan } = useCreatePlan()
    const { mutateAsync: updatePlan } = useUpdatePlan()
    const [isLoading, setIsLoading] = useState(false)
    const [features, setFeatures] = useState<string[]>([""])
    const [formData, setFormData] = useState({
        name: "",
        price: "",
        interval: "MONTHLY",
        maxMembers: "",
        maxProjects: "",
    })

    useEffect(() => {
        if (plan && isOpen) {
            setFormData({
                name: plan.name,
                price: plan.price.toString(),
                interval: plan.interval.toUpperCase(),
                maxMembers: plan.maxMembers.toString(),
                maxProjects: plan.maxProjects.toString(),
            })
            setFeatures(plan.features.length > 0 ? plan.features : [""])
        } else if (!plan && isOpen) {
            setFormData({
                name: "",
                price: "",
                interval: "MONTHLY",
                maxMembers: "",
                maxProjects: "",
            })
            setFeatures([""])
        }
    }, [plan, isOpen])

    if (!isOpen) return null

    const handleAddFeature = () => setFeatures([...features, ""])
    const handleRemoveFeature = (index: number) => {
        if (features.length > 1) {
            setFeatures(features.filter((_, i) => i !== index))
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        try {
            const payload = {
                name: formData.name,
                price: formData.price,
                interval: formData.interval,
                features: features.filter(f => f.trim() !== ""),
                maxMembers: Number(formData.maxMembers),
                maxProjects: Number(formData.maxProjects),
            }

            if (plan) {
                await updatePlan({
                    planId: plan.id || plan._id!,
                    ...payload,
                    isActive: plan.isActive
                })
                toast.success("Plan updated successfully")
            } else {
                await createPlan(payload)
                toast.success("Plan created successfully")
            }
            onClose()
        } catch (error) {
            toast.error(getErrorMessage(error, `Failed to ${plan ? 'update' : 'create'} plan`));
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

            <div className="relative w-full max-w-lg bg-[#0d0d0d] border border-white/5 rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="absolute top-0 inset-x-0 h-32 bg-linear-to-b from-blue-500/10 to-transparent pointer-events-none" />

                <div className="relative p-7">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-xl font-black text-white tracking-tight">{plan ? 'Update' : 'Create'} <span className="text-blue-500">Tier</span></h2>
                            <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mt-1">Configure plan parameters</p>
                        </div>
                        <button onClick={onClose} className="h-9 w-9 rounded-full hover:bg-white/5 flex items-center justify-center text-zinc-500 hover:text-white transition-colors">
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                            {/* Plan Name */}
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Plan Name</label>
                                <div className="relative group">
                                    <Sparkles className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600 group-focus-within:text-blue-500 transition-colors" />
                                    <input
                                        required
                                        type="text"
                                        placeholder="e.g. Professional"
                                        className="w-full bg-zinc-900/50 border border-white/5 rounded-2xl pl-11 pr-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all placeholder:text-zinc-700"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                            </div>

                            {/* Pricing & Interval */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Price ($)</label>
                                    <div className="relative group">
                                        <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600 group-focus-within:text-blue-500 transition-colors" />
                                        <input
                                            required
                                            type="number"
                                            placeholder="0"
                                            className="w-full bg-zinc-900/50 border border-white/5 rounded-2xl pl-11 pr-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all"
                                            value={formData.price}
                                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Billing</label>
                                    <div className="relative group">
                                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600 group-focus-within:text-blue-500 pointer-events-none transition-colors" />
                                        <select
                                            className="w-full bg-zinc-900/50 border border-white/5 rounded-2xl pl-11 pr-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all appearance-none cursor-pointer"
                                            value={formData.interval}
                                            onChange={(e) => setFormData({ ...formData, interval: e.target.value })}
                                        >
                                            <option value="MONTHLY">Monthly</option>
                                            <option value="YEARLY">Yearly</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Limits */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Max Members</label>
                                    <div className="relative group">
                                        <Users className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600 group-focus-within:text-blue-500 transition-colors" />
                                        <input
                                            required
                                            type="number"
                                            placeholder="Unlimited = -1"
                                            className="w-full bg-zinc-900/50 border border-white/5 rounded-2xl pl-11 pr-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all"
                                            value={formData.maxMembers}
                                            onChange={(e) => setFormData({ ...formData, maxMembers: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Max Projects</label>
                                    <div className="relative group">
                                        <Layers className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600 group-focus-within:text-blue-500 transition-colors" />
                                        <input
                                            required
                                            type="number"
                                            placeholder="Unlimited = -1"
                                            className="w-full bg-zinc-900/50 border border-white/5 rounded-2xl pl-11 pr-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all"
                                            value={formData.maxProjects}
                                            onChange={(e) => setFormData({ ...formData, maxProjects: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Features */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between ml-1">
                                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                                        <ShieldCheck className="h-3 w-3" /> Features
                                    </label>
                                    <button
                                        type="button"
                                        onClick={handleAddFeature}
                                        className="text-[10px] font-black text-blue-500 hover:text-blue-400 uppercase tracking-widest transition-colors flex items-center gap-1"
                                    >
                                        <Plus className="h-3 w-3" /> Add
                                    </button>
                                </div>
                                <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1 custom-scrollbar">
                                    {features.map((feature, index) => (
                                        <div key={index} className="flex gap-2 group/feat">
                                            <input
                                                required
                                                type="text"
                                                placeholder={`Access to ${index === 0 ? 'premium tools' : 'feature ' + (index + 1)}`}
                                                className="flex-1 bg-zinc-900/30 border border-white/5 rounded-xl px-4 py-2.5 text-xs text-zinc-300 focus:outline-none focus:border-blue-500/30 transition-all placeholder:text-zinc-700"
                                                value={feature}
                                                onChange={(e) => {
                                                    const newFeatures = [...features]
                                                    newFeatures[index] = e.target.value
                                                    setFeatures(newFeatures)
                                                }}
                                            />
                                            {features.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveFeature(index)}
                                                    className="px-2 rounded-xl hover:bg-red-500/10 text-zinc-600 hover:text-red-500 transition-all"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="pt-2 flex gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 px-6 py-3.5 rounded-2xl text-xs font-bold text-zinc-500 hover:text-white hover:bg-white/5 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="flex-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-2xl text-xs font-black uppercase tracking-widest py-3.5 shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
                            >
                                {isLoading ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <Sparkles className="h-4 w-4" />
                                )}
                                {plan ? 'Confirm Update' : 'Confirm Tier'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
