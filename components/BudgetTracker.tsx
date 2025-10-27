
import React from 'react';
import { BudgetItem } from '../types';

interface BudgetTrackerProps {
  items: BudgetItem[];
  total: number;
}

const BudgetTracker: React.FC<BudgetTrackerProps> = ({ items, total }) => {
  const spent = items.reduce((sum, item) => sum + item.cost, 0);
  const remaining = total - spent;
  const percentage = total > 0 ? (spent / total) * 100 : 0;

  return (
    <div className="p-6 bg-white rounded-lg border border-slate-200 shadow-lg">
      <h3 className="text-xl font-bold text-slate-800 mb-4">Budget Tracker</h3>
      <div className="space-y-2">
        <div className="flex justify-between text-sm font-semibold">
          <span>Spent: {spent.toLocaleString('en-KE', { style: 'currency', currency: 'KES' })}</span>
          <span>Total: {total.toLocaleString('en-KE', { style: 'currency', currency: 'KES' })}</span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-4">
          <div 
            className="bg-teal-500 h-4 rounded-full" 
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
        <div className="text-right text-sm font-semibold text-slate-600">
            Remaining: {remaining.toLocaleString('en-KE', { style: 'currency', currency: 'KES' })}
        </div>
      </div>
      
      <div className="mt-6 border-t border-slate-200 pt-4">
        <h4 className="font-bold text-slate-700 mb-2">Expenses:</h4>
        {items.length === 0 ? (
            <p className="text-slate-500 text-sm">No expenses added yet.</p>
        ) : (
            <ul className="space-y-2">
                {items.map(item => (
                    <li key={item.id} className="flex justify-between p-2 bg-slate-50 rounded-md">
                        <span className="text-slate-700">{item.name}</span>
                        <span className="font-semibold text-slate-800">{item.cost.toLocaleString('en-KE', { style: 'currency', currency: 'KES' })}</span>
                    </li>
                ))}
            </ul>
        )}
      </div>
    </div>
  );
};

export default BudgetTracker;
