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
    <div className="bg-white text-slate-900 min-h-screen font-sans pb-20">
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
            <div className="bg-white border border-slate-200 p-5 rounded-lg flex items-start gap-4 shadow-xs">
              <div className="w-10 h-10 rounded-md bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Email Us</h4>
                <p className="text-xs text-slate-500 mt-0.5">Replies within 24 hours</p>
                <a href="mailto:nexxskill39@gmail.com" className="text-xs font-bold text-blue-600 hover:underline mt-1.5 inline-block">
                  nexxskill39@gmail.com
                </a>
              </div>
            </div>

            <div className="bg-white border border-slate-200 p-5 rounded-lg flex items-start gap-4 shadow-xs">
              <div className="w-10 h-10 rounded-md bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Call Support</h4>
                <p className="text-xs text-slate-500 mt-0.5">Mon - Sat, 10 AM - 7 PM IST</p>
                <a href="tel:+916002860802" className="text-xs font-bold text-blue-600 hover:underline mt-1.5 inline-block">
                  +91 6002860802
                </a>
              </div>
            </div>

            <div className="bg-white border border-slate-200 p-5 rounded-lg flex items-start gap-4 shadow-xs">
              <div className="w-10 h-10 rounded-md bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">WhatsApp Support</h4>
                <p className="text-xs text-slate-500 mt-0.5">Instant messaging</p>
                <a href="https://wa.me/916002860802" target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-emerald-700 hover:underline mt-1.5 inline-block">
                  Chat on WhatsApp
                </a>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="md:col-span-7 bg-white border border-slate-200 p-6 sm:p-8 rounded-lg shadow-xs">
            <h3 className="text-xl font-bold text-slate-900 font-space mb-4">Send a Message</h3>

            {status && (
              <div className={`mb-4 p-3 rounded-md flex items-center gap-3 text-xs ${status.type === 'success' ? 'bg-emerald-50 border border-emerald-200 text-emerald-800' : 'bg-red-50 border border-red-200 text-red-800'}`}>
                {status.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />}
                <span>{status.message}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Full name"
                    className="w-full bg-white border border-slate-300 rounded-md px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">WhatsApp Number</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full bg-white border border-slate-300 rounded-md px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@example.com"
                  className="w-full bg-white border border-slate-300 rounded-md px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Subject</label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="Course query..."
                  className="w-full bg-white border border-slate-300 rounded-md px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Message *</label>
                <textarea
                  rows="3"
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="How can we help?"
                  className="w-full bg-white border border-slate-300 rounded-md px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-600"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-4 rounded-md text-sm transition-colors shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
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
