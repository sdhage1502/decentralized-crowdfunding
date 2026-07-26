'use client';

import React from 'react';

/**
 * Skeleton stats bar matching the 6-column grid on the dashboard.
 */
const SkeletonStats = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="bg-paper-2-glass backdrop-blur min-w-0 p-3.5 rounded-xl border border-rule flex flex-col items-center justify-center text-center gap-1 shadow-sm animate-pulse"
        >
          {/* Icon placeholder */}
          <div className="p-2 rounded-lg bg-paper-3-glass backdrop-blur-sm flex items-center justify-center">
            <div className="w-3.5 h-3.5 bg-paper-3 rounded" />
          </div>
          {/* Label */}
          <div className="mt-1 flex flex-col items-center gap-1.5">
            <div className="w-14 h-2.5 bg-paper-3 rounded" />
            <div className="w-8 h-4 bg-paper-3 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default SkeletonStats;
