
import React, { useState, useEffect } from 'react';
import { HomeProfile } from '../types';
import { generateConciergeTip } from '../services/geminiService';
import { BellIcon } from './icons';

interface ConciergeInboxProps {
  profile: HomeProfile;
}

const ConciergeInbox: React.FC<ConciergeInboxProps> = ({ profile }) => {
  const [tip, setTip] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTip = async () => {
      setIsLoading(true);
      try {
        const generatedTip = await generateConciergeTip(profile);
        setTip(generatedTip);
      } catch (e) {
        console.error("Failed to fetch concierge tip", e);
        setTip("Could not fetch a tip right now. Please check back later!");
      } finally {
        setIsLoading(false);
      }
    };
    fetchTip();
  }, [profile]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-slate-200">
      <h3 className="flex items-center gap-3 text-xl font-bold text-slate-800">
        <BellIcon className="w-6 h-6 text-teal-600" />
        <span>Your Concierge Inbox</span>
      </h3>
      <div className="mt-4 p-4 bg-slate-50 rounded-md border border-slate-200/80 min-h-[80px] flex items-center">
        {isLoading ? (
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-teal-300 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-teal-300 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
            <div className="w-2 h-2 bg-teal-300 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
          </div>
        ) : (
          <p className="text-slate-700">{tip}</p>
        )}
      </div>
    </div>
  );
};

export default ConciergeInbox;
