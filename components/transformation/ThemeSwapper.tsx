'use client';

import { useEffect } from 'react';
import { useOmnitrixStore } from '@/lib/store/useOmnitrixStore';
import { themes } from '@/lib/themes';

export function ThemeSwapper() {
  const activeAlien = useOmnitrixStore((state) => state.activeAlien);

  useEffect(() => {
    if (!activeAlien) {
      // Revert to default or do nothing
      return;
    }

    const theme = themes[activeAlien];
    if (!theme) return;

    const root = document.documentElement;

    root.style.setProperty('--color-primary', theme.colors.primary);
    root.style.setProperty('--color-secondary', theme.colors.secondary);
    root.style.setProperty('--color-bg', theme.colors.bg);
    root.style.setProperty('--color-surface', theme.colors.surface);
    root.style.setProperty('--color-text', theme.colors.text);
    root.style.setProperty('--color-glow', theme.colors.glow);
    root.style.setProperty('--particle-color', theme.colors.primary); // usually same as primary
    root.style.setProperty('--font-display', `"${theme.font.display}", sans-serif`);
    root.style.setProperty('--font-body', `"${theme.font.body}", sans-serif`);
    root.style.setProperty('--cursor-url', `url(${theme.cursor})`);

    // We can also set a data attribute for any custom css targeting
    root.setAttribute('data-alien', activeAlien);

  }, [activeAlien]);

  return null; // This component doesn't render anything visually
}