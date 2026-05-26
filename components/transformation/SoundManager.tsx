'use client';

import { useEffect } from 'react';
import { useOmnitrixStore } from '@/lib/store/useOmnitrixStore';
import { synth } from '@/lib/utils/WebAudioSynth';

export function SoundManager() {
  const activeAlien = useOmnitrixStore((state) => state.activeAlien);
  const isMuted = useOmnitrixStore((state) => state.isMuted);

  // Sync mute state globally
  useEffect(() => {
    synth.setMute(isMuted);
  }, [isMuted]);

  // Sync transformation sweeps & element hums
  useEffect(() => {
    if (!activeAlien) {
      synth.stopAmbient();
      return;
    }

    // Trigger transformation audio effect
    synth.playTransform();

    // Trigger ambient oscillator loop
    synth.playAmbient(activeAlien);

    return () => {
      synth.stopAmbient();
    };
  }, [activeAlien]);

  return null;
}