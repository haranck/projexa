import { Link } from "react-router-dom";
import { ArrowRight, Target, MessageSquare, TrendingUp, Video, Shield, MessageCircle, Sparkles, BarChart, Zap, Users, Bell, Layout } from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { FRONTEND_ROUTES } from "../../constants/frontendRoutes";

const FeaturesSection = () => {
  const features = [
    {
      icon: Target,
      title: "Issue Tracking",
      description: "Create, assign, and track tasks with ease",
      color: "text-blue-500",
    },
    {
      icon: MessageSquare,
      title: "Team Collaboration",
      description: "Real-time chat, voice & video meetings",
      color: "text-purple-500",
    },
    {
      icon: TrendingUp,
      title: "Progress Tracking",
      description: "Sprints, epics, and performance insights",
      color: "text-green-500",
    },
    {
      icon: Video,
      title: "Video Conferencing",
      description: "Built-in video calls for seamless collaboration",
      color: "text-red-500",
    },
    {
      icon: Shield,
      title: "Role Management",
      description: "Granular permissions and access control",
      color: "text-yellow-500",
    },
    {
      icon: MessageCircle,
      title: "Real-Time Chat",
      description: "Instant messaging with file sharing",
      color: "text-cyan-500",
    },
  ];

  const benefits = [
    {
      icon: Layout,
      title: "Beautiful and intuitive UI",
      description: "Clean, modern interface designed for productivity",
    },
    {
      icon: BarChart,
      title: "Powerful analytics dashboard",
      description: "Deep insights into team performance and metrics",
    },
    {
      icon: Zap,
      title: "Sprint and roadmap automation",
      description: "Automate repetitive tasks and workflows",
    },
    {
      icon: Users,
      title: "Deep customization of rules & permissions",
      description: "Tailor the platform to your team's needs",
    },
    {
      icon: Sparkles,
      title: "Blazing fast performance",
      description: "Optimized for speed and reliability",
    },
    {
      icon: Bell,
      title: "Real-time updates and notifications",
      description: "Stay informed with instant alerts",
    },
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-[#0a0a0a] via-[#0f0f23] to-[#0a0a0a]">
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
                Transform the Way Your{" "}
                <span className="text-[#3b82f6] bg-linear-to-br from-blue-500 to-purple-600 bg-clip-text">
                  Team
                </span>{" "}
                Works
              </h1>
              <p className="text-lg text-zinc-400 max-w-xl">
                Powerful project management with real-time{" "}
                <span className="text-[#10b981]">collaboration</span>, issue tracking, sprint planning, analytics, and team communication — all in one beautifully designed platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to={FRONTEND_ROUTES.SIGNUP}>
                  <Button className="bg-[#3b82f6] hover:bg-[#2563eb] text-white h-12 px-8 text-base group">
                    Start Your Project
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Button variant="outline" className="h-12 px-8 text-base border-zinc-700 hover:bg-white/5">
                  Join ProJexa
                </Button>
              </div>
            </div>

            {/* Right Content - Dashboard Mockup */}
            <div className="relative">
              <div className="relative bg-linear-to-br from-[#1a1a2e] to-[#16213e] rounded-2xl p-6 border border-white/10 shadow-2xl">
                {/* Browser Chrome */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>

                {/* Dashboard Cards */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-[#2a2a4e] rounded-lg p-4 border border-blue-500/20">
                      <div className="w-8 h-8 bg-blue-500/20 rounded-lg mb-2"></div>
                      <div className="h-2 bg-white/10 rounded w-3/4"></div>
                    </div>
                  ))}
                </div>

                {/* Progress Bar */}
                <div className="bg-[#2a2a4e] rounded-lg p-4 border border-green-500/20">
                  <div className="h-2 bg-green-500 rounded-full w-2/3"></div>
                </div>

                {/* Glow Effect */}
                <div className="absolute -inset-1 bg-linear-to-r from-blue-500 to-purple-600 rounded-2xl opacity-20 blur-xl -z-10"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Everything You Need for Success
            </h2>
            <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
              The ultimate toolkit for modern teams — collaborate, track progress, and deliver results.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="bg-[#1a1a2e] border-white/10 p-6 hover:bg-[#1f1f3a] transition-all duration-300 hover:scale-105 hover:border-blue-500/30 group"
              >
                <div className={`w-12 h-12 rounded-lg bg-linear-to-br from-blue-500/10 to-purple-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className={`h-6 w-6 ${feature.color}`} />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-zinc-400 text-sm">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="bg-linear-to-br from-[#1a1a2e] to-[#16213e] rounded-2xl p-8 md:p-12 border border-white/10">
            <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-4">
              Built for Modern Teams
            </h2>
            <p className="text-zinc-400 text-center mb-12 max-w-2xl mx-auto">
              Trusted by thousands of teams worldwide managing their most important career and personal needs.
            </p>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-transparent mb-2 bg-linear-to-r from-blue-500 to-purple-600 bg-clip-text">
                  10K+
                </div>
                <div className="text-zinc-400">Teams managed</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-transparent mb-2 bg-linear-to-r from-green-500 to-cyan-600 bg-clip-text">
                  50K+
                </div>
                <div className="text-zinc-400">Hours saved</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-transparent mb-2 bg-linear-to-r from-yellow-500 to-red-600 bg-clip-text">
                  99.9%
                </div>
                <div className="text-zinc-400">Uptime</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Why Choose ProJexa
            </h2>
            <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
              Experience the difference with our powerful features and intuitive design.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="bg-[#1a1a2e] border border-white/10 rounded-xl p-6 hover:bg-[#1f1f3a] transition-all duration-300 hover:border-blue-500/30"
              >
                <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4">
                  <benefit.icon className="h-6 w-6 text-blue-500" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {benefit.title}
                </h3>
                <p className="text-zinc-400 text-sm">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-linear-to-br from-[#1a1a2e] to-[#16213e] rounded-2xl p-12 text-center border border-white/10 relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute inset-0 bg-linear-to-r from-blue-500/10 to-purple-500/10 blur-3xl"></div>

            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Start Managing Your Projects Smarter
              </h2>
              <p className="text-zinc-400 mb-8 max-w-2xl mx-auto">
                Join thousands of teams already using TeamSync to collaborate better and deliver faster.
              </p>
              <Link to={FRONTEND_ROUTES.SIGNUP}>
                <Button className="bg-[#3b82f6] hover:bg-[#2563eb] text-white h-12 px-8 text-base">
                  Get Started Free
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FeaturesSection;
