import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink, 
  Clock, 
  Video, 
  Edit2, 
  Copy, 
  Check, 
  Users, 
  Flame 
} from 'lucide-react';

const WebinarModalContext = createContext();

export const WebinarModalProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [webinars, setWebinars] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedWebinar, setSelectedWebinar] = useState(null);
  const [bookedWebinarIds, setBookedWebinarIds] = useState([]);
  const [userBookings, setUserBookings] = useState([]);
  const [copiedId, setCopiedId] = useState(null);

  const { user } = useAuth();
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
  const [bookingSuccess, setBookingSuccess] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchWebinars();
    if (user) {
      fetchUserBookings();
    } else {
      setUserBookings([]);
    }
  }, [user]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const fetchWebinars = async () => {
    try {
      const res = await api.get('/webinars', { params: user ? { email: user.email } : {} });
      if (res.data?.success) {
        setWebinars(res.data.data.webinars || []);
        setBookedWebinarIds(res.data.data.booked_webinar_ids || []);
      }
    } catch (err) {
      console.error('Failed to fetch webinars:', err);
    }
  };

  const fetchUserBookings = async () => {
    try {
      const res = await api.get('/student/profile');
      if (res.data?.success) {
        setUserBookings(res.data.data.webinar_bookings || []);
      }
    } catch (err) {
      console.error('Failed to fetch user bookings:', err);
    }
  };

  const handleCopyLink = (e, url, id) => {
    e.stopPropagation();
    const link = url || 'https://meet.google.com/nexxskill-mainframe-demo';
    navigator.clipboard.writeText(link);
    setCopiedId(id);
    setTimeout(() => {
      setCopiedId(null);
    }, 2500);
  };

  const openWebinarModal = (webinar = null) => {
    const target = webinar || (webinars.length > 0 ? webinars[0] : null);
    setSelectedWebinar(target);

    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        selected_date: target && Array.isArray(target.available_dates) && target.available_dates.length > 0 ? target.available_dates[0] : (target?.scheduled_at || ''),
        question: ''
      });
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        selected_date: target && Array.isArray(target.available_dates) && target.available_dates.length > 0 ? target.available_dates[0] : (target?.scheduled_at || ''),
        question: ''
      });
    }

    setStatus(null);
    setBookingSuccess(null);
    setIsEditing(false);
    setIsOpen(true);
    fetchUserBookings();
  };

  const closeWebinarModal = () => {
    setIsOpen(false);
    setSelectedWebinar(null);
    setBookingSuccess(null);
    setStatus(null);
    setIsEditing(false);
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
        setIsEditing(false);
        fetchWebinars();
        fetchUserBookings();
      }
    } catch (err) {
      setStatus({ type: 'error', message: err.response?.data?.error?.message || 'Registration failed' });
    } finally {
      setSubmitting(false);
    }
  };

  // Compute stats for current selected webinar
  const quota = selectedWebinar?.quota || 50;
  const bookedCount = selectedWebinar?.registrations_count || 0;
  const seatsLeft = selectedWebinar?.seats_left !== undefined ? selectedWebinar.seats_left : Math.max(0, quota - bookedCount);
  const percentBooked = Math.min(100, Math.round((bookedCount / quota) * 100));

  return (
    <WebinarModalContext.Provider value={{ openWebinarModal, closeWebinarModal, webinars, bookedWebinarIds, userBookings }}>
      {children}

      {/* Global Webinar Modal with Light/Dark Mode */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0d172e] border border-slate-200 dark:border-slate-800 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden relative max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
            
            {/* Header */}
            <div className="px-6 pt-6 pb-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/80 dark:bg-[#080e1a]/80 shrink-0">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#2daee8] flex items-center gap-1">
                  <Video className="w-3 h-3 text-[#2daee8]" />
                  <span>NexxSkill Masterclass</span>
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white font-space mt-0.5">
                  {selectedWebinar ? selectedWebinar.title : 'Book Free Masterclass'}
                </h3>
              </div>
              <button 
                onClick={closeWebinarModal} 
                className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center text-lg font-bold transition-colors cursor-pointer"
              >
                ×
              </button>
            </div>

            <div className="p-6 space-y-5 overflow-y-auto flex-1 text-slate-900 dark:text-slate-100">
              
              {/* Existing Active User Bookings Banner */}
              {userBookings.length > 0 && !isEditing && !bookingSuccess && (
                <div className="bg-blue-50/70 dark:bg-[#121f3d]/70 border border-blue-200 dark:border-[#1a2d52] p-4 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#1153aa] dark:text-[#2daee8] uppercase tracking-wider flex items-center gap-1.5">
                      <Video className="w-4 h-4" />
                      <span>Your Active Bookings</span>
                    </span>
                    <span className="bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase border border-emerald-300 dark:border-emerald-800">
                      Confirmed
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {userBookings.map((b) => (
                      <div key={b.id} className="bg-white dark:bg-[#080e1a] border border-blue-100 dark:border-slate-800 p-3.5 rounded-xl space-y-2.5 text-xs shadow-2xs">
                        <div className="font-bold text-slate-900 dark:text-white text-sm">{b.webinar_title}</div>
                        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 dark:border-slate-800 pt-2">
                          <span className="text-[#1153aa] dark:text-[#2daee8] font-bold flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{b.selected_date}</span>
                          </span>

                          <div className="flex items-center gap-2">
                            <a
                              href={b.meeting_url || 'https://meet.google.com/nexxskill-mainframe-demo'}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 bg-gradient-to-r from-[#1153aa] to-[#2daee8] text-white font-bold px-3.5 py-1.5 rounded-xl text-xs transition-opacity hover:opacity-95 shadow-xs"
                            >
                              <span>Join Room</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>

                            <button
                              onClick={(e) => handleCopyLink(e, b.meeting_url, b.id)}
                              className="p-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg transition-colors cursor-pointer"
                              title="Copy Meeting Link"
                            >
                              {copiedId === b.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>

                            <button
                              onClick={() => {
                                setIsEditing(true);
                                setFormData(prev => ({ ...prev, selected_date: b.selected_date || prev.selected_date }));
                              }}
                              className="inline-flex items-center gap-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 transition-colors cursor-pointer text-xs"
                              title="Edit Date or Timings"
                            >
                              <Edit2 className="w-3 h-3 text-[#1153aa] dark:text-[#2daee8]" />
                              <span>Edit</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Booking Success Screen */}
              {bookingSuccess ? (
                <div className="space-y-4 text-center py-2">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>

                  <div>
                    <h4 className="text-xl font-extrabold text-slate-900 dark:text-white font-space">{bookingSuccess.message}</h4>
                    <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">
                      A confirmation reminder will be emailed to <strong>{bookingSuccess.userEmail}</strong> 30 minutes before start.
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
                          <Clock className="w-3.5 h-3.5" />
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

                    {/* Direct Meeting Link Access */}
                    <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-2">
                      <span className="text-slate-400 font-bold uppercase block text-[10px]">Direct Live Meeting Access</span>
                      <div className="flex items-center gap-2">
                        <a
                          href={bookingSuccess.meetingUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#1153aa] to-[#2daee8] text-white font-bold px-4 py-2.5 rounded-xl text-xs transition-opacity hover:opacity-95 shadow-md shadow-[#2daee8]/20"
                        >
                          <span>Open Live Room Now</span>
                          <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                        </a>
                        <button
                          onClick={(e) => handleCopyLink(e, bookingSuccess.meetingUrl, 'modal-success')}
                          className="p-2.5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl transition-colors cursor-pointer"
                          title="Copy meeting link"
                        >
                          {copiedId === 'modal-success' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                      <p className="text-[10px] text-slate-400 font-mono truncate text-center">
                        {bookingSuccess.meetingUrl}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={closeWebinarModal}
                    className="w-full bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold py-3 px-4 rounded-xl text-xs transition-colors cursor-pointer"
                  >
                    Done & Return
                  </button>
                </div>
              ) : (userBookings.length === 0 || isEditing) && selectedWebinar ? (
                <>
                  {/* Slots booked counter & progress bar in modal */}
                  <div className="bg-slate-50 dark:bg-[#080e1a] border border-slate-200/80 dark:border-slate-800/80 p-3.5 rounded-2xl space-y-2.5">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 font-bold text-slate-700 dark:text-slate-300">
                        <Users className="w-3.5 h-3.5 text-[#2daee8]" />
                        <span>Live Seat Counter:</span>
                      </div>
                      <span className="font-extrabold text-slate-900 dark:text-white font-space">
                        <span className="text-[#1153aa] dark:text-[#2daee8]">{bookedCount}</span> / {quota} Booked
                      </span>
                    </div>

                    <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden p-0.5">
                      <div 
                        className="h-full rounded-full bg-gradient-to-r from-[#1153aa] to-[#2daee8] transition-all duration-500"
                        style={{ width: `${percentBooked}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400">
                      <span>{percentBooked}% Capacity</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold">{seatsLeft} Seats Remaining</span>
                    </div>
                  </div>

                  {status && (
                    <div className={`p-3 rounded-xl flex items-center gap-2 text-xs ${status.type === 'success' ? 'bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300' : 'bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300'}`}>
                      {status.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />}
                      <span>{status.message}</span>
                    </div>
                  )}

                  <form onSubmit={handleSubmitRegistration} className="space-y-4">
                    {/* Logged in User Profile Info */}
                    <div className="bg-slate-50 dark:bg-[#080e1a] border border-slate-200/80 dark:border-slate-800/80 p-3.5 rounded-2xl space-y-2 text-xs">
                      <div className="flex items-center justify-between text-slate-500 font-bold uppercase text-[10px]">
                        <span>Verified Profile Credentials</span>
                        <span className="text-[#2daee8] font-bold">Active User</span>
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
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-2">Select Live Batch Slot *</label>
                        <div className="grid grid-cols-1 gap-2">
                          {selectedWebinar.available_dates.map((d, i) => {
                            const isSelected = formData.selected_date === d;
                            return (
                              <div
                                key={i}
                                onClick={() => setFormData({ ...formData, selected_date: d })}
                                className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                                  isSelected
                                    ? 'bg-blue-50 dark:bg-[#121f3d] border-[#2daee8] ring-1 ring-[#2daee8]'
                                    : 'bg-white dark:bg-[#080e1a] border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                                }`}
                              >
                                <div className="flex items-center gap-2.5">
                                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${isSelected ? 'border-[#2daee8] bg-[#2daee8] text-white' : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0d172e]'}`}>
                                    {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white"></div>}
                                  </div>
                                  <span className={`text-xs font-semibold ${isSelected ? 'text-[#1153aa] dark:text-[#2daee8] font-bold' : 'text-slate-700 dark:text-slate-300'}`}>
                                    {d}
                                  </span>
                                </div>
                                <span className="text-[10px] font-bold text-[#1153aa] dark:text-[#2daee8] bg-blue-100 dark:bg-[#0d172e] px-2 py-0.5 rounded-full">
                                  Live Slot
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Query for speaker */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Question for Speaker (Optional)</label>
                      <textarea
                        rows="3"
                        value={formData.question}
                        onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                        placeholder="Ask any technical or career question for the live session..."
                        className="w-full bg-white dark:bg-[#080e1a] border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#2daee8]"
                      />
                    </div>

                    {/* Reminder notice */}
                    <div className="p-3 rounded-xl bg-blue-50/70 dark:bg-[#121f3d]/70 border border-blue-100 dark:border-[#1a2d52] text-[11px] text-[#1153aa] dark:text-[#2daee8] flex items-center gap-2">
                      <Clock className="w-4 h-4 shrink-0" />
                      <span>Automated email reminder will be sent <strong>30 minutes</strong> before session start.</span>
                    </div>

                    <div className="flex items-center gap-3">
                      {userBookings.length > 0 && (
                        <button
                          type="button"
                          onClick={() => setIsEditing(false)}
                          className="w-1/3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold py-3 px-4 rounded-xl text-xs transition-colors border border-slate-300 dark:border-slate-700 cursor-pointer"
                        >
                          Cancel
                        </button>
                      )}
                      <button
                        type="submit"
                        disabled={submitting}
                        className="flex-1 bg-gradient-to-r from-[#1153aa] to-[#2daee8] hover:shadow-lg hover:shadow-[#2daee8]/25 text-white font-bold py-3 px-4 rounded-xl text-xs transition-all shadow-md disabled:opacity-50 cursor-pointer"
                      >
                        {submitting ? 'Saving...' : userBookings.length > 0 ? 'Update Reservation' : 'Confirm Free Seat'}
                      </button>
                    </div>
                  </form>
                </>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </WebinarModalContext.Provider>
  );
};

export const useWebinarModal = () => useContext(WebinarModalContext);
