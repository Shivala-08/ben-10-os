import { AlienTheme } from '../types';

export const ghostfreakTheme: AlienTheme = {
  id: 'ghostfreak',
  name: 'Ghostfreak',
  colors: {
    primary: '#7B00FF',
    secondary: '#7B00FF80', // simplified secondary
    bg: '#050505',
    surface: '#111111',
    text: '#E0E0E0',
    glow: '#7B00FF',
  },
  particles: { type: 'glitch', count: 200, speed: 1.5, spread: 2.0 },
  sound: { transform: `/sounds/ghostfreak-transform.mp3`, ambient: `/sounds/ghostfreak-ambient.mp3` },
  cursor: `/cursors/ghostfreak.svg`,
  font: { display: 'Orbitron', body: 'Space Grotesk' },
  shader: 'noise',
  gsapEase: 'power4.out',
};
