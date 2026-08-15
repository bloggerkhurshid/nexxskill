import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAuthModal } from '../context/AuthModalContext';
import { Search, User, LogOut, Menu, X, Mail, MapPin, ShieldCheck } from 'lucide-react';

import { useWebinarModal } from '../context/WebinarModalContext';

export const Header = () => {
  const { user, logout } = useAuth();
  const { openAuthModal } = useAuthModal();
  const { openWebinarModal } = useWebinarModal();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/courses?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="bg-white/95 backdrop-blur-md text-slate-900 border-b border-slate-200/80 sticky top-0 z-40 shadow-xs h-20 flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex items-center justify-between gap-6">
        
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 shrink-0 group">
          <img src="/assets/logo.png" alt="NexxSkill Logo" className="w-10 h-10 object-contain rounded-xl border border-slate-200 shadow-xs group-hover:scale-105 transition-transform" />
          <span className="text-xl font-extrabold tracking-tight text-slate-900 font-space">
            Nexx<span className="text-blue-600">Skill</span>
          </span>
        </Link>

        {/* Udemy Style Search Bar */}
        <form onSubmit={handleSearch} className="hidden sm:flex flex-1 max-w-xl relative">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for Mainframe, COBOL, Data Science..."
              className="w-full bg-slate-100/80 border border-slate-200 rounded-full pl-11 pr-4 py-2.5 text-xs font-medium text-slate-900 placeholder-slate-500 focus:outline-none focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 transition-all shadow-inner"
            />
          </div>
        </form>

        {/* Header Right Nav Links */}
        <div className="hidden lg:flex items-center gap-7 text-xs font-bold text-slate-700 tracking-wide uppercase font-space">
          <Link to="/courses" className="hover:text-blue-600 transition-colors">Courses</Link>
          <Link to="/webinars" className="hover:text-blue-600 transition-colors">Webinars</Link>
          <Link to="/about" className="hover:text-blue-600 transition-colors">About</Link>
          <Link to="/contact" className="hover:text-blue-600 transition-colors">Contact</Link>
        </div>

        {/* Auth Buttons triggering Auth Modal */}
        <div className="hidden sm:flex items-center gap-3 shrink-0">
          {user ? (
            <div className="flex items-center gap-3">
              <Link to="/student/dashboard" className="flex items-center gap-2 bg-slate-900 border border-slate-900 px-4 py-2.5 rounded-xl text-xs font-bold text-white hover:bg-slate-800 transition-all shadow-sm">
                <User className="w-3.5 h-3.5 text-blue-400" />
                <span>My Dashboard</span>
              </Link>
              <button onClick={logout} className="p-2.5 text-slate-500 hover:text-red-600 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer" title="Logout">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => openAuthModal('login')}
                className="px-4.5 py-2.5 text-xs font-bold text-slate-800 border border-slate-300 rounded-xl hover:border-slate-900 hover:bg-slate-50 transition-all cursor-pointer"
              >
                Log in
              </button>
              <button
                onClick={() => openAuthModal('signup')}
                className="px-4.5 py-2.5 text-xs font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-all shadow-sm hover:shadow-blue-600/20 cursor-pointer"
              >
                Sign up
              </button>
            </div>
          )}
        </div>

        {/* Mobile menu trigger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden text-slate-700 p-2 rounded-xl border border-slate-200 hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6 text-slate-900" /> : <Menu className="w-6 h-6 text-slate-900" />}
        </button>
      </div>

      {/* Mobile Glassmorphic Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200/80 bg-white/98 backdrop-blur-xl px-5 pt-4 pb-7 flex flex-col gap-4 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-200 absolute top-20 left-0 right-0 z-50">
          <form onSubmit={handleSearch} className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search courses..."
              className="w-full bg-slate-100/90 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-500 focus:outline-none focus:bg-white focus:border-blue-600 font-medium"
            />
          </form>

          <nav className="flex flex-col gap-1 text-sm font-bold text-slate-800 font-space">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-colors flex items-center justify-between"
            >
              <span>Home</span>
            </Link>
            <Link
              to="/courses"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-colors flex items-center justify-between"
            >
              <span>All Courses</span>
            </Link>
            <Link
              to="/webinars"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-colors flex items-center justify-between"
            >
              <span>Webinars & Masterclasses</span>
            </Link>
            <Link
              to="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-colors flex items-center justify-between"
            >
              <span>About Us</span>
            </Link>
            <Link
              to="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-colors flex items-center justify-between"
            >
              <span>Contact Support</span>
            </Link>
          </nav>
          
          <div className="pt-3 border-t border-slate-200 flex flex-col gap-2.5">
            {user ? (
              <div className="space-y-2">
                <Link
                  to="/student/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center bg-slate-900 text-white font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm"
                >
                  <User className="w-4 h-4 text-blue-400" />
                  <span>My Dashboard</span>
                </Link>
                <button
                  onClick={() => { setMobileMenuOpen(false); logout(); }}
                  className="w-full text-center border border-slate-300 text-slate-700 font-bold py-2.5 rounded-xl text-xs hover:bg-slate-100 transition-colors"
                >
                  Log out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => { setMobileMenuOpen(false); openAuthModal('login'); }}
                  className="w-full text-center border border-slate-300 text-slate-800 font-bold py-2.5 rounded-xl text-xs hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Log in
                </button>
                <button
                  onClick={() => { setMobileMenuOpen(false); openAuthModal('signup'); }}
                  className="w-full text-center bg-blue-600 text-white font-bold py-2.5 rounded-xl text-xs hover:bg-blue-700 transition-colors shadow-sm cursor-pointer"
                >
                  Sign up
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export const Footer = () => {
  return (
    <footer className="bg-slate-950 text-slate-400 pt-16 pb-10 border-t border-slate-900 font-sans relative overflow-hidden">
      {/* Background Accent Gradients */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
        
        {/* Top Grid Area */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-slate-800/80">
          
          {/* Brand & Mission Column */}
          <div className="md:col-span-5 space-y-5">
            <Link to="/" className="inline-flex items-center gap-3 group">
              <img src="/assets/logo.png" alt="NexxSkill Logo" className="w-9 h-9 object-contain rounded-xl shadow-md group-hover:scale-105 transition-transform" />
              <span className="text-xl font-extrabold tracking-tight text-white font-space">
                Nexx<span className="text-blue-500">Skill</span>
              </span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm font-normal">
              Premier Enterprise Engineering & Mainframe Training Academy. Hands-on COBOL, JCL, DB2, and System z labs mentored directly by enterprise industry veterans.
            </p>
          </div>

          {/* Programs Navigation */}
          <div className="md:col-span-2 space-y-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-space">Programs</h4>
            <ul className="space-y-2.5 text-xs text-slate-400 font-medium">
              <li><Link to="/courses" className="hover:text-white transition-colors flex items-center gap-1.5"><span className="text-blue-500">•</span> Mainframe Masterclass</Link></li>
              <li><Link to="/courses" className="hover:text-white transition-colors flex items-center gap-1.5"><span className="text-blue-500">•</span> COBOL & JCL Bootcamps</Link></li>
              <li><Link to="/courses" className="hover:text-white transition-colors flex items-center gap-1.5"><span className="text-blue-500">•</span> Interview Prep Cohort</Link></li>
              <li><Link to="/webinars" className="hover:text-white transition-colors flex items-center gap-1.5"><span className="text-blue-500">•</span> Live Tech Webinars</Link></li>
            </ul>
          </div>

          {/* Quick Links & Legal */}
          <div className="md:col-span-2 space-y-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-space">Academy</h4>
            <ul className="space-y-2.5 text-xs text-slate-400 font-medium">
              <li><Link to="/about" className="hover:text-white transition-colors">About Academy</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Help Center & Contact</Link></li>
              <li><Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link to="/refund-policy" className="hover:text-white transition-colors">Cancellation & Refund</Link></li>
            </ul>
          </div>

          {/* Direct Reach */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-space">Contact Support</h4>
            <div className="space-y-3 text-xs text-slate-400">
              <div className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                <div>
                  <span className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider">Official Email</span>
                  <a href="mailto:support@nexxskill.com" className="text-slate-200 hover:text-blue-400 font-semibold transition-colors">support@nexxskill.com</a>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                <div>
                  <span className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider">Learning Platform</span>
                  <p className="text-slate-300">Online Learning Portal (100% Online & Remote Access)</p>
                </div>
              </div>

              <div className="pt-1">
                <span className="inline-flex items-center gap-1.5 text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-lg">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Razorpay PCI-DSS Verified</span>
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Copyright & Credit Bar */}
        <div className="flex flex-col items-center justify-center text-center text-xs text-slate-500 gap-3 pt-2">
          <p className="text-slate-400">
            © {new Date().getFullYear()} <strong className="text-white font-bold font-space">NexxSkill Academy</strong>. All rights reserved. Powered by <a href="https://projuktisoft.com" target="_blank" rel="noopener noreferrer" className="font-bold text-slate-300 hover:text-white hover:underline transition-colors">ProjuktiSoft</a>
          </p>
          <div className="flex items-center justify-center gap-5 text-xs text-slate-400">
            <Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy</Link>
            <span className="text-slate-700">•</span>
            <Link to="/terms" className="hover:text-white transition-colors">Terms</Link>
            <span className="text-slate-700">•</span>
            <Link to="/refund-policy" className="hover:text-white transition-colors">Refund Policy</Link>
          </div>
        </div>

      </div>
    </footer>
  );
};
