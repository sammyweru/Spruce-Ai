import React, { useState } from 'react';
import { LogEntry } from '../types';
import Modal from './Modal';
import { BookOpenIcon, PlusCircleIcon } from './icons';

interface HomeLogbookViewProps {
  entries: LogEntry[];
  onUpdateEntries: (newEntries: LogEntry[]) => void;
}

const HomeLogbookView: React.FC<HomeLogbookViewProps> = ({ entries, onUpdateEntries }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newEntry, setNewEntry] = useState<Omit<LogEntry, 'id'>>({
        date: new Date().toISOString().split('T')[0],
        category: 'Other',
        description: '',
        details: '',
        cost: 0,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setNewEntry(prev => ({ ...prev, [name]: name === 'cost' ? Number(value) : value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const updatedEntries = [{ id: `log-${Date.now()}`, ...newEntry }, ...entries].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        onUpdateEntries(updatedEntries);
        setIsModalOpen(false);
        // Reset form
        setNewEntry({
            date: new Date().toISOString().split('T')[0],
            category: 'Other',
            description: '',
            details: '',
            cost: 0,
        });
    };

  return (
    <div className="animate-fade-in-up">
      <header className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <div className="text-center sm:text-left">
            <h2 className="text-3xl font-bold text-slate-800">Home Logbook</h2>
            <p className="mt-1 text-md text-slate-500">A digital record of your home's history.</p>
        </div>
        <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 text-white font-bold rounded-full shadow-lg hover:bg-teal-500 transition-all cursor-pointer"
        >
            <PlusCircleIcon className="w-6 h-6" />
            <span>Add New Entry</span>
        </button>
      </header>
      
      {entries.length === 0 ? (
        <div className="text-center py-20 bg-slate-100 rounded-lg">
            <BookOpenIcon className="mx-auto h-16 w-16 text-slate-400" />
            <p className="mt-4 text-xl text-slate-500">Your logbook is empty.</p>
            <p className="text-slate-400">Add an entry to start recording your home's history.</p>
        </div>
      ) : (
        <div className="space-y-4">
            {entries.map(entry => (
                <div key={entry.id} className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="font-bold text-slate-800">{entry.description}</p>
                            <p className="text-sm text-slate-500">{entry.details}</p>
                        </div>
                        <div className="text-right flex-shrink-0 ml-4">
                            <p className="text-sm font-semibold text-slate-700">{new Date(entry.date).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                            <span className="text-xs font-semibold bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full">{entry.category}</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
      )}
      
      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add to Home Logbook">
            <form onSubmit={handleSubmit} className="space-y-4">
                 <div>
                    <label htmlFor="date" className="block text-sm font-medium text-slate-700">Date</label>
                    <input type="date" name="date" value={newEntry.date} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md" />
                </div>
                 <div>
                    <label htmlFor="category" className="block text-sm font-medium text-slate-700">Category</label>
                    <select name="category" value={newEntry.category} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md">
                        <option>Paint</option>
                        <option>Appliance</option>
                        <option>Repair</option>
                        <option>Installation</option>
                        <option>Other</option>
                    </select>
                </div>
                 <div>
                    <label htmlFor="description" className="block text-sm font-medium text-slate-700">Description</label>
                    <input type="text" name="description" value={newEntry.description} onChange={handleChange} required placeholder="e.g., Painted Living Room" className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md" />
                </div>
                <div>
                    <label htmlFor="details" className="block text-sm font-medium text-slate-700">Details</label>
                    <textarea name="details" value={newEntry.details} onChange={handleChange} rows={3} placeholder="e.g., Used 'Sadolin' brand, color 'Morning Sky'. Contractor was John..." className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md"></textarea>
                </div>
                <div className="text-right">
                     <button type="submit" className="inline-flex items-center justify-center px-6 py-2 border border-transparent text-sm font-semibold rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700">
                        Save Entry
                    </button>
                </div>
            </form>
        </Modal>
      )}
    </div>
  );
};

export default HomeLogbookView;
