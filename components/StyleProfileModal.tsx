import React from 'react';
import { StyleProfile } from '../types';
import Modal from './Modal';
import { SparklesIcon } from './icons';

interface StyleProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: StyleProfile;
}

const StyleProfileModal: React.FC<StyleProfileModalProps> = ({ isOpen, onClose, profile }) => {
  const sortedProfile = Object.entries(profile).sort(([, a], [, b]) => (b as number) - (a as number));

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="My Personal Style Profile">
      <div className="text-center">
        <p className="text-slate-600 mb-4">
          Based on the designs you've liked and saved, we're learning your unique taste!
        </p>
        
        {sortedProfile.length === 0 ? (
          <div className="py-8 text-center bg-slate-50 rounded-lg">
            <SparklesIcon className="w-12 h-12 text-slate-400 mx-auto" />
            <p className="mt-2 text-slate-500">Start liking and saving designs to build your profile.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {sortedProfile.map(([style, count]) => (
              <div key={style} className="p-3 bg-teal-50 border border-teal-100 rounded-lg text-left">
                <span className="font-bold text-teal-800">{style}</span>
                <div className="w-full bg-teal-100 rounded-full h-2.5 mt-1">
                  <div 
                    className="bg-teal-500 h-2.5 rounded-full" 
                    style={{ width: `${Math.min(100, ((count as number) / Math.max(...(Object.values(profile) as number[]))) * 100)}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        )}

        <p className="text-xs text-slate-400 mt-6">
          Your profile helps our AI make better suggestions for you over time.
        </p>
      </div>
    </Modal>
  );
};

export default StyleProfileModal;