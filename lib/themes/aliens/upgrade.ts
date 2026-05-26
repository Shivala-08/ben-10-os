import { AlienTheme } from '../types';

export const upgradeTheme: AlienTheme = {
  id: 'upgrade',
  name: 'Upgrade',
  colors: {
    primary: '#00FF41',
    secondary: '#00FF4180', // simplified secondary
    bg: '#050505',
    surface: '#111111',
    text: '#E0E0E0',
    glow: '#00FF41',
  },
  particles: { type: 'circuit', count: 200, speed: 1.5, spread: 2.0 },
  sound: { transform: `/sounds/upgrade-transform.mp3`, ambient: `/sounds/upgrade-ambient.mp3` },
  cursor: `/cursors/upgrade.svg`,
  font: { display: 'Orbitron', body: 'Space Grotesk' },
  shader: 'liquid_metal',
  gsapEase: 'power4.out',
};
