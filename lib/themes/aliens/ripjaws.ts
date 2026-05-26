import { AlienTheme } from '../types';

export const ripjawsTheme: AlienTheme = {
  id: 'ripjaws',
  name: 'Ripjaws',
  colors: {
    primary: '#0088FF',
    secondary: '#0088FF80', // simplified secondary
    bg: '#050505',
    surface: '#111111',
    text: '#E0E0E0',
    glow: '#0088FF',
  },
  particles: { type: 'water', count: 200, speed: 1.5, spread: 2.0 },
  sound: { transform: `/sounds/ripjaws-transform.mp3`, ambient: `/sounds/ripjaws-ambient.mp3` },
  cursor: `/cursors/ripjaws.svg`,
  font: { display: 'Orbitron', body: 'Space Grotesk' },
  shader: 'caustics',
  gsapEase: 'power4.out',
};
