import { Link } from "react-router-dom";
import { Separator } from "../ui/separator";
import { FRONTEND_ROUTES } from "../../constants/frontendRoutes";

const Footer = () => {
  return (
    <footer className="bg-[#0a0a0a] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold text-white mb-4">ProJexa</h3>
            <p className="text-zinc-400 text-sm max-w-md mb-4">
              Transform the way your team works with powerful project management and real-time collaboration.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to={FRONTEND_ROUTES.LANDING} className="text-zinc-400 hover:text-white text-sm transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <a href="#features" className="text-zinc-400 hover:text-white text-sm transition-colors">
                  Dashboard
                </a>
              </li>
              <li>
                <a href="#pricing" className="text-zinc-400 hover:text-white text-sm transition-colors">
                  Pricing
                </a>
              </li>
              <li>
                <Link to={FRONTEND_ROUTES.LOGIN} className="text-zinc-400 hover:text-white text-sm transition-colors">
                  Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-zinc-400 hover:text-white text-sm transition-colors">
                  Terms
                </a>
              </li>
              <li>
                <a href="#" className="text-zinc-400 hover:text-white text-sm transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-zinc-400 hover:text-white text-sm transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="bg-white/5 mb-8" />

        {/* Copyright */}
        <div className="text-center text-zinc-500 text-sm">
          © 2025 ProJexa. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
