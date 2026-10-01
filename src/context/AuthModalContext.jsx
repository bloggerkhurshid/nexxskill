import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { X, AlertCircle, CheckCircle2, Eye, EyeOff, Lock, Mail, User, Phone, ArrowRight, ArrowLeft, ShieldCheck, Sparkles, KeyRound } from 'lucide-react';

const AuthModalContext = createContext();

export const AuthModalProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState('login'); // 'login' or 'signup'
  const [signupStep, setSignupStep] = useState('details'); // 'details' or 'otp'
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState('');
  const [infoMessage, setInfoMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const { login, loginWithGoogle, register, sendRegisterOtp } = useAuth();
  const navigate = useNavigate();

  // Handle countdown for OTP resend
  useEffect(() => {
    let timer = null;
    if (resendCooldown > 0) {
      timer = setTimeout(() => {
        setResendCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  const openAuthModal = (initialMode = 'login') => {
    setMode(initialMode);
    setSignupStep('details');
    setError('');
    setInfoMessage('');
    setOtp('');
    setAgreed(false);
    setShowPassword(false);
    setResendCooldown(0);
    setIsOpen(true);
  };

  const closeAuthModal = () => {
    setIsOpen(false);
    setError('');
    setInfoMessage('');
    setOtp('');
    setSignupStep('details');
  };

  // Step 1: Send OTP to email
  const handleRequestOtp = async (e) => {
    if (e) e.preventDefault();
    setError('');
    setInfoMessage('');

    if (!name.trim()) {
      setError('Please enter your full name');
      return;
    }

    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Please enter a valid email address');
      return;
    }

    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (!agreed) {
      setError('Please agree to the Terms of Service & Privacy Policy');
      return;
    }

    setLoading(true);

    try {
      const res = await sendRegisterOtp(email.trim(), name.trim());
      setSignupStep('otp');
      setResendCooldown(60);
      setInfoMessage(res?.message || `A 6-digit verification code was sent to ${email.trim()}`);
    } catch (err) {
      setError(err.message || 'Failed to send verification code. Please check your email and try again.');
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (resendCooldown > 0) return;
    setError('');
    setInfoMessage('');
    setLoading(true);

    try {
      const res = await sendRegisterOtp(email.trim(), name.trim());
      setResendCooldown(60);
      setInfoMessage(res?.message || 'New verification code sent! Check your inbox or spam folder.');
    } catch (err) {
      setError(err.message || 'Failed to resend verification code');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP & Complete Registration OR Login
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setInfoMessage('');

    if (mode === 'login') {
      setLoading(true);
      try {
        await login(email, password);
        closeAuthModal();
        navigate('/student/dashboard');
      } catch (err) {
        setError(err.message || 'Login failed');
      } finally {
        setLoading(false);
      }
      return;
    }

    // Signup Step 1: user pressed enter or button on details form
    if (signupStep === 'details') {
      await handleRequestOtp(e);
      return;
    }

    // Signup Step 2: verify OTP
    const cleanOtp = otp.trim();
    if (!cleanOtp || cleanOtp.length !== 6) {
      setError('Please enter the 6-digit verification code sent to your email');
      return;
    }

    setLoading(true);

    try {
      await register(name.trim(), email.trim(), phone.trim(), password, cleanOtp);
      closeAuthModal();
      navigate('/student/dashboard');
    } catch (err) {
      setError(err.message || 'Verification failed. Please check the code and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setError('');
    setInfoMessage('');
    setGoogleLoading(true);

    try {
      await loginWithGoogle();
      closeAuthModal();
      navigate('/student/dashboard');
    } catch (err) {
      setError(err.message || 'Google authentication failed');
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <AuthModalContext.Provider value={{ openAuthModal, closeAuthModal }}>
      {children}

      {/* Modern Modal Backdrop */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-[#0d172e] border border-slate-200/80 dark:border-[#1a2d52] w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden relative animate-in fade-in zoom-in-95 duration-200 grid grid-cols-1 md:grid-cols-12 my-auto">
            
            {/* Left Brand Panel */}
            <div className="md:col-span-5 bg-gradient-to-br from-[#0b172a] via-[#1153aa]/90 to-[#080e1a] p-8 text-white flex flex-col justify-between relative overflow-hidden hidden md:flex">
              <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 rounded-full bg-[#2daee8]/20 blur-2xl pointer-events-none"></div>
              
              <div className="space-y-6 relative z-10">
                <div className="flex items-center gap-2.5">
                  <img src="/assets/logo.png" alt="NexxSkill Logo" className="w-9 h-9 object-contain rounded-lg" />
                  <span className="font-extrabold text-xl tracking-tight font-space text-white">
                    Nexx<span className="text-[#2daee8]">Skill</span>
                  </span>
                </div>

                <div className="space-y-3 pt-4">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#2daee8]/20 text-[#2daee8] text-[11px] font-semibold tracking-wide border border-[#2daee8]/30 uppercase">
                    <Sparkles className="w-3 h-3 text-[#2daee8]" />
                    <span>Mainframe & Data</span>
                  </span>
                  <h2 className="text-2xl font-bold font-space text-white leading-tight">
                    {mode === 'login'
                      ? 'Welcome Back!'
                      : signupStep === 'otp'
                      ? 'Email Verification'
                      : 'Start Your Journey'}
                  </h2>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {mode === 'login' 
                      ? 'Log in to continue your enterprise Mainframe and high-scale system engineering labs.'
                      : signupStep === 'otp'
                      ? 'We ensure high security by verifying your email address before activating your student dashboard.'
                      : 'Join 600+ engineers mentored directly by IBM & Societe Generale tech veterans.'}
                  </p>
                </div>
              </div>

              <div className="pt-8 border-t border-slate-700/60 space-y-2 text-[11px] text-slate-400 relative z-10">
                <div className="flex items-center gap-2 text-slate-300">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Secure 256-Bit Encrypted Session</span>
                </div>
                <p className="text-[10px] text-slate-500">© 2026 NexxSkill Technical Academy</p>
              </div>
            </div>

            {/* Right Form Area */}
            <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-between bg-white dark:bg-[#0d172e] relative">
              
              {/* Close Button */}
              <button 
                onClick={closeAuthModal} 
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 bg-slate-100 dark:bg-[#1a2d52]/60 hover:bg-slate-200 dark:hover:bg-[#1a2d52] p-1.5 rounded-full transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white font-space">
                    {mode === 'login' 
                      ? 'Sign in to Account' 
                      : signupStep === 'otp' 
                      ? 'Verify Email Address' 
                      : 'Create Free Account'}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {mode === 'login' 
                      ? 'Enter your registered student credentials' 
                      : signupStep === 'otp'
                      ? `Enter the 6-digit code sent to ${email}`
                      : 'Fill details below to get instant access'}
                  </p>
                </div>

                {error && (
                  <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-red-700 dark:text-red-300 text-xs flex items-center justify-between gap-2 animate-in fade-in duration-150">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                      <span className="font-semibold leading-relaxed">{error}</span>
                    </div>
                    {error.toLowerCase().includes('already exists') && mode === 'signup' && (
                      <button
                        type="button"
                        onClick={() => { setMode('login'); setError(''); setInfoMessage(''); }}
                        className="text-[#2daee8] hover:text-[#1153aa] dark:hover:text-sky-300 underline font-bold whitespace-nowrap cursor-pointer shrink-0 ml-2"
                      >
                        Sign in now →
                      </button>
                    )}
                  </div>
                )}

                {infoMessage && (
                  <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2.5 animate-in fade-in duration-150">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span className="font-medium leading-relaxed">{infoMessage}</span>
                  </div>
                )}

                {/* Google Sign-in / Sign-up Button */}
                {(mode === 'login' || (mode === 'signup' && signupStep === 'details')) && (
                  <div>
                    <button
                      type="button"
                      onClick={handleGoogleAuth}
                      disabled={googleLoading || loading}
                      className="w-full flex items-center justify-center gap-3 bg-white dark:bg-[#101f3c] border border-slate-300 dark:border-[#1e3a6a] hover:bg-slate-50 dark:hover:bg-[#14264b] text-slate-800 dark:text-slate-100 font-semibold py-2.5 px-4 rounded-xl text-xs transition-all shadow-sm cursor-pointer disabled:opacity-50"
                    >
                      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                      </svg>
                      <span>{googleLoading ? 'Connecting to Google...' : mode === 'login' ? 'Sign in with Google' : 'Sign up with Google'}</span>
                    </button>

                    <div className="relative my-3">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-slate-200 dark:border-[#1e3a6a]"></div>
                      </div>
                      <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-wider">
                        <span className="bg-white dark:bg-[#0d172e] px-2 text-slate-400">or with email</span>
                      </div>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-3.5">
                  {/* SIGNUP STEP 1: Personal Details */}
                  {mode === 'signup' && signupStep === 'details' && (
                    <>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">Full Name *</label>
                        <div className="relative">
                          <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                          <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Ananya Roy"
                            className="w-full bg-slate-50 dark:bg-[#101f3c] border border-slate-200 dark:border-[#1e3a6a] focus:bg-white dark:focus:bg-[#14264b] focus:border-[#2daee8] rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-slate-900 dark:text-white font-medium focus:outline-none transition-all"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">Email Address *</label>
                        <div className="relative">
                          <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                          <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="student@example.com"
                            className="w-full bg-slate-50 dark:bg-[#101f3c] border border-slate-200 dark:border-[#1e3a6a] focus:bg-white dark:focus:bg-[#14264b] focus:border-[#2daee8] rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-slate-900 dark:text-white font-medium focus:outline-none transition-all"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">WhatsApp Number (Optional)</label>
                        <div className="relative">
                          <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                          <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="+91 98765 43210"
                            className="w-full bg-slate-50 dark:bg-[#101f3c] border border-slate-200 dark:border-[#1e3a6a] focus:bg-white dark:focus:bg-[#14264b] focus:border-[#2daee8] rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-slate-900 dark:text-white font-medium focus:outline-none transition-all"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">Password *</label>
                        <div className="relative">
                          <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                          <input
                            type={showPassword ? 'text' : 'password'}
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Minimum 6 characters"
                            className="w-full bg-slate-50 dark:bg-[#101f3c] border border-slate-200 dark:border-[#1e3a6a] focus:bg-white dark:focus:bg-[#14264b] focus:border-[#2daee8] rounded-xl pl-10 pr-10 py-2.5 text-xs text-slate-900 dark:text-white font-medium focus:outline-none transition-all"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-0.5 cursor-pointer"
                            title={showPassword ? 'Hide password' : 'Show password'}
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      {/* Terms and Conditions Checkbox */}
                      <div className="flex items-start gap-2 pt-1">
                        <input
                          type="checkbox"
                          id="modal-agreed"
                          checked={agreed}
                          onChange={(e) => setAgreed(e.target.checked)}
                          className="mt-0.5 rounded border-slate-300 text-[#1153aa] focus:ring-[#2daee8] cursor-pointer"
                        />
                        <label htmlFor="modal-agreed" className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug cursor-pointer select-none">
                          I agree to the <Link to="/terms" onClick={closeAuthModal} className="text-[#2daee8] font-bold hover:underline">Terms</Link>, <Link to="/privacy-policy" onClick={closeAuthModal} className="text-[#2daee8] font-bold hover:underline">Privacy</Link> & <Link to="/refund-policy" onClick={closeAuthModal} className="text-[#2daee8] font-bold hover:underline">Refund Policy</Link>.
                        </label>
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-brand-gradient hover:opacity-95 text-white font-bold py-3 px-4 rounded-xl text-xs transition-all shadow-brand-glow disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2 mt-2"
                      >
                        <span>{loading ? 'Sending Verification Code...' : 'Continue to Verify Email'}</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </>
                  )}

                  {/* SIGNUP STEP 2: OTP Verification Input */}
                  {mode === 'signup' && signupStep === 'otp' && (
                    <div className="space-y-4 pt-1">
                      <div className="p-3.5 bg-blue-50/80 dark:bg-[#101f3c]/60 border border-blue-200 dark:border-[#1e3a6a] rounded-2xl flex items-center justify-between text-xs">
                        <div className="truncate mr-2">
                          <span className="text-slate-500 dark:text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Sending OTP To</span>
                          <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">{email}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => { setSignupStep('details'); setError(''); setInfoMessage(''); }}
                          className="text-[#2daee8] hover:text-[#1153aa] text-xs font-bold underline cursor-pointer shrink-0 flex items-center gap-1"
                        >
                          <ArrowLeft className="w-3 h-3" />
                          <span>Change</span>
                        </button>
                      </div>

                      <div>
                        <label className="block text-center text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                          Enter 6-Digit Verification Code
                        </label>
                        <div className="relative max-w-[280px] mx-auto">
                          <KeyRound className="w-5 h-5 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                          <input
                            type="text"
                            inputMode="numeric"
                            autoComplete="one-time-code"
                            maxLength={6}
                            required
                            autoFocus
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                            placeholder="123456"
                            className="w-full bg-slate-50 dark:bg-[#101f3c] border-2 border-slate-300 dark:border-[#1e3a6a] focus:bg-white dark:focus:bg-[#14264b] focus:border-[#2daee8] rounded-2xl pl-10 pr-4 py-2.5 text-center font-mono text-xl font-bold tracking-[0.4em] text-slate-900 dark:text-white focus:outline-none transition-all shadow-inner"
                          />
                        </div>
                        <p className="text-[11px] text-center text-slate-500 dark:text-slate-400 mt-2">
                          Valid for 10 minutes. Check your spam folder if not received.
                        </p>
                      </div>

                      <div className="text-center pt-1">
                        {resendCooldown > 0 ? (
                          <span className="text-xs text-slate-400 font-medium">
                            Resend code in <strong className="text-slate-600 dark:text-slate-300">{resendCooldown}s</strong>
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={handleResendOtp}
                            disabled={loading}
                            className="text-xs text-[#2daee8] hover:text-[#1153aa] dark:hover:text-sky-300 font-bold underline cursor-pointer disabled:opacity-50"
                          >
                            Didn't receive code? Resend Code
                          </button>
                        )}
                      </div>

                      <button
                        type="submit"
                        disabled={loading || otp.length !== 6}
                        className="w-full bg-brand-gradient hover:opacity-95 text-white font-bold py-3.5 px-4 rounded-xl text-xs transition-all shadow-brand-glow disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2 mt-2"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        <span>{loading ? 'Verifying & Registering...' : 'Verify Email & Create Account'}</span>
                      </button>
                    </div>
                  )}

                  {/* LOGIN FORM */}
                  {mode === 'login' && (
                    <>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">Email Address</label>
                        <div className="relative">
                          <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                          <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="student@example.com"
                            className="w-full bg-slate-50 dark:bg-[#101f3c] border border-slate-200 dark:border-[#1e3a6a] focus:bg-white dark:focus:bg-[#14264b] focus:border-[#2daee8] rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-slate-900 dark:text-white font-medium focus:outline-none transition-all"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">Password</label>
                        <div className="relative">
                          <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                          <input
                            type={showPassword ? 'text' : 'password'}
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full bg-slate-50 dark:bg-[#101f3c] border border-slate-200 dark:border-[#1e3a6a] focus:bg-white dark:focus:bg-[#14264b] focus:border-[#2daee8] rounded-xl pl-10 pr-10 py-2.5 text-xs text-slate-900 dark:text-white font-medium focus:outline-none transition-all"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-0.5 cursor-pointer"
                            title={showPassword ? 'Hide password' : 'Show password'}
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-brand-gradient hover:opacity-95 text-white font-bold py-3 px-4 rounded-xl text-xs transition-all shadow-brand-glow disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2 mt-2"
                      >
                        <span>{loading ? 'Signing in...' : 'Sign In to Portal'}</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </form>
              </div>

              {/* Toggle Login/Signup */}
              <div className="pt-5 mt-4 border-t border-slate-100 dark:border-[#1a2d52] text-center text-xs text-slate-500 dark:text-slate-400">
                {mode === 'login' ? (
                  <span>
                    Don't have an account?{' '}
                    <button onClick={() => { setMode('signup'); setSignupStep('details'); setError(''); setInfoMessage(''); }} className="text-[#2daee8] font-bold hover:underline cursor-pointer">
                      Sign up for free
                    </button>
                  </span>
                ) : (
                  <span>
                    Already registered?{' '}
                    <button onClick={() => { setMode('login'); setError(''); setInfoMessage(''); }} className="text-[#2daee8] font-bold hover:underline cursor-pointer">
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

