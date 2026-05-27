'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { parseVoiceCommand, SpokenCommand } from '@/lib/voice/command-parser';
import { useOmnitrixStore } from '@/lib/store/useOmnitrixStore';
import { useRouter } from 'next/navigation';
import { synth } from '@/lib/utils/WebAudioSynth';
import { BIG_10_NAMES } from '@/lib/api/ben10';

export type VoiceState = 'idle' | 'listening' | 'processing' | 'success' | 'error';

export function useVoiceControl() {
  const [isSupported, setIsSupported] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceState, setVoiceState] = useState<VoiceState>('idle');
  const [recognizedText, setRecognizedText] = useState('');
  
  const recognitionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);

  const router = useRouter();

  // Zustand state triggers
  const unlockAlien = useOmnitrixStore((state) => state.unlockAlien);
  const setActiveAlien = useOmnitrixStore((state) => state.setActiveAlien);
  const setIsTransforming = useOmnitrixStore((state) => state.setIsTransforming);
  const setIsMuted = useOmnitrixStore((state) => state.setIsMuted);

  // Initialize SpeechRecognition safely on client
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        setIsSupported(true);
        const rec = new SpeechRecognition();
        rec.continuous = false;
        rec.interimResults = false;
        rec.lang = 'en-US';
        recognitionRef.current = rec;
      }
    }
  }, []);

  const cleanupMic = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    setAnalyser(null);
  }, []);

  const setupMic = useCallback(async () => {
    try {
      cleanupMic();
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      streamRef.current = stream;

      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const audioCtx = new AudioCtx();
      audioContextRef.current = audioCtx;

      const source = audioCtx.createMediaStreamSource(stream);
      const analyserNode = audioCtx.createAnalyser();
      analyserNode.fftSize = 64;

      source.connect(analyserNode);
      setAnalyser(analyserNode);
    } catch (e) {
      console.warn('Microphone capture blocked or unsupported.', e);
    }
  }, [cleanupMic]);

  const executeAction = useCallback((cmd: SpokenCommand) => {
    setVoiceState('processing');
    
    setTimeout(() => {
      switch (cmd.type) {
        case 'activate': {
          const target = cmd.payload || '';
          // Search big 10 or api mappings
          const matched = BIG_10_NAMES.find(
            (name) => name.toLowerCase().replace(' ', '_') === target || name.toLowerCase() === target
          );

          if (matched) {
            const formatted = matched.toLowerCase().replace(' ', '_');
            setVoiceState('success');
            synth.playTransform();
            setIsTransforming(true);
            unlockAlien(formatted);
            
            setTimeout(() => {
              setActiveAlien(formatted);
              setIsTransforming(false);
              router.push(`/alien/${formatted}`);
            }, 600);
          } else {
            // Unrecognized alien
            setVoiceState('error');
            synth.playAccessDenied();
          }
          break;
        }

        case 'random': {
          setVoiceState('success');
          synth.playTransform();
          setIsTransforming(true);
          const randIndex = Math.floor(Math.random() * BIG_10_NAMES.length);
          const randName = BIG_10_NAMES[randIndex];
          const formatted = randName.toLowerCase().replace(' ', '_');
          unlockAlien(formatted);
          
          setTimeout(() => {
            setActiveAlien(formatted);
            setIsTransforming(false);
            router.push(`/alien/${formatted}`);
          }, 600);
          break;
        }

        case 'abilities': {
          setVoiceState('success');
          synth.playClick();
          // Scroll window toabilities grid
          window.scrollTo({
            top: window.innerHeight * 0.9,
            behavior: 'smooth'
          });
          break;
        }

        case 'wheel': {
          setVoiceState('success');
          synth.playClick();
          setActiveAlien(null);
          router.push('/');
          break;
        }

        case 'mute':
          setVoiceState('success');
          setIsMuted(true);
          synth.playClick();
          break;

        case 'unmute':
          setVoiceState('success');
          setIsMuted(false);
          synth.playClick();
          break;

        case 'unknown':
        default:
          setVoiceState('error');
          synth.playAccessDenied();
          break;
      }

      // Reset back to idle after 2.5 seconds
      setTimeout(() => {
        setVoiceState('idle');
        setRecognizedText('');
      }, 2500);
    }, 1200); // 1.2s analysis simulation delay
  }, [unlockAlien, setActiveAlien, setIsTransforming, setIsMuted, router]);

  const startVoiceControl = useCallback(async () => {
    if (!isSupported || !recognitionRef.current || isListening) return;

    try {
      setVoiceState('listening');
      setIsListening(true);
      setRecognizedText('SPEAK NOW...');
      synth.playClick();

      await setupMic();

      const rec = recognitionRef.current;

      rec.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        setRecognizedText(text.toUpperCase());
        const command = parseVoiceCommand(text);
        executeAction(command);
      };

      rec.onerror = () => {
        setVoiceState('error');
        synth.playAccessDenied();
        setIsListening(false);
        cleanupMic();
        setTimeout(() => setVoiceState('idle'), 2500);
      };

      rec.onend = () => {
        setIsListening(false);
        cleanupMic();
      };

      rec.start();
    } catch (e) {
      setIsListening(false);
      cleanupMic();
    }
  }, [isSupported, isListening, setupMic, cleanupMic, executeAction]);

  const stopVoiceControl = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
    cleanupMic();
    setVoiceState('idle');
  }, [isListening, cleanupMic]);

  // Cleanup mic capture and recognitions on unmount
  useEffect(() => {
    return () => {
      cleanupMic();
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {}
      }
    };
  }, [cleanupMic]);

  return {
    isSupported,
    isListening,
    voiceState,
    recognizedText,
    analyser,
    startVoiceControl,
    stopVoiceControl
  };
}
export default useVoiceControl;
