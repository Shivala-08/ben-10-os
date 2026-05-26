import { AlienTheme } from '../types';

export const heatblastTheme: AlienTheme = {
  id: 'heatblast',
  name: 'Heatblast',
  colors: {
    primary: '#FF4500',
    secondary: '#FF450080', // simplified secondary
    bg: '#050505',
    surface: '#111111',
    text: '#E0E0E0',
    glow: '#FF4500',
  },
  particles: { type: 'fire', count: 200, speed: 1.5, spread: 2.0 },
  sound: { transform: `/sounds/heatblast-transform.mp3`, ambient: `/sounds/heatblast-ambient.mp3` },
  cursor: `/cursors/heatblast.svg`,
  font: { display: 'Orbitron', body: 'Space Grotesk' },
  shader: 'fire',
  gsapEase: 'power4.out',
};
