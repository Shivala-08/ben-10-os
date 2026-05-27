'use client';

import React, { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useOmnitrixStore } from '@/lib/store/useOmnitrixStore';
import Home from '../../page';

export default function AlienPage() {
  const params = useParams();
  const slug = params?.slug as string;
  
  const setActiveAlien = useOmnitrixStore((state) => state.setActiveAlien);
  const setBootComplete = useOmnitrixStore((state) => state.setBootComplete);

  useEffect(() => {
    if (!slug) return;

    // Direct link loads check sessionStorage to skip the boot sequence if visited
    const bootDone = sessionStorage.getItem('omnitrix_boot_done');
    if (bootDone === 'true') {
      setBootComplete(true);
    }
    
    // Select the url alien in the Zustand store
    setActiveAlien(slug);
  }, [slug, setActiveAlien, setBootComplete]);

  return <Home />;
}
