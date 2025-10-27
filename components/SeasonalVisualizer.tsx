import React from 'react';
import { ImageFile } from '../types';

type Season = 'Spring' | 'Summer' | 'Fall' | 'Winter';
const SEASONS: Season[] = ['Spring', 'Summer', 'Fall', 'Winter'];

interface SeasonalDesigns {
    Spring?: ImageFile | 'loading';
    Summer?: ImageFile | 'loading';
    Fall?: ImageFile | 'loading';
    Winter?: ImageFile | 'loading';
}

interface SeasonalVisualizerProps {
  designs: SeasonalDesigns;
  activeSeason: Season | null;
  onSelectSeason: (season: Season) => void;
  isGenerating: boolean;
}

const SeasonalVisualizer: React.FC<SeasonalVisualizerProps> = ({ designs, activeSeason, onSelectSeason, isGenerating }) => {
  const getButtonState = (season: Season) => {
    const design = designs[season];
    if (design === 'loading') {
      return {
        text: 'Generating...',
        disabled: true,
        className: 'bg-slate-200 text-slate-500 cursor-wait',
        icon: <svg className="animate-spin h-4 w-4 text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
      };
    }
    if (season === activeSeason) {
      return {
        text: season,
        disabled: isGenerating,
        className: 'bg-teal-600 text-white shadow-md scale-105 border-teal-600',
        icon: null
      };
    }
    return {
      text: season,
      disabled: isGenerating,
      className: 'bg-white text-slate-600 hover:bg-slate-100 border-slate-200 disabled:opacity-50',
      icon: null
    };
  };
  
  return (
    <div className="bg-slate-100/80 p-4 rounded-lg animate-fade-in-up">
      <p className="text-center text-sm font-semibold text-slate-600 mb-3">4-Season Landscaping Visualizer:</p>
      <div className="flex justify-center items-center gap-2 flex-wrap">
        {SEASONS.map(season => {
          const { text, disabled, className, icon } = getButtonState(season);
          const emoji = season === 'Spring' ? '🌸' : season === 'Summer' ? '☀️' : season === 'Fall' ? '🍂' : '❄️';
          return (
            <button
              key={season}
              disabled={disabled}
              onClick={() => onSelectSeason(season)}
              className={`flex items-center gap-2 px-4 py-1.5 text-xs font-medium rounded-full transition-all duration-200 ease-in-out border focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-100 focus:ring-teal-500 ${className}`}
            >
              {icon || <span className="text-sm">{emoji}</span>}
              <span>{text}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SeasonalVisualizer;
