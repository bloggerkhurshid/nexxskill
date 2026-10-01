import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { BookOpen, User, CheckCircle, Video, Calendar, ExternalLink, FileText, Download, Printer, Image as ImageIcon, ShieldCheck, Trash2, Maximize } from 'lucide-react';
import * as htmlToImage from 'html-to-image';
import { SEO } from '../components/SEO';

export const StudentDashboard = () => {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [webinarBookings, setWebinarBookings] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [updating, setUpdating] = useState(false);
  const [msg, setMsg] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [downloadingImage, setDownloadingImage] = useState(false);
  const [selectedVideoModal, setSelectedVideoModal] = useState(null);
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [enrRes, profRes] = await Promise.all([
        api.get('/student/enrollments'),
        api.get('/student/profile')
      ]);

      if (enrRes.data?.success) {
        setEnrollments(enrRes.data.data.enrollments || []);
      }
      if (profRes.data?.success) {
        const p = profRes.data.data.profile;
        setProfile(p);
        setEditName(p.name || '');
        setEditPhone(p.phone || '');
        setWebinarBookings(profRes.data.data.webinar_bookings || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setMsg('');

    try {
      const res = await api.put('/student/profile', { name: editName, phone: editPhone });
      if (res.data?.success) {
        setMsg('Profile updated successfully');
        fetchData();
      }
    } catch (err) {
      setMsg(err.response?.data?.error?.message || 'Failed to update profile');
    } finally {
      setUpdating(false);
    }
  };

  const handleSaveAsImage = async () => {
    const node = document.getElementById('printable-invoice-card');
    if (!node || !selectedInvoice) return;
    
    try {
      setDownloadingImage(true);
      const dataUrl = await htmlToImage.toPng(node, {
        quality: 0.95,
        backgroundColor: '#ffffff',
        filter: (domNode) => {
          return !domNode.classList || !domNode.classList.contains('no-print');
        }
      });
      
      const link = document.createElement('a');
      link.download = `Invoice-INV-2026-${selectedInvoice.id + 1000}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to export invoice image:', err);
    } finally {
      setDownloadingImage(false);
    }
  };

  const handleDownloadPdf = () => {
    if (!selectedInvoice) return;
    
    const invoiceNumber = `INV-2026-${(selectedInvoice.id + 1000)}`;
    const studentName = profile?.name || user?.name || 'Student';
    const studentEmail = profile?.email || user?.email || 'N/A';
    const studentPhone = profile?.phone || 'Verified';
    const issueDate = new Date(selectedInvoice.created_at).toLocaleDateString();
    
    const discountAmount = (selectedInvoice.discount_rupees || 0);
    const paidAmount = (selectedInvoice.amount_rupees || 0);
    const originalPrice = paidAmount + discountAmount;
    const couponCode = selectedInvoice.coupon_code || '';

    const invoiceContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${invoiceNumber} - NexxSkill Invoice</title>
        <style>
          body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 40px; color: #1e293b; line-height: 1.5; }
          .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #2563eb; padding-bottom: 20px; margin-bottom: 30px; }
          .logo { font-size: 24px; font-weight: 800; color: #0f172a; text-decoration: none; }
          .logo span { color: #2563eb; }
          .subtitle { font-size: 12px; color: #64748b; margin-top: 4px; }
          .badge { background: #dcfce7; color: #166534; font-size: 11px; font-weight: 800; padding: 4px 12px; border-radius: 20px; text-transform: uppercase; letter-spacing: 1px; display: inline-block; }
          .meta { text-align: right; }
          .meta-title { font-size: 14px; font-weight: 700; color: #334155; margin-top: 8px; font-family: monospace; }
          .meta-date { font-size: 11px; color: #64748b; }
          .grid { display: flex; gap: 30px; background: #f8fafc; padding: 20px; border-radius: 12px; border: 1px solid #e2e8f0; margin-bottom: 30px; }
          .col { flex: 1; }
          .section-label { font-size: 10px; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px; }
          .student-name { font-size: 15px; font-weight: 700; color: #0f172a; }
          .student-info { font-size: 12px; color: #475569; }
          .ref-text { font-family: monospace; font-size: 11px; font-weight: 600; color: #334155; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
          th { background: #f1f5f9; text-align: left; padding: 12px; font-size: 11px; font-weight: 800; color: #475569; text-transform: uppercase; border-bottom: 1px solid #cbd5e1; }
          td { padding: 16px 12px; border-bottom: 1px solid #e2e8f0; font-size: 13px; }
          .course-title { font-weight: 700; color: #0f172a; font-size: 14px; }
          .course-sub { font-size: 11px; color: #64748b; margin-top: 2px; }
          .coupon-tag { font-family: monospace; background: #f3e8ff; color: #6b21a8; padding: 2px 6px; border-radius: 4px; font-weight: 700; font-size: 11px; margin-left: 6px; }
          .summary { display: flex; justify-content: flex-end; margin-bottom: 40px; }
          .summary-box { width: 300px; }
          .summary-row { display: flex; justify-content: space-between; font-size: 12px; color: #64748b; margin-bottom: 6px; }
          .summary-discount { display: flex; justify-content: space-between; font-size: 12px; color: #7e22ce; font-weight: 700; margin-bottom: 6px; }
          .summary-total { display: flex; justify-content: space-between; font-size: 16px; font-weight: 800; color: #0f172a; border-top: 2px solid #e2e8f0; padding-top: 10px; margin-top: 10px; }
          .summary-total span:last-child { color: #2563eb; }
          .footer { text-align: center; border-top: 1px solid #e2e8f0; padding-top: 20px; font-size: 11px; color: #94a3b8; }
        </style>
      </head>
      <body>
        <div className="header">
          <div>
            <div className="logo">Nexx<span>Skill</span></div>
            <div className="subtitle">Enterprise Engineering Academy • support@nexxskill.com</div>
          </div>
          <div className="meta">
            <div className="badge">Payment Complete</div>
            <div className="meta-title">${invoiceNumber}</div>
            <div className="meta-date">Date: ${issueDate}</div>
          </div>
        </div>

        <div className="grid">
          <div className="col">
            <div className="section-label">Billed Student</div>
            <div className="student-name">${studentName}</div>
            <div className="student-info">${studentEmail}</div>
            <div className="student-info">${studentPhone}</div>
          </div>
          <div className="col">
            <div className="section-label">Payment Details</div>
            <div className="ref-text">Order ID: ${selectedInvoice.razorpay_order_id}</div>
            <div className="ref-text">Payment ID: ${selectedInvoice.razorpay_payment_id || 'FREE_COUPON'}</div>
            <div className="student-info" style="color: #166534; font-weight: 700; margin-top: 4px;">✔ Verified Digital Receipt</div>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Description</th>
              <th style="text-align: right;">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <div className="course-title">
                  ${selectedInvoice.course_title}
                  ${couponCode ? `<span className="coupon-tag">COUPON: ${couponCode}</span>` : ''}
                </div>
                <div className="course-sub">Duration: ${selectedInvoice.course_duration} • Enterprise Technical Cohort</div>
              </td>
              <td style="text-align: right; font-weight: 700; font-size: 14px;">INR ${originalPrice.toLocaleString()}.00</td>
            </tr>
          </tbody>
        </table>

        <div className="summary">
          <div className="summary-box">
            <div className="summary-row"><span>Standard Tuition Fee:</span><span>INR ${originalPrice.toLocaleString()}.00</span></div>
            ${couponCode ? `<div className="summary-discount"><span>Coupon Discount (${couponCode}):</span><span>- INR ${discountAmount.toLocaleString()}.00</span></div>` : ''}
            <div className="summary-row"><span>GST (0% Zero-Rated):</span><span>INR 0.00</span></div>
            <div className="summary-total"><span>Total Amount Paid:</span><span>INR ${paidAmount.toLocaleString()}.00</span></div>
          </div>
        </div>

        <div className="footer">
          <p><strong>Thank you for learning with NexxSkill Academy!</strong></p>
          <p>This is an official computer-generated tax receipt for online course enrollment.</p>
        </div>

        <script>
          window.onload = function() {
            window.print();
          };
        </script>
      </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.open();
      printWindow.document.write(invoiceContent);
      printWindow.document.close();
    }
  };

  const [noticeModal, setNoticeModal] = useState(null);

  const handleCancelWebinar = async (webinarId) => {
    if (!window.confirm('Are you sure you want to cancel your reserved seat for this webinar?')) {
      return;
    }
    try {
      const res = await api.delete(`/webinars/${webinarId}/booking`);
      if (res.data?.success) {
        setNoticeModal({ type: 'success', title: 'Reservation Cancelled', message: res.data.message || 'Webinar reservation cancelled successfully' });
        fetchData();
      }
    } catch (err) {
      setNoticeModal({ type: 'error', title: 'Cancellation Error', message: err.response?.data?.error?.message || 'Failed to cancel webinar booking' });
    }
  };

  if (loading) {
    return <div className="bg-slate-50 dark:bg-[#080e1a] text-slate-500 dark:text-slate-400 min-h-screen py-16 text-center">Loading dashboard...</div>;
  }

  return (
    <div className="bg-slate-50 dark:bg-[#080e1a] text-slate-900 dark:text-slate-100 min-h-screen py-10 font-sans transition-colors duration-300">
      <SEO
        title="Student Learning Portal & Courses"
        description="Access your enrolled Mainframe courses, live session recordings, and official course receipts on NexxSkill."
        canonical="/student/dashboard"
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="bg-gradient-to-br from-[#0b172a] via-[#1153aa]/90 to-[#080e1a] text-white p-6 sm:p-8 rounded-2xl shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-[#1a2d52] relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-56 h-56 rounded-full bg-[#2daee8]/20 blur-3xl pointer-events-none"></div>
          
          <div className="relative z-10">
            <span className="text-xs font-bold text-[#2daee8] uppercase tracking-widest bg-[#2daee8]/20 border border-[#2daee8]/40 px-2.5 py-1 rounded-full">
              Student Dashboard
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-space mt-2">Welcome back, {profile?.name || user?.name}!</h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-1">{profile?.email || user?.email}</p>
          </div>

          <div className="flex items-center gap-4 bg-slate-900/60 p-4 rounded-xl border border-slate-700/60 relative z-10">
            <div className="text-right">
              <h4 className="text-2xl font-bold font-space text-[#2daee8]">{enrollments.filter(e => e.status === 'paid').length}</h4>
              <p className="text-[10px] text-slate-300 uppercase">Enrolled Courses</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Enrolled Courses List */}
          <div className="lg:col-span-8 space-y-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white font-space flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[#2daee8]" />
              <span>Enrolled Courses</span>
            </h2>

            {enrollments.length === 0 ? (
              <div className="bg-white dark:bg-[#0d172e] border border-slate-200 dark:border-[#1a2d52] p-8 rounded-2xl text-center text-slate-500 dark:text-slate-400 text-sm">
                No active course enrollments. Browse our available catalog to enroll!
              </div>
            ) : (
              <div className="space-y-3">
                {enrollments.map((enr) => (
                  <div key={enr.id} className="bg-white dark:bg-[#0d172e] border border-slate-200 dark:border-[#1a2d52] p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded uppercase flex items-center gap-1">
                          <CheckCircle className="w-3 h-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
                          <span>Success</span>
                        </span>
                        <span className="text-xs text-slate-400">• {new Date(enr.created_at).toLocaleDateString()}</span>
                      </div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">{enr.course_title}</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Duration: {enr.course_duration}</p>
                    </div>

                    <div className="flex flex-col sm:items-end gap-2 border-t sm:border-0 border-slate-100 dark:border-[#1a2d52] pt-2 sm:pt-0">
                      <div className="sm:text-right">
                        <p className="text-xs text-slate-500 dark:text-slate-400">Fee Paid:</p>
                        <p className="text-lg font-bold text-slate-900 dark:text-white font-space">₹{enr.amount_rupees?.toLocaleString()}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        {(enr.course_video_url || (Array.isArray(enr.course_videos) && enr.course_videos.length > 0)) && (
                          <button
                            onClick={() => {
                              setSelectedVideoModal(enr);
                              setActiveVideoIndex(0);
                            }}
                            className="inline-flex items-center gap-1.5 bg-brand-gradient hover:opacity-95 text-white font-bold px-3.5 py-2 rounded-xl text-xs transition-all shadow-brand-glow cursor-pointer"
                          >
                            <Video className="w-3.5 h-3.5" />
                            <span>Watch Recorded Class</span>
                          </button>
                        )}
                        <button
                          onClick={() => setSelectedInvoice(enr)}
                          className="inline-flex items-center gap-1.5 bg-slate-100 dark:bg-[#101f3c] hover:bg-slate-200 dark:hover:bg-[#14264b] text-slate-800 dark:text-slate-200 font-bold px-3 py-1.5 rounded-xl text-xs border border-slate-300 dark:border-[#1e3a6a] transition-colors cursor-pointer"
                        >
                          <FileText className="w-3.5 h-3.5 text-[#2daee8]" />
                          <span>View Invoice</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Booked Live Masterclasses & Webinars */}
            <div className="pt-6 space-y-4">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white font-space flex items-center gap-2">
                <Video className="w-5 h-5 text-[#2daee8]" />
                <span>Booked Live Masterclasses</span>
              </h2>

              {webinarBookings.length === 0 ? (
                <div className="bg-white dark:bg-[#0d172e] border border-slate-200 dark:border-[#1a2d52] p-6 rounded-2xl text-center text-slate-500 dark:text-slate-400 text-sm">
                  No upcoming webinar bookings. Browse our Webinars section to reserve your seat!
                </div>
              ) : (
                <div className="space-y-3">
                  {webinarBookings.map((wb) => (
                    <div key={wb.id} className="bg-white dark:bg-[#0d172e] border border-slate-200 dark:border-[#1a2d52] p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="bg-[#1153aa]/10 dark:bg-[#2daee8]/20 text-[#2daee8] text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                            Seat Confirmed
                          </span>
                          <span className="text-xs text-slate-400">• Booked on {new Date(wb.created_at).toLocaleDateString()}</span>
                        </div>
                        <h3 className="text-base font-bold text-slate-900 dark:text-white">{wb.webinar_title}</h3>
                        <p className="text-xs text-[#2daee8] font-semibold flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>Scheduled: {wb.selected_date}</span>
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <a
                          href={wb.meeting_url || 'https://meet.google.com/nexxskill-mainframe-demo'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 bg-brand-gradient hover:opacity-95 text-white font-bold px-4 py-2 rounded-xl text-xs transition-all shadow-brand-glow"
                        >
                          <span>Join Live Session</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                        <button
                          onClick={() => handleCancelWebinar(wb.webinar_id)}
                          className="p-2 bg-red-50 dark:bg-red-950/40 hover:bg-red-100 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/60 rounded-xl transition-colors cursor-pointer"
                          title="Cancel / Delete Reservation"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Profile Card */}
          <div className="lg:col-span-4 bg-white dark:bg-[#0d172e] border border-slate-200 dark:border-[#1a2d52] p-6 rounded-2xl space-y-4 shadow-xs">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white font-space flex items-center gap-2">
              <User className="w-5 h-5 text-[#2daee8]" />
              <span>Profile Settings</span>
            </h2>

            {msg && (
              <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 text-blue-700 dark:text-blue-300 text-xs">
                {msg}
              </div>
            )}

            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1.5">Full Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-[#101f3c] border border-slate-200 dark:border-[#1e3a6a] rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#2daee8] transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1.5">WhatsApp Number</label>
                <input
                  type="tel"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-[#101f3c] border border-slate-200 dark:border-[#1e3a6a] rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#2daee8] transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1.5">Email</label>
                <input
                  type="email"
                  disabled
                  value={profile?.email || ''}
                  className="w-full bg-slate-100 dark:bg-[#080e1a]/80 border border-slate-200 dark:border-[#1a2d52] rounded-xl px-3.5 py-2.5 text-sm text-slate-500 dark:text-slate-400 cursor-not-allowed"
                />
              </div>

              <button
                type="submit"
                disabled={updating}
                className="w-full bg-brand-gradient hover:opacity-95 text-white font-bold py-3 px-4 rounded-xl text-sm transition-all shadow-brand-glow disabled:opacity-50 cursor-pointer"
              >
                {updating ? 'Saving...' : 'Update Profile'}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Printable Invoice Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 print:p-0 print:static print:bg-white print:z-auto">
          <div id="printable-invoice-card" className="bg-white border border-slate-200 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden relative max-h-[90vh] flex flex-col print:border-none print:shadow-none print:max-h-none print:overflow-visible">
            <div className="px-6 py-4 flex items-center justify-between border-b border-slate-100 bg-slate-50 shrink-0 no-print">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-bold text-slate-900 font-space">Official Tax Invoice</h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleSaveAsImage}
                  disabled={downloadingImage}
                  className="bg-brand-gradient hover:opacity-95 text-white font-bold px-3.5 py-1.5 rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-brand-glow cursor-pointer disabled:opacity-50"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{downloadingImage ? 'Generating...' : 'Download Invoice'}</span>
                </button>
                <button onClick={() => setSelectedInvoice(null)} className="text-slate-400 hover:text-slate-700 text-2xl font-bold p-1 cursor-pointer">
                  ×
                </button>
              </div>
            </div>

            <div className="p-4 sm:p-8 space-y-4 sm:space-y-5 overflow-y-auto flex-1 text-slate-800 text-xs print:p-0 print:space-y-4">
              {/* Invoice Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-start gap-4 border-b border-slate-200 pb-4 sm:pb-5 print:pb-4 break-inside-avoid">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <img src="/assets/logo.png" alt="NexxSkill Logo" className="w-8 h-8 rounded" />
                    <span className="text-xl font-extrabold text-slate-900 font-space">Nexx<span className="text-blue-600">Skill</span></span>
                  </div>
                  <p className="text-slate-500 text-[11px] pt-0.5">Enterprise Engineering Academy</p>
                  <p className="text-slate-400 text-[10px]">support@nexxskill.com • www.nexxskill.com</p>
                </div>

                <div className="text-left sm:text-right space-y-1 w-full sm:w-auto flex flex-row sm:flex-col justify-between items-center sm:items-end border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                    Invoice Paid
                  </span>
                  <div className="text-right sm:text-right">
                    <p className="text-xs font-mono font-bold text-slate-700 sm:pt-2">INV-2026-{(selectedInvoice.id + 1000)}</p>
                    <p className="text-[10px] text-slate-400">Issued Date: {new Date(selectedInvoice.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              {/* Billed To & Platform Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 bg-slate-50 p-3.5 sm:p-4 rounded-xl border border-slate-100 break-inside-avoid">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Billed Student</span>
                  <p className="font-bold text-slate-900 text-sm">{profile?.name || user?.name}</p>
                  <p className="text-slate-500 break-all">{profile?.email || user?.email}</p>
                  <p className="text-slate-500">{profile?.phone || 'Phone verified'}</p>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Payment Reference</span>
                  <p className="font-semibold text-slate-700 font-mono text-[11px] break-all">Order ID: {selectedInvoice.razorpay_order_id}</p>
                  <p className="font-semibold text-slate-700 font-mono text-[11px] break-all">Payment Ref: {selectedInvoice.razorpay_payment_id || 'FREE_COUPON_REDEEMED'}</p>
                  <p className="text-emerald-600 font-semibold flex items-center gap-1 mt-1 text-[11px]">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Verified Transaction</span>
                  </p>
                </div>
              </div>

              {/* Itemized Table */}
              <div className="border border-slate-200 rounded-xl overflow-x-auto break-inside-avoid">
                <table className="w-full text-left min-w-[280px]">
                  <thead className="bg-slate-100 text-slate-600 uppercase text-[10px] font-bold">
                    <tr>
                      <th className="p-2.5 sm:p-3">Course Description</th>
                      <th className="p-2.5 sm:p-3 text-right">Fee Rate</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="p-2.5 sm:p-3 font-bold text-slate-900">
                        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                          <span className="text-xs sm:text-sm">{selectedInvoice.course_title}</span>
                          {selectedInvoice.coupon_code && (
                            <span className="font-mono bg-purple-100 text-purple-700 border border-purple-200 px-1.5 py-0.5 rounded text-[9px] sm:text-[10px] uppercase">
                              COUPON: {selectedInvoice.coupon_code}
                            </span>
                          )}
                        </div>
                        <span className="block font-normal text-slate-500 text-[10px] sm:text-[11px] mt-0.5">
                          Duration: {selectedInvoice.course_duration} • Enterprise Technical Cohort
                        </span>
                      </td>
                      <td className="p-2.5 sm:p-3 text-right font-bold text-slate-900 whitespace-nowrap text-xs sm:text-sm">
                        ₹{((selectedInvoice.amount_rupees || 0) + (selectedInvoice.discount_rupees || 0)).toLocaleString()}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Summary Breakdown */}
              <div className="flex justify-end pt-1 break-inside-avoid">
                <div className="w-full sm:w-72 space-y-1.5 text-xs bg-slate-50 sm:bg-transparent p-3 sm:p-0 rounded-xl sm:rounded-none border sm:border-none border-slate-100">
                  <div className="flex justify-between text-slate-500 text-[11px] sm:text-xs">
                    <span>Standard Tuition Fee:</span>
                    <span>₹{((selectedInvoice.amount_rupees || 0) + (selectedInvoice.discount_rupees || 0)).toLocaleString()}</span>
                  </div>
                  {selectedInvoice.coupon_code && (
                    <div className="flex justify-between font-bold text-purple-700 text-[11px] sm:text-xs">
                      <span>Coupon Discount ({selectedInvoice.coupon_code}):</span>
                      <span>- ₹{(selectedInvoice.discount_rupees || 0).toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-slate-500 text-[11px] sm:text-xs">
                    <span>GST (0% Zero-Rated):</span>
                    <span>₹0.00</span>
                  </div>
                  <div className="flex justify-between text-sm sm:text-base font-extrabold text-slate-900 pt-2 border-t border-slate-200 font-space">
                    <span>Total Amount Paid:</span>
                    <span className="text-blue-600">₹{(selectedInvoice.amount_rupees || 0).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Footer Note */}
              <div className="pt-3 sm:pt-4 border-t border-slate-200 text-center space-y-0.5 text-[10px] sm:text-[11px] text-slate-400 break-inside-avoid">
                <p className="font-bold text-slate-600">Thank you for learning with NexxSkill Academy!</p>
                <p>This is a computer-generated tax receipt and invoice statement for online course access.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom Notification Modal */}
      {noticeModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0d172e] border border-slate-200/90 dark:border-[#1a2d52] w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-7 text-center space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mx-auto shadow-md ${
              noticeModal.type === 'success'
                ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                : noticeModal.type === 'error'
                ? 'bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800'
                : 'bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-[#2daee8] border border-blue-200 dark:border-blue-800'
            }`}>
              <AlertCircle className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white font-space">{noticeModal.title}</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">{noticeModal.message}</p>
            </div>

            <button
              onClick={() => {
                if (noticeModal.onClose) noticeModal.onClose();
                setNoticeModal(null);
              }}
              className="w-full bg-brand-gradient hover:opacity-95 text-white font-bold py-3 px-4 rounded-xl text-xs transition-all shadow-brand-glow cursor-pointer mt-2"
            >
              Understand & Continue
            </button>
          </div>
        </div>
      )}

      {/* Recorded Class Video Player Modal */}
      {selectedVideoModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-slate-800 w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 flex items-center justify-between border-b border-slate-800 bg-slate-900">
              <div className="flex items-center gap-2">
                <Video className="w-5 h-5 text-blue-400" />
                <h3 className="text-sm font-bold text-white font-space truncate">{selectedVideoModal.course_title} - Recorded Classes</h3>
              </div>
              <button onClick={() => setSelectedVideoModal(null)} className="text-slate-400 hover:text-white text-2xl font-bold p-1 cursor-pointer">
                ×
              </button>
            </div>

            <div className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 overflow-y-auto flex-1 text-slate-200">
              {/* Video Player */}
              <div className="lg:col-span-8 space-y-3">
                <div className="relative aspect-video bg-black rounded-xl overflow-hidden shadow-inner flex items-center justify-center border border-slate-800 group">
                  <video
                    id="course-video-player"
                    key={activeVideoIndex}
                    src={(Array.isArray(selectedVideoModal.course_videos) && selectedVideoModal.course_videos.length > 0)
                      ? selectedVideoModal.course_videos[activeVideoIndex]?.url
                      : selectedVideoModal.course_video_url}
                    controls
                    controlsList="nodownload noremoteplayback noplaybackrate"
                    disablePictureInPicture
                    disableRemotePlayback
                    onContextMenu={(e) => e.preventDefault()}
                    autoPlay
                    className="w-full h-full object-contain"
                  />

                  {/* Custom Fullscreen Overlay Button */}
                  <button
                    onClick={() => {
                      const videoEl = document.getElementById('course-video-player');
                      if (videoEl) {
                        if (videoEl.requestFullscreen) {
                          videoEl.requestFullscreen();
                        } else if (videoEl.webkitRequestFullscreen) {
                          videoEl.webkitRequestFullscreen();
                        } else if (videoEl.msRequestFullscreen) {
                          videoEl.msRequestFullscreen();
                        }
                      }
                    }}
                    title="Toggle Fullscreen"
                    className="absolute top-3 right-3 bg-slate-900/80 hover:bg-[#1153aa] text-white p-2 rounded-xl border border-slate-700/80 backdrop-blur-md transition-all opacity-80 hover:opacity-100 cursor-pointer shadow-lg flex items-center gap-1.5 text-xs font-bold"
                  >
                    <Maximize className="w-4 h-4" />
                    <span className="hidden sm:inline">Fullscreen</span>
                  </button>
                </div>

                <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-[10px] font-bold text-[#2daee8] uppercase tracking-wider bg-[#2daee8]/10 border border-[#2daee8]/20 px-2 py-0.5 rounded">
                    {(Array.isArray(selectedVideoModal.course_videos) && selectedVideoModal.course_videos.length > 0)
                      ? selectedVideoModal.course_videos[activeVideoIndex]?.day
                      : 'Recorded Session'}
                  </span>
                  <h4 className="text-sm font-bold text-white font-space mt-1">
                    {(Array.isArray(selectedVideoModal.course_videos) && selectedVideoModal.course_videos.length > 0)
                      ? (selectedVideoModal.course_videos[activeVideoIndex]?.title || selectedVideoModal.course_title)
                      : selectedVideoModal.course_title}
                  </h4>
                  <p className="text-xs text-slate-400">Duration: {selectedVideoModal.course_duration} • High Definition WebM Stream</p>
                </div>
              </div>

              {/* Day-Wise Playlist */}
              <div className="lg:col-span-4 space-y-3 border-t lg:border-t-0 lg:border-l border-slate-800 pt-4 lg:pt-0 lg:pl-6">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Day-Wise Video Playlist ({(Array.isArray(selectedVideoModal.course_videos) ? selectedVideoModal.course_videos.length : 1)})
                </h4>

                <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
                  {Array.isArray(selectedVideoModal.course_videos) && selectedVideoModal.course_videos.length > 0 ? (
                    selectedVideoModal.course_videos.map((vid, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveVideoIndex(idx)}
                        className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                          activeVideoIndex === idx
                            ? 'bg-[#1153aa]/30 border-[#2daee8] text-white shadow-sm'
                            : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-300'
                        }`}
                      >
                        <div className="space-y-0.5">
                          <span className={`text-[10px] font-extrabold uppercase ${activeVideoIndex === idx ? 'text-[#2daee8]' : 'text-slate-400'}`}>
                            {vid.day || `Day ${idx + 1}`}
                          </span>
                          <p className="text-xs font-bold truncate">{vid.title || `Class Session ${idx + 1}`}</p>
                        </div>
                        <Video className={`w-4 h-4 shrink-0 ${activeVideoIndex === idx ? 'text-[#2daee8]' : 'text-slate-500'}`} />
                      </button>
                    ))
                  ) : (
                    <button
                      onClick={() => setActiveVideoIndex(0)}
                      className="w-full text-left p-3 rounded-xl border bg-[#1153aa]/30 border-[#2daee8] text-white flex items-center justify-between"
                    >
                      <div>
                        <span className="text-[10px] font-extrabold text-[#2daee8] uppercase">Day 1</span>
                        <p className="text-xs font-bold">Main Class Recording</p>
                      </div>
                      <Video className="w-4 h-4 text-[#2daee8]" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
