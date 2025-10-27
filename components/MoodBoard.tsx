
import React from 'react';
import { MoodBoardCollection } from '../types';
import { SparklesIcon, ArrowLeftIcon } from './icons';

interface MoodBoardProps {
  collections: MoodBoardCollection[];
  onClear: () => void;
  onBack?: () => void;
}

const MoodBoard: React.FC<MoodBoardProps> = ({ collections, onClear, onBack }) => {
  return (
    <div style={{animation: 'fadeIn 0.5s ease-in-out'}}>
      <header className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <div className="flex items-center gap-4">
            {onBack && (
                <button onClick={onBack} className="p-2 rounded-full bg-white hover:bg-slate-100 transition-colors">
                    <ArrowLeftIcon className="w-6 h-6 text-slate-600" />
                </button>
            )}
            <div className="text-center sm:text-left">
                <h2 className="text-3xl font-bold text-slate-800">
                    Inspiration Mood Board
                </h2>
                <p className="mt-1 text-md text-slate-500">Your collected design ideas</p>
            </div>
        </div>
        <div className="flex gap-4">
            <button
                onClick={onClear}
                disabled={collections.length === 0}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500 transition-colors disabled:bg-slate-400 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-semibold"
            >
                Clear Board
            </button>
        </div>
      </header>
      
      {collections.length === 0 ? (
        <div className="text-center py-20 bg-slate-100 rounded-lg">
            <SparklesIcon className="mx-auto h-16 w-16 text-slate-400" />
            <p className="mt-4 text-xl text-slate-500">Your mood board is empty.</p>
            <p className="text-slate-400">Pin some generated designs to get started!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {collections.map(collection => (
            <div key={collection.id} className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-lg transform hover:-translate-y-1 transition-transform duration-300">
              <img 
                src={`data:${collection.image.mimeType};base64,${collection.image.base64}`} 
                alt={collection.style}
                className="w-full h-64 object-cover" 
              />
              <div className="p-4">
                <h3 className="font-bold text-lg text-slate-800">{collection.style}</h3>
                <div className="mt-3 flex gap-2">
                  {collection.palette.map((color, index) => (
                    <div 
                      key={index} 
                      className="w-8 h-8 rounded-full border-2 border-white shadow-md"
                      style={{ backgroundColor: color }}
                      title={color}
                    ></div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MoodBoard;
