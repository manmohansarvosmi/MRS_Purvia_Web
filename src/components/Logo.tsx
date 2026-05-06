import React from 'react';

export const Logo = ({ className }: { className?: string }) => {
  return (
    <div className={`flex items-center ${className}`}>
      <span className="text-xl font-[900] uppercase tracking-tighter text-primary italic">
        M.R.S. PURVIA
      </span>
    </div>
  );
};
