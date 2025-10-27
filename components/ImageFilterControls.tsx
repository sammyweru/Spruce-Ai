import React from 'react';

export const FILTERS = {
  'none': 'None',
  'black-and-white': 'B&W',
  'sepia': 'Sepia',
  'vintage': 'Vintage',
  'cool': 'Cool',
  'warm': 'Warm',
};

interface ImageFilterControlsProps {
  onSelectFilter: (filter: string) => void;
  activeFilter: string;
}

const ImageFilterControls: React.FC<ImageFilterControlsProps> = ({ onSelectFilter, activeFilter }) => {
  return (
    <div className="flex justify-center items-center gap-2 flex-wrap -mt-4">
      <p className="text-sm font-semibold text-slate-600 mr-2">Filters:</p>
      {Object.entries(FILTERS).map(([key, name]) => (
        <button
          key={key}
          onClick={() => onSelectFilter(key)}
          className={`
            px-4 py-1.5 text-xs font-medium rounded-full transition-all duration-200 ease-in-out border
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-50 focus:ring-teal-500
            ${activeFilter === key
              ? 'bg-teal-600 text-white shadow-md scale-105 border-teal-600'
              : 'bg-white text-slate-600 hover:bg-slate-100 border-slate-200'
            }
          `}
        >
          {name}
        </button>
      ))}
    </div>
  );
};

export default ImageFilterControls;
