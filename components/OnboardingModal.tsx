
import React, { useState } from 'react';
import { HomeProfile } from '../types';
import Modal from './Modal';
import { SpruceIcon } from './icons';

interface OnboardingModalProps {
  isOpen: boolean;
  onSave: (profile: HomeProfile) => void;
  onClose: () => void;
}

const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onSave, onClose }) => {
  const [profile, setProfile] = useState<HomeProfile>({
    houseType: 'Apartment',
    projectGoal: 'interior',
    budget: 50000,
    painPoints: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(profile);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const isNumber = e.target.type === 'number';
    setProfile(prev => ({ ...prev, [name]: isNumber ? Number(value) : value }));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Welcome to Spruce!">
      <div className="text-center">
        <SpruceIcon className="w-12 h-12 text-teal-600 mx-auto" />
        <p className="mt-2 text-slate-600">To give you the best suggestions, tell us about your home.</p>
      </div>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label htmlFor="houseType" className="block text-sm font-medium text-slate-700">What kind of home do you have?</label>
          <select id="houseType" name="houseType" value={profile.houseType} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm">
            <option>Apartment</option>
            <option>Bungalow</option>
            <option>Maisonette</option>
            <option>Townhouse</option>
            <option>Other</option>
          </select>
        </div>
        <div>
          <label htmlFor="projectGoal" className="block text-sm font-medium text-slate-700">What's your primary goal today?</label>
          <select id="projectGoal" name="projectGoal" value={profile.projectGoal} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm">
            <option value="interior">Redesign a Room (Interior)</option>
            <option value="exterior">Improve Curb Appeal (Exterior)</option>
            <option value="doctor">Fix a Problem (Home Doctor)</option>
            <option value="upcycle">Upcycle Furniture</option>
          </select>
        </div>
        <div>
          <label htmlFor="budget" className="block text-sm font-medium text-slate-700">What's your overall renovation budget?</label>
           <div className="relative mt-1">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <span className="text-gray-500 sm:text-sm">KES</span>
            </div>
            <input type="number" name="budget" id="budget" value={profile.budget} onChange={handleChange} className="block w-full rounded-md border-slate-300 pl-12 pr-4 focus:border-teal-500 focus:ring-teal-500 sm:text-sm" placeholder="50000" />
          </div>
        </div>
        <div>
          <label htmlFor="painPoints" className="block text-sm font-medium text-slate-700">What are your biggest home frustrations?</label>
          <textarea id="painPoints" name="painPoints" value={profile.painPoints} onChange={handleChange} rows={3} placeholder="e.g., My living room is too dark, the backyard is messy, not enough storage..." className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"></textarea>
        </div>
        <div className="pt-2 flex justify-between items-center">
            <button type="button" onClick={onClose} className="text-sm text-slate-500 hover:text-slate-700 font-medium">
                Skip for now
            </button>
            <button type="submit" className="inline-flex items-center justify-center px-6 py-2 border border-transparent text-sm font-semibold rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700">
                Save & Get Started
            </button>
        </div>
      </form>
    </Modal>
  );
};

export default OnboardingModal;