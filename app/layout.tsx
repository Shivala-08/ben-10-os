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
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'OmnitrixOS',
  },
};

import { GlobalTrigger } from '@/components/terminal/GlobalTrigger';
import { PWARegistration } from '@/components/PWARegistration';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${orbitron.variable} ${spaceGrotesk.variable} h-full antialiased`}
    >
      <head>
        <link rel="preconnect" href="https://ben10-api.herokuapp.com" />
        <link rel="dns-prefetch" href="https://ben10-api.herokuapp.com" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className="min-h-full flex flex-col bg-black overflow-x-hidden hologram-overlay">
        <Providers>
          {children}
          <GlobalTrigger />
          <PWARegistration />
          <Analytics />
          <SpeedInsights />
        </Providers>
      </body>
    </html>
  );
}
