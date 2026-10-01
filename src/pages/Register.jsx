import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { SEO } from '../components/SEO';
import { PageHeader } from '../components/PageHeader';

export const Register = () => {
  const [searchParams] = useSearchParams();
  const prefilledCourse = searchParams.get('course') || '';

  const [formData, setFormData] = useState({
    full_name: '',
    mobile: '',
    email: '',
    course_interested: prefilledCourse || 'Mainframe Full Course',
    experience_level: 'Beginner'
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const res = await api.post('/leads', formData);
      if (res.data?.success) {
        setStatus({ type: 'success', message: 'Registration inquiry submitted! Our career counselor will contact you shortly.' });
        setFormData({ full_name: '', mobile: '', email: '', course_interested: 'Mainframe Full Course', experience_level: 'Beginner' });
      }
    } catch (err) {
      setStatus({ type: 'error', message: err.response?.data?.error?.message || 'Submission failed' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 dark:bg-[#080e1a] text-slate-900 dark:text-slate-100 min-h-screen font-sans pb-20 transition-colors duration-300">
      <SEO
        title="Register Your Interest & Career Counseling"
        description="Register your interest for NexxSkill enterprise training cohorts. Book a free 1-on-1 counseling session with our lead instructor."
        canonical="/register"
        keywords="Register NexxSkill, Mainframe Counseling, Career Advice, Software Cohort Enrollment"
      />
      
      {/* Page Hero Section */}
      <PageHeader
        badgeText="Admissions & Counseling"
        titlePrefix="Register Your"
        highlightTitle="Career Interest"
        description="Book a free 1-on-1 guidance session with our lead instructor Jahangir Alom Bakul."
      />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="bg-white dark:bg-[#0d172e] border border-slate-200/90 dark:border-[#1a2d52] p-8 sm:p-10 rounded-3xl shadow-xl transition-colors">
          {status && (
            <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 text-sm ${status.type === 'success' ? 'bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300' : 'bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300'}`}>
              {status.type === 'success' ? <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" /> : <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0" />}
              <span>{status.message}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1.5">Full Name *</label>
              <input
                type="text"
                required
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                placeholder="Enter your full name"
                className="w-full bg-slate-50 dark:bg-[#080e1a] border border-slate-300 dark:border-[#1e3a6a] rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#2daee8] transition-colors"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1.5">Mobile Number *</label>
                <input
                  type="tel"
                  required
                  value={formData.mobile}
                  onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="w-full bg-slate-50 dark:bg-[#080e1a] border border-slate-300 dark:border-[#1e3a6a] rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#2daee8] transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1.5">Email Address *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@example.com"
                  className="w-full bg-slate-50 dark:bg-[#080e1a] border border-slate-300 dark:border-[#1e3a6a] rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#2daee8] transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1.5">Course Interested In</label>
              <select
                value={formData.course_interested}
                onChange={(e) => setFormData({ ...formData, course_interested: e.target.value })}
                className="w-full bg-slate-50 dark:bg-[#080e1a] border border-slate-300 dark:border-[#1e3a6a] rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#2daee8] transition-colors"
              >
                <option value="Mainframe Full Course">Mainframe Full Course (₹7,999)</option>
                <option value="Mainframe Crash Course">Mainframe Crash Course (₹2,499)</option>
                <option value="Interview Preparation">Interview Preparation (₹2,499)</option>
                <option value="Corporate Communication">Corporate Communication (₹1,499)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1.5">Experience Level</label>
              <select
                value={formData.experience_level}
                onChange={(e) => setFormData({ ...formData, experience_level: e.target.value })}
                className="w-full bg-slate-50 dark:bg-[#080e1a] border border-slate-300 dark:border-[#1e3a6a] rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#2daee8] transition-colors"
              >
                <option value="Beginner">Beginner (College Student / Fresher)</option>
                <option value="Intermediate">Intermediate (1-3 Years Experience)</option>
                <option value="Advanced">Advanced (3+ Years Senior Professional)</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-gradient hover:opacity-95 text-white font-bold py-3.5 px-6 rounded-xl text-sm transition-all shadow-brand-glow disabled:opacity-50 cursor-pointer mt-2"
            >
              {loading ? 'Submitting Registration...' : 'Submit Registration Lead'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

