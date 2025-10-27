
import React from 'react';
import { SpruceIcon, SunIcon, HeartStethoscopeIcon, PaintBrushIcon } from './icons';

type DesignMode = 'interior' | 'exterior' | 'doctor' | 'upcycle';

interface DesignModeToggleProps {
  selectedMode: DesignMode;
  onModeChange: (mode: DesignMode) => void;
}

const modes = [
    { id: 'interior', label: 'Interior', icon: SpruceIcon },
    { id: 'exterior', label: 'Exterior', icon: SunIcon },
    { id: 'doctor', label: 'Home Doctor', icon: HeartStethoscopeIcon },
    { id: 'upcycle', label: 'Upcycle', icon: PaintBrushIcon },
];

const DesignModeToggle: React.FC<DesignModeToggleProps> = ({ selectedMode, onModeChange }) => {
  return (
    <div className="flex flex-wrap justify-center gap-2 p-2 bg-slate-200 rounded-full">
      {modes.map(mode => (
         <button
            key={mode.id}
            onClick={() => onModeChange(mode.id as DesignMode)}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
            selectedMode === mode.id 
                ? 'bg-white text-teal-700 shadow-md' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
        >
            <mode.icon className="w-5 h-5" />
            <span>{mode.label}</span>
        </button>
      ))}
    </div>
  );
};

export default DesignModeToggle;
