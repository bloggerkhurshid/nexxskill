import React from 'react';
import { SEO } from '../components/SEO';
import { PageHeader } from '../components/PageHeader';

export const PrivacyPolicy = () => {
  return (
    <div className="bg-slate-50 dark:bg-[#080e1a] text-slate-900 dark:text-slate-100 min-h-screen font-sans pb-20 transition-colors duration-300">
      <SEO
        title="Privacy Policy"
        description="Read NexxSkill's Privacy Policy regarding student data collection, encryption, and protection."
        canonical="/privacy-policy"
      />
      
      {/* Page Hero Section */}
      <PageHeader
        badgeText="Legal Documentation"
        titlePrefix="Privacy"
        highlightTitle="Policy"
        description="Last updated: August 14, 2026 • NexxSkill Technical Academy"
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        <div className="space-y-6 text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-white dark:bg-[#0d172e] border border-slate-200/90 dark:border-[#1a2d52] p-8 sm:p-10 rounded-3xl shadow-xs transition-colors">
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white font-space">1. Information We Collect</h2>
            <p>
              NexxSkill ("we", "our", or "us") collects personal information when you register for an account, enroll in our Mainframe or technical courses, submit lead inquiry forms, or contact support. This information may include your full name, email address, phone number, and payment details processed securely through Cashfree Payments.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white font-space">2. How We Use Your Information</h2>
            <p>We use your personal data to:</p>
            <ul className="list-disc pl-5 space-y-1 text-slate-600 dark:text-slate-400">
              <li>Deliver interactive live sessions, course access, and technical learning materials.</li>
              <li>Process payment transactions and issue digital enrollment receipts.</li>
              <li>Provide 1-on-1 career counseling, mock interview prep, and placement assistance.</li>
              <li>Send critical course updates, webinar invitations, and administrative notifications.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white font-space">3. Data Security & Storage</h2>
            <p>
              We implement industry-standard encryption protocols (SSL/TLS) for data transmission. Passwords are hashed using BCrypt, and sensitive financial data (such as card numbers or UPI IDs) is handled directly by Cashfree Payments (PCI-DSS Level 1 certified) and never stored on our servers.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white font-space">4. Third-Party Services</h2>
            <p>
              We do not sell or rent your personal data to third parties. We may share necessary data only with trusted infrastructure providers (such as Cashfree for payments and transactional email services) bound by confidentiality obligations.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white font-space">5. Contact Us</h2>
            <p>
              If you have questions regarding this Privacy Policy or wish to request data correction, please email us at <a href="mailto:support@nexxskill.com" className="text-[#1153aa] dark:text-[#2daee8] font-bold hover:underline">support@nexxskill.com</a> or call <a href="tel:+916002860802" className="text-[#1153aa] dark:text-[#2daee8] font-bold hover:underline">+91 6002860802</a>.
            </p>
          </section>
        </div>

      </div>
    </div>
  );
};

export const TermsOfService = () => {
  return (
    <div className="bg-slate-50 dark:bg-[#080e1a] text-slate-900 dark:text-slate-100 min-h-screen font-sans pb-20 transition-colors duration-300">
      <SEO
        title="Terms of Service"
        description="Review terms, student conduct, intellectual property, and policies for NexxSkill courses and webinars."
        canonical="/terms"
      />
      
      {/* Page Hero Section */}
      <PageHeader
        badgeText="Terms of Agreement"
        titlePrefix="Terms of"
        highlightTitle="Service"
        description="Last updated: August 14, 2026 • NexxSkill Technical Academy"
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        <div className="space-y-6 text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-white dark:bg-[#0d172e] border border-slate-200/90 dark:border-[#1a2d52] p-8 sm:p-10 rounded-3xl shadow-xs transition-colors">
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white font-space">1. Agreement to Terms</h2>
            <p>
              By accessing or enrolling in courses on NexxSkill, you agree to comply with and be bound by these Terms of Service. If you disagree with any part of these terms, you may not access our services or course material.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white font-space">2. Intellectual Property Rights</h2>
            <p>
              All course content, live workshops, source code scripts, COBOL/JCL assignments, and digital materials provided by NexxSkill are the exclusive intellectual property of NexxSkill and Jahangir Alom Bakul. Unauthorized distribution, copying, or reselling of course materials is strictly prohibited.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white font-space">3. Student Conduct & Account Usage</h2>
            <p>
              Student accounts are strictly for individual use. Account credentials (email and password) may not be shared. We reserve the right to suspend or terminate accounts found violating usage integrity or attempting unauthorized system access.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white font-space">4. Modifications & Updates</h2>
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
    <div className="bg-slate-50 dark:bg-[#080e1a] text-slate-900 dark:text-slate-100 min-h-screen font-sans pb-20 transition-colors duration-300">
      <SEO
        title="Refund Policy & Guarantee"
        description="Review our satisfaction guarantee, cancellation terms, and refund policy for NexxSkill courses."
        canonical="/refund-policy"
      />
      
      {/* Page Hero Section */}
      <PageHeader
        badgeText="Billing & Refunds"
        titlePrefix="Cancellation &"
        highlightTitle="Refund Policy"
        description="Last updated: August 14, 2026 • NexxSkill Technical Academy"
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        <div className="space-y-6 text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-white dark:bg-[#0d172e] border border-slate-200/90 dark:border-[#1a2d52] p-8 sm:p-10 rounded-3xl shadow-xs transition-colors">
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white font-space">1. 7-Day Money-Back Guarantee</h2>
            <p>
              We offer a 7-day hassle-free refund policy for all standard course enrollments. If you are unsatisfied with the training or curriculum quality within 7 days of enrollment, you are eligible for a full refund.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white font-space">2. Refund Request Process</h2>
            <p>
              To request a refund, please send an email to <a href="mailto:support@nexxskill.com" className="text-[#1153aa] dark:text-[#2daee8] font-bold hover:underline">support@nexxskill.com</a> with your Order ID, Cashfree Payment Reference ID, and registered email address. Approved refunds will be credited back to your original payment method via Cashfree Payments within 5–7 business days.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white font-space">3. Non-Refundable Items</h2>
            <p>
              Refunds will not be issued if requested after the 7-day guarantee window has expired, or if more than 50% of the course modules have already been completed or downloaded.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white font-space">4. Contact Support</h2>
            <p>
              For billing inquiries or refund assistance, contact us via email at <a href="mailto:support@nexxskill.com" className="text-[#1153aa] dark:text-[#2daee8] font-bold hover:underline">support@nexxskill.com</a> or call our support line at <a href="tel:+916002860802" className="text-[#1153aa] dark:text-[#2daee8] font-bold hover:underline">+91 6002860802</a>.
            </p>
          </section>
        </div>

      </div>
    </div>
  );
};

