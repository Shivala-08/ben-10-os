import { AlienTheme } from '../types';

export const fourarmsTheme: AlienTheme = {
  id: 'four_arms',
  name: 'Four Arms',
  colors: {
    primary: '#CC2200',
    secondary: '#CC220080', // simplified secondary
    bg: '#050505',
    surface: '#111111',
    text: '#E0E0E0',
    glow: '#CC2200',
  },
  particles: { type: 'shockwave', count: 200, speed: 1.5, spread: 2.0 },
  sound: { transform: `/sounds/four_arms-transform.mp3`, ambient: `/sounds/four_arms-ambient.mp3` },
  cursor: `/cursors/four_arms.svg`,
  font: { display: 'Orbitron', body: 'Space Grotesk' },
  shader: 'shockwave',
  gsapEase: 'power4.out',
};
