import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Calendar, Video, ExternalLink, Play, Clock, ArrowRight, Users, CheckCircle2, AlertCircle, Edit, Star, Trash2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAuthModal } from '../context/AuthModalContext';

import { PageHeader } from '../components/PageHeader';
import { NoticeModal } from '../components/NoticeModal';

export const Webinars = () => {
  const [webinars, setWebinars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedWebinar, setSelectedWebinar] = useState(null);

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
  const recordings = webinars.filter(w => w.type === 'recording');

  return (
    <div className="bg-white text-slate-900 min-h-screen font-sans pb-20">
      
      {/* Page Hero Section */}
      <PageHeader
        badgeText="Live Interactive Sessions"
        titlePrefix="Technical"
        highlightTitle="Webinars & Masterclasses"
        description="Live interactive sessions and archived video lessons led by Jahangir Alom Bakul."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">

        {/* Live Sessions */}
        <div className="mb-14">
          <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Video className="w-5 h-5 text-blue-600" />
            <span>Upcoming Live Sessions</span>
          </h2>

          {loading ? (
            <div className="text-center text-slate-500 py-8">Loading webinar sessions...</div>
          ) : liveWebinars.length === 0 ? (
            <div className="bg-white border border-slate-200 p-8 rounded-lg text-center text-slate-500 text-sm">
              No live webinars currently scheduled. Check back soon!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {liveWebinars.map((webinar) => {
                const seatsLeft = webinar.seats_left !== undefined ? webinar.seats_left : (webinar.quota || 50) - (webinar.registrations_count || 0);
                const isFull = seatsLeft <= 0;
                const isBooked = bookedWebinarIds.map(id => Number(id)).includes(Number(webinar.id));
                const bookedDate = userBookings[webinar.id]?.selected_date;

                return (
                  <div
                    key={webinar.id}
                    className={`bg-white border rounded-2xl overflow-hidden flex flex-col justify-between transition-all duration-200 ${
                      isBooked
                        ? 'border-slate-900 shadow-md ring-2 ring-slate-900/10'
                        : 'border-slate-200 hover:border-blue-400 hover:shadow-md'
                    }`}
                  >
                    {/* Header Banner & Status */}
                    <div className="p-6 space-y-4">
                      <div className="flex items-center justify-between gap-2">
                        {isBooked ? (
                          <span className="bg-slate-900 text-white text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5 shadow-2xs">
                            <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                            <span>Seat Reserved</span>
                          </span>
                        ) : (
                          <span className="bg-blue-50 text-blue-700 border border-blue-200 text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5">
                            <Video className="w-3 h-3 text-blue-600" />
                            <span>Live Masterclass</span>
                          </span>
                        )}

                        <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                          isBooked
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : isFull
                            ? 'bg-red-50 text-red-700 border border-red-200'
                            : 'bg-slate-100 text-slate-700 border border-slate-200'
                        }`}>
                          {isBooked ? 'Active Booking' : isFull ? 'Quota Full' : `${seatsLeft} Seats Left`}
                        </span>
                      </div>

                      {/* Title & Description */}
                      <div>
                        <h3 className="font-extrabold text-slate-900 text-lg font-space leading-snug hover:text-blue-600 transition-colors">
                          {webinar.title}
                        </h3>
                        <p className="text-slate-600 text-xs leading-relaxed mt-2 line-clamp-3">{webinar.description}</p>
                      </div>

                      {/* Instructor Chip */}
                      <div className="flex items-center gap-3 pt-2">
                        <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center font-space shadow-xs">
                          JB
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900">Jahangir Alom Bakul</p>
                          <p className="text-[10px] text-slate-500">IBM & Societe Generale Alum</p>
                        </div>
                      </div>

                      {/* Schedule Info Box */}
                      <div className="bg-slate-50 border border-slate-200/80 p-3.5 rounded-xl text-xs space-y-2">
                        <div className="flex items-center justify-between text-slate-700">
                          <span className="text-slate-500 font-semibold">Seat Quota:</span>
                          <span className="font-bold text-slate-900">{webinar.registrations_count || 0} / {webinar.quota || 50} Seats</span>
                        </div>

                        {isBooked && bookedDate ? (
                          <div className="pt-2 border-t border-slate-200 text-slate-800 font-medium">
                            <span className="text-slate-500 text-[10px] font-bold uppercase block mb-0.5">Your Reserved Slot:</span>
                            <span className="font-bold text-blue-600 text-xs flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                              <span>{bookedDate}</span>
                            </span>
                          </div>
                        ) : (
                          Array.isArray(webinar.available_dates) && webinar.available_dates.length > 0 && (
                            <div className="pt-2 border-t border-slate-200 text-slate-600">
                              <span className="text-slate-500 text-[10px] font-bold uppercase block mb-0.5">Available Dates:</span>
                              <span className="font-medium text-slate-800 text-xs">{webinar.available_dates.join(', ')}</span>
                            </div>
                          )
                        )}
                      </div>
                    </div>

                    {/* Bottom Action Footer */}
                    <div className="p-6 pt-3 border-t border-slate-100 bg-slate-50/80 space-y-3">
                      <div className="flex items-baseline justify-between">
                        <span className="text-xs text-slate-500 font-semibold">Session Access:</span>
                        <span className="text-sm font-extrabold text-blue-600 font-space uppercase">100% Free Entry</span>
                      </div>

                      {isBooked ? (
                        <div className="flex items-center gap-2">
                          <a
                            href={webinar.meeting_url || 'https://meet.google.com/nexxskill-mainframe-demo'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 px-3 rounded-xl text-xs transition-colors shadow-sm text-center flex items-center justify-center gap-1.5"
                          >
                            <span>Join Live Room</span>
                            <ExternalLink className="w-3.5 h-3.5 text-blue-400" />
                          </a>
                          <button
                            onClick={() => handleOpenModal(webinar)}
                            className="p-2.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl transition-colors cursor-pointer"
                            title="Edit Reserved Timing"
                          >
                            <Edit className="w-4 h-4 text-blue-600" />
                          </button>
                          <button
                            onClick={() => handleCancelBooking(webinar.id)}
                            className="p-2.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-xl transition-colors cursor-pointer"
                            title="Cancel / Delete Reservation"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleOpenModal(webinar)}
                          disabled={isFull}
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-colors shadow-sm disabled:opacity-50 cursor-pointer flex items-center justify-center gap-1.5"
                        >
                          <span>{isFull ? 'Quota Full' : 'Reserve Seat & Submit Query'}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>

      {/* Webinar Registration & Query Modal */}
      {selectedWebinar && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 w-full max-w-lg rounded-lg shadow-xl overflow-hidden relative">
            <div className="px-6 pt-6 pb-4 flex items-center justify-between border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900 font-space">
                Register & Submit Query: {selectedWebinar.title}
              </h3>
              <button onClick={() => setSelectedWebinar(null)} className="text-slate-400 hover:text-slate-700 text-xl font-bold">
                ×
              </button>
            </div>

            <div className="p-6 space-y-4">
              {bookingSuccess ? (
                <div className="space-y-4 text-center py-2">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>

                  <div>
                    <h4 className="text-xl font-bold text-slate-900 font-space">{bookingSuccess.message}</h4>
                    <p className="text-slate-500 text-xs mt-1">A confirmation has been logged for {bookingSuccess.userEmail}</p>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg text-left space-y-3 text-xs">
                    <div>
                      <span className="text-slate-400 font-bold uppercase block text-[10px]">Session Title</span>
                      <span className="font-bold text-slate-900 text-sm">{bookingSuccess.webinarTitle}</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-slate-200">
                      <div>
                        <span className="text-slate-400 font-bold uppercase block text-[10px]">Booked Date & Time</span>
                        <span className="font-bold text-blue-600 flex items-center gap-1 mt-0.5">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{bookingSuccess.bookedDate}</span>
                        </span>
                      </div>

                      <div>
                        <span className="text-slate-400 font-bold uppercase block text-[10px]">Status</span>
                        <span className="font-bold text-emerald-600 flex items-center gap-1 mt-0.5">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Confirmed</span>
                        </span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-200">
                      <span className="text-slate-400 font-bold uppercase block text-[10px] mb-1">Live Meeting Access Link</span>
                      <a
                        href={bookingSuccess.meetingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center w-full gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2.5 rounded-md text-xs transition-colors shadow-xs"
                      >
                        <span>Join Live Session at [{bookingSuccess.bookedDate}]</span>
                        <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                      </a>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setBookingSuccess(null);
                      setSelectedWebinar(null);
                    }}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 px-4 rounded-md text-xs transition-colors"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <>
                  {status && (
                    <div className={`p-3 rounded-md flex items-center gap-2 text-xs ${status.type === 'success' ? 'bg-emerald-50 border border-emerald-200 text-emerald-800' : 'bg-red-50 border border-red-200 text-red-800'}`}>
                      {status.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />}
                      <span>{status.message}</span>
                    </div>
                  )}

                  <form onSubmit={handleSubmitRegistration} className="space-y-4">
                    {/* Logged in User Profile Info Summary */}
                    <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-md space-y-2 text-xs">
                      <div className="flex items-center justify-between text-slate-500 font-bold uppercase text-[10px]">
                        <span>Profile Credentials</span>
                        <span className="text-blue-600 font-bold">Verified Account</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 border-t border-slate-200 text-slate-900">
                        <div>
                          <span className="text-slate-400 block text-[10px]">Full Name</span>
                          <span className="font-bold">{user?.name || formData.name}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">Email Address</span>
                          <span className="font-bold truncate block">{user?.email || formData.email}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">WhatsApp Number</span>
                          <span className="font-bold">{user?.phone || formData.phone || 'N/A'}</span>
                        </div>
                      </div>
                    </div>

                    {Array.isArray(selectedWebinar.available_dates) && selectedWebinar.available_dates.length > 0 && (
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Select Available Date / Session *</label>
                        <select
                          value={formData.selected_date}
                          onChange={(e) => setFormData({ ...formData, selected_date: e.target.value })}
                          className="w-full bg-white border border-slate-300 rounded-md px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-600"
                        >
                          {selectedWebinar.available_dates.map((d, i) => (
                            <option key={i} value={d}>{d}</option>
                          ))}
                        </select>
                      </div>
                    )}

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Specific Query or Question for Speaker</label>
                      <textarea
                        rows="3"
                        value={formData.question}
                        onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                        placeholder="Ask any technical or career question for the live session..."
                        className="w-full bg-white border border-slate-300 rounded-md px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-600"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-4 rounded-md text-sm transition-colors shadow-sm disabled:opacity-50"
                    >
                      {submitting ? 'Reserving Seat...' : 'Confirm Registration'}
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
    <div className="bg-white text-slate-900 min-h-screen py-12 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <div className="border-b border-slate-200 pb-6">
          <h1 className="text-3xl font-extrabold text-slate-900 font-space">Free Technical Resources</h1>
          <p className="text-slate-500 text-sm mt-1">Downloadable Mainframe cheatsheets and JCL templates</p>
        </div>

        <div className="bg-white border border-slate-200 p-10 rounded-lg shadow-xs space-y-4">
          <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mx-auto">
            <Clock className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">New Technical Materials Incoming</h3>
          <p className="text-slate-600 text-sm max-w-md mx-auto leading-relaxed">
            We are curating high-density Mainframe & Data Engineering cheatsheets. Check back shortly or browse our available courses.
          </p>
          <div className="pt-2">
            <Link to="/courses" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2.5 rounded-md text-xs transition-colors">
              <span>Browse All Courses</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
