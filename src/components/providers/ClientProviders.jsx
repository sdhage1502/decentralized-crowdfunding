'use client';

import React from 'react';
import { ThemeProvider } from 'next-themes';
import Header from '../ui/Header';
import ClickSpark from '../ui/ClickSpark';
import BackgroundSpotlight from '../ui/BackgroundSpotlight';
import AnimatedGridLines from '../ui/AnimatedGridLines';
import TechBackground from '../ui/TechBackground';
import { Web3Provider } from '../../context/Web3Context';
import { Toaster } from 'react-hot-toast';

export default function ClientProviders({ children }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <Web3Provider>
        <ClickSpark
          sparkColor="#3247C5"
          sparkSize={10}
          sparkRadius={20}
          sparkCount={8}
          duration={400}
        >
          <TechBackground animated={true} showCircuitry={true} />
          <BackgroundSpotlight />
          <AnimatedGridLines />
          <Header />
          <Toaster
            position="top-center"
            toastOptions={{
              style: {
                fontSize: '14px',
                fontWeight: '600',
                textAlign: 'center',
                borderRadius: '9999px',
                padding: '10px 20px',
                background: 'rgba(255, 255, 255, 0.92)',
                backdropFilter: 'blur(16px) saturate(180%)',
                WebkitBackdropFilter: 'blur(16px) saturate(180%)',
                border: '1px solid rgba(0, 0, 0, 0.06)',
                boxShadow: '0 4px 24px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.04)',
                color: '#0f172a',
              },
              success: {
                duration: 4000,
                style: {
                  background: 'rgba(240, 253, 244, 0.95)',
                  border: '1px solid rgba(34, 197, 94, 0.2)',
                  color: '#166534',
                },
              },
              error: {
                duration: 5000,
                style: {
                  background: 'rgba(254, 242, 242, 0.95)',
                  border: '1px solid rgba(239, 68, 68, 0.2)',
                  color: '#991b1b',
                },
              },
              loading: {
                style: {
                  background: 'rgba(239, 246, 255, 0.95)',
                  border: '1px solid rgba(59, 130, 246, 0.2)',
                  color: '#1e40af',
                },
              },
            }}
          />
          {children}
        </ClickSpark>
      </Web3Provider>
    </ThemeProvider>
  );
}
