import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAuthModal } from '../context/AuthModalContext';
import { useTheme } from '../context/ThemeContext';
import { Search, User, LogOut, Menu, X, Mail, MapPin, ShieldCheck, Sun, Moon } from 'lucide-react';

import { useWebinarModal } from '../context/WebinarModalContext';

export const Header = () => {
  const { user, logout } = useAuth();
  const { openAuthModal } = useAuthModal();
  const { openWebinarModal } = useWebinarModal();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/courses?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const navLinks = [
    { label: 'Courses', path: '/courses' },
    { label: 'Webinars', path: '/webinars', badge: 'Live' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' },
  ];

  return (
    <header className="bg-white/95 dark:bg-[#080e1a]/95 backdrop-blur-md text-slate-900 dark:text-slate-100 border-b border-slate-200/80 dark:border-slate-800/80 sticky top-0 z-40 shadow-xs h-20 flex items-center transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex items-center justify-between gap-4 md:gap-6">
        
        {/* Brand Logo with #1153aa & #2daee8 */}
        <Link to="/" className="flex items-center gap-3 shrink-0 group">
          <div className="relative">
            <img 
              src="/assets/logo.png" 
              alt="NexxSkill Logo" 
              className="w-10 h-10 object-contain rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs group-hover:scale-105 transition-transform" 
            />
            <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-[#1153aa]/20 to-[#2daee8]/20 blur-xs -z-10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </div>
          <span className="text-xl font-extrabold tracking-tight font-space text-black dark:text-white transition-colors">
            NexxSkill
          </span>
        </Link>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="hidden sm:flex flex-1 max-w-md lg:max-w-lg relative">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-4 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for Mainframe, COBOL, Data Science..."
              className="w-full bg-slate-100/90 dark:bg-[#0d172e] border border-slate-200 dark:border-slate-800 rounded-full pl-11 pr-4 py-2.5 text-xs font-medium text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:bg-white dark:focus:bg-[#101f3c] focus:border-[#2daee8] dark:focus:border-[#2daee8] focus:ring-2 focus:ring-[#2daee8]/20 transition-all shadow-inner"
            />
          </div>
        </form>

        {/* Header Nav Links */}
        <div className="hidden lg:flex items-center gap-6 text-xs font-bold tracking-wide uppercase font-space">
          {navLinks.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`relative py-1 transition-colors flex items-center gap-1.5 ${
                  isActive 
                    ? 'text-[#1153aa] dark:text-[#2daee8]' 
                    : 'text-slate-700 dark:text-slate-300 hover:text-[#1153aa] dark:hover:text-[#2daee8]'
                }`}
              >
                <span>{item.label}</span>
                {item.badge && (
                  <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded-full bg-red-500 text-white animate-pulse">
                    {item.badge}
                  </span>
                )}
                {isActive && (
                  <span className="absolute -bottom-1.5 left-0 right-0 h-0.5 bg-gradient-to-r from-[#1153aa] to-[#2daee8] rounded-full"></span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Header Right: Theme Switcher & Auth */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          
          {/* Light / Dark Mode Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 sm:p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/80 dark:bg-[#0d172e] text-slate-700 dark:text-slate-300 hover:text-[#1153aa] dark:hover:text-[#2daee8] hover:border-[#2daee8]/40 transition-all cursor-pointer shadow-xs"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle Light/Dark Theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400 rotate-0 transition-transform" />
            ) : (
              <Moon className="w-4 h-4 text-[#1153aa] transition-transform" />
            )}
          </button>

          {/* Auth Buttons */}
          <div className="hidden sm:flex items-center gap-2">
            {user ? (
              <div className="flex items-center gap-2.5">
                <Link 
                  to="/student/dashboard" 
                  className="flex items-center gap-2 bg-gradient-to-r from-[#1153aa] to-[#2daee8] px-4 py-2.5 rounded-xl text-xs font-bold text-white hover:opacity-95 transition-all shadow-md shadow-[#2daee8]/20"
                >
                  <User className="w-3.5 h-3.5 text-white" />
                  <span>Dashboard</span>
                </Link>
                <button 
                  onClick={logout} 
                  className="p-2.5 text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer" 
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openAuthModal('login')}
                  className="px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 rounded-xl hover:border-[#1153aa] dark:hover:border-[#2daee8] hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-all cursor-pointer"
                >
                  Log in
                </button>
                <button
                  onClick={() => openAuthModal('signup')}
                  className="px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-[#1153aa] to-[#2daee8] rounded-xl hover:shadow-lg hover:shadow-[#2daee8]/25 transition-all cursor-pointer"
                >
                  Sign up
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden text-slate-700 dark:text-slate-300 p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Glassmorphic Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200/80 dark:border-slate-800/80 bg-white/98 dark:bg-[#080e1a]/98 backdrop-blur-xl px-5 pt-4 pb-7 flex flex-col gap-4 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-200 absolute top-20 left-0 right-0 z-50">
          <form onSubmit={handleSearch} className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search courses..."
              className="w-full bg-slate-100/90 dark:bg-[#0d172e] border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:border-[#2daee8] font-medium"
            />
          </form>

          <nav className="flex flex-col gap-1 text-sm font-bold text-slate-800 dark:text-slate-200 font-space">
            {navLinks.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-xl hover:bg-blue-50 dark:hover:bg-[#0d172e] hover:text-[#1153aa] dark:hover:text-[#2daee8] transition-colors flex items-center justify-between"
              >
                <span>{item.label}</span>
                {item.badge && (
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-red-500 text-white">
                    {item.badge}
                  </span>
                )}
              </Link>
            ))}
          </nav>
          
          {/* Mobile Theme Toggle */}
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
            <button
              onClick={toggleTheme}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-100 dark:bg-[#0d172e] border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200"
            >
              <div className="flex items-center gap-2">
                {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-[#1153aa]" />}
                <span>Theme: {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</span>
              </div>
              <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">Tap to change</span>
            </button>
          </div>
          
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-2.5">
            {user ? (
              <div className="space-y-2">
                <Link
                  to="/student/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center bg-gradient-to-r from-[#1153aa] to-[#2daee8] text-white font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm"
                >
                  <User className="w-4 h-4" />
                  <span>My Dashboard</span>
                </Link>
                <button
                  onClick={() => { setMobileMenuOpen(false); logout(); }}
                  className="w-full text-center border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold py-2.5 rounded-xl text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Log out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => { setMobileMenuOpen(false); openAuthModal('login'); }}
                  className="w-full text-center border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-bold py-2.5 rounded-xl text-xs hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Log in
                </button>
                <button
                  onClick={() => { setMobileMenuOpen(false); openAuthModal('signup'); }}
                  className="w-full text-center bg-gradient-to-r from-[#1153aa] to-[#2daee8] text-white font-bold py-2.5 rounded-xl text-xs hover:opacity-95 transition-colors shadow-sm cursor-pointer"
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
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#1153aa]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#2daee8]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
        
        {/* Top Grid Area */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-slate-800/80">
          
          {/* Brand & Mission Column */}
          <div className="md:col-span-5 space-y-5">
            <Link to="/" className="inline-flex items-center gap-3 group">
              <img src="/assets/logo.png" alt="NexxSkill Logo" className="w-9 h-9 object-contain rounded-xl shadow-md group-hover:scale-105 transition-transform" />
              <span className="text-xl font-extrabold tracking-tight text-white font-space">
                Nexx<span className="text-[#2daee8]">Skill</span>
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
              <li><Link to="/courses" className="hover:text-[#2daee8] transition-colors flex items-center gap-1.5"><span className="text-[#2daee8]">•</span> Mainframe Masterclass</Link></li>
              <li><Link to="/courses" className="hover:text-[#2daee8] transition-colors flex items-center gap-1.5"><span className="text-[#2daee8]">•</span> COBOL & JCL Bootcamps</Link></li>
              <li><Link to="/courses" className="hover:text-[#2daee8] transition-colors flex items-center gap-1.5"><span className="text-[#2daee8]">•</span> Interview Prep Cohort</Link></li>
              <li><Link to="/webinars" className="hover:text-[#2daee8] transition-colors flex items-center gap-1.5"><span className="text-[#2daee8]">•</span> Live Tech Webinars</Link></li>
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
                  <span>Cashfree PCI-DSS 256-Bit Secure</span>
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
