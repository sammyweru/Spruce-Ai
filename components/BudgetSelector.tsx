
import React from 'react';

type Budget = 'low' | 'mid' | 'high';

interface BudgetSelectorProps {
  selectedBudget: Budget;
  onSelectBudget: (budget: Budget) => void;
}

const budgetOptions = {
    low: { label: '$', tooltip: 'Small Budget (< 20k KES)'},
    mid: { label: '$$', tooltip: 'Medium Budget (< 100k KES)'},
    high: { label: '$$$', tooltip: 'Large Budget (250k+ KES)'},
}

const BudgetSelector: React.FC<BudgetSelectorProps> = ({ selectedBudget, onSelectBudget }) => {
  return (
    <div className="flex items-center gap-2 bg-slate-200 p-1 rounded-full">
      <span className="text-sm font-semibold text-slate-600 ml-2">Budget:</span>
      {Object.entries(budgetOptions).map(([key, {label, tooltip}]) => (
        <button
          key={key}
          title={tooltip}
          onClick={() => onSelectBudget(key as Budget)}
          className={`px-4 py-1 text-sm font-bold rounded-full transition-colors ${
            selectedBudget === key
              ? 'bg-white text-teal-700 shadow-sm'
              : 'text-slate-500 hover:bg-white/60'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
};

export default BudgetSelector;
