'use client';
import React from 'react';
import Header from './components/Header';
import { Web3Provider } from '../context/Web3Context';
import { Toaster } from 'react-hot-toast'; // ✅ import Toaster
import '../styles/globals.css';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/crowdfunding.svg" sizes="any" />
        <link rel="icon" type="image/png" href="/crowdfunding.svg" />
        <link rel="apple-touch-icon" href="/crowdfunding.svg" />
      </head>
      <body>
        <Web3Provider>
          <Header />
          <Toaster
            position="top-center" // ✅ set position globally
            toastOptions={{
              duration: 4000,
              style: {
                background: '#333',
                color: '#fff',
              },
            }}
          />
          {children}
        </Web3Provider>
      </body>
    </html>
  );
}
