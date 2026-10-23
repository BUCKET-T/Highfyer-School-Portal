import React from 'react';

const Spinner = ({ size = 'md', color = 'brand-blue', text = '' }) => {
  // Define size variants
  const sizeClasses = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-[3px]',
    lg: 'w-12 h-12 border-4',
  };

  // Define border color variants (leaves top border transparent for rotation effect)
  const colorClasses = {
    'brand-blue': 'border-brand-blue border-t-transparent',
    'brand-coral': 'border-brand-coral border-t-transparent',
    'brand-navy': 'border-brand-navy border-t-transparent',
    white: 'border-white border-t-transparent',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3 select-none">
      <div
        className={`rounded-full animate-spin ${sizeClasses[size] || sizeClasses.md} ${
          colorClasses[color] || colorClasses['brand-blue']
        }`}
      />
      {text && (
        <p className="text-xs font-semibold text-slate-500 tracking-wide animate-pulse">
          {text}
        </p>
      )}
    </div>
  );
};

export default Spinner;