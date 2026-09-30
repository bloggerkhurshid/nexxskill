import React, { useState } from 'react';
import api from '../services/api';
import { Mail, Phone, MessageSquare, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { SEO } from '../components/SEO';

export const Contact = () => {
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const res = await api.post('/contact', formData);
      if (res.data?.success) {
        setStatus({ type: 'success', message: 'Your message has been sent successfully!' });
        setFormData({ name: '', phone: '', email: '', subject: '', message: '' });
      }
    } catch (err) {
      setStatus({ type: 'error', message: err.response?.data?.error?.message || 'Failed to send message' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 dark:bg-[#080e1a] text-slate-900 dark:text-slate-100 min-h-screen font-sans pb-20 transition-colors duration-300">
      <SEO
        title="Contact NexxSkill Support & Admissions"
        description="Get in touch with NexxSkill Academy. Contact our admissions team for course inquiries, batch timings, and enterprise training consultations."
        canonical="/contact"
        keywords="Contact NexxSkill, Mainframe Admissions, Course Inquiry, IT Support, Tech Training Contact"
      />
      
      {/* Page Hero Section */}
      <PageHeader
        badgeText="24/7 Student Desk"
        titlePrefix="Contact"
        highlightTitle="NexxSkill Support"
        description="Have questions regarding course schedules, enrollment procedures, or technical syllabus?"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Info Cards */}
          <div className="md:col-span-5 space-y-4">
            <div className="bg-white dark:bg-[#0d172e] border border-slate-200 dark:border-[#1a2d52] p-5 rounded-2xl flex items-start gap-4 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-[#1153aa]/10 dark:bg-[#2daee8]/20 text-[#2daee8] flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">Email Us</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Replies within 24 hours</p>
                <a href="mailto:nexxskill39@gmail.com" className="text-xs font-bold text-[#2daee8] hover:underline mt-1.5 inline-block">
                  nexxskill39@gmail.com
                </a>
              </div>
            </div>

            <div className="bg-white dark:bg-[#0d172e] border border-slate-200 dark:border-[#1a2d52] p-5 rounded-2xl flex items-start gap-4 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-[#1153aa]/10 dark:bg-[#2daee8]/20 text-[#2daee8] flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">Call Support</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Mon - Sat, 10 AM - 7 PM IST</p>
                <a href="tel:+916002860802" className="text-xs font-bold text-[#2daee8] hover:underline mt-1.5 inline-block">
                  +91 6002860802
                </a>
              </div>
            </div>

            <div className="bg-white dark:bg-[#0d172e] border border-slate-200 dark:border-[#1a2d52] p-5 rounded-2xl flex items-start gap-4 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">WhatsApp Support</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Instant messaging</p>
                <a href="https://wa.me/916002860802" target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline mt-1.5 inline-block">
                  Chat on WhatsApp
                </a>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="md:col-span-7 bg-white dark:bg-[#0d172e] border border-slate-200 dark:border-[#1a2d52] p-6 sm:p-8 rounded-2xl shadow-xs">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white font-space mb-4">Send a Message</h3>

            {status && (
              <div className={`mb-4 p-3.5 rounded-xl flex items-center gap-3 text-xs ${status.type === 'success' ? 'bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300' : 'bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300'}`}>
                {status.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" /> : <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0" />}
                <span>{status.message}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1.5">Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Full name"
                    className="w-full bg-slate-50 dark:bg-[#101f3c] border border-slate-200 dark:border-[#1e3a6a] rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#2daee8] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1.5">WhatsApp Number</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full bg-slate-50 dark:bg-[#101f3c] border border-slate-200 dark:border-[#1e3a6a] rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#2daee8] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1.5">Email Address *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@example.com"
                  className="w-full bg-slate-50 dark:bg-[#101f3c] border border-slate-200 dark:border-[#1e3a6a] rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#2daee8] transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1.5">Subject</label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="Course query..."
                  className="w-full bg-slate-50 dark:bg-[#101f3c] border border-slate-200 dark:border-[#1e3a6a] rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#2daee8] transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1.5">Message *</label>
                <textarea
                  rows="3"
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="How can we help?"
                  className="w-full bg-slate-50 dark:bg-[#101f3c] border border-slate-200 dark:border-[#1e3a6a] rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#2daee8] transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-brand-gradient hover:opacity-95 text-white font-bold py-3 px-4 rounded-xl text-sm transition-all shadow-brand-glow disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>{loading ? 'Sending...' : 'Submit Message'}</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
