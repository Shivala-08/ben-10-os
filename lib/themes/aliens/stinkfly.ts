import { AlienTheme } from '../types';

export const stinkflyTheme: AlienTheme = {
  id: 'stinkfly',
  name: 'Stinkfly',
  colors: {
    primary: '#AAFF00',
    secondary: '#AAFF0080', // simplified secondary
    bg: '#050505',
    surface: '#111111',
    text: '#E0E0E0',
    glow: '#AAFF00',
  },
  particles: { type: 'drip', count: 200, speed: 1.5, spread: 2.0 },
  sound: { transform: `/sounds/stinkfly-transform.mp3`, ambient: `/sounds/stinkfly-ambient.mp3` },
  cursor: `/cursors/stinkfly.svg`,
  font: { display: 'Orbitron', body: 'Space Grotesk' },
  shader: 'bioluminescence',
  gsapEase: 'power4.out',
};
