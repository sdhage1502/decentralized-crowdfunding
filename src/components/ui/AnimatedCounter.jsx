'use client';

import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';

/**
 * AnimatedCounter — Animates a number from 0 → target using GSAP.
 * Triggers animation when the element scrolls into view.
 *
 * @param {number} target - The final number to animate to
 * @param {number} [decimals=0] - Number of decimal places
 * @param {string} [prefix=''] - Text before the number (e.g., '$')
 * @param {string} [suffix=''] - Text after the number (e.g., ' ETH')
 * @param {number} [duration=1.2] - Animation duration in seconds
 * @param {string} [className=''] - Additional CSS classes
 */
const AnimatedCounter = ({
  target,
  decimals = 0,
  prefix = '',
  suffix = '',
  duration = 1.2,
  className = '',
}) => {
  const counterRef = useRef(null);
  const valueRef = useRef({ val: 0 });
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const element = counterRef.current;
    if (!element || hasAnimated) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true);

            gsap.to(valueRef.current, {
              val: target,
              duration,
              ease: 'power2.out',
              onUpdate: () => {
                if (counterRef.current) {
                  const formatted = decimals > 0
                    ? valueRef.current.val.toFixed(decimals)
                    : Math.round(valueRef.current.val).toString();
                  counterRef.current.textContent = `${prefix}${formatted}${suffix}`;
                }
              },
            });

            observer.unobserve(element);
          }
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [target, decimals, prefix, suffix, duration, hasAnimated]);

  // Show initial value
  const initialDisplay = `${prefix}${decimals > 0 ? (0).toFixed(decimals) : '0'}${suffix}`;

  return (
    <span ref={counterRef} className={className}>
      {initialDisplay}
    </span>
  );
};

export default AnimatedCounter;
