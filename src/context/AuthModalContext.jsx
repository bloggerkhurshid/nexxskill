import React, { createContext, useContext, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { X, AlertCircle, Eye, EyeOff, Lock, Mail, User, Phone, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

const AuthModalContext = createContext();

export const AuthModalProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState('login'); // 'login' or 'signup'
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, register } = useAuth();
  const navigate = useNavigate();

  const openAuthModal = (initialMode = 'login') => {
    setMode(initialMode);
    setError('');
    setAgreed(false);
    setShowPassword(false);
    setIsOpen(true);
  };

  const closeAuthModal = () => {
    setIsOpen(false);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (mode === 'signup' && !agreed) {
      setError('Please agree to the Terms of Service & Privacy Policy');
      return;
    }

    setLoading(true);

    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        await register(name, email, phone, password);
      }
      closeAuthModal();
      navigate('/student/dashboard');
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthModalContext.Provider value={{ openAuthModal, closeAuthModal }}>
      {children}

      {/* Modern Modal Backdrop */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200/80 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden relative animate-in fade-in zoom-in-95 duration-200 grid grid-cols-1 md:grid-cols-12 my-auto">
            
            {/* Left Brand Panel */}
            <div className="md:col-span-5 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 p-8 text-white flex flex-col justify-between relative overflow-hidden hidden md:flex">
              <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 rounded-full bg-blue-500/10 blur-2xl pointer-events-none"></div>
              
              <div className="space-y-6 relative z-10">
                <div className="flex items-center gap-2.5">
                  <img src="/assets/logo.png" alt="NexxSkill Logo" className="w-9 h-9 object-contain rounded-lg" />
                  <span className="font-extrabold text-xl tracking-tight font-space text-white">
                    Nexx<span className="text-blue-400">Skill</span>
                  </span>
                </div>

                <div className="space-y-3 pt-4">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 text-[11px] font-semibold tracking-wide border border-blue-400/30 uppercase">
                    <Sparkles className="w-3 h-3 text-blue-400" />
                    <span>Mainframe & Data</span>
                  </span>
                  <h2 className="text-2xl font-bold font-space text-white leading-tight">
                    {mode === 'login' ? 'Welcome Back!' : 'Start Your Journey'}
                  </h2>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {mode === 'login' 
                      ? 'Log in to continue your enterprise Mainframe and high-scale system engineering labs.'
                      : 'Join 600+ engineers mentored directly by IBM & Societe Generale tech veterans.'}
                  </p>
                </div>
              </div>

              <div className="pt-8 border-t border-slate-800/80 space-y-2 text-[11px] text-slate-400 relative z-10">
                <div className="flex items-center gap-2 text-slate-300">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Secure 256-Bit Encrypted Session</span>
                </div>
                <p className="text-[10px] text-slate-500">© 2026 NexxSkill Technical Academy</p>
              </div>
            </div>

            {/* Right Form Area */}
            <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-between bg-white relative">
              
              {/* Close Button */}
              <button 
                onClick={closeAuthModal} 
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 p-1.5 rounded-full transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="space-y-5">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 font-space">
                    {mode === 'login' ? 'Sign in to Account' : 'Create Free Account'}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    {mode === 'login' ? 'Enter your registered student credentials' : 'Fill details below to get instant access'}
                  </p>
                </div>

                {error && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2.5 animate-in fade-in duration-150">
                    <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                    <span className="font-semibold">{error}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-3.5">
                  {mode === 'signup' && (
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">Full Name</label>
                      <div className="relative">
                        <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Ananya Roy"
                          className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-600 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-slate-900 font-medium focus:outline-none transition-all"
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">Email Address</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="student@example.com"
                        className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-600 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-slate-900 font-medium focus:outline-none transition-all"
                      />
                    </div>
                  </div>

                  {mode === 'signup' && (
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">WhatsApp Number (Optional)</label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+91 98765 43210"
                          className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-600 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-slate-900 font-medium focus:outline-none transition-all"
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">Password</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-600 rounded-xl pl-10 pr-10 py-2.5 text-xs text-slate-900 font-medium focus:outline-none transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
                        title={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Terms and Conditions Checkbox */}
                  {mode === 'signup' && (
                    <div className="flex items-start gap-2 pt-1">
                      <input
                        type="checkbox"
                        id="modal-agreed"
                        checked={agreed}
                        onChange={(e) => setAgreed(e.target.checked)}
                        className="mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-600 cursor-pointer"
                      />
                      <label htmlFor="modal-agreed" className="text-[11px] text-slate-600 leading-snug cursor-pointer select-none">
                        I agree to the <Link to="/terms" onClick={closeAuthModal} className="text-blue-600 font-bold hover:underline">Terms</Link>, <Link to="/privacy-policy" onClick={closeAuthModal} className="text-blue-600 font-bold hover:underline">Privacy</Link> & <Link to="/refund-policy" onClick={closeAuthModal} className="text-blue-600 font-bold hover:underline">Refund Policy</Link>.
                      </label>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl text-xs transition-all shadow-md hover:shadow-lg disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2 mt-2"
                  >
                    <span>{loading ? 'Processing...' : mode === 'login' ? 'Sign In to Portal' : 'Create Student Account'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              </div>

              {/* Toggle Login/Signup */}
              <div className="pt-5 mt-4 border-t border-slate-100 text-center text-xs text-slate-500">
                {mode === 'login' ? (
                  <span>
                    Don't have an account?{' '}
                    <button onClick={() => { setMode('signup'); setError(''); }} className="text-blue-600 font-bold hover:underline cursor-pointer">
                      Sign up for free
                    </button>
                  </span>
                ) : (
                  <span>
                    Already registered?{' '}
                    <button onClick={() => { setMode('login'); setError(''); }} className="text-blue-600 font-bold hover:underline cursor-pointer">
                      Sign in here
                    </button>
                  </span>
                )}
              </div>

            </div>

          </div>
        </div>
      )}
    </AuthModalContext.Provider>
  );
};

export const useAuthModal = () => useContext(AuthModalContext);
