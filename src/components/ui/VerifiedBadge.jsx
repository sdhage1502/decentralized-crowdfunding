'use client';

import React from 'react';
import { BadgeCheck } from 'lucide-react';

/**
 * Verification badge shown on campaigns with `verified: true` field.
 * Small glassmorphic pill with a checkmark icon.
 */
const VerifiedBadge = ({ className = '' }) => {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 dark:bg-emerald-400/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 dark:border-emerald-400/20 backdrop-blur-sm ${className}`}
      title="Verified Campaign"
    >
      <BadgeCheck size={11} strokeWidth={2.5} />
      Verified
    </span>
  );
};

export default VerifiedBadge;
