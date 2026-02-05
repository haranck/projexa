import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { FRONTEND_ROUTES } from "@/constants/frontendRoutes"
import { Check, Sparkles, ArrowRight } from "lucide-react"

export const PaymentSuccess = () => {
  const navigate = useNavigate()
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // Progress bar animation
    const interval = setInterval(() => {
      setProgress((prev) => Math.min(prev + 2, 100))
    }, 60)

    const timer = setTimeout(() => {
      navigate(FRONTEND_ROUTES.HOME)
    }, 3500)

    return () => {
      clearTimeout(timer)
      clearInterval(interval)
    }
  }, [navigate])

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 flex flex-col items-center animate-in fade-in zoom-in duration-700">
        {/* Success Icon */}
        <div className="relative mb-8 group">
          <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-xl animate-pulse" />
          <div className="relative w-24 h-24 bg-emerald-500/10 rounded-full border border-emerald-500/20 flex items-center justify-center">
            <Check className="w-12 h-12 text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.5)]" />
          </div>
          <div className="absolute -top-2 -right-2 bg-[#0a0a0a] border border-white/10 p-2 rounded-full animate-bounce delay-100">
            <Sparkles className="w-5 h-5 text-yellow-400 fill-yellow-400" />
          </div>
        </div>

        {/* Content */}
        <div className="text-center space-y-4 max-w-md px-6">
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight bg-clip-text  bg-linear-to-b from-white to-zinc-400">
            Payment Successful
          </h1>
          <p className="text-zinc-400 text-lg leading-relaxed">
            Your workspace has been successfully activated. Were setting everything up for you.
          </p>
        </div>

        {/* Action Card */}
        <div className="mt-12 p-1 rounded-2xl bg-linear-to-b from-white/10 to-transparent w-full max-w-sm mx-4">
          <div className="bg-[#141414] rounded-xl p-6 border border-white/5 space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-medium text-zinc-500 uppercase tracking-wider">
                <span>Redirecting</span>
                <span>{progress}%</span>
              </div>
              <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-linear-to-r from-blue-500 to-emerald-500 transition-all duration-100 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <button
              onClick={() => navigate(FRONTEND_ROUTES.PROFILE)}
              className="w-full group flex items-center justify-center gap-2 px-4 py-3 bg-white text-black rounded-lg font-semibold hover:bg-zinc-200 transition-colors"
            >
              <span>Go to Profile</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
