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
        position="top-center"
        toastOptions={{
          // Default options for all toasts
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
        </Web3Provider>
      </body>
    </html>
  );
}
