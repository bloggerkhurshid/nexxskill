import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageHeader } from '../components/PageHeader';
import { SEO } from '../components/SEO';

export const About = () => {
  return (
    <div className="bg-slate-50 dark:bg-[#080e1a] text-slate-900 dark:text-slate-100 font-sans pb-20 transition-colors duration-300">
      <SEO
        title="About NexxSkill Academy | Enterprise Mainframe & Software"
        description="Learn about NexxSkill Academy, our mission, hands-on Mainframe, COBOL, DB2, and System z enterprise software engineering mentorship."
        canonical="/about"
        keywords="About NexxSkill, Mainframe Academy, Enterprise Tech Mentorship, Banking IT Training, COBOL, System z"
      />
      
      {/* Page Hero Section */}
      <PageHeader
        badgeText="Enterprise Engineering Academy"
        titlePrefix="About"
        highlightTitle="NexxSkill Academy"
        description="Hands-on Mainframe, COBOL, and System z mentorship designed to bridge traditional CS and enterprise banking software."
      />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-16">

        {/* Why NexxSkill Grid Cards */}
        <div className="space-y-6">
          <div className="text-center space-y-1">
            <span className="text-xs font-extrabold text-[#2daee8] uppercase tracking-wider font-space">The Academy Difference</span>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white font-space">
              Why Learn With NexxSkill?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-[#0d172e] border border-slate-200/90 dark:border-[#1a2d52] rounded-2xl p-6 space-y-3 shadow-xs hover:border-[#2daee8] dark:hover:border-[#2daee8] transition-colors">
              <div className="w-10 h-10 rounded-xl bg-[#1153aa]/10 dark:bg-[#2daee8]/20 text-[#2daee8] flex items-center justify-center font-bold font-space text-lg">
                01
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white font-space">Production-Ready Labs</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Work directly on live IBM System z mainframe emulators, executing real COBOL programs and JCL dataset jobs.
              </p>
            </div>

            <div className="bg-white dark:bg-[#0d172e] border border-slate-200/90 dark:border-[#1a2d52] rounded-2xl p-6 space-y-3 shadow-xs hover:border-[#2daee8] dark:hover:border-[#2daee8] transition-colors">
              <div className="w-10 h-10 rounded-xl bg-[#1153aa]/10 dark:bg-[#2daee8]/20 text-[#2daee8] flex items-center justify-center font-bold font-space text-lg">
                02
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white font-space">Enterprise Banking Stack</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Master VSAM indexing, DB2 relational SQL queries, CICS online transactions, and batch error recovery.
              </p>
            </div>

            <div className="bg-white dark:bg-[#0d172e] border border-slate-200/90 dark:border-[#1a2d52] rounded-2xl p-6 space-y-3 shadow-xs hover:border-[#2daee8] dark:hover:border-[#2daee8] transition-colors">
              <div className="w-10 h-10 rounded-xl bg-[#1153aa]/10 dark:bg-[#2daee8]/20 text-[#2daee8] flex items-center justify-center font-bold font-space text-lg">
                03
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white font-space">1-on-1 Career Mentorship</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Receive ATS resume re-engineering, technical mock interviews, and direct referral opportunities to enterprise partners.
              </p>
            </div>
          </div>
        </div>

        {/* Tech Stack Pills */}
        <div className="bg-white dark:bg-[#0d172e] border border-slate-200/80 dark:border-[#1a2d52] rounded-3xl p-8 space-y-6 text-center">
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white font-space">Mastered Technologies</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Core languages and tools covered across our training modules</p>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            {['COBOL', 'JCL', 'DB2', 'VSAM', 'CICS', 'IMSDB', 'REXX', 'ASSEMBLER'].map((tech, i) => (
              <span key={i} className="bg-slate-50 dark:bg-[#101f3c] border border-slate-200 dark:border-[#1a2d52] text-slate-900 dark:text-white text-xs font-extrabold px-4 py-2.5 rounded-xl shadow-xs font-mono">
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Action Banner */}
        <div className="bg-brand-gradient text-white rounded-3xl p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-brand-glow">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="text-2xl font-bold font-space">Start Your Mainframe Journey Today</h3>
            <p className="text-xs text-blue-100">Explore our available live cohorts or book a technical webinar session.</p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Link
              to="/courses"
              className="bg-white text-[#1153aa] hover:bg-slate-100 font-bold px-6 py-3 rounded-xl text-xs transition-all shadow-md flex items-center gap-2 cursor-pointer"
            >
              <span>View Courses</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};
