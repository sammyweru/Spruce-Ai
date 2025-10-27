
import React from 'react';
import { UserIcon, BriefcaseIcon } from './icons';

type AppMode = 'personal' | 'pro';

interface AppModeToggleProps {
  selectedMode: AppMode;
  onModeChange: (mode: AppMode) => void;
}

const AppModeToggle: React.FC<AppModeToggleProps> = ({ selectedMode, onModeChange }) => {
  return (
    <div className="relative flex w-full max-w-xs p-1 bg-slate-200 rounded-full">
      <div
        className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-full shadow-md transition-transform duration-300 ease-in-out`}
        style={{ transform: selectedMode === 'personal' ? 'translateX(4px)' : 'translateX(calc(100% + 4px))' }}
      />
      <button
        onClick={() => onModeChange('personal')}
        className={`relative z-10 w-1/2 flex items-center justify-center gap-2 py-2 rounded-full text-sm font-semibold transition-colors duration-300 ${
          selectedMode === 'personal' ? 'text-teal-700' : 'text-slate-500 hover:text-slate-800'
        }`}
      >
        <UserIcon className="w-5 h-5" />
        <span>Personal</span>
      </button>
      <button
        onClick={() => onModeChange('pro')}
        className={`relative z-10 w-1/2 flex items-center justify-center gap-2 py-2 rounded-full text-sm font-semibold transition-colors duration-300 ${
          selectedMode === 'pro' ? 'text-teal-700' : 'text-slate-500 hover:text-slate-800'
        }`}
      >
        <BriefcaseIcon className="w-5 h-5" />
        <span>Pro</span>
      </button>
    </div>
  );
};

export default AppModeToggle;
