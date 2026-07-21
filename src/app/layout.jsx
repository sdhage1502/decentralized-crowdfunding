import React from 'react';
import '../styles/globals.css';
import Script from 'next/script';
import { Plus_Jakarta_Sans } from 'next/font/google';
import ClientProviders from '../components/providers/ClientProviders';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '600', '800'],
  display: 'swap',
  variable: '--font-plus-jakarta',
});

export const metadata = {
  title: 'DFund - Ethereum-Powered Decentralized Crowdfunding',
  description: 'Launch or back fundraising campaigns secured by Ethereum smart contracts. Transparent, fee-free, direct.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="apple-touch-icon" href="/favicon.png" />
      </head>
      <body className={plusJakartaSans.className}>
        <Script
          id="clarity-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "rpq9qoqysb");`,
          }}
        />
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}

