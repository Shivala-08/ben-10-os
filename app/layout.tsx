import './globals.css';
import type { Metadata } from 'next';
import { Space_Grotesk, Orbitron } from 'next/font/google';
import { Providers } from './providers';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

const orbitron = Orbitron({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'OmnitrixOS',
  description: 'The Ultimate Ben 10 Interactive Portfolio / Fan Experience',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${orbitron.variable} ${spaceGrotesk.variable} h-full antialiased`}
    >
      <head>
        <link rel="preconnect" href="https://ben10-api.herokuapp.com" />
        <link rel="dns-prefetch" href="https://ben10-api.herokuapp.com" />
        <meta name="theme-color" content="#000000" />
      </head>
      <body className="min-h-full flex flex-col bg-black overflow-x-hidden hologram-overlay">
        <Providers>
          {children}
          <Analytics />
          <SpeedInsights />
        </Providers>
      </body>
    </html>
  );
}
