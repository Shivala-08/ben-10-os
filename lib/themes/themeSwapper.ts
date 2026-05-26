// lib/themes/themeSwapper.ts
import { AlienTheme } from './types';
import { themes } from './index';

// Function to apply a specific alien theme
export const applyTheme = (alienKey: string | null) => {
  const root = document.documentElement; // Get the root element (<html>)

  if (!root) {
    console.error('Root element not found. Cannot apply theme.');
    return;
  }

  // Clear existing theme attributes and CSS variables
  root.removeAttribute('data-alien');
  // Consider removing previously set CSS variables if they are not overwritten
  // For simplicity, we'll directly set variables.

  if (alienKey && themes[alienKey]) {
    const theme = themes[alienKey];

    // Apply the data-alien attribute for potential CSS targeting
    root.setAttribute('data-alien', theme.id);

    // Set CSS variables for colors
    root.style.setProperty('--color-primary', theme.colors.primary);
    root.style.setProperty('--color-secondary', theme.colors.secondary);
    root.style.setProperty('--color-bg', theme.colors.bg);
    root.style.setProperty('--color-surface', theme.colors.surface);
    root.style.setProperty('--color-text', theme.colors.text);
    root.style.setProperty('--color-glow', theme.colors.glow);

    // Set other theme properties that might be used in CSS
    root.style.setProperty('--font-display', `"${theme.font.display}", sans-serif`);
    root.style.setProperty('--font-body', `"${theme.font.body}", sans-serif`);
    root.style.setProperty('--cursor-url', `url('${theme.cursor}')`);
    root.style.setProperty('--transition-easing', theme.gsapEase); // Example: GSAP ease mapped to CSS

    // Note: Particle system, shader, and other dynamic elements might be handled
    // in the frontend components themselves, referencing theme properties.
    // For example, a component might read theme.particles.type.
  } else {
    // Apply a default or neutral theme if no alienKey is provided (e.g., for initial load or reset)
    console.warn('No alien key provided, applying default theme.');
    root.style.setProperty('--color-primary', '#FFFFFF'); // Example default
    root.style.setProperty('--color-secondary', '#CCCCCC');
    root.style.setProperty('--color-bg', '#000000');
    root.style.setProperty('--color-surface', '#18181B');
    root.style.setProperty('--color-text', '#FFFFFF');
    root.style.setProperty('--color-glow', '#CCCCCC');
    root.style.setProperty('--font-display', `'Space Grotesk', sans-serif`); // Default fallback
    root.style.setProperty('--font-body', `'Space Grotesk', sans-serif`);
    root.style.setProperty('--cursor-url', `url('/cursors/default/cursor.svg')`); // Default cursor
    root.style.setProperty('--transition-easing', 'ease-in-out');
  }
};

// You might also want a function to get the current theme or reset it.
export const resetTheme = () => {
  applyTheme(null); // Apply default theme by passing null
};
