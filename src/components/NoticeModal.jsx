import React from 'react';
import { AlertCircle } from 'lucide-react';

export const NoticeModal = ({ modal, onClose }) => {
  if (!modal) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#0d172e] border border-slate-200/90 dark:border-[#1a2d52] w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-7 text-center space-y-4 animate-in fade-in zoom-in-95 duration-200">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mx-auto shadow-md ${
          modal.type === 'success'
            ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
            : modal.type === 'error'
            ? 'bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800'
            : 'bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-[#2daee8] border border-blue-200 dark:border-blue-800'
        }`}>
          <AlertCircle className="w-6 h-6" />
        </div>

        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white font-space">{modal.title}</h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">{modal.message}</p>
        </div>

        <button
          onClick={() => {
            if (modal.onClose) modal.onClose();
            onClose();
          }}
          className="w-full bg-brand-gradient hover:opacity-95 text-white font-bold py-3 px-4 rounded-xl text-xs transition-all shadow-brand-glow cursor-pointer mt-2"
        >
          {modal.buttonText || (modal.type === 'success' ? 'Go to My Profile' : 'Understand & Continue')}
        </button>
      </div>
    </div>
  );
};

