import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "../ui/button";
import { FRONTEND_ROUTES } from "../../constants/frontendRoutes";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-lg border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to={FRONTEND_ROUTES.LANDING} className="flex items-center">
            <img
              src="/logo.png"
              alt="ProJexa Logo"
              className="h-24 w-30 mt-5 mb-2 object-contain"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-zinc-300 hover:text-white transition-colors text-sm">
              Features
            </a>
            <a href="#pricing" className="text-zinc-300 hover:text-white transition-colors text-sm">
              Pricing
            </a>
            <a href="#about" className="text-zinc-300 hover:text-white transition-colors text-sm">
              About
            </a>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to={FRONTEND_ROUTES.LOGIN}>
              <Button
                variant="ghost"
                className="text-zinc-300 hover:text-white hover:bg-white/5"
              >
                Login
              </Button>
            </Link>
            <Link to={FRONTEND_ROUTES.SIGNUP}>
              <Button className="bg-[#3b82f6] hover:bg-[#2563eb] text-white">
                Sign Up
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-[#0a0a0a] border-t border-white/5">
          <div className="px-4 py-4 space-y-3">
            <a
              href="#features"
              className="block text-zinc-300 hover:text-white transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Features
            </a>
            <a
              href="#pricing"
              className="block text-zinc-300 hover:text-white transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Pricing
            </a>
            <a
              href="#about"
              className="block text-zinc-300 hover:text-white transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </a>
            <div className="pt-4 space-y-2">
              <Link to={FRONTEND_ROUTES.LOGIN} className="block">
                <Button variant="outline" className="w-full">
                  Login
                </Button>
              </Link>
              <Link to={FRONTEND_ROUTES.SIGNUP} className="block">
                <Button className="w-full bg-[#3b82f6] hover:bg-[#2563eb]">
                  Sign Up
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
