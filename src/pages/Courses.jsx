import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useAuthModal } from '../context/AuthModalContext';
import { useCashfree } from '../hooks/useCashfree';
import { Star, Clock, CheckCircle2, AlertCircle, Phone, Loader2 } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { NoticeModal } from '../components/NoticeModal';
import { SEO } from '../components/SEO';

export const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [purchasingCourseId, setPurchasingCourseId] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  
  const { user, updateUser } = useAuth();
  const { openAuthModal } = useAuthModal();
  const navigate = useNavigate();
  const cashfreeLoaded = useCashfree();
  const [phoneInput, setPhoneInput] = useState('');
  const [searchParams] = useSearchParams();
  const searchFilter = searchParams.get('search') || '';

  const [checkoutCourse, setCheckoutCourse] = useState(null);
  const [couponCode, setCouponCode] = useState('');
  const [couponStatus, setCouponStatus] = useState(null);
  const [validatingCoupon, setValidatingCoupon] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [paymentStatusAlert, setPaymentStatusAlert] = useState(null);

  const [enrolledCourseIds, setEnrolledCourseIds] = useState([]);

  useEffect(() => {
    document.title = 'Available Courses & Training Cohorts | NexxSkill';
    fetchCourses();
  }, []);

  useEffect(() => {
    if (user) {
      fetchUserEnrollments();
    } else {
      setEnrolledCourseIds([]);
    }
  }, [user]);

  useEffect(() => {
    if (checkoutCourse) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [checkoutCourse]);

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
        // Filter out upcoming courses completely per request
        const availableOnly = (res.data.data.courses || []).filter(c => c.type === 'available');
        setCourses(availableOnly);

        const checkoutId = searchParams.get('checkout');
        if (checkoutId) {
          const matched = availableOnly.find(c => Number(c.id) === Number(checkoutId));
          if (matched) {
            handleOpenCheckoutModal(matched);
          }
        }
      }
    } catch (err) {
      console.error('Failed to fetch courses:', err);
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
    const userPhone = (user?.phone || '').toString().replace(/[^0-9]/g, '').slice(-10);
    setPhoneInput(userPhone);
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
    if (!cashfreeLoaded && !appliedCoupon?.isFree) {
      setNoticeModal({ type: 'info', title: 'Gateway Loading', message: 'Payment gateway is initializing, please try again in a moment.' });
      return;
    }

    const cleanPhone = (user?.phone || phoneInput || '').toString().replace(/[^0-9]/g, '').slice(-10);
    if (!cleanPhone || cleanPhone.length !== 10) {
      setErrorMsg('Please enter your 10-digit mobile number before proceeding to payment.');
      return;
    }

    setPurchasingCourseId(checkoutCourse.id);
    setErrorMsg('');

    try {
      const orderRes = await api.post('/payments/create-order', {
        courseId: checkoutCourse.id,
        couponCode: appliedCoupon ? appliedCoupon.code : '',
        phone: cleanPhone
      });

      if (cleanPhone && cleanPhone !== user?.phone) {
        updateUser({ phone: cleanPhone });
      }

      if (!orderRes.data?.success) {
        throw new Error(orderRes.data?.error?.message || 'Failed to create payment order');
      }

      // Handle 100% Discount (Free Checkout Direct Activation)
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

      const { orderId, paymentSessionId, environment } = orderRes.data.data;

      if (!paymentSessionId) {
        throw new Error('Cashfree payment session could not be created. Please configure Cashfree credentials.');
      }

      if (!window.Cashfree) {
        throw new Error('Cashfree Payment Gateway SDK could not be loaded. Please refresh and try again.');
      }

      const cashfree = window.Cashfree({
        mode: environment === 'production' ? 'production' : 'sandbox'
      });

      cashfree.checkout({
        paymentSessionId: paymentSessionId,
        redirectTarget: "_modal"
      }).then(async (result) => {
        document.body.style.overflow = '';
        setPurchasingCourseId(null);

        if (result.error) {
          setNoticeModal({
            type: 'info',
            title: 'Payment Cancelled',
            message: result.error.message || 'Payment window was closed before completing payment.'
          });
          return;
        }

        // Only verify after payment completion in Cashfree
        try {
          const verifyRes = await api.post('/payments/verify', {
            order_id: orderId
          });

          if (verifyRes.data?.success) {
            setCheckoutCourse(null);
            setNoticeModal({
              type: 'success',
              title: 'Payment Successful',
              message: 'Payment verified! Your course access has been activated.',
              onClose: () => navigate('/student/dashboard')
            });
          } else {
            setNoticeModal({
              type: 'error',
              title: 'Payment Incomplete',
              message: verifyRes.data?.error?.message || 'Payment was not confirmed by gateway.'
            });
          }
        } catch (vErr) {
          setNoticeModal({
            type: 'error',
            title: 'Payment Verification Error',
            message: vErr.response?.data?.error?.message || 'Payment verification failed.'
          });
        }
      });
    } catch (err) {
      document.body.style.overflow = '';
      setNoticeModal({
        type: 'error',
        title: 'Payment Initiation Error',
        message: err.response?.data?.error?.message || err.message || 'Payment initiation failed'
      });
    } finally {
      document.body.style.overflow = '';
      setPurchasingCourseId(null);
    }
  };

  const filteredCourses = courses.filter(c => 
    c.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
    c.description?.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="bg-slate-50 dark:bg-[#080e1a] text-slate-900 dark:text-slate-100 min-h-screen font-sans pb-20 transition-colors duration-300">
      <SEO
        title="Mainframe & Enterprise Software Courses"
        description="Explore comprehensive IBM System z Mainframe training, COBOL, JCL, DB2, and corporate software engineering cohorts at NexxSkill."
        canonical="/courses"
        keywords="Mainframe Courses, COBOL Training, JCL, DB2 Certification, System z Training, IBM Mainframe, Enterprise Cohort"
      />
      
      {/* Page Hero Section */}
      <PageHeader
        badgeText="Enterprise Training Catalog"
        titlePrefix="All Available"
        highlightTitle="Courses & Cohorts"
        description={`${filteredCourses.length} results found ${searchFilter ? `for "${searchFilter}"` : 'across Mainframe & Data Engineering'}`}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">

        {paymentStatusAlert && (
          <div className={`mb-6 p-4 rounded-xl border flex items-center justify-between gap-3 text-sm shadow-sm transition-all ${
            paymentStatusAlert.type === 'success'
              ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 font-semibold'
              : paymentStatusAlert.type === 'error'
              ? 'bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-800 text-red-800 dark:text-red-300 font-semibold'
              : 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 font-semibold'
          }`}>
            <div className="flex items-center gap-2.5">
              <AlertCircle className={`w-5 h-5 shrink-0 ${
                paymentStatusAlert.type === 'success' ? 'text-emerald-600 dark:text-emerald-400' : paymentStatusAlert.type === 'error' ? 'text-red-600 dark:text-red-400' : 'text-amber-600 dark:text-amber-400'
              }`} />
              <span>{paymentStatusAlert.message}</span>
            </div>
            <button onClick={() => setPaymentStatusAlert(null)} className="text-xs font-bold opacity-60 hover:opacity-100 p-1 cursor-pointer">
              ×
            </button>
          </div>
        )}

        {loading ? (
          <div className="py-12 text-center text-slate-500 dark:text-slate-400">Loading course catalog...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredCourses.map((course) => (
              <div key={course.id} id={course.slug} className="bg-white dark:bg-[#0d172e] border border-slate-200/90 dark:border-[#1a2d52] rounded-2xl overflow-hidden flex flex-col justify-between hover:shadow-xl hover:border-[#2daee8] dark:hover:border-[#2daee8] transition-all duration-300 group">
                <div className="p-6">
                  <div className="aspect-video rounded-xl bg-slate-950 mb-5 overflow-hidden relative shadow-inner">
                    <img src="/assets/hero_banner.png" alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <span className="absolute top-3 left-3 bg-brand-gradient text-white text-[10px] font-extrabold px-3 py-1 rounded-full shadow-md uppercase tracking-wider z-10">
                      Live Cohort
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 dark:text-white text-xl font-space group-hover:text-[#2daee8] transition-colors leading-snug">
                    {course.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 line-clamp-2 leading-relaxed">{course.description}</p>

                  <div className="flex items-center gap-1.5 mt-3 text-xs">
                    <span className="font-bold text-slate-900 dark:text-white font-space">4.9</span>
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-current" />)}
                    </div>
                    <span className="text-slate-400 font-medium">(120+ Enrolled)</span>
                  </div>

                  <div className="space-y-2 mt-5 pt-4 border-t border-slate-100 dark:border-[#1a2d52]">
                    {Array.isArray(course.bullets) && course.bullets.map((b, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#2daee8] shrink-0" />
                        <span>{b}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-6 pt-4 border-t border-slate-100 dark:border-[#1a2d52] bg-slate-50/80 dark:bg-[#101f3c]/60 space-y-3">
                  {userEnrollments[Number(course.id)] ? (
                    <button
                      onClick={() => navigate('/student/dashboard')}
                      className="w-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-all"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      <span>Enrolled</span>
                    </button>
                  ) : (
                    <>
                      <div className="flex items-baseline justify-between">
                        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Tuition Fee:</span>
                        <span className="text-2xl font-extrabold text-slate-900 dark:text-white font-space">₹{course.price_rupees?.toLocaleString()}</span>
                      </div>

                      <button
                        onClick={() => handleOpenCheckoutModal(course)}
                        className="w-full bg-brand-gradient hover:opacity-95 text-white font-bold py-3 px-4 rounded-xl text-xs transition-all shadow-brand-glow cursor-pointer flex items-center justify-center gap-2"
                      >
                        <span>Enroll Now</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Checkout & Coupon Modal */}
      {checkoutCourse && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0d172e] border border-slate-200 dark:border-[#1a2d52] w-full max-w-md rounded-2xl shadow-2xl overflow-hidden relative">
            <div className="px-6 pt-6 pb-4 flex items-center justify-between border-b border-slate-100 dark:border-[#1a2d52] bg-slate-50 dark:bg-[#101f3c]">
              <div>
                <span className="text-[10px] font-bold text-[#2daee8] uppercase tracking-widest bg-[#2daee8]/15 px-2 py-0.5 rounded">
                  Course Checkout
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white font-space mt-1">
                  {checkoutCourse.title}
                </h3>
              </div>
              <button onClick={() => setCheckoutCourse(null)} className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 text-2xl font-bold leading-none p-1">
                ×
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Order Breakdown Summary */}
              <div className="bg-slate-50 dark:bg-[#101f3c] border border-slate-200 dark:border-[#1e3a6a] p-4 rounded-xl space-y-2 text-xs">
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Standard Tuition Fee:</span>
                  <span className="font-bold text-slate-900 dark:text-white">₹{checkoutCourse.price_rupees?.toLocaleString()}</span>
                </div>

                {appliedCoupon && (
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold pt-1 border-t border-slate-200 dark:border-[#1e3a6a]">
                    <span>Discount ({appliedCoupon.discountPercent}% OFF - {appliedCoupon.code}):</span>
                    <span>- ₹{(appliedCoupon.discountAmount / 100).toLocaleString()}</span>
                  </div>
                )}

                <div className="flex justify-between text-sm font-extrabold text-slate-900 dark:text-white pt-2 border-t border-slate-200 dark:border-[#1e3a6a] font-space">
                  <span>Total Amount Payable:</span>
                  <span className="text-[#2daee8]">
                    ₹{appliedCoupon ? (appliedCoupon.finalAmount / 100).toLocaleString() : checkoutCourse.price_rupees?.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Coupon Form */}
              <form onSubmit={handleApplyCoupon} className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">Have a Discount Coupon?</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter Code (e.g. FREE100)"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    className="flex-1 bg-white dark:bg-[#080e1a] border border-slate-300 dark:border-[#1e3a6a] rounded-xl px-3.5 py-2 text-sm text-slate-900 dark:text-white font-mono uppercase focus:outline-none focus:border-[#2daee8]"
                  />
                  <button
                    type="submit"
                    disabled={validatingCoupon || !couponCode.trim()}
                    className="bg-[#1153aa] hover:bg-[#0e4388] text-white font-bold px-4 py-2 rounded-xl text-xs transition-colors disabled:opacity-50 cursor-pointer shrink-0"
                  >
                    {validatingCoupon ? 'Applying...' : 'Apply'}
                  </button>
                </div>

                {couponStatus && (
                  <p className={`text-xs font-semibold mt-1.5 ${couponStatus.type === 'success' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                    {couponStatus.message}
                  </p>
                )}
              </form>

              {/* Phone Number Input if missing */}
              {(!user?.phone || user.phone.replace(/[^0-9]/g, '').length < 10) && (
                <div className="bg-sky-50/80 dark:bg-sky-950/40 border border-sky-200/80 dark:border-sky-800/60 rounded-2xl p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-[#2daee8]" />
                      <span>Mobile Number</span>
                    </span>
                    <span className="text-[10px] bg-sky-100 dark:bg-sky-900/60 text-sky-700 dark:text-sky-300 font-bold px-2 py-0.5 rounded-full uppercase">
                      Required for Cashfree
                    </span>
                  </div>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">+91</span>
                    <input
                      type="tel"
                      maxLength={10}
                      value={phoneInput}
                      onChange={(e) => {
                        setPhoneInput(e.target.value.replace(/[^0-9]/g, ''));
                        setErrorMsg('');
                      }}
                      placeholder="Enter 10-digit mobile number"
                      className="w-full pl-11 pr-3.5 py-2.5 bg-white dark:bg-[#080e1a] border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-[#2daee8]"
                    />
                  </div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">
                    Used for your official Cashfree payment receipt and WhatsApp lab mentorship.
                  </p>
                </div>
              )}

              {errorMsg && (
                <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/60 rounded-xl text-red-600 dark:text-red-400 text-xs font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Checkout CTA */}
              <button
                onClick={handleProceedPayment}
                disabled={purchasingCourseId === checkoutCourse.id}
                className="w-full bg-brand-gradient hover:opacity-95 text-white font-bold py-3.5 px-4 rounded-xl text-sm transition-all shadow-brand-glow disabled:opacity-50 cursor-pointer"
              >
                {purchasingCourseId === checkoutCourse.id
                  ? 'Processing Enrollment...'
                  : appliedCoupon?.isFree
                  ? 'Unlock Free Access Now'
                  : 'Proceed to Payment'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Notification Modal */}
      <NoticeModal modal={noticeModal} onClose={() => setNoticeModal(null)} />
    </div>
  );
};
