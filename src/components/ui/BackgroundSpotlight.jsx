'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function BackgroundSpotlight() {
  const spotlightRef = useRef(null);

  useEffect(() => {
    // Check if device supports fine pointer (mouse) and no reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const hasPointer = window.matchMedia('(pointer: fine)').matches;

    if (prefersReducedMotion || !hasPointer || !spotlightRef.current) return;

    // High-performance GSAP quickTo for silky smooth 120fps mouse tracking
    const xTo = gsap.quickTo(spotlightRef.current, "x", { duration: 0.6, ease: "power2.out" });
    const yTo = gsap.quickTo(spotlightRef.current, "y", { duration: 0.6, ease: "power2.out" });

    const handleMouseMove = (e) => {
      xTo(e.clientX);
      yTo(e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div
      ref={spotlightRef}
      className="fixed top-0 left-0 w-[650px] h-[650px] -ml-[325px] -mt-[325px] pointer-events-none z-[-1] rounded-full opacity-70 dark:opacity-50 transition-opacity duration-500 hidden sm:block"
      style={{
        background: `
          radial-gradient(circle at center, rgba(0, 112, 243, 0.12) 0%, rgba(94, 106, 210, 0.05) 35%, transparent 70%),
          radial-gradient(circle at center, rgba(14, 165, 233, 0.08) 0%, transparent 40%)
        `,
        willChange: 'transform',
      }}
      aria-hidden="true"
    />
  );
}
