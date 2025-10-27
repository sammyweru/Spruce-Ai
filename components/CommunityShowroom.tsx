
import React, { useState } from 'react';
import { ShowroomItem, DesignChallenge } from '../types';
import { HeartIcon, SparklesIcon, TrophyIcon } from './icons';
import Modal from './Modal';
import ImageComparator from './ImageComparator';
import MessageRenderer from './MessageRenderer';

interface CommunityShowroomProps {
  items: ShowroomItem[];
  challenges: DesignChallenge[];
  onLike: (item: ShowroomItem) => void;
}

const CommunityShowroom: React.FC<CommunityShowroomProps> = ({ items, challenges, onLike }) => {
  const [selectedItem, setSelectedItem] = useState<ShowroomItem | null>(null);
  const [activeTab, setActiveTab] = useState<'inspiration' | 'challenges'>('inspiration');

  const renderInspiration = () => (
    items.length === 0 ? (
      <div className="text-center py-20 bg-slate-100 rounded-lg">
        <SparklesIcon className="mx-auto h-16 w-16 text-slate-400" />
        <p className="mt-4 text-xl text-slate-500">The showroom is empty.</p>
      </div>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {items.map(item => (
          <div key={item.id} className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-lg transform hover:-translate-y-1 transition-transform duration-300 group">
            <button onClick={() => setSelectedItem(item)} className="w-full text-left">
              <div className="relative">
                  <img src={`data:${item.generatedImage.mimeType};base64,${item.generatedImage.base64}`} alt={item.style} className="w-full h-64 object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                      <p className="text-white font-bold">View Before & After</p>
                  </div>
              </div>
              <div className="p-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-lg text-slate-800 truncate">{item.style}</h3>
                  <div className="flex items-center gap-1 text-slate-500">
                      <HeartIcon className="w-5 h-5" />
                      <span className="text-sm font-medium">{item.likes}</span>
                  </div>
                </div>
                <p className="text-sm text-slate-400">by {item.author}</p>
              </div>
            </button>
          </div>
        ))}
      </div>
    )
  );
  
  const renderChallenges = () => (
    <div className="space-y-12">
        {challenges.map(challenge => (
            <div key={challenge.id} className="bg-white p-6 rounded-lg border border-slate-200 shadow-lg">
                <div className="flex flex-col md:flex-row gap-8">
                    <div className="md:w-1/3">
                        <img src={`data:${challenge.promptImage.mimeType};base64,${challenge.promptImage.base64}`} alt="Challenge prompt" className="rounded-lg w-full" />
                    </div>
                    <div className="md:w-2/3">
                        <h3 className="text-2xl font-bold text-slate-800">{challenge.title}</h3>
                        <p className="mt-2 text-slate-600">{challenge.description}</p>
                        <button className="mt-4 px-4 py-2 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-500 transition-colors">Enter Challenge</button>
                    </div>
                </div>
                <div className="mt-8 border-t border-slate-200 pt-6">
                    <h4 className="text-lg font-bold text-slate-700 mb-4">Top Submissions:</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {challenge.submissions.sort((a,b) => b.votes - a.votes).map(sub => (
                             <div key={sub.id} className="border border-slate-200 rounded-lg overflow-hidden group">
                                <img src={`data:${sub.generatedImage.mimeType};base64,${sub.generatedImage.base64}`} alt={`Submission by ${sub.author}`} className="w-full h-48 object-cover" />
                                <div className="p-3 flex justify-between items-center">
                                    <p className="text-sm text-slate-500">by <span className="font-semibold">{sub.author}</span></p>
                                    <button className="flex items-center gap-2 px-3 py-1 bg-white border border-slate-200 text-slate-600 rounded-full hover:bg-slate-100 transition-colors">
                                        <HeartIcon className="w-4 h-4" />
                                        <span className="text-xs font-bold">{sub.votes}</span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        ))}
    </div>
  );

  return (
    <div className="animate-fade-in-up">
      <header className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-800">Community Hub</h2>
        <p className="mt-1 text-md text-slate-500">Get inspired and show off your creativity.</p>
        <div className="mt-6 flex justify-center border-b border-slate-200">
            <button onClick={() => setActiveTab('inspiration')} className={`px-6 py-3 text-sm font-semibold ${activeTab === 'inspiration' ? 'border-b-2 border-teal-600 text-teal-600' : 'text-slate-500'}`}>Inspiration</button>
            <button onClick={() => setActiveTab('challenges')} className={`px-6 py-3 text-sm font-semibold ${activeTab === 'challenges' ? 'border-b-2 border-teal-600 text-teal-600' : 'text-slate-500'}`}>Challenges</button>
        </div>
      </header>

      {activeTab === 'inspiration' ? renderInspiration() : renderChallenges()}

      {selectedItem && (
        <Modal isOpen={!!selectedItem} onClose={() => setSelectedItem(null)} title={selectedItem.style}>
            <div className="space-y-4">
                <ImageComparator
                    originalImage={`data:${selectedItem.originalImage.mimeType};base64,${selectedItem.originalImage.base64}`}
                    generatedImage={`data:${selectedItem.generatedImage.mimeType};base64,${selectedItem.generatedImage.base64}`}
                    activeFilter="none"
                    isSelectable={false}
                />
                <button onClick={() => onLike(selectedItem)} className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-full hover:bg-red-200 transition-colors">
                    <HeartIcon className="w-5 h-5"/>
                    <span className="font-semibold">{selectedItem.likes} Likes</span>
                </button>
            </div>
        </Modal>
      )}
    </div>
  );
};

export default CommunityShowroom;
