import { useEffect, useRef, useState } from "react";
import {
  Target, MessageSquare, TrendingUp, Video, Shield, MessageCircle,
  Sparkles, BarChart, Zap, Users, Bell, Layout, Check, Star, ArrowRight,
} from "lucide-react";

// ─── Scroll-reveal hook ───────────────────────────────────────────────────────
const useScrollReveal = (threshold = 0.15) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return { ref, visible };
};

// ─── Animated counter ────────────────────────────────────────────────────────
const AnimatedCounter = ({ to, suffix = "" }: { to: number; suffix?: string }) => {
  const [count, setCount] = useState(0);
  const { ref, visible } = useScrollReveal(0.5);

  useEffect(() => {
    if (!visible) return;
    let start = 0;
    const duration = 1800;
    const step = (to / duration) * 16;
    const timer = setInterval(() => {
      start += step;
      if (start >= to) { setCount(to); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [visible, to]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}{suffix}
    </span>
  );
};

// ─── Stagger wrapper ─────────────────────────────────────────────────────────
const StaggerReveal = ({ children, delay = 0, className = "" }: {
  children: React.ReactNode; delay?: number; className?: string;
}) => {
  const { ref, visible } = useScrollReveal();
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${className}`}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(32px)",
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
};

// ─── Pricing card ────────────────────────────────────────────────────────────
interface PricingCardProps {
  name: string;
  price: number;
  description: string;
  features: string[];
  highlighted?: boolean;
  badge?: string;
  delay?: number;
}

const PricingCard = ({ name, price, description, features, highlighted, badge, delay = 0 }: PricingCardProps) => {
  const { ref, visible } = useScrollReveal();
  return (
    <div
      ref={ref}
      className={`relative rounded-3xl border transition-all duration-700 ease-out flex flex-col ${
        highlighted
          ? "bg-gradient-to-b from-indigo-600/30 via-indigo-500/10 to-zinc-900/60 border-indigo-500/50 shadow-2xl shadow-indigo-500/20 scale-[1.03] z-10"
          : "bg-zinc-900/40 border-white/8 hover:border-indigo-500/30"
      }`}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible
          ? highlighted ? "scale(1.03)" : "translateY(0)"
          : "translateY(40px)",
        transitionDelay: `${delay}ms`,
      }}
    >
      {badge && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500 text-white text-xs font-black uppercase tracking-widest shadow-lg shadow-indigo-500/40 flex items-center gap-1.5">
          <Star className="w-3 h-3 fill-white" /> {badge}
        </div>
      )}

      <div className="p-8 flex flex-col flex-1">
        {/* Plan name */}
        <p className={`text-sm font-bold uppercase tracking-[0.2em] mb-3 ${highlighted ? "text-indigo-300" : "text-zinc-500"}`}>
          {name}
        </p>

        {/* Price */}
        <div className="flex items-end gap-1 mb-3">
          <span className={`text-sm font-semibold mt-1 ${highlighted ? "text-indigo-300" : "text-zinc-400"}`}>₹</span>
          <span className="text-5xl font-black text-white tracking-tighter">{price.toLocaleString()}</span>
          <span className="text-zinc-500 text-sm mb-1.5">/mo</span>
        </div>

        <p className="text-zinc-400 text-sm leading-relaxed mb-8">{description}</p>

        {/* CTA */}
        <button
          className={`w-full py-3.5 rounded-2xl font-bold text-sm transition-all duration-300 mb-8 flex items-center justify-center gap-2 group ${
            highlighted
              ? "bg-gradient-to-r from-indigo-500 to-cyan-500 text-white hover:from-indigo-400 hover:to-cyan-400 shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:-translate-y-0.5"
              : "bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:-translate-y-0.5"
          }`}
        >
          Get Started
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>

        {/* Divider */}
        <div className={`h-px mb-8 ${highlighted ? "bg-indigo-500/30" : "bg-white/5"}`} />

        {/* Features */}
        <ul className="space-y-3 flex-1">
          {features.map((feat, i) => (
            <li key={i} className="flex items-start gap-3">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${highlighted ? "bg-indigo-500/20" : "bg-emerald-500/10"}`}>
                <Check className={`w-3 h-3 ${highlighted ? "text-indigo-300" : "text-emerald-400"}`} />
              </div>
              <span className="text-zinc-400 text-sm leading-snug">{feat}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

// ─── Feature Card ────────────────────────────────────────────────────────────
interface FeatureItem {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  color: string;
  bg: string;
}

const AnimatedFeatureCard = ({ feature, delay }: { feature: FeatureItem; delay: number }) => {
  const { ref, visible } = useScrollReveal();
  return (
    <div
      ref={ref}
      className="bg-zinc-900/40 border border-white/5 p-8 rounded-2xl hover:bg-zinc-900/70 transition-all duration-400 hover:border-indigo-500/20 group hover:-translate-y-2 backdrop-blur-sm cursor-default"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(36px)",
        transition: "opacity 0.6s ease, transform 0.6s ease",
        transitionDelay: `${delay}ms`,
      }}
    >
      <div className={`w-14 h-14 rounded-2xl ${feature.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
        <feature.icon className={`h-7 w-7 ${feature.color}`} />
      </div>
      <h3 className="text-xl font-bold text-white mb-3 tracking-tight">{feature.title}</h3>
      <p className="text-zinc-400 text-sm leading-relaxed">{feature.description}</p>
    </div>
  );
};

// ─── Benefit Card ────────────────────────────────────────────────────────────
interface BenefitItem {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}

const AnimatedBenefitCard = ({ benefit, delay }: { benefit: BenefitItem; delay: number }) => {
  const { ref, visible } = useScrollReveal();
  return (
    <div
      ref={ref}
      className="bg-zinc-900/20 border border-white/5 rounded-2xl p-8 hover:bg-zinc-900/50 transition-all duration-400 hover:border-cyan-500/20 hover:-translate-y-1 cursor-default group"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(32px)",
        transition: "opacity 0.6s ease, transform 0.6s ease",
        transitionDelay: `${delay}ms`,
      }}
    >
      <div className="w-12 h-12 rounded-xl bg-cyan-500/8 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border border-cyan-500/10">
        <benefit.icon className="h-6 w-6 text-cyan-400" />
      </div>
      <h3 className="text-lg font-bold text-white mb-3">{benefit.title}</h3>
      <p className="text-zinc-400 text-sm leading-relaxed">{benefit.description}</p>
    </div>
  );
};

// ─── Main Component ──────────────────────────────────────────────────────────
const FeaturesSection = () => {
  const features: FeatureItem[] = [
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
      title: "Intelligent Metrics",
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

  const benefits: BenefitItem[] = [
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

  const plans: PricingCardProps[] = [
    {
      name: "Starter",
      price: 499,
      description: "Perfect for small teams and startups who want to ship faster with essential tools.",
      features: [
        "Up to 5 team members",
        "10 active projects",
        "Basic issue tracking",
        "5 GB storage",
        "Email support",
        "Community forum access",
      ],
      delay: 100,
    },
    {
      name: "Professional",
      price: 1499,
      description: "For growing teams that need advanced collaboration, reporting, and automation.",
      features: [
        "Up to 25 team members",
        "Unlimited projects",
        "Advanced analytics & reports",
        "50 GB storage",
        "AI-powered meeting summaries",
        "Priority email & chat support",
        "Custom workflows",
        "API access",
      ],
      highlighted: true,
      badge: "Most Popular",
      delay: 200,
    },
    {
      name: "Premium",
      price: 3999,
      description: "Enterprise-grade power for large organisations with compliance and security needs.",
      features: [
        "Unlimited team members",
        "Unlimited projects & storage",
        "SSO & SAML authentication",
        "SOC 2 compliance & audit logs",
        "Dedicated success manager",
        "24/7 phone support",
        "White-label options",
        "Custom integrations",
      ],
      delay: 300,
    },
  ];

  return (
    <div className="bg-[#030303] py-24 relative overflow-hidden">
      {/* Decorative Glows */}
      <div className="absolute top-1/4 left-0 -translate-y-1/2 w-72 h-72 bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-600/6 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute top-2/3 left-1/2 -translate-x-1/2 w-[600px] h-80 bg-purple-600/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Features Section ── */}
        <section id="features" className="mb-32 scroll-mt-24">
          <StaggerReveal className="text-center mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold uppercase tracking-widest">
              <Zap className="w-3 h-3" /> Features
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
              Powerful Tools for{" "}
              <span className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                Exceptional
              </span>{" "}
              Teams
            </h2>
            <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
              ProJexa provides a comprehensive suite of features designed to scale with your team&apos;s ambition.
            </p>
          </StaggerReveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">
            {features.map((feature, index) => (
              <AnimatedFeatureCard key={index} feature={feature} delay={index * 80} />
            ))}
          </div>
        </section>

        {/* ── Stats Section ── */}
        <section className="mb-32">
          <StaggerReveal>
            <div className="bg-gradient-to-br from-zinc-900/60 via-zinc-900/30 to-zinc-900/60 rounded-[32px] p-8 md:p-16 border border-white/5 relative overflow-hidden">
              <div className="absolute inset-0 bg-indigo-500/5 blur-3xl pointer-events-none" />
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-cyan-500/5 blur-[80px] rounded-full pointer-events-none" />

              <div className="relative z-10 grid md:grid-cols-3 gap-12 text-center">
                {[
                  { to: 10000, suffix: "+", label: "Active Teams" },
                  { to: 50000000, suffix: "+", label: "Tasks Completed" },
                  { to: 999, suffix: "%", label: "SLA Uptime" },
                ].map(({ to, suffix, label }, i) => (
                  <div key={i} className="space-y-3">
                    <div className="text-5xl font-black text-white tracking-tighter">
                      {label === "SLA Uptime" ? (
                        <span>99.9<span className="text-indigo-400">%</span></span>
                      ) : (
                        <AnimatedCounter to={to} suffix={suffix} />
                      )}
                    </div>
                    <p className="text-zinc-500 font-medium uppercase text-xs tracking-[0.2em]">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </StaggerReveal>
        </section>

        {/* ── Pricing Section ── */}
        <section id="pricing" className="mb-32 scroll-mt-24">
          <StaggerReveal className="text-center mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-semibold uppercase tracking-widest">
              <Sparkles className="w-3 h-3" /> Pricing
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
              Simple,{" "}
              <span className="bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">
                Transparent
              </span>{" "}
              Pricing
            </h2>
            <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
              No hidden fees. Cancel anytime. Pick the plan that scales with your team.
            </p>
          </StaggerReveal>

          {/* Toggle — visual only */}
          <StaggerReveal delay={100} className="flex justify-center mb-12">
            <div className="inline-flex items-center gap-1 bg-white/5 border border-white/10 rounded-2xl p-1">
              <span className="px-5 py-2 rounded-xl bg-white/10 text-white text-sm font-semibold">Monthly</span>
              <span className="px-5 py-2 text-zinc-500 text-sm font-medium">Annual <span className="text-emerald-400 text-xs font-bold">Save 20%</span></span>
            </div>
          </StaggerReveal>

          <div className="grid md:grid-cols-3 gap-6 items-stretch">
            {plans.map((plan) => (
              <PricingCard key={plan.name} {...plan} />
            ))}
          </div>

          {/* Enterprise note */}
          <StaggerReveal delay={400} className="mt-12 text-center">
            <p className="text-zinc-500 text-sm">
              Need a custom plan?{" "}
              <button className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors underline underline-offset-2">
                Contact our sales team →
              </button>
            </p>
          </StaggerReveal>
        </section>

        {/* ── Benefits Grid ── */}
        <section id="about" className="mb-24 scroll-mt-24">
          <StaggerReveal className="text-center mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold uppercase tracking-widest">
              <Star className="w-3 h-3" /> About
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
              Engineered for{" "}
              <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Excellence
              </span>
            </h2>
            <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
              We focus on the details so you can focus on building what matters.
            </p>
          </StaggerReveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <AnimatedBenefitCard key={index} benefit={benefit} delay={index * 80} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default FeaturesSection;
