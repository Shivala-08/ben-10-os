import { Alien } from '@/lib/api/types';
import { FusedAlien } from '@/types/fusion.types';

// Hardcoded color dictionary for roster elements
const ALIEN_COLORS: Record<string, string> = {
  heatblast: '#FF4500',
  xlr8: '#00FFFF',
  ghostfreak: '#9370DB',
  diamondhead: '#7FFFD4',
  upgrade: '#32CD32',
  four_arms: '#FF0000',
  wildmutt: '#FF8C00',
  grey_matter: '#708090',
  stinkfly: '#ADFF2F',
  ripjaws: '#4682B4'
};

function getAlienColor(alienId: string): string {
  return ALIEN_COLORS[alienId] || '#00FF41';
}

// Blends two hex colors at exactly 50% ratio
function blendHexColors(colorA: string, colorB: string): string {
  const cA = colorA.replace('#', '');
  const cB = colorB.replace('#', '');

  const rA = parseInt(cA.substring(0, 2), 16);
  const gA = parseInt(cA.substring(2, 4), 16);
  const bA = parseInt(cA.substring(4, 6), 16);

  const rB = parseInt(cB.substring(0, 2), 16);
  const gB = parseInt(cB.substring(2, 4), 16);
  const bB = parseInt(cB.substring(4, 6), 16);

  const rBlend = Math.round((rA + rB) / 2).toString(16).padStart(2, '0');
  const gBlend = Math.round((gA + gB) / 2).toString(16).padStart(2, '0');
  const bBlend = Math.round((bA + bB) / 2).toString(16).padStart(2, '0');

  return `#${rBlend}${gBlend}${bBlend}`;
}

/**
 * DNA Biometric Blender: Merges cellular structures of 2 alien specimens to create a hybrid.
 */
export function fuseAliens(alienA: Alien, alienB: Alien): FusedAlien {
  const idA = alienA.general.name.toLowerCase().replace(/\s+/g, '_');
  const idB = alienB.general.name.toLowerCase().replace(/\s+/g, '_');

  // 1. Hybrid Name Generation
  const halfA = alienA.general.name.slice(0, Math.ceil(alienA.general.name.length / 2));
  const halfB = alienB.general.name.slice(Math.floor(alienB.general.name.length / 2));
  // Clean up joining boundaries
  const hybridName = (halfA.trim() + halfB.trim()).replace(/\s+/g, '');

  // 2. Hybrid Species & Homeworlds
  const hybridSpecies = `${alienA.general.species.slice(0, Math.ceil(alienA.general.species.length / 2))}${alienB.general.species.slice(Math.floor(alienB.general.species.length / 2))}`.replace(/\s+/g, '');
  const hybridWorld = `${alienA.general.homeWorld} / ${alienB.general.homeWorld}`;

  // 3. Merged Abilities list (combine, unique, max 8, shortest-first)
  const combinedAbilities = Array.from(new Set([...alienA.abilities, ...alienB.abilities]));
  const sortedAbilities = combinedAbilities
    .sort((x, y) => x.length - y.length)
    .slice(0, 8);

  // 4. Palette Blending
  const colorA = getAlienColor(idA);
  const colorB = getAlienColor(idB);
  
  const primary = blendHexColors(colorA, colorB);
  const background = '#0a0a0a'; // Darker theme backgrounds
  const glow = primary;

  // 5. Particles emitter theme
  let particles: FusedAlien['particles'] = 'blended';
  if (idA === 'heatblast' || idB === 'heatblast') particles = 'fire';
  else if (idA === 'xlr8' || idB === 'xlr8') particles = 'cyan';
  else if (idA === 'ghostfreak' || idB === 'ghostfreak') particles = 'purple';
  else if (idA === 'diamondhead' || idB === 'diamondhead') particles = 'crystals';
  else if (idA === 'upgrade' || idB === 'upgrade') particles = 'grid';
  else if (idA === 'four_arms' || idB === 'four_arms') particles = 'rings';

  return {
    name: hybridName,
    species: hybridSpecies,
    homeWorld: hybridWorld,
    abilities: sortedAbilities,
    palette: { primary, background, glow },
    particles
  };
}
