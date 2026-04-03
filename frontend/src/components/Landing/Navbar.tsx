import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { Button } from "../ui/button";
import { FRONTEND_ROUTES } from "../../constants/frontendRoutes";

const navItems = [
  { label: "Features", id: "features" },
  { label: "Pricing", id: "pricing" },
  { label: "About", id: "about" },
];

const scrollToSection = (id: string) => {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
};

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
        scrolled
          ? "bg-[#0a0a0a]/70 backdrop-blur-xl border-white/5 py-3 md:py-4"
          : "bg-transparent border-transparent py-4 md:py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to={FRONTEND_ROUTES.LANDING} className="flex items-center group">
            <div className="relative">
              <img
                src="/logo.png"
                alt="ProJexa Logo"
                className="h-16 mt-2 ml-2 mr-2 md:h-20 w-auto object-contain transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-indigo-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-10">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => scrollToSection(item.id)}
                className="text-zinc-400 hover:text-white transition-all text-sm font-medium tracking-wide relative group cursor-pointer bg-transparent border-none outline-none"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-indigo-500 transition-all group-hover:w-full" />
              </button>
            ))}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to={FRONTEND_ROUTES.LOGIN}>
              <button className="text-zinc-400 hover:text-white transition-colors text-sm font-medium">
                Login
              </button>
            </Link>
            <Link to={FRONTEND_ROUTES.SIGNUP}>
              <Button className="h-10 px-6 bg-white text-black hover:bg-zinc-200 rounded-xl font-semibold shadow-lg transition-all hover:-translate-y-0.5 active:translate-y-0">
                Join Now
                <ArrowUpRight className="ml-1.5 w-4 h-4" />
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white p-2 rounded-lg bg-white/5 border border-white/10"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-[#0a0a0a] border-b border-white/5 animate-in slide-in-from-top-4 duration-300">
          <div className="px-4 py-8 space-y-6">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => {
                  scrollToSection(item.id);
                  setIsMenuOpen(false);
                }}
                className="block w-full text-left text-zinc-400 hover:text-white transition-colors text-lg font-medium bg-transparent border-none outline-none cursor-pointer"
              >
                {item.label}
              </button>
            ))}
            <div className="pt-6 space-y-4 border-t border-white/5">
              <Link to={FRONTEND_ROUTES.LOGIN} onClick={() => setIsMenuOpen(false)} className="block">
                <Button variant="ghost" className="w-full text-zinc-300 bg-white/5">
                  Login
                </Button>
              </Link>
              <Link to={FRONTEND_ROUTES.SIGNUP} onClick={() => setIsMenuOpen(false)} className="block">
                <Button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white">
                  Get Started
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
