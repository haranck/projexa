import { Target, MessageSquare, TrendingUp, Video, Shield, MessageCircle, Sparkles, BarChart, Zap, Users, Bell, Layout } from "lucide-react";
import { Card } from "../ui/card";

const FeaturesSection = () => {
  const features = [
    {
      icon: Target,
      title: "Advanced Issue Tracking",
      description: "Create, assign, and track tasks with precision using custom workflows and automated status updates.",
      color: "text-indigo-400",
      bg: "bg-indigo-500/10",
    },
    {
      icon: MessageSquare,
      title: "Unified Collaboration",
      description: "Keep your team in sync with real-time chat, structured threads, and seamless file sharing.",
      color: "text-cyan-400",
      bg: "bg-cyan-500/10",
    },
    {
      icon: TrendingUp,
      title: "Inteligent Metrics",
      description: "Gain deep insights with automated sprint reports, velocity charts, and burndown tracking.",
      color: "text-purple-400",
      bg: "bg-purple-500/10",
    },
    {
      icon: Video,
      title: "Crystal Clear Meetings",
      description: "High-definition video conferencing integrated directly into your workspace for instant alignment.",
      color: "text-rose-400",
      bg: "bg-rose-500/10",
    },
    {
      icon: Shield,
      title: "Security & Governance",
      description: "Enterprise-grade permissions and audit logs ensure your data stays secure and compliant.",
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
    },
    {
      icon: MessageCircle,
      title: "Interactive Hub",
      description: "A centralized command center for all team activities, notifications, and cross-project updates.",
      color: "text-amber-400",
      bg: "bg-amber-500/10",
    },
  ];

  const benefits = [
    {
      icon: Layout,
      title: "Immersive UI/UX",
      description: "A meticulously crafted interface that prioritizes focus and minimizes cognitive load.",
    },
    {
      icon: BarChart,
      title: "Custom Dashboards",
      description: "Visualise exactly what matters to you with drag-and-drop widgets and live data.",
    },
    {
      icon: Zap,
      title: "Seamless Automation",
      description: "Eliminate repetitive tasks with powerful triggers and custom logic engines.",
    },
    {
      icon: Users,
      title: "Team Harmony",
      description: "Foster a culture of transparency and accountability with shared goals and visibility.",
    },
    {
      icon: Sparkles,
      title: "Ultra-Low Latency",
      description: "Real-time updates delivered in milliseconds using modern websocket technology.",
    },
    {
      icon: Bell,
      title: "Smart Notifications",
      description: "Stay informed without being overwhelmed by intelligent, filtered alerting.",
    },
  ];

  return (
    <div className="bg-[#030303] py-24 relative overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-64 h-64 bg-indigo-600/10 blur-[100px] rounded-full" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-600/5 blur-[120px] rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Features Section */}
        <section id="features" className="mb-32">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
              Powerful Tools for <span className="text-indigo-400">Exceptional</span> Teams
            </h2>
            <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
              ProJexa provides a comprehensive suite of features designed to scale with your team&apos;s ambition.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="bg-zinc-900/40 border-white/5 p-8 hover:bg-zinc-900/60 transition-all duration-300 hover:border-indigo-500/20 group hover:-translate-y-1 backdrop-blur-sm"
              >
                <div className={`w-14 h-14 rounded-2xl ${feature.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <feature.icon className={`h-7 w-7 ${feature.color}`} />
                </div>
                <h3 className="text-xl font-bold text-white mb-3 tracking-tight">
                  {feature.title}
                </h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </section>

        {/* Stats / Proof Section */}
        <section className="mb-32">
          <div className="bg-linear-to-br from-zinc-900/50 via-zinc-900/20 to-zinc-900/50 rounded-[32px] p-8 md:p-16 border border-white/5 relative overflow-hidden">
            <div className="absolute inset-0 bg-indigo-500/5 blur-3xl" />
            
            <div className="relative z-10 grid md:grid-cols-3 gap-12 text-center">
              <div className="space-y-2">
                <div className="text-5xl font-bold text-white tracking-tighter">10k+</div>
                <p className="text-zinc-500 font-medium uppercase text-xs tracking-[0.2em]">Active Teams</p>
              </div>
              <div className="space-y-2">
                <div className="text-5xl font-bold text-white tracking-tighter">50M+</div>
                <p className="text-zinc-500 font-medium uppercase text-xs tracking-[0.2em]">Tasks Completed</p>
              </div>
              <div className="space-y-2">
                <div className="text-5xl font-bold text-white tracking-tighter">99.9%</div>
                <p className="text-zinc-500 font-medium uppercase text-xs tracking-[0.2em]">SLA Uptime</p>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Grid (Bento Style) */}
        <section id="about" className="mb-24">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
              Engineered for <span className="text-cyan-400">Excellence</span>
            </h2>
            <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
              We focus on the details so you can focus on building what matters.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="bg-zinc-900/20 border border-white/5 rounded-2xl p-8 hover:bg-zinc-900/40 transition-all duration-300 hover:border-cyan-500/20"
              >
                <div className="w-12 h-12 rounded-xl bg-cyan-500/5 flex items-center justify-center mb-6">
                  <benefit.icon className="h-6 w-6 text-cyan-400" />
                </div>
                <h3 className="text-lg font-bold text-white mb-3">
                  {benefit.title}
                </h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default FeaturesSection;
