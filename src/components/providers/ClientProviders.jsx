'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Header from '../ui/Header';
import ClickSpark from '../ui/ClickSpark';
import TechBackground from '../ui/TechBackground';
import { Web3Provider } from '../../context/Web3Context';
import { Toaster } from 'react-hot-toast';

export default function ClientProviders({ children }) {
  const pathname = usePathname();
  const isHomepage = pathname === '/';

  return (
    <Web3Provider>
      <ClickSpark
        sparkColor="#3247C5"
        sparkSize={10}
        sparkRadius={20}
        sparkCount={8}
        duration={400}
      >
        {/* Global Tech Background */}
        <TechBackground animated={isHomepage} showCircuitry={true} />
        <Header />
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              fontSize: '16px',
              fontWeight: '500',
              textAlign: 'center',
            },
            success: {
              duration: 4000,
              theme: {
                primary: 'green',
                secondary: 'white',
              },
            },
            error: {
              duration: 5000,
              theme: {
                primary: 'red',
                secondary: 'white',
              },
            },
          }}
        />
        {children}
      </ClickSpark>
    </Web3Provider>
  );
}
