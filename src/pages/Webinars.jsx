import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { 
  Calendar, 
  Video, 
  ExternalLink, 
  Play, 
  Clock, 
  ArrowRight, 
  Users, 
  CheckCircle2, 
  AlertCircle, 
  Edit, 
  Star, 
  Trash2, 
  Copy, 
  Check, 
  Sparkles,
  ShieldCheck,
  Flame
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAuthModal } from '../context/AuthModalContext';

import { PageHeader } from '../components/PageHeader';
import { NoticeModal } from '../components/NoticeModal';
import { SEO } from '../components/SEO';

export const Webinars = () => {
  const [webinars, setWebinars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedWebinar, setSelectedWebinar] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  const { user } = useAuth();
  const { openAuthModal } = useAuthModal();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    selected_date: '',
    question: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState(null);

  const [bookedWebinarIds, setBookedWebinarIds] = useState([]);
  const [userBookings, setUserBookings] = useState({});

  useEffect(() => {
    fetchWebinars();
  }, [user]);

  useEffect(() => {
    if (selectedWebinar) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedWebinar]);

  const fetchWebinars = async () => {
    try {
      const res = await api.get('/webinars', {
        params: user ? { email: user.email } : {}
      });
      if (res.data?.success) {
        setWebinars(res.data.data.webinars || []);
        setBookedWebinarIds(res.data.data.booked_webinar_ids || []);
        setUserBookings(res.data.data.user_bookings || {});
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const [bookingSuccess, setBookingSuccess] = useState(null);

  const handleCopyLink = (e, url, id) => {
    e.stopPropagation();
    const link = url || 'https://meet.google.com/nexxskill-mainframe-demo';
    navigator.clipboard.writeText(link);
    setCopiedId(id);
    setTimeout(() => {
      setCopiedId(null);
    }, 2500);
  };

  const handleOpenModal = (webinar) => {
    if (!user) {
      openAuthModal('login');
      return;
    }

    setSelectedWebinar(webinar);
    setStatus(null);
    setBookingSuccess(null);
    setFormData({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      selected_date: Array.isArray(webinar.available_dates) && webinar.available_dates.length > 0 ? webinar.available_dates[0] : (webinar.scheduled_at || ''),
      question: ''
    });
  };

  const handleSubmitRegistration = async (e) => {
    e.preventDefault();
    if (!selectedWebinar) return;

    setSubmitting(true);
    setStatus(null);

    try {
      const res = await api.post('/webinars/register', {
        webinar_id: selectedWebinar.id,
        ...formData
      });

      if (res.data?.success) {
        setBookingSuccess({
          webinarTitle: selectedWebinar.title,
          bookedDate: formData.selected_date || selectedWebinar.scheduled_at,
          meetingUrl: res.data?.data?.meeting_url || selectedWebinar.meeting_url || 'https://meet.google.com/nexxskill-mainframe-demo',
          userEmail: formData.email,
          message: res.data?.message || 'Seat reserved successfully'
        });
        fetchWebinars();
      }
    } catch (err) {
      setStatus({ type: 'error', message: err.response?.data?.error?.message || 'Registration failed' });
    } finally {
      setSubmitting(false);
    }
  };

  const [noticeModal, setNoticeModal] = useState(null);

  const handleCancelBooking = async (webinarId) => {
    if (!window.confirm('Are you sure you want to cancel your reserved seat for this webinar?')) {
      return;
    }
    try {
      const res = await api.delete(`/webinars/${webinarId}/booking`);
      if (res.data?.success) {
        setNoticeModal({ type: 'success', title: 'Reservation Cancelled', message: res.data.message || 'Webinar reservation cancelled successfully' });
        fetchWebinars();
      }
    } catch (err) {
      setNoticeModal({ type: 'error', title: 'Cancellation Error', message: err.response?.data?.error?.message || 'Failed to cancel webinar booking' });
    }
  };

  const liveWebinars = webinars
    .filter(w => w.type === 'live')
    .sort((a, b) => {
      const aBooked = bookedWebinarIds.map(id => Number(id)).includes(Number(a.id));
      const bBooked = bookedWebinarIds.map(id => Number(id)).includes(Number(b.id));
      if (aBooked && !bBooked) return -1;
      if (!aBooked && bBooked) return 1;
      return 0;
    });

  return (
    <div className="bg-slate-50 dark:bg-[#080e1a] text-slate-900 dark:text-slate-100 min-h-screen font-sans pb-24 transition-colors duration-200">
      <SEO
        title="Live Enterprise Webinars & Bootcamps"
        description="Join live interactive Mainframe masterclasses and enterprise deep dives led by industry veteran Jahangir Alom Bakul. Direct meeting links and automated reminders available."
        canonical="/webinars"
        keywords="Mainframe Webinars, COBOL Masterclass, Enterprise IT Workshop, System z Webinar, NexxSkill Live Sessions"
      />
      
      {/* Page Hero Header */}
      <PageHeader
        badgeText="Interactive Live Bootcamps"
        titlePrefix="Industry-Leading"
        highlightTitle="Webinars & Masterclasses"
        description="Accelerate your enterprise career with live masterclasses, hands-on Q&A, and direct mentorship from Jahangir Alom Bakul."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">

        {/* Live Sessions Heading */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white font-space flex items-center gap-2.5">
              <span className="p-2 rounded-xl bg-gradient-to-r from-[#1153aa] to-[#2daee8] text-white shadow-sm">
                <Video className="w-5 h-5" />
              </span>
              <span>Upcoming Live Masterclasses</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Select your preferred batch timing. Meeting links can be opened manually or joined directly below.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300 bg-white dark:bg-[#0d172e] border border-slate-200 dark:border-slate-800 px-3.5 py-1.5 rounded-full shadow-2xs self-start sm:self-auto">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Live Reminders: 30 Min Before Join</span>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="w-10 h-10 border-3 border-[#1153aa] border-t-[#2daee8] rounded-full animate-spin"></div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Loading masterclass sessions & seat availability...</p>
          </div>
        ) : liveWebinars.length === 0 ? (
          <div className="bg-white dark:bg-[#0d172e] border border-slate-200 dark:border-slate-800 p-12 rounded-3xl text-center space-y-3 shadow-xs">
            <Video className="w-12 h-12 text-slate-400 mx-auto" />
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 font-space">No Live Sessions Currently Scheduled</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Our enterprise mentors are scheduling new interactive weekend cohorts. Check back shortly or browse our recorded archives!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {liveWebinars.map((webinar) => {
              const quota = webinar.quota || 50;
              const bookedCount = webinar.registrations_count || 0;
              const seatsLeft = webinar.seats_left !== undefined ? webinar.seats_left : Math.max(0, quota - bookedCount);
              const isFull = seatsLeft <= 0;
              const percentBooked = Math.min(100, Math.round((bookedCount / quota) * 100));
              const isBooked = bookedWebinarIds.map(id => Number(id)).includes(Number(webinar.id));
              const bookedDate = userBookings[webinar.id]?.selected_date;
              const meetingLink = webinar.meeting_url || 'https://meet.google.com/nexxskill-mainframe-demo';
              const isCopied = copiedId === webinar.id;

              return (
                <div
                  key={webinar.id}
                  className={`bg-white dark:bg-[#0d172e] border rounded-3xl overflow-hidden flex flex-col justify-between transition-all duration-300 group ${
                    isBooked
                      ? 'border-[#2daee8] ring-2 ring-[#2daee8]/20 shadow-lg dark:shadow-[#2daee8]/5'
                      : 'border-slate-200/90 dark:border-slate-800/90 hover:border-[#2daee8]/60 hover:shadow-xl hover:shadow-[#2daee8]/10'
                  }`}
                >
                  {/* Top Area: Badges & Info */}
                  <div className="p-6 space-y-5">
                    
                    {/* Header Pill Badges */}
                    <div className="flex items-center justify-between gap-2">
                      {isBooked ? (
                        <span className="bg-gradient-to-r from-emerald-600 to-teal-500 text-white text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5 shadow-xs">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Seat Confirmed</span>
                        </span>
                      ) : (
                        <span className="bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900/60 text-[#1153aa] dark:text-[#2daee8] text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5">
                          <Video className="w-3 h-3 text-[#2daee8]" />
                          <span>Live Bootcamp</span>
                        </span>
                      )}

                      <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                        isBooked
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
                          : isFull
                          ? 'bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800'
                          : 'bg-slate-100 dark:bg-[#121f3d] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                      }`}>
                        {isBooked ? 'Active Booking' : isFull ? 'Batch Full' : `${seatsLeft} Seats Left`}
                      </span>
                    </div>

                    {/* Title & Description */}
                    <div>
                      <h3 className="font-extrabold text-slate-900 dark:text-white text-lg font-space leading-snug group-hover:text-[#1153aa] dark:group-hover:text-[#2daee8] transition-colors">
                        {webinar.title}
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed mt-2.5 line-clamp-3">
                        {webinar.description}
                      </p>
                    </div>

                    {/* Mentor Info Pill */}
                    <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-slate-50 dark:bg-[#080e1a] border border-slate-200/70 dark:border-slate-800/80">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#1153aa] to-[#2daee8] text-white font-extrabold text-xs flex items-center justify-center font-space shadow-xs shrink-0">
                        JB
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">Jahangir Alom Bakul</p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">Ex-IBM & Societe Generale Enterprise Specialist</p>
                      </div>
                    </div>

                    {/* Live Slots Booked Visual Counter & Progress Bar */}
                    <div className="bg-slate-50 dark:bg-[#080e1a] border border-slate-200/80 dark:border-slate-800/80 p-4 rounded-2xl space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-bold">
                          <Users className="w-3.5 h-3.5 text-[#1153aa] dark:text-[#2daee8]" />
                          <span>Seats Booked:</span>
                        </div>
                        <div className="font-extrabold text-slate-900 dark:text-white font-space text-xs">
                          <span className="text-[#1153aa] dark:text-[#2daee8] text-sm">{bookedCount}</span>
                          <span className="text-slate-400 font-normal"> / {quota} Slots</span>
                        </div>
                      </div>

                      {/* Visual Progress Track */}
                      <div className="w-full bg-slate-200 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden p-0.5">
                        <div 
                          className="h-full rounded-full bg-gradient-to-r from-[#1153aa] to-[#2daee8] transition-all duration-700 shadow-xs"
                          style={{ width: `${percentBooked}%` }}
                        />
                      </div>

                      {/* Dynamic Seats Status Text */}
                      <div className="flex items-center justify-between text-[11px] pt-0.5">
                        <span className="text-slate-500 dark:text-slate-400 font-medium">
                          {percentBooked}% Occupied
                        </span>
                        {isFull ? (
                          <span className="text-red-500 font-bold">Sold Out</span>
                        ) : seatsLeft <= 10 ? (
                          <span className="text-amber-500 dark:text-amber-400 font-bold flex items-center gap-1">
                            <Flame className="w-3 h-3" />
                            <span>Only {seatsLeft} left!</span>
                          </span>
                        ) : (
                          <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                            Seats Filling Fast
                          </span>
                        )}
                      </div>

                      {/* Booked Date Alert or Available Dates */}
                      {isBooked && bookedDate ? (
                        <div className="pt-2 border-t border-slate-200/80 dark:border-slate-800/80 text-xs">
                          <span className="text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-wider block mb-1">Your Confirmed Slot:</span>
                          <span className="font-bold text-[#1153aa] dark:text-[#2daee8] flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 shrink-0" />
                            <span>{bookedDate}</span>
                          </span>
                        </div>
                      ) : (
                        Array.isArray(webinar.available_dates) && webinar.available_dates.length > 0 && (
                          <div className="pt-2 border-t border-slate-200/80 dark:border-slate-800/80 text-xs">
                            <span className="text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-wider block mb-1">Available Batches:</span>
                            <span className="font-semibold text-slate-800 dark:text-slate-200 text-xs block truncate">
                              {webinar.available_dates.join(' • ')}
                            </span>
                          </div>
                        )
                      )}
                    </div>

                    {/* Manual Meeting Link Direct Box */}
                    <div className="p-3 rounded-2xl bg-blue-50/60 dark:bg-[#121f3d]/60 border border-blue-100 dark:border-[#1a2d52] space-y-2">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-[#1153aa] dark:text-[#2daee8] uppercase tracking-wider flex items-center gap-1">
                          <ExternalLink className="w-3 h-3" />
                          <span>Direct Meeting URL</span>
                        </span>
                        <button
                          onClick={(e) => handleCopyLink(e, meetingLink, webinar.id)}
                          className="text-[11px] font-bold text-slate-600 dark:text-slate-300 hover:text-[#1153aa] dark:hover:text-[#2daee8] flex items-center gap-1 transition-colors cursor-pointer"
                          title="Copy direct meeting link"
                        >
                          {isCopied ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-500" />
                              <span className="text-emerald-500">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copy Link</span>
                            </>
                          )}
                        </button>
                      </div>

                      <div className="text-[10px] font-mono text-slate-600 dark:text-slate-300 bg-white/80 dark:bg-[#080e1a]/80 px-2.5 py-1.5 rounded-lg border border-slate-200/60 dark:border-slate-800 truncate">
                        {meetingLink}
                      </div>
                    </div>

                  </div>

                  {/* Bottom Action Footer */}
                  <div className="p-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/70 dark:bg-[#0b1428] space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500 dark:text-slate-400 font-semibold">Registration Cost:</span>
                      <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider font-space bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                        100% Free Entry
                      </span>
                    </div>

                    {isBooked ? (
                      <div className="flex items-center gap-2">
                        <a
                          href={meetingLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 bg-gradient-to-r from-[#1153aa] to-[#2daee8] hover:opacity-95 text-white font-bold py-3 px-4 rounded-xl text-xs transition-all shadow-md shadow-[#2daee8]/20 text-center flex items-center justify-center gap-2"
                        >
                          <span>Open Live Room</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                        <button
                          onClick={() => handleOpenModal(webinar)}
                          className="p-3 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl transition-colors cursor-pointer"
                          title="Change Batch Timing"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleCancelBooking(webinar.id)}
                          className="p-3 bg-red-50 dark:bg-red-950/40 hover:bg-red-100 dark:hover:bg-red-900/60 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-xl transition-colors cursor-pointer"
                          title="Cancel Reservation"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleOpenModal(webinar)}
                          disabled={isFull}
                          className="flex-1 bg-gradient-to-r from-[#1153aa] to-[#2daee8] hover:shadow-lg hover:shadow-[#2daee8]/25 text-white font-bold py-3 px-4 rounded-xl text-xs transition-all shadow-md disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                        >
                          <span>{isFull ? 'Batch Full' : 'Book Free Seat'}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                        <a
                          href={meetingLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-3 bg-slate-100 dark:bg-[#121f3d] border border-slate-200 dark:border-slate-800 hover:border-[#2daee8] text-slate-700 dark:text-slate-300 rounded-xl transition-colors cursor-pointer"
                          title="Open Meeting Room Directly in Browser"
                        >
                          <ExternalLink className="w-4 h-4 text-[#2daee8]" />
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* Webinar Registration Modal */}
      {selectedWebinar && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0d172e] border border-slate-200 dark:border-slate-800 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden relative animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="px-6 pt-6 pb-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#2daee8]">NexxSkill Masterclass</span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white font-space mt-0.5">
                  {selectedWebinar.title}
                </h3>
              </div>
              <button 
                onClick={() => setSelectedWebinar(null)} 
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-800 dark:hover:text-white flex items-center justify-center text-lg font-bold transition-colors cursor-pointer"
              >
                ×
              </button>
            </div>

            <div className="p-6 space-y-5">
              {bookingSuccess ? (
                <div className="space-y-5 text-center py-2">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>

                  <div>
                    <h4 className="text-xl font-extrabold text-slate-900 dark:text-white font-space">{bookingSuccess.message}</h4>
                    <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">
                      A confirmation reminder will be sent to <strong>{bookingSuccess.userEmail}</strong> 30 minutes before the session starts.
                    </p>
                  </div>

                  <div className="bg-slate-50 dark:bg-[#080e1a] border border-slate-200/80 dark:border-slate-800/80 p-4 rounded-2xl text-left space-y-3 text-xs">
                    <div>
                      <span className="text-slate-400 font-bold uppercase block text-[10px]">Session Title</span>
                      <span className="font-bold text-slate-900 dark:text-white text-sm">{bookingSuccess.webinarTitle}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                      <div>
                        <span className="text-slate-400 font-bold uppercase block text-[10px]">Booked Batch</span>
                        <span className="font-bold text-[#1153aa] dark:text-[#2daee8] flex items-center gap-1 mt-0.5">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{bookingSuccess.bookedDate}</span>
                        </span>
                      </div>

                      <div>
                        <span className="text-slate-400 font-bold uppercase block text-[10px]">Status</span>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-0.5">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Confirmed</span>
                        </span>
                      </div>
                    </div>

                    {/* Manual Meeting Room Access Link */}
                    <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-2">
                      <span className="text-slate-500 dark:text-slate-400 font-bold uppercase block text-[10px]">Live Meeting Access Link</span>
                      <div className="flex items-center gap-2">
                        <a
                          href={bookingSuccess.meetingUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#1153aa] to-[#2daee8] hover:opacity-95 text-white font-bold px-4 py-3 rounded-xl text-xs transition-all shadow-md shadow-[#2daee8]/20"
                        >
                          <span>Open Live Room Now</span>
                          <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                        </a>
                        <button
                          onClick={(e) => handleCopyLink(e, bookingSuccess.meetingUrl, 'modal')}
                          className="p-3 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl transition-colors cursor-pointer"
                          title="Copy meeting link"
                        >
                          {copiedId === 'modal' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                      <p className="text-[10px] text-slate-400 text-center font-mono truncate">
                        {bookingSuccess.meetingUrl}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setBookingSuccess(null);
                      setSelectedWebinar(null);
                    }}
                    className="w-full bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold py-3 px-4 rounded-xl text-xs transition-colors cursor-pointer"
                  >
                    Done & Return to Sessions
                  </button>
                </div>
              ) : (
                <>
                  {status && (
                    <div className={`p-3.5 rounded-xl flex items-center gap-2.5 text-xs ${
                      status.type === 'success' 
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300' 
                        : 'bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300'
                    }`}>
                      {status.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />}
                      <span>{status.message}</span>
                    </div>
                  )}

                  <form onSubmit={handleSubmitRegistration} className="space-y-4">
                    {/* Logged in User Credentials */}
                    <div className="bg-slate-50 dark:bg-[#080e1a] border border-slate-200/80 dark:border-slate-800/80 p-3.5 rounded-2xl space-y-2 text-xs">
                      <div className="flex items-center justify-between text-slate-500 font-bold uppercase text-[10px]">
                        <span>Profile Info</span>
                        <span className="text-[#2daee8] font-bold">Verified Account</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 border-t border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100">
                        <div>
                          <span className="text-slate-400 block text-[10px]">Full Name</span>
                          <span className="font-bold">{user?.name || formData.name}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">Email Address</span>
                          <span className="font-bold truncate block">{user?.email || formData.email}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">WhatsApp</span>
                          <span className="font-bold">{user?.phone || formData.phone || 'N/A'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Batch Selection */}
                    {Array.isArray(selectedWebinar.available_dates) && selectedWebinar.available_dates.length > 0 && (
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1.5">Select Preferred Batch *</label>
                        <select
                          value={formData.selected_date}
                          onChange={(e) => setFormData({ ...formData, selected_date: e.target.value })}
                          className="w-full bg-white dark:bg-[#080e1a] border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-900 dark:text-slate-100 focus:outline-none focus:border-[#2daee8]"
                        >
                          {selectedWebinar.available_dates.map((d, i) => (
                            <option key={i} value={d}>{d}</option>
                          ))}
                        </select>
                      </div>
                    )}

                    {/* Query for speaker */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1.5">Question for Speaker (Optional)</label>
                      <textarea
                        rows="3"
                        value={formData.question}
                        onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                        placeholder="Ask any technical or career question for the live session..."
                        className="w-full bg-white dark:bg-[#080e1a] border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-[#2daee8] placeholder-slate-400"
                      />
                    </div>

                    {/* Automated Reminder Notice */}
                    <div className="p-3 rounded-xl bg-blue-50/70 dark:bg-[#121f3d]/70 border border-blue-100 dark:border-[#1a2d52] text-[11px] text-[#1153aa] dark:text-[#2daee8] flex items-center gap-2">
                      <Clock className="w-4 h-4 shrink-0" />
                      <span>An automated reminder email with your join link will be sent <strong>30 minutes</strong> before the session starts.</span>
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full bg-gradient-to-r from-[#1153aa] to-[#2daee8] hover:shadow-lg hover:shadow-[#2daee8]/25 text-white font-bold py-3.5 px-4 rounded-xl text-xs transition-all shadow-md disabled:opacity-50 cursor-pointer"
                    >
                      {submitting ? 'Reserving Your Free Seat...' : 'Confirm Free Registration'}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Custom Notification Modal */}
      <NoticeModal modal={noticeModal} onClose={() => setNoticeModal(null)} />
    </div>
  );
};

export const Resources = () => {
  return (
    <div className="bg-slate-50 dark:bg-[#080e1a] text-slate-900 dark:text-slate-100 min-h-screen py-16 font-sans transition-colors duration-200">
      <SEO
        title="Free Technical Resources & Cheatsheets"
        description="Download free IBM System z Mainframe cheatsheets, JCL templates, and developer reference guides."
        canonical="/resources"
        keywords="Mainframe Resources, JCL Cheatsheet, COBOL Reference, Free Developer Templates"
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <PageHeader
          badgeText="Developer Cheatsheets"
          titlePrefix="Free"
          highlightTitle="Technical Resources"
          description="Curated enterprise Mainframe reference guides, JCL syntax cards, and COBOL sample workflows."
        />

        <div className="bg-white dark:bg-[#0d172e] border border-slate-200 dark:border-slate-800 p-12 rounded-3xl shadow-xs space-y-4 max-w-2xl mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#1153aa] to-[#2daee8] text-white flex items-center justify-center mx-auto shadow-md shadow-[#2daee8]/20">
            <Clock className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white font-space">Enterprise Cheatsheets Incoming</h3>
          <p className="text-slate-600 dark:text-slate-400 text-xs md:text-sm max-w-md mx-auto leading-relaxed">
            We are curating high-density Mainframe, DB2, and COBOL cheatsheets for live cohort members. Browse our available courses in the meantime!
          </p>
          <div className="pt-3">
            <Link 
              to="/courses" 
              className="inline-flex items-center gap-2 bg-gradient-to-r from-[#1153aa] to-[#2daee8] text-white font-bold px-6 py-3 rounded-xl text-xs transition-all shadow-md shadow-[#2daee8]/20 hover:opacity-95"
            >
              <span>Explore All Courses</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
