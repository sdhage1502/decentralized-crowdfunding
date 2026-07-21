'use client';

import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(useGSAP);
}

export default function Template({ children }) {
  const container = useRef(null);

  useGSAP(() => {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (!prefersReducedMotion) {
      // Subtle fade and slide up transition
      gsap.from(container.current, {
        y: 20,
        opacity: 0,
        duration: 0.6,
        ease: 'power3.out',
        clearProps: 'all'
      });
    }
  }, { scope: container });

  return (
    <div ref={container} className="page-transition-container w-full h-full">
      {children}
    </div>
  );
}
