import React from 'react';

export const PageHeader = ({ badgeText, titlePrefix, highlightTitle, titleSuffix = '', description }) => {
  return (
    <section className="py-10 flex items-center">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-20 text-center space-y-2 w-full">
        {badgeText && (
          <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
            <span>{badgeText}</span>
          </div>
        )}

        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 font-space tracking-tight">
          {titlePrefix}{' '}
          <span className="text-blue-600">{highlightTitle}</span>
          {titleSuffix && ` ${titleSuffix}`}
        </h1>

        {description && (
          <p className="text-slate-600 text-xs md:text-sm max-w-xl mx-auto leading-relaxed">
            {description}
          </p>
        )}
      </div>
    </section>
  );
};
