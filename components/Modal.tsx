
import React, { useEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);

    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4" 
      onClick={onClose}
      style={{ animation: 'fadeIn 0.3s ease-out' }}
    >
      <div 
        className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-auto animate-fade-in-up" 
        onClick={e => e.stopPropagation()}
        style={{ opacity: 0, animationDelay: '0.1s' }}
      >
        <div className="flex justify-between items-center border-b border-slate-200 p-4">
          <h3 className="text-xl font-bold text-slate-800">{title}</h3>
          <button 
            onClick={onClose} 
            className="text-slate-400 hover:text-slate-800 transition-colors rounded-full w-8 h-8 flex items-center justify-center bg-slate-100 hover:bg-slate-200"
            aria-label="Close modal"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-6">
            {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
