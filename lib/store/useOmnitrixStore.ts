import { create } from 'zustand';

interface OmnitrixState {
  activeAlien: string | null;
  bootComplete: boolean;
  wheelRotation: number;
  isMuted: boolean;
  isTransforming: boolean;
  setActiveAlien: (alienId: string | null) => void;
  setBootComplete: (complete: boolean) => void;
  setWheelRotation: (rotation: number) => void;
  setIsMuted: (muted: boolean) => void;
  setIsTransforming: (transforming: boolean) => void;
}

export const useOmnitrixStore = create<OmnitrixState>((set) => ({
  activeAlien: null,
  bootComplete: false,
  wheelRotation: 0,
  isMuted: false,
  isTransforming: false,
  setActiveAlien: (alienId) => set({ activeAlien: alienId }),
  setBootComplete: (complete) => set({ bootComplete: complete }),
  setWheelRotation: (rotation) => set({ wheelRotation: rotation }),
  setIsMuted: (muted) => set({ isMuted: muted }),
  setIsTransforming: (transforming) => set({ isTransforming: transforming }),
}));
