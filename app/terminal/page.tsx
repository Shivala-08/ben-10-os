'use client';

import dynamic from 'next/dynamic';

const Terminal = dynamic(
  () => import('@/components/terminal/Terminal'),
  { ssr: false }
);

export default function TerminalPage() {
  return (
    <main className="w-full min-h-screen bg-black overflow-hidden relative select-none">
      <Terminal />
    </main>
  );
}
