import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import { Calendar, CheckCircle2, AlertCircle, ExternalLink, Clock, Video, Edit2 } from 'lucide-react';

const WebinarModalContext = createContext();

export const WebinarModalProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [webinars, setWebinars] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedWebinar, setSelectedWebinar] = useState(null);
  const [bookedWebinarIds, setBookedWebinarIds] = useState([]);
  const [userBookings, setUserBookings] = useState([]);

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
      console.error('Failed to fetch user webinar bookings:', err);
    }
  };

  const openWebinarModal = (targetWebinar = null) => {
    if (!user) {
      navigate('/login?redirect=/');
      return;
    }

    const activeWebinar = targetWebinar || webinars.find(w => w.type === 'live') || webinars[0];
    if (activeWebinar) {
      setSelectedWebinar(activeWebinar);
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        selected_date: Array.isArray(activeWebinar.available_dates) && activeWebinar.available_dates.length > 0 ? activeWebinar.available_dates[0] : (activeWebinar.scheduled_at || ''),
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

  return (
    <WebinarModalContext.Provider value={{ openWebinarModal, closeWebinarModal, webinars, bookedWebinarIds, userBookings }}>
      {children}

      {/* Global Webinar Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 w-full max-w-lg rounded-xl shadow-2xl overflow-hidden relative max-h-[90vh] flex flex-col">
            <div className="px-6 pt-6 pb-4 flex items-center justify-between border-b border-slate-100 bg-slate-50 shrink-0">
              <div>
                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest bg-blue-100 px-2 py-0.5 rounded">
                  Live Masterclass Reservation
                </span>
                <h3 className="text-lg font-bold text-slate-900 font-space mt-1">
                  {selectedWebinar ? selectedWebinar.title : 'Book Free Webinar'}
                </h3>
              </div>
              <button onClick={closeWebinarModal} className="text-slate-400 hover:text-slate-700 text-2xl font-bold leading-none p-1">
                ×
              </button>
            </div>

            <div className="p-6 space-y-5 overflow-y-auto flex-1">
              {/* Existing Active User Bookings Banner */}
              {userBookings.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-900 uppercase tracking-wider flex items-center gap-1.5">
                      <Video className="w-4 h-4 text-blue-600" />
                      <span>Your Active Bookings</span>
                    </span>
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                      Seat Reserved
                    </span>
                  </div>

                  <div className="space-y-2">
                    {userBookings.map((b) => (
                      <div key={b.id} className="bg-white border border-blue-100 p-3.5 rounded-md space-y-2.5 text-xs shadow-2xs">
                        <div className="font-bold text-slate-900 text-sm">{b.webinar_title}</div>
                        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-2">
                          <span className="text-blue-600 font-bold flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{b.selected_date}</span>
                          </span>

                          <div className="flex items-center gap-2">
                            <a
                              href={b.meeting_url || 'https://meet.google.com/nexxskill-mainframe-demo'}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white font-bold px-3 py-1.5 rounded text-xs transition-colors shadow-2xs"
                            >
                              <span>Join Session</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>

                            <button
                              onClick={() => {
                                setIsEditing(true);
                                setFormData(prev => ({ ...prev, selected_date: b.selected_date || prev.selected_date }));
                              }}
                              className="inline-flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-2.5 py-1.5 rounded text-xs border border-slate-300 transition-colors cursor-pointer"
                              title="Edit Date or Timings"
                            >
                              <Edit2 className="w-3 h-3 text-blue-600" />
                              <span>Edit</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

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
                          <Clock className="w-3.5 h-3.5" />
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
                    onClick={closeWebinarModal}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 px-4 rounded-md text-xs transition-colors"
                  >
                    Done
                  </button>
                </div>
              ) : (userBookings.length === 0 || isEditing) && selectedWebinar ? (
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
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Select Available Date / Session Slot *</label>
                        <div className="grid grid-cols-1 gap-2">
                          {selectedWebinar.available_dates.map((d, i) => {
                            const isSelected = formData.selected_date === d;
                            return (
                              <div
                                key={i}
                                onClick={() => setFormData({ ...formData, selected_date: d })}
                                className={`p-3 rounded-lg border flex items-center justify-between cursor-pointer transition-all ${
                                  isSelected
                                    ? 'bg-blue-50 border-blue-600 ring-1 ring-blue-600'
                                    : 'bg-white border-slate-200 hover:border-slate-300'
                                }`}
                              >
                                <div className="flex items-center gap-2.5">
                                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${isSelected ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300 bg-white'}`}>
                                    {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white"></div>}
                                  </div>
                                  <span className={`text-xs font-semibold ${isSelected ? 'text-blue-950 font-bold' : 'text-slate-700'}`}>
                                    {d}
                                  </span>
                                </div>
                                <span className="text-[10px] font-bold text-blue-600 bg-blue-100/80 px-2 py-0.5 rounded">
                                  Live Slot
                                </span>
                              </div>
                            );
                          })}
                        </div>
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

                    <div className="flex items-center gap-3">
                      {userBookings.length > 0 && (
                        <button
                          type="button"
                          onClick={() => setIsEditing(false)}
                          className="w-1/3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 px-4 rounded-md text-sm transition-colors border border-slate-300 cursor-pointer"
                        >
                          Cancel
                        </button>
                      )}
                      <button
                        type="submit"
                        disabled={submitting}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-4 rounded-md text-sm transition-colors shadow-sm disabled:opacity-50"
                      >
                        {submitting ? 'Saving...' : userBookings.length > 0 ? 'Update Reservation' : 'Confirm Webinar Reservation'}
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
