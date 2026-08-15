import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import { CheckCircle2, AlertCircle } from 'lucide-react';

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
    <div className="bg-white text-slate-900 min-h-screen py-12 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 font-space">Register Your Interest</h1>
          <p className="text-slate-500 text-sm">
            Book a free 1-on-1 counseling session with our lead instructor.
          </p>
        </div>

        <div className="bg-white border border-slate-200 p-8 rounded-lg shadow-sm">
          {status && (
            <div className={`mb-6 p-4 rounded-md flex items-center gap-3 text-sm ${status.type === 'success' ? 'bg-emerald-50 border border-emerald-200 text-emerald-800' : 'bg-red-50 border border-red-200 text-red-800'}`}>
              {status.type === 'success' ? <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" /> : <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />}
              <span>{status.message}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Full Name *</label>
              <input
                type="text"
                required
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                placeholder="Enter your full name"
                className="w-full bg-white border border-slate-300 rounded-md px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-blue-600"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Mobile Number *</label>
                <input
                  type="tel"
                  required
                  value={formData.mobile}
                  onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="w-full bg-white border border-slate-300 rounded-md px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@example.com"
                  className="w-full bg-white border border-slate-300 rounded-md px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-blue-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Course Interested In</label>
              <select
                value={formData.course_interested}
                onChange={(e) => setFormData({ ...formData, course_interested: e.target.value })}
                className="w-full bg-white border border-slate-300 rounded-md px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-blue-600"
              >
                <option value="Mainframe Full Course">Mainframe Full Course (₹7,999)</option>
                <option value="Mainframe Crash Course">Mainframe Crash Course (₹2,499)</option>
                <option value="Interview Preparation">Interview Preparation (₹2,499)</option>
                <option value="Corporate Communication">Corporate Communication (₹1,499)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Experience Level</label>
              <select
                value={formData.experience_level}
                onChange={(e) => setFormData({ ...formData, experience_level: e.target.value })}
                className="w-full bg-white border border-slate-300 rounded-md px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-blue-600"
              >
                <option value="Beginner">Beginner (College Student / Fresher)</option>
                <option value="Intermediate">Intermediate (1-3 Years Experience)</option>
                <option value="Advanced">Advanced (3+ Years Senior Professional)</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-md text-sm transition-colors shadow-sm disabled:opacity-50"
            >
              {loading ? 'Submitting Registration...' : 'Submit Registration Lead'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
