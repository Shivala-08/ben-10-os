import { AlienTheme } from '../types';

export const greymatterTheme: AlienTheme = {
  id: 'grey_matter',
  name: 'Grey Matter',
  colors: {
    primary: '#55AAFF',
    secondary: '#55AAFF80', // simplified secondary
    bg: '#050505',
    surface: '#111111',
    text: '#E0E0E0',
    glow: '#55AAFF',
  },
  particles: { type: 'nodes', count: 200, speed: 1.5, spread: 2.0 },
  sound: { transform: `/sounds/grey_matter-transform.mp3`, ambient: `/sounds/grey_matter-ambient.mp3` },
  cursor: `/cursors/grey_matter.svg`,
  font: { display: 'Orbitron', body: 'Space Grotesk' },
  shader: 'network',
  gsapEase: 'power4.out',
};
