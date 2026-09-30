import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Star, ShieldCheck, Play, Pause, Award, Clock, ArrowRight, CheckCircle, Users, Terminal, Cpu, Check, Loader2, X, CheckCircle2, AlertCircle, ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useAuthModal } from '../context/AuthModalContext';
import { useWebinarModal } from '../context/WebinarModalContext';
import { NoticeModal } from '../components/NoticeModal';
import { useRazorpay } from '../hooks/useRazorpay';
import { SEO } from '../components/SEO';
import heroVideo from '../assets/hero-video.mp4';

export const Home = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showWebinarModal, setShowWebinarModal] = useState(false);
  const [webinars, setWebinars] = useState([]);
  const [selectedWebinar, setSelectedWebinar] = useState(null);
  const [webinarFormData, setWebinarFormData] = useState({ name: '', email: '', phone: '', selected_date: '', question: '' });
  const [webinarSubmitting, setWebinarSubmitting] = useState(false);
  const [webinarStatus, setWebinarStatus] = useState(null);
  const [webinarBookingSuccess, setWebinarBookingSuccess] = useState(null);
  const [purchasingCourseId, setPurchasingCourseId] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const [checkoutCourse, setCheckoutCourse] = useState(null);
  const [couponCode, setCouponCode] = useState('');
  const [couponStatus, setCouponStatus] = useState(null);
  const [validatingCoupon, setValidatingCoupon] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [paymentStatusAlert, setPaymentStatusAlert] = useState(null);

  const { user } = useAuth();
  const { openAuthModal } = useAuthModal();
  const navigate = useNavigate();
  const razorpayLoaded = useRazorpay();

  const [faqs, setFaqs] = useState([]);
  const [openFaqIdx, setOpenFaqIdx] = useState(null);

  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);

  const toggleVideoPlay = () => {
    if (videoRef.current) {
      if (videoRef.current.muted) {
        videoRef.current.muted = false;
      }
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  useEffect(() => {
    fetchCourses();
    fetchWebinars();
    fetchFaqs();
  }, [user]);

  useEffect(() => {
    if (videoRef.current) {
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch(() => {
            // Autoplay with audio was blocked by browser policy -> play muted initially to guarantee autoplay
            if (videoRef.current) {
              videoRef.current.muted = true;
              videoRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
            }
          });
      }
    }
  }, []);

  const fetchFaqs = async () => {
    try {
      const res = await api.get('/faqs');
      if (res.data?.success) {
        setFaqs(res.data.data.faqs || []);
      }
    } catch (err) {
      console.error('Failed to fetch FAQs:', err);
    }
  };

  const fetchWebinars = async () => {
    try {
      const res = await api.get('/webinars', { params: user ? { email: user.email } : {} });
      if (res.data?.success) {
        setWebinars(res.data.data.webinars || []);
      }
    } catch (err) {
      console.error('Failed to fetch webinars:', err);
    }
  };

  const handleOpenBookWebinarModal = () => {
    if (!user) {
      openAuthModal('login');
      return;
    }
    const live = webinars.find(w => w.type === 'live') || webinars[0];
    if (live) {
      setSelectedWebinar(live);
      setWebinarFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        selected_date: Array.isArray(live.available_dates) && live.available_dates.length > 0 ? live.available_dates[0] : (live.scheduled_at || ''),
        question: ''
      });
    }
    setWebinarStatus(null);
    setWebinarBookingSuccess(null);
    setShowWebinarModal(true);
  };

  const handleWebinarSubmit = async (e) => {
    e.preventDefault();
    if (!selectedWebinar) return;
    setWebinarSubmitting(true);
    setWebinarStatus(null);

    try {
      const res = await api.post('/webinars/register', {
        webinar_id: selectedWebinar.id,
        ...webinarFormData
      });

      if (res.data?.success) {
        setWebinarBookingSuccess({
          webinarTitle: selectedWebinar.title,
          bookedDate: webinarFormData.selected_date || selectedWebinar.scheduled_at,
          meetingUrl: res.data?.data?.meeting_url || selectedWebinar.meeting_url || 'https://meet.google.com/nexxskill-mainframe-demo',
          userEmail: webinarFormData.email,
          message: res.data?.message || 'Seat reserved successfully'
        });
        fetchWebinars();
      }
    } catch (err) {
      setWebinarStatus({ type: 'error', message: err.response?.data?.error?.message || 'Registration failed' });
    } finally {
      setWebinarSubmitting(false);
    }
  };

  const [userEnrollments, setUserEnrollments] = useState({});

  useEffect(() => {
    if (user) {
      fetchUserEnrollments();
    } else {
      setUserEnrollments({});
    }
  }, [user]);

  const fetchUserEnrollments = async () => {
    try {
      const res = await api.get('/student/enrollments');
      if (res.data?.success) {
        const enrMap = {};
        (res.data.data.enrollments || []).forEach(e => {
          enrMap[Number(e.course_id)] = e;
        });
        setUserEnrollments(enrMap);
      }
    } catch (err) {
      console.error('Failed to fetch user enrollments:', err);
    }
  };

  const fetchCourses = async () => {
    try {
      const res = await api.get('/courses');
      if (res.data?.success) {
        const availableOnly = (res.data.data.courses || []).filter(c => c.type === 'available');
        setCourses(availableOnly);
      }
    } catch (err) {
      console.error('Failed to fetch home courses:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCheckoutModal = (course) => {
    if (!user) {
      openAuthModal('login');
      return;
    }
    setCheckoutCourse(course);
    setCouponCode('');
    setCouponStatus(null);
    setAppliedCoupon(null);
    setErrorMsg('');
  };

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponCode.trim() || !checkoutCourse) return;

    setValidatingCoupon(true);
    setCouponStatus(null);

    try {
      const res = await api.post('/coupons/validate', {
        code: couponCode,
        courseId: checkoutCourse.id
      });

      if (res.data?.success) {
        setAppliedCoupon(res.data.data);
        setCouponStatus({ type: 'success', message: res.data.message });
      }
    } catch (err) {
      setAppliedCoupon(null);
      setCouponStatus({ type: 'error', message: err.response?.data?.error?.message || 'Invalid coupon code' });
    } finally {
      setValidatingCoupon(false);
    }
  };

  const [noticeModal, setNoticeModal] = useState(null);

  const handleProceedPayment = async () => {
    if (!checkoutCourse) return;
    if (!razorpayLoaded && !appliedCoupon?.isFree) {
      setNoticeModal({ type: 'info', title: 'SDK Loading', message: 'Payment SDK is loading, please try again in a moment.' });
      return;
    }

    setPurchasingCourseId(checkoutCourse.id);
    setErrorMsg('');

    try {
      const orderRes = await api.post('/payments/create-order', {
        courseId: checkoutCourse.id,
        couponCode: appliedCoupon ? appliedCoupon.code : ''
      });

      if (!orderRes.data?.success) {
        throw new Error(orderRes.data?.error?.message || 'Failed to create payment order');
      }

      if (orderRes.data.isFree) {
        setCheckoutCourse(null);
        setNoticeModal({
          type: 'success',
          title: 'Course Unlocked!',
          message: orderRes.data.message || 'Course unlocked with 100% discount!',
          onClose: () => navigate('/student/dashboard')
        });
        return;
      }

      const { orderId, amount, currency, keyId, courseTitle } = orderRes.data.data;

      const options = {
        key: keyId,
        amount: amount,
        currency: currency,
        name: 'NexxSkill Academy',
        description: courseTitle,
        ...(orderId && !orderId.startsWith('order_demo_') ? { order_id: orderId } : {}),
        prefill: {
          name: user.name || '',
          email: user.email || '',
          contact: user.phone || ''
        },
        theme: {
          color: '#1e3a8a'
        },
        handler: async (response) => {
          document.body.style.overflow = '';
          try {
            const verifyRes = await api.post('/payments/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });

            if (verifyRes.data?.success) {
              setCheckoutCourse(null);
              setNoticeModal({
                type: 'success',
                title: 'Payment Successful',
                message: 'Enrollment successful! Your course access has been activated.',
                onClose: () => navigate('/student/dashboard')
              });
            } else {
              setNoticeModal({ type: 'error', title: 'Payment Verification Failed', message: 'Payment verification failed. Please contact support.' });
            }
          } catch (vErr) {
            setNoticeModal({ type: 'error', title: 'Payment Verification Error', message: vErr.response?.data?.error?.message || 'Payment verification failed.' });
          }
        },
        modal: {
          ondismiss: () => {
            document.body.style.overflow = '';
            setPurchasingCourseId(null);
            setNoticeModal({ type: 'info', title: 'Payment Cancelled', message: 'Payment process was cancelled by user.' });
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response) {
        document.body.style.overflow = '';
        setNoticeModal({
          type: 'error',
          title: 'Payment Failed',
          message: `Reason: ${response.error.description || 'Transaction declined'}`
        });
      });
      rzp.open();
    } catch (err) {
      document.body.style.overflow = '';
      setNoticeModal({ type: 'error', title: 'Payment Initiation Error', message: err.response?.data?.error?.message || err.message || 'Payment initiation failed' });
    } finally {
      document.body.style.overflow = '';
      setPurchasingCourseId(null);
    }
  };

  const handleEnrollNow = (e, course) => {
    e.stopPropagation();
    setSelectedCourse(null);
    handleOpenCheckoutModal(course);
  };
  return (
    <div className="bg-slate-50 dark:bg-[#080e1a] text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200">
      <SEO
        title="NexxSkill | Enterprise System z Mainframe & Software Academy"
        description="Master job-ready IBM System z Mainframe, COBOL, JCL, DB2, and corporate software skills led by industry veteran Jahangir Alom Bakul (IBM & Societe Generale Alum)."
        canonical="/"
        keywords="NexxSkill, Mainframe Training, COBOL, JCL, System z, Enterprise Engineering, IBM Mainframe Course"
      />
      {/* Modern Hero Section with #1153aa & #2daee8 Accents */}
      <section className="bg-white dark:bg-[#080e1a] py-16 md:py-24 border-b border-slate-200/80 dark:border-slate-800/80 relative overflow-hidden transition-colors duration-200">
        {/* Subtle Ambient Animated Glow Blobs */}
        <div className="absolute top-10 left-10 w-96 h-96 bg-[#1153aa]/10 rounded-full blur-3xl pointer-events-none animate-float-glow-1"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#2daee8]/10 rounded-full blur-3xl pointer-events-none animate-float-glow-2"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {paymentStatusAlert && (
            <div className={`mb-8 p-4 rounded-2xl border flex items-center justify-between gap-3 text-sm shadow-md transition-all ${
              paymentStatusAlert.type === 'success'
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 font-semibold'
                : paymentStatusAlert.type === 'error'
                ? 'bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-800 text-red-800 dark:text-red-300 font-semibold'
                : 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 font-semibold'
            }`}>
              <div className="flex items-center gap-2.5">
                <AlertCircle className={`w-5 h-5 shrink-0 ${
                  paymentStatusAlert.type === 'success' ? 'text-emerald-600' : paymentStatusAlert.type === 'error' ? 'text-red-600' : 'text-amber-600'
                }`} />
                <span>{paymentStatusAlert.message}</span>
              </div>
              <button onClick={() => setPaymentStatusAlert(null)} className="text-xs font-bold opacity-60 hover:opacity-100 p-1 cursor-pointer">
                ×
              </button>
            </div>
          )}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 dark:bg-[#0d172e] border border-blue-200/80 dark:border-[#1a2d52] text-[#1153aa] dark:text-[#2daee8] text-xs font-bold tracking-wide shadow-xs">
                <span className="w-2 h-2 rounded-full bg-[#2daee8] animate-pulse"></span>
                <span>Enterprise Engineering Academy</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white font-space tracking-tight leading-[1.12]">
                Master <span className="bg-gradient-to-r from-[#1153aa] to-[#2daee8] bg-clip-text text-transparent">System z Mainframes</span> & High-Scale Systems
              </h1>

              <p className="text-slate-600 dark:text-slate-400 text-base md:text-lg leading-relaxed max-w-xl">
                Industry-focused Mainframe, COBOL, JCL, and Data mentorship by Jahangir Alom Bakul (IBM & Societe Generale Alum).
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Link
                  to="/courses"
                  className="bg-gradient-to-r from-[#1153aa] to-[#2daee8] hover:shadow-lg hover:shadow-[#2daee8]/25 text-white font-bold px-7 py-3.5 rounded-xl text-sm transition-all shadow-md flex items-center gap-2"
                >
                  <span>Explore Courses</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/webinars"
                  className="bg-white dark:bg-[#0d172e] hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 font-bold px-7 py-3.5 rounded-xl text-sm transition-all shadow-xs cursor-pointer flex items-center gap-2"
                >
                  <Video className="w-4 h-4 text-[#2daee8]" />
                  <span>Book Free Webinar</span>
                </Link>
              </div>

              <div className="pt-6 border-t border-slate-100 dark:border-slate-800 grid grid-cols-3 gap-4 text-xs text-slate-500 dark:text-slate-400">
                <div>
                  <span className="block font-extrabold text-slate-900 dark:text-white text-base font-space">10+ Yrs</span>
                  <span>Corporate Exp</span>
                </div>
                <div>
                  <span className="block font-extrabold text-slate-900 dark:text-white text-base font-space">IBM & SG</span>
                  <span>Veteran Mentor</span>
                </div>
                <div>
                  <span className="block font-extrabold text-[#1153aa] dark:text-[#2daee8] text-base font-space">600+</span>
                  <span>Engineers Mentored</span>
                </div>
              </div>
            </div>

            {/* Right Video Container */}
            <div className="lg:col-span-6">
              <div
                onClick={toggleVideoPlay}
                className="rounded-3xl overflow-hidden border-4 border-white dark:border-slate-800 shadow-2xl bg-slate-950 aspect-video ring-1 ring-slate-200 dark:ring-slate-700/80 relative cursor-pointer group"
              >
                <video
                  ref={videoRef}
                  src={heroVideo}
                  onContextMenu={(e) => e.preventDefault()}
                  autoPlay
                  loop
                  playsInline
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  className="w-full h-full object-cover"
                />

                {/* Subtle Play/Pause Overlay Indicator on Hover or Click */}
                <div className={`absolute inset-0 flex items-center justify-center bg-slate-900/30 transition-opacity ${isPlaying ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'}`}>
                  <div className="w-14 h-14 rounded-2xl bg-white/95 dark:bg-[#0d172e]/95 text-slate-900 dark:text-white flex items-center justify-center shadow-lg backdrop-blur-xs transition-transform group-hover:scale-110">
                    {isPlaying ? <Pause className="w-6 h-6 fill-current text-[#1153aa] dark:text-[#2daee8]" /> : <Play className="w-6 h-6 fill-current text-[#1153aa] dark:text-[#2daee8] ml-0.5" />}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Featured Courses Carousel/Grid */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white font-space">Available Enterprise Courses</h2>
            <p className="text-slate-500 dark:text-slate-400 text-xs md:text-sm mt-1">Select from our active enterprise training cohorts with direct terminal access</p>
          </div>
          <Link to="/courses" className="text-xs font-bold text-[#1153aa] dark:text-[#2daee8] hover:underline flex items-center gap-1 self-start sm:self-auto">
            <span>View All Programs</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12 text-slate-500 gap-2">
            <Loader2 className="w-6 h-6 animate-spin text-[#2daee8]" />
            <span className="text-sm font-medium">Loading courses from API...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {courses.map((course) => (
              <div
                key={course.id}
                onClick={() => setSelectedCourse(course)}
                className="bg-white dark:bg-[#0d172e] border border-slate-200/90 dark:border-slate-800/90 rounded-2xl overflow-hidden flex flex-col justify-between hover:border-[#2daee8]/60 hover:shadow-xl hover:shadow-[#2daee8]/10 transition-all cursor-pointer group"
              >
                <div className="p-5">
                  <div className="aspect-video rounded-xl bg-slate-900 mb-4 overflow-hidden relative">
                    <img src={course.thumbnail_url || "/assets/hero_banner.png"} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    {course.id === 1 && (
                      <span className="absolute top-2.5 left-2.5 bg-gradient-to-r from-amber-400 to-amber-500 text-amber-950 text-[10px] font-extrabold px-2.5 py-1 rounded-lg shadow-md uppercase tracking-wider z-10">
                        Bestseller
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-slate-900 dark:text-white text-base leading-snug group-hover:text-[#1153aa] dark:group-hover:text-[#2daee8] transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Jahangir Alom Bakul</p>

                  {/* Rating */}
                  <div className="flex items-center gap-1 mt-2 text-xs">
                    <span className="font-bold text-amber-600 dark:text-amber-400">4.9</span>
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 fill-current" />)}
                    </div>
                    <span className="text-slate-400 dark:text-slate-500">(120+)</span>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-2">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{course.duration} duration</span>
                  </div>
                </div>

                <div className="px-5 py-3 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/70 dark:bg-[#080e1a]/70 flex items-center justify-between">
                  {userEnrollments[Number(course.id)] ? (
                    <button
                      onClick={(e) => { e.stopPropagation(); navigate('/student/dashboard'); }}
                      className="w-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 px-3.5 py-2 rounded-xl flex items-center justify-center gap-1 hover:bg-emerald-100 transition-colors"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Enrolled</span>
                    </button>
                  ) : (
                    <>
                      <span className="text-lg font-extrabold text-slate-900 dark:text-white font-space">₹{(course.price_rupees || 0).toLocaleString()}</span>
                      <button
                        onClick={(e) => handleEnrollNow(e, course)}
                        disabled={purchasingCourseId === course.id}
                        className="text-xs font-bold bg-gradient-to-r from-[#1153aa] to-[#2daee8] hover:shadow-md hover:shadow-[#2daee8]/25 text-white px-3.5 py-2 rounded-xl flex items-center gap-1 transition-all shadow-xs disabled:opacity-50"
                      >
                        <span>{purchasingCourseId === course.id ? 'Processing...' : 'Enroll Now'}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Course Details Modal */}
      {selectedCourse && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0d172e] border border-slate-200 dark:border-slate-800 w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden relative max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-[#080e1a]/80">
              <span className="text-xs font-bold text-[#1153aa] dark:text-[#2daee8] uppercase tracking-widest bg-blue-100 dark:bg-blue-950 px-2.5 py-1 rounded-full">
                Course Details
              </span>
              <button
                onClick={() => setSelectedCourse(null)}
                className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center text-lg font-bold transition-colors cursor-pointer"
              >
                ×
              </button>
            </div>

            <div className="p-6 space-y-4 overflow-y-auto flex-1">
              <div className="aspect-video rounded-2xl bg-slate-950 overflow-hidden">
                <img src={selectedCourse.thumbnail_url || "/assets/hero_banner.png"} alt={selectedCourse.title} className="w-full h-full object-cover" />
              </div>

              <div>
                <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white font-space leading-tight">
                  {selectedCourse.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">Instructor: Jahangir Alom Bakul (IBM & Societe Generale Alum)</p>
              </div>

              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">{selectedCourse.description}</p>

              <div className="flex items-center gap-4 text-xs text-slate-600 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                <span className="flex items-center gap-1 font-semibold text-slate-900 dark:text-slate-200"><Clock className="w-4 h-4 text-[#2daee8]" /> Duration: {selectedCourse.duration}</span>
                <span className="flex items-center gap-1 font-semibold text-slate-900 dark:text-slate-200"><Award className="w-4 h-4 text-[#2daee8]" /> Certificate Included</span>
              </div>

              {Array.isArray(selectedCourse.bullets) && selectedCourse.bullets.length > 0 && (
                <div className="space-y-2 pt-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Key Learning Modules:</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {selectedCourse.bullets.map((b, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-[#080e1a] p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span>{b}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-[#080e1a]/80 flex items-center justify-between shrink-0">
              <div>
                <span className="block text-[10px] text-slate-400 font-bold uppercase">Total Fee</span>
                <span className="text-2xl font-extrabold text-slate-900 dark:text-white font-space">₹{(selectedCourse.price_rupees || 0).toLocaleString()}</span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSelectedCourse(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-300 dark:border-slate-700 rounded-xl transition-colors"
                >
                  Close
                </button>
                {userEnrollments[Number(selectedCourse.id)] ? (
                  <button
                    onClick={() => {
                      setSelectedCourse(null);
                      navigate('/student/dashboard');
                    }}
                    className="px-5 py-2.5 text-xs font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 rounded-xl flex items-center gap-1.5 shadow-2xs hover:bg-emerald-100 transition-colors cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Enrolled</span>
                  </button>
                ) : (
                  <button
                    onClick={(e) => {
                      const c = selectedCourse;
                      setSelectedCourse(null);
                      handleEnrollNow(e, c);
                    }}
                    disabled={purchasingCourseId === selectedCourse.id}
                    className="px-5 py-2.5 text-xs font-bold bg-gradient-to-r from-[#1153aa] to-[#2daee8] hover:shadow-md text-white rounded-xl flex items-center gap-1.5 shadow-sm transition-all disabled:opacity-50"
                  >
                    <span>{purchasingCourseId === selectedCourse.id ? 'Processing...' : 'Enroll Now'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* The NexxSkill Advantage Section */}
      <section className="py-20 bg-white dark:bg-[#0b1428] border-y border-slate-200/80 dark:border-slate-800/80 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-bold text-[#1153aa] dark:text-[#2daee8] uppercase tracking-widest bg-blue-50 dark:bg-[#0d172e] border border-blue-200/80 dark:border-[#1a2d52] px-3.5 py-1 rounded-full">
              Why Choose Our Academy
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white font-space mt-3">The NexxSkill Advantage</h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm mt-2">
              Engineered from the ground up for zero-fluff enterprise technical mastery.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-50 dark:bg-[#0d172e] border border-slate-200/80 dark:border-slate-800/80 p-7 rounded-2xl shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#1153aa] to-[#2daee8] text-white flex items-center justify-center font-bold shadow-md shadow-[#2daee8]/20">
                <Terminal className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white font-space">Practical Learning</h3>
              <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
                We prioritize zero-fluff, hands-on examples and execution of real-world test scripts directly inside terminal emulators instead of stale theory lectures.
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-[#0d172e] border border-slate-200/80 dark:border-slate-800/80 p-7 rounded-2xl shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#1153aa] to-[#2daee8] text-white flex items-center justify-center font-bold shadow-md shadow-[#2daee8]/20">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white font-space">Industry Experience</h3>
              <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
                Learn engineering design standards directly from veterans with real background deploying code onto transaction processing subsystems.
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-[#0d172e] border border-slate-200/80 dark:border-slate-800/80 p-7 rounded-2xl shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#1153aa] to-[#2daee8] text-white flex items-center justify-center font-bold shadow-md shadow-[#2daee8]/20">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white font-space">Beginner Friendly</h3>
              <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
                No prior infrastructure experience expected. We break down enterprise concepts into simplified logical frameworks from step one.
              </p>
            </div>
          </div>

          {/* End-to-End Career Support Box */}
          <div className="mt-14 bg-gradient-to-br from-[#0c1c38] to-[#0a274c] text-white p-8 sm:p-10 rounded-3xl border border-[#1a2d52] shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#2daee8]/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center relative z-10">
              <div className="md:col-span-5 space-y-3">
                <span className="text-[11px] font-extrabold text-[#2daee8] uppercase tracking-widest bg-[#2daee8]/10 border border-[#2daee8]/20 px-3 py-1 rounded-full">
                  Career Acceleration
                </span>
                <h3 className="text-2xl md:text-3xl font-bold font-space text-white">End-to-End Career Support</h3>
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                  We actively guide our developers past the training phase straight into specialized enterprise production roles.
                </p>
              </div>

              <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs text-slate-200">
                {[
                  'Tailored Mainframe & Enterprise Resume Review',
                  'Production Support Knowledge & Workflows',
                  '1-on-1 Interactive Mock Interviews',
                  'Verified Enterprise Technical Interview Pools'
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-3 bg-[#0d1f3d]/80 p-3.5 rounded-xl border border-[#1e3a6c]/80 shadow-xs">
                    <Check className="w-4 h-4 text-[#2daee8] shrink-0" />
                    <span className="font-semibold">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Student Reviews & Testimonials */}
      <section className="py-20 bg-slate-50 dark:bg-[#080e1a] border-t border-slate-200/80 dark:border-slate-800/80 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200/60 dark:border-slate-800/60 pb-8">
            <div className="space-y-2.5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-[#0d172e] border border-blue-200/80 dark:border-[#1a2d52] text-[#1153aa] dark:text-[#2daee8] text-xs font-bold shadow-xs">
                <Star className="w-3.5 h-3.5 fill-current text-amber-500" />
                <span>Verified Student Feedback</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white font-space tracking-tight">
                What Our Engineers Are Saying
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-sm max-w-xl leading-relaxed">
                Real reviews from corporate professionals and engineers transformed through NexxSkill Academy's enterprise curriculum.
              </p>
            </div>

            <div className="flex items-center gap-6 bg-white dark:bg-[#0d172e] border border-slate-200/80 dark:border-slate-800 px-6 py-3.5 rounded-2xl shrink-0 shadow-xs">
              <div>
                <span className="text-2xl md:text-3xl font-extrabold font-space text-slate-900 dark:text-white block">4.9/5</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Average Rating</span>
              </div>
              <div className="h-8 w-px bg-slate-200 dark:bg-slate-800"></div>
              <div>
                <span className="text-2xl md:text-3xl font-extrabold font-space text-[#1153aa] dark:text-[#2daee8] block">600+</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Engineers Placed</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: 'Ananya Roy',
                role: 'Core Infrastructure Engineer',
                company: 'TCS Enterprise Systems',
                avatar: 'AR',
                review: 'The Mainframe Masterclass gave me real hands-on confidence in COBOL and JCL. The interview prep module was instrumental in clearing my enterprise technical rounds.',
                badge: 'Placed Engineer'
              },
              {
                name: 'Karthik Patel',
                role: 'Systems Operations Analyst',
                company: 'Cognizant Banking Tech',
                avatar: 'KP',
                review: 'Hands-down the best enterprise training program. Studying real z/OS production workflows and live lab sessions completely transformed my understanding of Mainframe architectures.',
                badge: 'Banking Tech'
              },
              {
                name: 'Rajesh Sharma',
                role: 'System z Specialist',
                company: 'Wipro Enterprise Systems',
                avatar: 'RS',
                review: 'The zero-fluff terminal emulator labs were game-changing. I went from zero Mainframe concepts to debugging VSAM KSDS files and passing technical interviews with total ease.',
                badge: 'Mainframe Specialist'
              }
            ].map((r, i) => (
              <div key={i} className="bg-white dark:bg-[#0d172e] border border-slate-200/90 dark:border-slate-800/90 p-6 sm:p-7 rounded-2xl flex flex-col justify-between space-y-6 hover:border-[#2daee8]/50 transition-all hover:-translate-y-1 shadow-xs hover:shadow-md group">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex text-amber-400 gap-1">
                      {[...Array(5)].map((_, idx) => <Star key={idx} className="w-4 h-4 fill-current" />)}
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#1153aa] dark:text-[#2daee8] bg-blue-50 dark:bg-blue-950/60 border border-blue-200/60 dark:border-blue-900/60 px-2.5 py-0.5 rounded-full">
                      {r.badge}
                    </span>
                  </div>

                  <p className="text-slate-700 dark:text-slate-300 text-xs sm:text-sm leading-relaxed font-normal italic">
                    "{r.review}"
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-[#1153aa] to-[#2daee8] text-white font-bold text-xs flex items-center justify-center font-space shrink-0 shadow-xs">
                    {r.avatar}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white font-space group-hover:text-[#2daee8] transition-colors">{r.name}</h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">{r.role} • <span className="font-semibold text-slate-700 dark:text-slate-300">{r.company}</span></p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions Section */}
      <section className="py-20 bg-white dark:bg-[#0b1428] border-t border-slate-200/80 dark:border-slate-800/80 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-12">
            <span className="text-xs font-bold text-[#1153aa] dark:text-[#2daee8] uppercase tracking-widest bg-blue-50 dark:bg-[#0d172e] border border-blue-200/80 dark:border-[#1a2d52] px-3.5 py-1 rounded-full">
              Got Questions?
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white font-space">
              Frequently Asked Questions
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xl mx-auto">
              Everything you need to know about our Mainframe training programs, live masterclasses, and career guidance.
            </p>
          </div>

          {faqs.length === 0 ? (
            <div className="text-center text-slate-500 py-8 text-sm">Loading FAQs...</div>
          ) : (
            <div className="space-y-4 max-w-4xl mx-auto">
              {faqs.map((faq, idx) => (
                <div
                  key={faq.id || idx}
                  className="bg-slate-50 dark:bg-[#0d172e] border border-slate-200/80 dark:border-slate-800/80 rounded-2xl overflow-hidden shadow-xs hover:border-[#2daee8]/50 transition-all"
                >
                  <button
                    onClick={() => setOpenFaqIdx(openFaqIdx === idx ? null : idx)}
                    className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 font-bold text-slate-900 dark:text-white text-base hover:text-[#1153aa] dark:hover:text-[#2daee8] transition-colors cursor-pointer"
                  >
                    <span className="flex items-center gap-3">
                      <HelpCircle className="w-5 h-5 text-[#2daee8] shrink-0" />
                      <span>{faq.question}</span>
                    </span>
                    {openFaqIdx === idx ? (
                      <ChevronUp className="w-5 h-5 text-slate-400 shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                    )}
                  </button>
                  {openFaqIdx === idx && (
                    <div className="px-5 sm:px-6 pb-6 text-slate-600 dark:text-slate-300 text-sm leading-relaxed border-t border-slate-200/60 dark:border-slate-800/60 pt-4">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Checkout & Coupon Modal */}
      {checkoutCourse && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0d172e] border border-slate-200 dark:border-slate-800 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden relative animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 pt-6 pb-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-[#080e1a]/80">
              <div>
                <span className="text-[10px] font-bold text-[#1153aa] dark:text-[#2daee8] uppercase tracking-widest bg-blue-100 dark:bg-blue-950 px-2 py-0.5 rounded-full">
                  Secure Checkout
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white font-space mt-1">
                  {checkoutCourse.title}
                </h3>
              </div>
              <button
                onClick={() => setCheckoutCourse(null)}
                className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center text-lg font-bold transition-colors cursor-pointer"
              >
                ×
              </button>
            </div>

            <div className="p-6 space-y-5 text-xs text-slate-700 dark:text-slate-300">
              <div className="bg-slate-50 dark:bg-[#080e1a] p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 space-y-2">
                <div className="flex justify-between items-center text-sm font-bold text-slate-900 dark:text-white">
                  <span>Standard Tuition Fee:</span>
                  <span>₹{checkoutCourse.price_rupees?.toLocaleString()}</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between items-center text-xs font-bold text-emerald-600 dark:text-emerald-400 border-t border-slate-200 dark:border-slate-800 pt-2">
                    <span>Coupon ({appliedCoupon.code}) Discount ({appliedCoupon.discountPercent || 0}%):</span>
                    <span>-₹{(appliedCoupon.discountAmount / 100).toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between items-center text-base font-extrabold text-slate-900 dark:text-white border-t border-slate-200 dark:border-slate-800 pt-2 font-space">
                  <span>Final Payable:</span>
                  <span className="text-[#1153aa] dark:text-[#2daee8] text-xl">
                    ₹{(appliedCoupon
                      ? appliedCoupon.finalAmount / 100
                      : checkoutCourse.price_rupees
                    ).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Coupon Code Input */}
              <form onSubmit={handleApplyCoupon} className="space-y-2">
                <label className="block text-slate-700 dark:text-slate-300 font-semibold text-xs">Have a Promo / Coupon Code?</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="ENTER CODE (e.g. EARLY100)"
                    className="flex-1 bg-white dark:bg-[#080e1a] border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs uppercase font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:border-[#2daee8]"
                  />
                  <button
                    type="submit"
                    disabled={validatingCoupon || !couponCode.trim()}
                    className="bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold px-4 py-2 rounded-xl text-xs transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    {validatingCoupon ? 'Checking...' : 'Apply'}
                  </button>
                </div>
                {couponStatus && (
                  <p className={`text-[11px] font-semibold ${couponStatus.type === 'success' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                    {couponStatus.message}
                  </p>
                )}
              </form>

              {/* Action Buttons */}
              <div className="pt-2">
                <button
                  onClick={handleProceedPayment}
                  disabled={purchasingCourseId === checkoutCourse.id}
                  className="w-full bg-gradient-to-r from-[#1153aa] to-[#2daee8] hover:shadow-lg hover:shadow-[#2daee8]/25 text-white font-bold py-3.5 px-4 rounded-xl text-xs transition-all shadow-md disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                >
                  {purchasingCourseId === checkoutCourse.id ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Initiating Payment...</span>
                    </>
                  ) : appliedCoupon?.isFree ? (
                    <span>Unlock Course 100% Free</span>
                  ) : (
                    <span>Proceed to Secure Razorpay Checkout</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom Notification Modal */}
      <NoticeModal modal={noticeModal} onClose={() => setNoticeModal(null)} />
    </div>
  );
};
