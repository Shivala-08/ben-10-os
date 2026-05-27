'use client';

import { useState, useCallback, useRef } from 'react';
import { COMMANDS, CommandResult } from '@/lib/terminal/commands';
import { parseCommand } from '@/lib/terminal/terminal-parser';
import { getCommandHistory, saveCommandHistory } from '@/lib/terminal/terminal-history';
import { useOmnitrixStore } from '@/lib/store/useOmnitrixStore';
import { useRouter } from 'next/navigation';

export interface TerminalLine {
  id: string;
  text: string;
  type: 'input' | 'output' | 'system' | 'error';
}

export function useTerminal() {
  const [lines, setLines] = useState<TerminalLine[]>([
    { id: '1', text: '⬡ OMNITRIX OS [VERSION 2.0.0] - ACTIVE BOOT SECURED', type: 'system' },
    { id: '2', text: 'DNA SPECIMEN CODES ENCRYPTED. CELLULAR LINK READY.', type: 'system' },
    { id: '3', text: 'TYPE "help" TO ACQUIRE DIRECTORY OF SYSTEM COMMANDS.', type: 'system' },
    { id: '4', text: '', type: 'output' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Zustand Store contexts
  const unlockAlien = useOmnitrixStore((state) => state.unlockAlien);
  const setActiveAlien = useOmnitrixStore((state) => state.setActiveAlien);
  const setIsTransforming = useOmnitrixStore((state) => state.setIsTransforming);

  // Command History tracking state
  const [history, setHistory] = useState<string[]>(getCommandHistory());
  const historyIndexRef = useRef<number>(-1);

  const addLine = useCallback((text: string, type: TerminalLine['type'] = 'output') => {
    const id = Math.random().toString(36).substring(2, 9) + Date.now();
    setLines((prev) => [...prev, { id, text, type }]);
  }, []);

  const historyUp = useCallback((currentInput: string): string => {
    const stored = getCommandHistory();
    if (stored.length === 0) return currentInput;

    const newIndex = historyIndexRef.current + 1;
    if (newIndex < stored.length) {
      historyIndexRef.current = newIndex;
      return stored[newIndex];
    }
    return stored[stored.length - 1] || currentInput;
  }, []);

  const historyDown = useCallback((): string => {
    const stored = getCommandHistory();
    const newIndex = historyIndexRef.current - 1;

    if (newIndex >= 0 && newIndex < stored.length) {
      historyIndexRef.current = newIndex;
      return stored[newIndex];
    }
    
    historyIndexRef.current = -1;
    return '';
  }, []);

  const executeCommand = useCallback(async (rawInput: string) => {
    const trimmed = rawInput.trim();
    if (!trimmed) return;

    // Save user's input line to the screen
    addLine(`> ${trimmed}`, 'input');
    
    // Save to local storage history
    saveCommandHistory(trimmed);
    setHistory(getCommandHistory());
    historyIndexRef.current = -1; // Reset history selector

    const { command, args } = parseCommand(trimmed);

    if (!command) return;

    setIsLoading(true);

    const commandFn = COMMANDS[command];
    if (!commandFn) {
      addLine(`ERROR: COMMAND "${command.toUpperCase()}" NOT FOUND. TYPE "help" FOR DIRECTORY.`, 'error');
      setIsLoading(false);
      return;
    }

    try {
      const result: CommandResult = await commandFn(args);

      if (result.clear) {
        setLines([]);
        setIsLoading(false);
        return;
      }

      // Add lines with staggered timing simulation
      const renderLinesStaggered = async (outputLines: string[], isError = false) => {
        for (let i = 0; i < outputLines.length; i++) {
          const line = outputLines[i];
          
          // Speed up lines depending on count to prevent severe latency
          const delay = outputLines.length > 10 ? 10 : 40;
          await new Promise((resolve) => setTimeout(resolve, delay));
          
          addLine(line, isError ? 'error' : (line.startsWith('⬡') || line.startsWith('SYSTEM') ? 'system' : 'output'));
        }
      };

      await renderLinesStaggered(result.output, result.error);

      // Trigger attached store action contexts if applicable
      if (result.action) {
        result.action({
          unlockAlien,
          setActiveAlien,
          setIsTransforming,
          router
        });
      }
    } catch (e) {
      addLine('ERROR: INTERNAL DIAGNOSTIC THREAD FAULT.', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [addLine, unlockAlien, setActiveAlien, setIsTransforming, router]);

  return {
    lines,
    isLoading,
    history,
    historyUp,
    historyDown,
    executeCommand,
    clearHistory: () => {
      setLines([]);
      historyIndexRef.current = -1;
    }
  };
}
