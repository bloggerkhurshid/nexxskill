import React from 'react';
import { ArrowRight, CheckCircle2, Building2, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageHeader } from '../components/PageHeader';

export const About = () => {
  return (
    <div className="bg-white text-slate-900 font-sans pb-20">
      
      {/* Page Hero Section */}
      <PageHeader
        badgeText="Enterprise Engineering Academy"
        titlePrefix="About"
        highlightTitle="NexxSkill Academy"
        description="Hands-on Mainframe, COBOL, and System z mentorship designed to bridge traditional CS and enterprise banking software."
      />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-16">
        
        {/* Founder & Instructor Spotlight Card */}
        <div className="bg-slate-900 text-white rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
          <div className="absolute -right-16 -top-16 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
            
            {/* Photo Box */}
            <div className="lg:col-span-5">
              <div className="aspect-square w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl relative group">
                <img
                  src="/assets/jahangir.jpg"
                  alt="Jahangir Alom Bakul"
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute bottom-3 left-3 bg-slate-950/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-slate-800 text-white text-[11px] font-semibold flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>Founder & Lead Mentor</span>
                </div>
              </div>
            </div>

            {/* Bio Info */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <span className="text-xs font-bold text-blue-400 uppercase tracking-widest font-space">Instructor Profile</span>
                <h2 className="text-3xl md:text-4xl font-extrabold text-white font-space mt-1">
                  Jahangir Alom Bakul
                </h2>
                <p className="text-sm font-semibold text-slate-400 mt-1">
                  Ex-Societe Generale & IBM System z Mainframe Specialist
                </p>
              </div>

              <p className="text-slate-300 text-sm leading-relaxed">
                With over a decade of hands-on corporate engineering experience at global financial institutions, Jahangir Bakul has trained and mentored over 600 software engineers in high-throughput COBOL batch processing, JCL automation, DB2 databases, and IBM System z architecture.
              </p>

              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-800 text-center">
                <div className="space-y-1">
                  <h4 className="text-2xl font-extrabold text-blue-400 font-space">10+ Yrs</h4>
                  <p className="text-[11px] text-slate-400 font-medium">Enterprise Exp</p>
                </div>
                <div className="space-y-1 border-l border-slate-800">
                  <h4 className="text-2xl font-extrabold text-emerald-400 font-space">600+</h4>
                  <p className="text-[11px] text-slate-400 font-medium">Engineers Mentored</p>
                </div>
                <div className="space-y-1 border-l border-slate-800">
                  <h4 className="text-2xl font-extrabold text-purple-400 font-space">IBM & SG</h4>
                  <p className="text-[11px] text-slate-400 font-medium">Corporate Background</p>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Why NexxSkill Grid Cards */}
        <div className="space-y-6">
          <div className="text-center space-y-1">
            <span className="text-xs font-extrabold text-blue-600 uppercase tracking-wider font-space">The Academy Difference</span>
            <h2 className="text-3xl font-extrabold text-slate-900 font-space">
              Why Learn With NexxSkill?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border border-slate-200/90 rounded-2xl p-6 space-y-3 shadow-xs hover:border-blue-300 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold font-space text-lg">
                01
              </div>
              <h3 className="text-lg font-bold text-slate-900 font-space">Production-Ready Labs</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Work directly on live IBM System z mainframe emulators, executing real COBOL programs and JCL dataset jobs.
              </p>
            </div>

            <div className="bg-white border border-slate-200/90 rounded-2xl p-6 space-y-3 shadow-xs hover:border-blue-300 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold font-space text-lg">
                02
              </div>
              <h3 className="text-lg font-bold text-slate-900 font-space">Enterprise Banking Stack</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Master VSAM indexing, DB2 relational SQL queries, CICS online transactions, and batch error recovery.
              </p>
            </div>

            <div className="bg-white border border-slate-200/90 rounded-2xl p-6 space-y-3 shadow-xs hover:border-blue-300 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold font-space text-lg">
                03
              </div>
              <h3 className="text-lg font-bold text-slate-900 font-space">1-on-1 Career Mentorship</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Receive ATS resume re-engineering, technical mock interviews, and direct referral opportunities to enterprise partners.
              </p>
            </div>
          </div>
        </div>

        {/* Minimal Tech Stack Pills */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-3xl p-8 space-y-6 text-center">
          <div>
            <h3 className="text-xl font-bold text-slate-900 font-space">Mastered Technologies</h3>
            <p className="text-xs text-slate-500 mt-1">Core languages and tools covered across our training modules</p>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            {['COBOL', 'JCL', 'DB2', 'VSAM', 'CICS', 'IMSDB', 'REXX', 'ASSEMBLER'].map((tech, i) => (
              <span key={i} className="bg-white border border-slate-200 text-slate-900 text-xs font-extrabold px-4 py-2.5 rounded-xl shadow-xs font-mono">
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Action Banner */}
        <div className="bg-blue-600 text-white rounded-3xl p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="text-2xl font-bold font-space">Start Your Mainframe Journey Today</h3>
            <p className="text-xs text-blue-100">Explore our available live cohorts or book a technical webinar session.</p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Link
              to="/courses"
              className="bg-white text-blue-600 hover:bg-slate-100 font-bold px-6 py-3 rounded-xl text-xs transition-all shadow-md flex items-center gap-2 cursor-pointer"
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
