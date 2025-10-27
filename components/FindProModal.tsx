
import React, { useState } from 'react';
import Modal from './Modal';
import { SendIcon, FolderIcon } from './icons';

interface FindProModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (proName: string) => void;
}

const FindProModal: React.FC<FindProModalProps> = ({ isOpen, onClose, onConfirm }) => {
  const [submitted, setSubmitted] = useState(false);
  const [proName, setProName] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const name = formData.get('name') as string;
    // In a real app, we'd find a pro. Here we'll just use their name for the example.
    setProName(name || "Local Pro"); 
    setSubmitted(true);
  };
  
  const handleClose = () => {
    onClose();
    setTimeout(() => setSubmitted(false), 300);
  }
  
  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Find a Fundi in Nairobi">
        {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
                <p className="text-sm text-slate-600">
                    Ready to make your design a reality? We'll connect you with a vetted, local professional (fundi) for your project.
                </p>
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-slate-700">What should we call the Pro?</label>
                    <input type="text" id="name" name="name" required placeholder="e.g., Jane the Designer" className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm" />
                </div>
                 <div>
                    <label htmlFor="estate" className="block text-sm font-medium text-slate-700">Your Nairobi Estate / Area</label>
                    <input type="text" id="estate" required placeholder="e.g., Kilimani, Westlands, etc." className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm" />
                </div>
                <div className="pt-2 text-right">
                    <button type="submit" className="inline-flex items-center gap-2 justify-center px-6 py-2 border border-transparent text-sm font-semibold rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500">
                        <SendIcon className="w-4 h-4"/>
                        <span>Find a Pro</span>
                    </button>
                </div>
            </form>
        ) : (
            <div className="text-center py-8">
                <div className="mx-auto w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h3 className="mt-4 text-lg font-medium text-slate-900">We've found a match!</h3>
                <p className="mt-1 text-sm text-slate-500">
                    Ready to start collaborating with {proName}? Create a project hub to manage everything in one place.
                </p>
                <button 
                    onClick={() => onConfirm(proName)} 
                    className="mt-6 inline-flex items-center gap-2 justify-center px-6 py-2 border border-transparent text-sm font-semibold rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                >
                    <FolderIcon className="w-5 h-5"/>
                    <span>Start Project Hub</span>
                </button>
            </div>
        )}
    </Modal>
  );
};

export default FindProModal;
