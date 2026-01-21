import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { useUpdateProfile } from "@/hooks/User/UserHooks";
import { setAuthUser } from "@/store/slice/authSlice";
import { User, Phone, Mail, Loader2, X, Edit3, CheckCircle2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { getErrorMessage } from "@/utils/errorHandler";

interface EditProfileModalProps {
    open: boolean;
    onClose: () => void;
}

export default function EditProfileModal({ open, onClose }: EditProfileModalProps) {
    const dispatch = useDispatch();
    const user = useSelector((state: RootState) => state.auth.user);

    const [form, setForm] = useState({
        firstName: user?.firstName || "",
        lastName: user?.lastName || "",
        phone: user?.phone || ""
    });

    const [isSuccess, setIsSuccess] = useState(false);

    // Sync form with user data when modal opens
    useEffect(() => {
        if (open && user) {
            setForm({
                firstName: user.firstName,
                lastName: user.lastName,
                phone: user.phone
            });
            setIsSuccess(false);
        }
    }, [open, user]);

    const { mutate: updateProfile, isPending } = useUpdateProfile();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!form.firstName.trim() || !form.lastName.trim()) {
            toast.error("Name fields cannot be empty");
            return;
        }

        updateProfile({
            firstName: form.firstName,
            lastName: form.lastName,
            phoneNumber: form.phone 
        }, {
            onSuccess: () => {
                if (user) {
                    dispatch(setAuthUser({
                        ...user,
                        firstName: form.firstName,
                        lastName: form.lastName,
                        phone: form.phone
                    }));
                }
                setIsSuccess(true);
                toast.success("Profile updated successfully");
                setTimeout(onClose, 1500);
            },
            onError: (error) => {
                toast.error(getErrorMessage(error, "Failed to update profile"));
            }
        });
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            <div className="relative w-full max-w-[450px] bg-zinc-950 border border-white/10 rounded-[2rem] p-8 shadow-2xl overflow-hidden group">
                {/* Visual Glows */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/10 blur-[80px] group-hover:bg-blue-500/20 transition-all duration-700" />
                <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-purple-500/10 blur-[80px] group-hover:bg-purple-500/20 transition-all duration-700" />

                <button
                    onClick={onClose}
                    className="absolute right-6 top-6 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-500 hover:text-white transition-all border border-white/5 z-10"
                >
                    <X className="w-4 h-4" />
                </button>

                {isSuccess ? (
                    <div className="py-8 text-center space-y-4 animate-in fade-in zoom-in duration-300">
                        <div className="mx-auto w-16 h-16 rounded-3xl bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                            <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-xl font-bold text-white">Profile Updated!</h3>
                            <p className="text-zinc-500 text-sm">Your changes have been saved successfully.</p>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                        <div className="text-center space-y-2">
                            <div className="mx-auto w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                                <Edit3 className="w-6 h-6 text-blue-500" />
                            </div>
                            <h2 className="text-xl font-bold text-white">Edit Profile</h2>
                            <p className="text-zinc-500 text-sm">Update your personal information below</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">First Name</label>
                                    <div className="relative group">
                                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-blue-500 transition-colors" />
                                        <input
                                            name="firstName"
                                            type="text"
                                            placeholder="First Name"
                                            className="w-full bg-zinc-900/50 border border-white/5 rounded-xl px-10 py-3 text-sm focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all placeholder:text-zinc-600"
                                            value={form.firstName}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Last Name</label>
                                    <div className="relative group">
                                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-blue-500 transition-colors" />
                                        <input
                                            name="lastName"
                                            type="text"
                                            placeholder="Last Name"
                                            className="w-full bg-zinc-900/50 border border-white/5 rounded-xl px-10 py-3 text-sm focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all placeholder:text-zinc-600"
                                            value={form.lastName}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Email Address</label>
                                <div className="relative group opacity-60">
                                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                                    <input
                                        type="email"
                                        disabled
                                        className="w-full bg-zinc-900/50 border border-white/5 rounded-xl px-10 py-3 text-sm cursor-not-allowed outline-none transition-all"
                                        value={user?.email || ""}
                                    />
                                </div>
                                <p className="text-[10px] text-zinc-600 ml-1 italic">* Email cannot be changed</p>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Phone Number</label>
                                <div className="relative group">
                                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-blue-500 transition-colors" />
                                    <input
                                        name="phone"
                                        type="tel"
                                        placeholder="Phone Number"
                                        className="w-full bg-zinc-900/50 border border-white/5 rounded-xl px-10 py-3 text-sm focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all placeholder:text-zinc-600"
                                        value={form.phone}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isPending}
                                className="w-full mt-4 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 text-white py-3 rounded-xl font-bold text-sm transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2"
                            >
                                {isPending ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Updating Profile...
                                    </>
                                ) : "Save Changes"}
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}
