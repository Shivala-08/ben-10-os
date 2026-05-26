import { AliensResponse, SingleAlienResponse, Alien } from './types';
import { localAliens } from './data';

export const BIG_10_NAMES = [
  'Heatblast',
  'XLR8',
  'Ghostfreak',
  'Diamondhead',
  'Upgrade',
  'Four Arms',
  'Wildmutt',
  'Grey Matter',
  'Stinkfly',
  'Ripjaws',
];

// Simulate network delay for effect
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function fetchAllAliens(): Promise<AliensResponse> {
  await delay(300);
  return {
    count: localAliens.length,
    aliens: localAliens
  };
}

export async function fetchBig10Aliens(): Promise<Alien[]> {
  await delay(300);
  return localAliens.filter(alien => BIG_10_NAMES.includes(alien.general.name));
}

export async function fetchAlienById(id: string): Promise<SingleAlienResponse> {
  await delay(300);
  const alien = localAliens.find(a => a._id === id);
  if (!alien) {
    throw new Error(`Failed to fetch alien with id: ${id}`);
  }
  return {
    alien,
    request: { type: 'GET', url: `/api/aliens/${id}` }
  };
}

export async function fetchRandomAlien(): Promise<Alien> {
  await delay(300);
  const randomIndex = Math.floor(Math.random() * localAliens.length);
  return localAliens[randomIndex];
}
