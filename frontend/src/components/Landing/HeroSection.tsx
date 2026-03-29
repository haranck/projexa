import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Zap, Video, MessageSquare, Layout, CheckCircle2,type LucideIcon } from "lucide-react";
import { Button } from "../ui/button";
import { FRONTEND_ROUTES } from "../../constants/frontendRoutes";

// Mini-components for the Feature Mosaic
const FeatureCard = ({ title, icon: Icon, children, className = "" }: { title: string, icon: LucideIcon, children: React.ReactNode, className?: string }) => (
  <div className={`bg-zinc-900/60 backdrop-blur-2xl border border-white/5 rounded-[2rem] p-6 shadow-2xl transition-all hover:border-indigo-500/20 group hover:bg-zinc-900/80 ${className}`}>
    <div className="flex items-center gap-4 mb-5">
      <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
        <Icon className="w-5 h-5 text-indigo-400" />
      </div>
      <span className="text-white text-base font-bold tracking-tight">{title}</span>
    </div>
    {children}
  </div>
);

const HeroSection = () => {
  return (
    <section className="relative pt-32 pb-32 overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
        <div className="absolute top-[-15%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/15 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[10%] right-[-15%] w-[40%] h-[40%] bg-cyan-500/10 blur-[100px] rounded-full animate-pulse delay-700" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Messaging Section */}
        <div className="text-center space-y-10 mb-24 max-w-4xl mx-auto">
          {/* Enhanced Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-zinc-300 text-xs font-semibold animate-in fade-in slide-in-from-bottom-2 duration-700">
            <span className="flex h-1.5 w-1.5 rounded-full bg-indigo-400 animate-ping" />
            <Sparkles className="w-3 h-3 text-indigo-400" />
            <span className="tracking-widest uppercase">New: AI-Native Workflow</span>
          </div>

          {/* Heading */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-white leading-[0.95] animate-in fade-in slide-in-from-bottom-4 duration-1000">
            Reimagine How Your <br />
            <span className="bg-linear-to-r from-indigo-400 via-cyan-300 to-indigo-500 bg-clip-text text-transparent">
              Team Ships.
            </span>
          </h1>

          {/* Subheading */}
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-zinc-400 leading-relaxed animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-200">
            The world&apos;s most intelligent platform for engineering teams to plan, 
            track, and accelerate cycles with real-time AI insights.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
            <Link to={FRONTEND_ROUTES.SIGNUP}>
              <Button className="h-14 px-10 text-lg font-bold bg-white text-black hover:bg-zinc-200 rounded-2xl shadow-xl shadow-white/5 transition-all hover:scale-105 active:scale-95 group overflow-hidden relative">
                <span className="relative z-10 flex items-center">
                  Get Started Free
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Button>
            </Link>
            <Button variant="ghost" className="h-14 px-8 text-lg font-semibold text-white hover:bg-white/5 border border-white/10 rounded-2xl transition-all">
              Watch Demo
            </Button>
          </div>
        </div>

        {/* Feature Mosaic Reveal (Mobile: Stacked | Desktop: Professional Mosaic) */}
        <div className="relative mt-24 max-w-6xl mx-auto flex flex-col lg:block gap-8 lg:h-[650px] animate-in fade-in zoom-in duration-1000 delay-500">
          
          {/* 1. Scrum Board (Anchor) */}
          <FeatureCard 
            title="Agile Scrum" 
            icon={Layout}
            className="lg:absolute lg:top-[15%] lg:left-1/2 lg:-translate-x-1/2 w-full lg:max-w-[650px] z-10 shadow-indigo-500/5 order-2 lg:order-none"
          >
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="h-2.5 bg-indigo-500/30 rounded-full w-32"></div>
                <div className="h-2.5 bg-white/5 rounded-full w-16"></div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: "API Design", status: "In Progress", color: "bg-indigo-400" },
                  { label: "User Auth", status: "Done", color: "bg-emerald-400" },
                  { label: "Deployment", status: "Review", color: "bg-amber-400", hideOnMobile: true },
                  { label: "CI/CD Setup", status: "Backlog", color: "bg-zinc-600", hideOnMobile: true }
                ].map((task, i) => (
                  <div key={i} className={`bg-white/5 rounded-2xl p-4 border border-white/5 hover:border-white/10 transition-colors ${task.hideOnMobile ? 'hidden sm:block' : ''}`}>
                    <div className="text-[10px] text-zinc-500 mb-2 font-black uppercase tracking-wider">{task.status}</div>
                    <div className="text-sm text-white font-bold mb-3">{task.label}</div>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${task.color} shadow-sm shadow-black/50`}></div>
                      <div className="h-1.5 bg-white/10 rounded-full flex-1"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </FeatureCard>

          {/* 2. AI Video Summary (Top Right) */}
          <FeatureCard 
            title="AI Meetings" 
            icon={Video}
            className="lg:absolute lg:top-0 lg:right-0 w-full lg:w-[340px] z-20 shadow-2xl lg:animate-float order-1 lg:order-none"
          >
            <div className="bg-linear-to-br from-indigo-500/10 to-purple-500/10 rounded-2xl p-4 border border-indigo-500/20 relative overflow-hidden">
               <div className="flex items-center gap-2.5 mb-3">
                 <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse shadow-sm shadow-red-500/50"></div>
                 <span className="text-xs text-white/50 font-bold">Session Recording...</span>
               </div>
               <div className="text-xs text-white font-black mb-3 uppercase tracking-tight">AI Summary Intelligence:</div>
               <div className="space-y-3">
                 <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5" />
                    <div className="text-[11px] text-zinc-400 leading-normal font-medium">Sprint goals finalized for Q3 release.</div>
                 </div>
                 <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5" />
                    <div className="text-[11px] text-zinc-400 leading-normal font-medium">Assigned DB schema to <span className="text-indigo-300">@Liam</span>.</div>
                 </div>
               </div>
               <div className="mt-4 pt-3 border-t border-white/5 flex justify-end">
                  <div className="px-2.5 py-1 rounded-full bg-indigo-500 text-[9px] font-black text-white uppercase tracking-tighter">AI AGENT ACTIVE</div>
               </div>
            </div>
          </FeatureCard>

          {/* 3. Group Collaboration (Bottom Left) */}
          <FeatureCard 
            title="Team Flow" 
            icon={MessageSquare}
            className="lg:absolute lg:bottom-0 lg:left-0 w-full lg:w-[340px] z-20 shadow-2xl lg:animate-float-delayed order-3 lg:order-none"
          >
            <div className="space-y-4">
              {[
                { name: "Sarah M.", msg: "Just pushed the UI kit fixes.", time: "2m ago" },
                { name: "Alex K.", msg: "Reviewing the PR now. Looks good!", time: "Just now" }
              ].map((chat, i) => (
                <div key={i} className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-xl bg-linear-to-tr from-indigo-500 to-cyan-500 flex-shrink-0 shadow-lg shadow-indigo-500/20"></div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-black text-white">{chat.name}</span>
                      <span className="text-[10px] text-zinc-600 font-bold">{chat.time}</span>
                    </div>
                    <div className="text-[11px] text-zinc-400 leading-snug font-medium">{chat.msg}</div>
                  </div>
                </div>
              ))}
              <div className="pt-3 border-t border-white/5">
                <div className="bg-white/5 rounded-xl px-3 py-2.5 flex items-center justify-between border border-white/5">
                   <div className="text-[11px] text-zinc-600 italic font-medium">Type a message...</div>
                   <Zap className="w-4 h-4 text-indigo-400" />
                </div>
              </div>
            </div>
          </FeatureCard>

          {/* Glow Behind Mosaic */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[60%] bg-indigo-500/5 blur-[120px] -z-10 rounded-full" />
        </div>

        {/* Improved Social Proof */}
        <div className="mt-32 pt-16 border-t border-white/5 text-center space-y-10 opacity-60">
          <p className="text-zinc-500 text-sm font-semibold uppercase tracking-[0.3em]">
            Scaling with industry leaders
          </p>
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 grayscale opacity-80">
            {["CLOUDSYNC", "VELOCITY", "TECHFLOW", "DATASTREAM", "ZENITH"].map(logo => (
              <span key={logo} className="text-2xl font-black text-white tracking-widest">{logo}</span>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(1deg); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(-1deg); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};

export default HeroSection;
