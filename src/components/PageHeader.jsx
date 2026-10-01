import React from 'react';

export const PageHeader = ({ badgeText, titlePrefix, highlightTitle, titleSuffix = '', description }) => {
  return (
    <section className="pt-10 pb-8 flex items-center relative overflow-hidden">
      {/* Subtle ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-36 bg-gradient-to-r from-[#1153aa]/10 to-[#2daee8]/10 blur-3xl rounded-full pointer-events-none -z-10"></div>
      
      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-20 text-center space-y-3 w-full">
        {badgeText && (
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 dark:bg-[#0d172e] border border-blue-200/80 dark:border-[#1a2d52] text-[#1153aa] dark:text-[#2daee8] text-xs font-bold tracking-wide shadow-xs">
            <span className="w-2 h-2 rounded-full bg-[#2daee8] animate-pulse"></span>
            <span>{badgeText}</span>
          </div>
        )}

        <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white font-space tracking-tight leading-tight">
          {titlePrefix}{' '}
          <span className="bg-gradient-to-r from-[#1153aa] to-[#2daee8] dark:from-[#2daee8] dark:to-[#60a5fa] bg-clip-text text-transparent">
            {highlightTitle}
          </span>
          {titleSuffix && ` ${titleSuffix}`}
        </h1>

        {description && (
          <p className="text-slate-600 dark:text-slate-400 text-xs md:text-sm max-w-2xl mx-auto leading-relaxed">
            {description}
          </p>
        )}
      </div>
    </section>
  );
};
