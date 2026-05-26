import { AlienTheme } from '../types';

export const wildmuttTheme: AlienTheme = {
  id: 'wildmutt',
  name: 'Wildmutt',
  colors: {
    primary: '#FF8800',
    secondary: '#FF880080', // simplified secondary
    bg: '#050505',
    surface: '#111111',
    text: '#E0E0E0',
    glow: '#FF8800',
  },
  particles: { type: 'sonar', count: 200, speed: 1.5, spread: 2.0 },
  sound: { transform: `/sounds/wildmutt-transform.mp3`, ambient: `/sounds/wildmutt-ambient.mp3` },
  cursor: `/cursors/wildmutt.svg`,
  font: { display: 'Orbitron', body: 'Space Grotesk' },
  shader: 'sonar',
  gsapEase: 'power4.out',
};
