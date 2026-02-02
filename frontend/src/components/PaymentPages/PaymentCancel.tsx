import { useNavigate } from "react-router-dom"
import { X, ShieldAlert, ArrowLeft } from "lucide-react"
import { FRONTEND_ROUTES } from "@/constants/frontendRoutes"

export const PaymentCancel = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 flex flex-col items-center animate-in fade-in zoom-in duration-500">
        {/* Cancel Icon */}
        <div className="relative mb-8 group">
          <div className="absolute inset-0 bg-red-500/20 rounded-full blur-xl" />
          <div className="relative w-24 h-24 bg-red-500/10 rounded-full border border-red-500/20 flex items-center justify-center">
            <X className="w-10 h-10 text-red-400 drop-shadow-[0_0_10px_rgba(248,113,113,0.5)]" />
          </div>
          <div className="absolute -top-2 -right-2 bg-[#0a0a0a] border border-white/10 p-2 rounded-full">
            <ShieldAlert className="w-5 h-5 text-zinc-400" />
          </div>
        </div>

        {/* Content */}
        <div className="text-center space-y-4 max-w-md px-6">
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
            Payment Cancelled 
          </h1>
          <p className="text-zinc-400 text-lg leading-relaxed">
            No worries! No charges were made. You can choose a plan whenever youre ready.
          </p>
        </div>

        {/* Action Card */}
        <div className="mt-12 p-1 rounded-2xl bg-linear-to-b from-white/10 to-transparent w-full max-w-sm mx-4">
          <div className="bg-[#141414] rounded-xl p-6 border border-white/5 space-y-4">
            <button
              onClick={() => navigate(-1)}
              className="w-full group flex items-center justify-center gap-2 px-4 py-3 bg-white text-black rounded-lg font-semibold hover:bg-zinc-200 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span>Return to Plans</span>
            </button>

            <button
              onClick={() => navigate(FRONTEND_ROUTES.HOME)}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-transparent text-zinc-400 hover:text-white rounded-lg font-medium transition-colors text-sm"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
