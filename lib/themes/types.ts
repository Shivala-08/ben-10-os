export interface AlienTheme {
  id: string;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    bg: string;
    surface: string;
    text: string;
    glow: string;
  };
  particles: { type: string; count: number; speed: number; spread: number };
  sound: { transform: string; ambient: string };
  cursor: string;
  font: { display: string; body: string };
  shader: string;
  gsapEase: string;
}
