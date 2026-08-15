import React from 'react';

export const PrivacyPolicy = () => {
  return (
    <div className="bg-white text-slate-900 min-h-screen font-sans pb-20">
      
      {/* Page Hero Section matching Home Page structure */}
      <section className="bg-white py-14 md:py-18 border-b border-slate-100 relative overflow-hidden">
        <div className="absolute top-10 left-10 w-96 h-96 bg-blue-400/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-400/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
            <span>Legal Documentation</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 font-space tracking-tight">
            Privacy <span className="text-blue-600">Policy</span>
          </h1>

          <p className="text-slate-600 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
            Last updated: August 14, 2026 • NexxSkill Technical Academy
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 space-y-8">
        <div className="space-y-6 text-sm text-slate-700 leading-relaxed bg-slate-50 border border-slate-200 p-8 rounded-3xl">
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900">1. Information We Collect</h2>
            <p>
              NexxSkill ("we", "our", or "us") collects personal information when you register for an account, enroll in our Mainframe or technical courses, submit lead inquiry forms, or contact support. This information may include your full name, email address, phone number, and payment details processed securely through Razorpay.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900">2. How We Use Your Information</h2>
            <p>We use your personal data to:</p>
            <ul className="list-disc pl-5 space-y-1 text-slate-600">
              <li>Deliver interactive live sessions, course access, and technical learning materials.</li>
              <li>Process payment transactions and issue digital enrollment receipts.</li>
              <li>Provide 1-on-1 career counseling, mock interview prep, and placement assistance.</li>
              <li>Send critical course updates, webinar invitations, and administrative notifications.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900">3. Data Security & Storage</h2>
            <p>
              We implement industry-standard encryption protocols (SSL/TLS) for data transmission. Passwords are hashed using BCrypt, and sensitive financial data (such as card numbers or UPI IDs) is handled directly by Razorpay and never stored on our servers.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900">4. Third-Party Services</h2>
            <p>
              We do not sell or rent your personal data to third parties. We may share necessary data only with trusted infrastructure providers (such as Razorpay for payments and transactional email services) bound by confidentiality obligations.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900">5. Contact Us</h2>
            <p>
              If you have questions regarding this Privacy Policy or wish to request data correction, please email us at <a href="mailto:nexxskill39@gmail.com" className="text-blue-600 font-bold hover:underline">nexxskill39@gmail.com</a> or call <a href="tel:+916002860802" className="text-blue-600 font-bold hover:underline">+91 6002860802</a>.
            </p>
          </section>
        </div>

      </div>
    </div>
  );
};

export const TermsOfService = () => {
  return (
    <div className="bg-white text-slate-900 min-h-screen font-sans pb-20">
      
      {/* Page Hero Section matching Home Page structure */}
      <section className="bg-white py-14 md:py-18 border-b border-slate-100 relative overflow-hidden">
        <div className="absolute top-10 left-10 w-96 h-96 bg-blue-400/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-400/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
            <span>Terms of Agreement</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 font-space tracking-tight">
            Terms of <span className="text-blue-600">Service</span>
          </h1>

          <p className="text-slate-600 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
            Last updated: August 14, 2026 • NexxSkill Technical Academy
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 space-y-8">
        <div className="space-y-6 text-sm text-slate-700 leading-relaxed bg-slate-50 border border-slate-200 p-8 rounded-3xl">
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900">1. Agreement to Terms</h2>
            <p>
              By accessing or enrolling in courses on NexxSkill, you agree to comply with and be bound by these Terms of Service. If you disagree with any part of these terms, you may not access our services or course material.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900">2. Intellectual Property Rights</h2>
            <p>
              All course content, video lectures, source code scripts, COBOL/JCL assignments, and digital materials provided by NexxSkill are the exclusive intellectual property of NexxSkill and Jahangir Alom Bakul. Unauthorized distribution, copying, or reselling of course materials is strictly prohibited.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900">3. Student Conduct & Account Usage</h2>
            <p>
              Student accounts are strictly for individual use. Account credentials (email and password) may not be shared. We reserve the right to suspend or terminate accounts found violating usage integrity or attempting unauthorized system access.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900">4. Modifications & Updates</h2>
            <p>
              We reserve the right to update course schedules, curriculum materials, or pricing at any time. Active enrolled students retain access to their enrolled courses without additional fee changes.
            </p>
          </section>
        </div>

      </div>
    </div>
  );
};

export const RefundPolicy = () => {
  return (
    <div className="bg-white text-slate-900 min-h-screen font-sans pb-20">
      
      {/* Page Hero Section matching Home Page structure */}
      <section className="bg-white py-14 md:py-18 border-b border-slate-100 relative overflow-hidden">
        <div className="absolute top-10 left-10 w-96 h-96 bg-blue-400/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-400/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
            <span>Billing & Refunds</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 font-space tracking-tight">
            Cancellation & <span className="text-blue-600">Refund Policy</span>
          </h1>

          <p className="text-slate-600 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
            Last updated: August 14, 2026 • NexxSkill Technical Academy
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 space-y-8">
        <div className="space-y-6 text-sm text-slate-700 leading-relaxed bg-slate-50 border border-slate-200 p-8 rounded-3xl">
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900">1. 7-Day Money-Back Guarantee</h2>
            <p>
              We offer a 7-day hassle-free refund policy for all standard course enrollments. If you are unsatisfied with the training or curriculum quality within 7 days of enrollment, you are eligible for a full refund.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900">2. Refund Request Process</h2>
            <p>
              To request a refund, please send an email to <a href="mailto:nexxskill39@gmail.com" className="text-blue-600 font-bold hover:underline">nexxskill39@gmail.com</a> with your Order ID, Razorpay Payment ID, and registered email address. Approved refunds will be credited back to your original payment method via Razorpay within 5–7 business days.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900">3. Non-Refundable Items</h2>
            <p>
              Refunds will not be issued if requested after the 7-day guarantee window has expired, or if more than 50% of the course modules have already been completed or downloaded.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900">4. Contact Support</h2>
            <p>
              For billing inquiries or refund assistance, contact us via email at <a href="mailto:nexxskill39@gmail.com" className="text-blue-600 font-bold hover:underline">nexxskill39@gmail.com</a> or call our support line at <a href="tel:+916002860802" className="text-blue-600 font-bold hover:underline">+91 6002860802</a>.
            </p>
          </section>
        </div>

      </div>
    </div>
  );
};
