'use client';
import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

export default function AnimatedLoader({ message, size = 40, className = '' }) {
  const containerRef = useRef(null);
  const circlesRef = useRef([]);

  useGSAP(() => {
    // Pulse animation
    gsap.to(circlesRef.current, {
      scale: 1.5,
      opacity: 0,
      duration: 1.5,
      stagger: {
        each: 0.5,
        repeat: -1,
      },
      ease: 'power2.out',
    });

    if (message) {
      gsap.from('.loader-text', {
        opacity: 0.4,
        duration: 1.5,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut'
      });
    }
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className={`flex flex-col items-center justify-center gap-4 ${className}`}>
      <div 
        className="relative flex items-center justify-center"
        style={{ width: size, height: size }}
      >
        {/* Static center dot */}
        <div className="absolute w-1/4 h-1/4 bg-accent rounded-full" />
        
        {/* Pulsing rings */}
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            ref={el => {
              if (el && !circlesRef.current.includes(el)) {
                circlesRef.current[i] = el;
              }
            }}
            className="absolute inset-0 border-2 border-accent rounded-full opacity-60"
          />
        ))}
      </div>
      
      {message && (
        <span className="loader-text text-sm font-semibold text-ink-2 uppercase tracking-widest">
          {message}
        </span>
      )}
    </div>
  );
}
