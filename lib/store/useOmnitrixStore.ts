import { create } from 'zustand';

interface OmnitrixState {
  activeAlien: string | null;
  bootComplete: boolean;
  wheelRotation: number;
  isMuted: boolean;
  isTransforming: boolean;
  unlockedAliens: string[];
  isMalfunctioning: boolean;
  setActiveAlien: (alienId: string | null) => void;
  setBootComplete: (complete: boolean) => void;
  setWheelRotation: (rotation: number) => void;
  setIsMuted: (muted: boolean) => void;
  setIsTransforming: (transforming: boolean) => void;
  unlockAlien: (alienId: string) => void;
  initUnlockedAliens: () => void;
  setIsMalfunctioning: (malfunctioning: boolean) => void;
}

export const useOmnitrixStore = create<OmnitrixState>((set) => ({
  activeAlien: null,
  bootComplete: false,
  wheelRotation: 0,
  isMuted: false,
  isTransforming: false,
  unlockedAliens: ['heatblast'], // Heatblast unlocked by default
  isMalfunctioning: false,
  setActiveAlien: (alienId) => set({ activeAlien: alienId }),
  setBootComplete: (complete) => set({ bootComplete: complete }),
  setWheelRotation: (rotation) => set({ wheelRotation: rotation }),
  setIsMuted: (muted) => set({ isMuted: muted }),
  setIsTransforming: (transforming) => set({ isTransforming: transforming }),
  unlockAlien: (alienId) => set((state) => {
    if (state.unlockedAliens.includes(alienId)) return state;
    const newUnlocked = [...state.unlockedAliens, alienId];
    if (typeof window !== 'undefined') {
      localStorage.setItem('omnitrix_unlocked', JSON.stringify(newUnlocked));
    }
    return { unlockedAliens: newUnlocked };
  }),
  initUnlockedAliens: () => {
    if (typeof window === 'undefined') return;
    const stored = localStorage.getItem('omnitrix_unlocked');
    if (stored) {
      try {
        set({ unlockedAliens: JSON.parse(stored) });
      } catch (e) {
        console.error('Failed to parse unlocked aliens', e);
      }
    }
  },
  setIsMalfunctioning: (malfunctioning) => set({ isMalfunctioning: malfunctioning })
}));
