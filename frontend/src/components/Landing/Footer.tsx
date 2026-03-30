import { Link } from "react-router-dom";
import { Separator } from "../ui/separator";
import { FRONTEND_ROUTES } from "../../constants/frontendRoutes";
import { Twitter, Github, Linkedin, MessageSquare, ExternalLink } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-[#030303] border-t border-white/5 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-12 mb-16">
          {/* Brand Section */}
          <div className="col-span-2 space-y-6">
            <Link to={FRONTEND_ROUTES.LANDING} className="inline-block">
              <img src="/logo.png" alt="ProJexa" className="h-20 w-auto" />
            </Link>
            <p className="text-zinc-500 text-sm max-w-sm leading-relaxed">
              Empowering high-performance teams to ship faster and work smarter. 
              The all-in-one workspace for modern engineering and product groups.
            </p>
            <div className="flex justify-center sm:justify-start space-x-4">
              <a href="#" className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors text-zinc-400 hover:text-white">
                <Twitter size={18} />
              </a>
              <a href="#" className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors text-zinc-400 hover:text-white">
                <Github size={18} />
              </a>
              <a href="#" className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors text-zinc-400 hover:text-white">
                <Linkedin size={18} />
              </a>
            </div>
          </div>

          {/* Product Links */}
          <div className="col-span-1 space-y-6">
            <h4 className="text-white font-bold text-sm uppercase tracking-widest">Product</h4>
            <ul className="space-y-4">
              <li><a href="#features" className="text-zinc-500 hover:text-white text-sm transition-colors">Features</a></li>
              <li><a href="#pricing" className="text-zinc-500 hover:text-white text-sm transition-colors">Pricing</a></li>
              <li><a href="#" className="text-zinc-500 hover:text-white text-sm transition-colors">Changelog</a></li>
              <li><a href="#" className="text-zinc-500 hover:text-white text-sm transition-colors flex items-center">API Docs <ExternalLink className="ml-1 w-3 h-3" /></a></li>
            </ul>
          </div>

          {/* Company Links */}
          <div className="col-span-1 space-y-6">
            <h4 className="text-white font-bold text-sm uppercase tracking-widest">Company</h4>
            <ul className="space-y-4">
              <li><a href="#about" className="text-zinc-500 hover:text-white text-sm transition-colors">About Us</a></li>
              <li><a href="#" className="text-zinc-500 hover:text-white text-sm transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-white text-sm transition-colors text-indigo-400">Hiring!</a></li>
              <li><a href="#" className="text-zinc-500 hover:text-white text-sm transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Resources Links */}
          <div className="col-span-1 space-y-6">
            <h4 className="text-white font-bold text-sm uppercase tracking-widest">Resources</h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-zinc-500 hover:text-white text-sm transition-colors">Community</a></li>
              <li><a href="#" className="text-zinc-500 hover:text-white text-sm transition-colors">Privacy</a></li>
              <li><a href="#" className="text-zinc-500 hover:text-white text-sm transition-colors">Terms</a></li>
              <li><a href="#" className="text-zinc-500 hover:text-white text-sm transition-colors">Security</a></li>
            </ul>
          </div>

          {/* CTA Box */}
          <div className="col-span-1 space-y-6">
            <h4 className="text-white font-bold text-sm uppercase tracking-widest">Support</h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-zinc-500 hover:text-white text-sm transition-colors">Help Center</a></li>
              <li><a href="#" className="text-zinc-500 hover:text-white text-sm transition-colors flex items-center">Live Chat <MessageSquare className="ml-1 w-3 h-3" /></a></li>
            </ul>
          </div>
        </div>

        <Separator className="bg-white/5 mb-10" />

        <div className="flex flex-col md:flex-row justify-between items-center text-zinc-600 text-[13px] gap-6">
          <p>© 2026 ProJexa Inc. All rights reserved.</p>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <p>All Systems Operational</p>
          </div>
          <p className="hidden md:block">Hand-crafted for modern innovators.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
