import React from 'react';
import { AlertCircle } from 'lucide-react';

export const NoticeModal = ({ modal, onClose }) => {
  if (!modal) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden p-6 text-center space-y-4 animate-in fade-in zoom-in-95 duration-200">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto ${
          modal.type === 'success'
            ? 'bg-emerald-100 text-emerald-600'
            : modal.type === 'error'
            ? 'bg-red-100 text-red-600'
            : 'bg-blue-100 text-blue-600'
        }`}>
          <AlertCircle className="w-6 h-6" />
        </div>

        <div>
          <h3 className="text-lg font-bold text-slate-900 font-space">{modal.title}</h3>
          <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">{modal.message}</p>
        </div>

        <button
          onClick={() => {
            if (modal.onClose) modal.onClose();
            onClose();
          }}
          className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-colors shadow-sm cursor-pointer"
        >
          {modal.buttonText || (modal.type === 'success' ? 'Go to My Profile' : 'Understand & Continue')}
        </button>
      </div>
    </div>
  );
};
