export interface FusedAlien {
  name: string;
  species: string;
  homeWorld: string;
  abilities: string[];
  palette: {
    primary: string;
    background: string;
    glow: string;
  };
  particles: 'fire' | 'cyan' | 'purple' | 'crystals' | 'grid' | 'rings' | 'blended';
}
