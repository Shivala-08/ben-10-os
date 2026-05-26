import { AlienTheme } from '../types';

export const xlr8Theme: AlienTheme = {
  id: 'xlr8',
  name: 'XLR8',
  colors: {
    primary: '#00BFFF',
    secondary: '#00BFFF80', // simplified secondary
    bg: '#050505',
    surface: '#111111',
    text: '#E0E0E0',
    glow: '#00BFFF',
  },
  particles: { type: 'speed', count: 200, speed: 1.5, spread: 2.0 },
  sound: { transform: `/sounds/xlr8-transform.mp3`, ambient: `/sounds/xlr8-ambient.mp3` },
  cursor: `/cursors/xlr8.svg`,
  font: { display: 'Orbitron', body: 'Space Grotesk' },
  shader: 'blur',
  gsapEase: 'power4.out',
};
