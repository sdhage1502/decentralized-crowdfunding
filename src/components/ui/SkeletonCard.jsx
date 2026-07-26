'use client';

import React from 'react';

/**
 * Skeleton campaign card that matches the exact layout of real campaign cards.
 * Features a shimmer animation for a premium loading experience.
 */
const SkeletonCard = () => {
  return (
    <div className="bg-paper-2-glass backdrop-blur border border-rule rounded-xl overflow-hidden shadow-sm flex flex-col h-full animate-pulse">
      {/* Image placeholder */}
      <div className="relative h-40 w-full bg-paper-3 border-b border-rule">
        <div className="absolute inset-0 skeleton-shimmer" />
        {/* Goal badge skeleton */}
        <div className="absolute top-3 right-3 w-16 h-6 bg-black/10 dark:bg-white/10 rounded-full" />
        {/* Status badge skeleton */}
        <div className="absolute top-3 left-3 w-14 h-5 bg-black/10 dark:bg-white/10 rounded-full" />
        {/* Urgency badge skeleton */}
        <div className="absolute bottom-3 left-3 w-16 h-5 bg-black/10 dark:bg-white/10 rounded-full" />
      </div>

      {/* Card content */}
      <div className="p-4 flex flex-col flex-1 justify-between space-y-4">
        <div className="space-y-3">
          {/* Meta line */}
          <div className="flex items-center gap-3">
            <div className="w-20 h-3 bg-paper-3 rounded" />
            <div className="w-16 h-3 bg-paper-3 rounded" />
          </div>
          {/* Title */}
          <div className="space-y-2">
            <div className="w-full h-4 bg-paper-3 rounded" />
            <div className="w-3/4 h-4 bg-paper-3 rounded" />
          </div>
          {/* Description */}
          <div className="space-y-1.5">
            <div className="w-full h-3 bg-paper-3 rounded" />
            <div className="w-full h-3 bg-paper-3 rounded" />
            <div className="w-2/3 h-3 bg-paper-3 rounded" />
          </div>
        </div>

        <div className="space-y-3 pt-2">
          {/* Progress bar */}
          <div className="space-y-1">
            <div className="w-full h-1.5 bg-paper-3 rounded-full" />
            <div className="flex justify-between">
              <div className="w-16 h-3 bg-paper-3 rounded" />
              <div className="w-20 h-3 bg-paper-3 rounded" />
            </div>
          </div>
          {/* Button */}
          <div className="w-full h-9 bg-paper-3 rounded-lg" />
        </div>
      </div>
    </div>
  );
};

export default SkeletonCard;
