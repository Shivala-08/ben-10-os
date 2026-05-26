import { AlienTheme } from '../types';

export const diamondheadTheme: AlienTheme = {
  id: 'diamondhead',
  name: 'Diamondhead',
  colors: {
    primary: '#00FFCC',
    secondary: '#00FFCC80', // simplified secondary
    bg: '#050505',
    surface: '#111111',
    text: '#E0E0E0',
    glow: '#00FFCC',
  },
  particles: { type: 'crystal', count: 200, speed: 1.5, spread: 2.0 },
  sound: { transform: `/sounds/diamondhead-transform.mp3`, ambient: `/sounds/diamondhead-ambient.mp3` },
  cursor: `/cursors/diamondhead.svg`,
  font: { display: 'Orbitron', body: 'Space Grotesk' },
  shader: 'refraction',
  gsapEase: 'power4.out',
};
