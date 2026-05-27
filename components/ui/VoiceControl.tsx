'use client';

import React from 'react';
import { useVoiceControl } from '@/hooks/useVoiceControl';
import { VoiceVisualizer } from './VoiceVisualizer';

export function VoiceControl() {
  const {
    isSupported,
    isListening,
    voiceState,
    recognizedText,
    analyser,
    startVoiceControl,
    stopVoiceControl
  } = useVoiceControl();

  if (!isSupported) return null;

  const getMicColor = () => {
    switch (voiceState) {
      case 'listening':
        return 'text-[#00FF41] border-[#00FF41] bg-[#00FF41]/10 shadow-[0_0_12px_rgba(0,255,65,0.3)] animate-pulse';
      case 'processing':
        return 'text-[#FFCC00] border-[#FFCC00] bg-[#FFCC00]/10 shadow-[0_0_12px_rgba(255,204,0,0.3)]';
      case 'success':
        return 'text-[#00FF41] border-[#00FF41] bg-[#00FF41]/20 shadow-[0_0_15px_rgba(0,255,65,0.5)]';
      case 'error':
        return 'text-[#FF4444] border-[#FF4444] bg-[#FF4444]/20 shadow-[0_0_15px_rgba(255,68,68,0.5)] animate-bounce';
      case 'idle':
      default:
        return 'text-[var(--color-primary)] border-[var(--color-primary)]/20 hover:border-[var(--color-primary)] opacity-40 hover:opacity-100 bg-black/40';
    }
  };

  const handleMicToggle = () => {
    if (isListening) {
      stopVoiceControl();
    } else {
      startVoiceControl();
    }
  };

  return (
    <div className="flex items-center gap-3 select-none relative font-mono text-[10px]">
      {/* Waveform / Visualizer */}
      {isListening && analyser && (
        <div className="hidden sm:block border border-[#00FF41]/20 bg-black/50 p-1 rounded relative z-10">
          <VoiceVisualizer analyser={analyser} />
        </div>
      )}

      {/* State Message Panel */}
      {voiceState !== 'idle' && (
        <div className={`hidden md:block px-3 py-1 rounded font-bold uppercase tracking-wider select-none relative z-10 border transition-all ${
          voiceState === 'listening' ? 'text-[#00FF41] border-[#00FF41]/30 bg-black/40' :
          voiceState === 'processing' ? 'text-[#FFCC00] border-[#FFCC00]/30 bg-black/40 animate-pulse' :
          voiceState === 'success' ? 'text-[#00FF41] border-[#00FF41]/80 bg-[#00FF41]/10' :
          'text-[#FF4444] border-[#FF4444]/80 bg-[#FF4444]/10'
        }`}>
          {voiceState === 'listening' && (recognizedText || 'SPEAK COMMAND...')}
          {voiceState === 'processing' && 'ANALYZING DNA VOICE CODE...'}
          {voiceState === 'success' && 'COMMAND AUTHORIZED'}
          {voiceState === 'error' && 'VOICE PATTERN UNRECOGNIZED'}
        </div>
      )}

      {/* Microphone Toggle Button */}
      <button
        onClick={handleMicToggle}
        className={`w-9 h-9 border rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer relative z-10 ${getMicColor()}`}
        aria-label="Toggle Voice Control"
        title="Voice Control Matrix"
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
          <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
          <line x1="12" y1="19" x2="12" y2="23" />
          <line x1="8" y1="23" x2="16" y2="23" />
        </svg>
      </button>
    </div>
  );
}
export default VoiceControl;
