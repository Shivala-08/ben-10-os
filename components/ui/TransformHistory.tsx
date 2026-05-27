'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getHistory, HistoryLog } from '@/lib/utils/history';
import { synth } from '@/lib/utils/WebAudioSynth';

export function TransformHistory() {
  const [isOpen, setIsOpen] = useState(false);
  const [logs, setLogs] = useState<HistoryLog[]>([]);

  const fetchLogs = () => {
    setLogs(getHistory());
  };

  useEffect(() => {
    fetchLogs();
    // Listen for custom history update events
    window.addEventListener('omnitrix_history_updated', fetchLogs);
    return () => {
      window.removeEventListener('omnitrix_history_updated', fetchLogs);
    };
  }, []);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
    synth.playClick();
  };

  const handleClear = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('omnitrix_history');
      synth.playAccessDenied();
      fetchLogs();
    }
  };

  const formatDuration = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s}s`;
  };

  const formatTimestamp = (ts: number) => {
    const d = new Date(ts);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
  };

  return (
    <>
      {/* Floating high-tech clock icon button at bottom-right */}
      <div className="fixed bottom-24 right-8 z-40 pointer-events-auto">
        <button
          onClick={toggleOpen}
          aria-label="Toggle Transformation Logs"
          className="group relative w-12 h-12 bg-black/80 hover:bg-black border border-[#00FF41]/40 hover:border-[#00FF41] rounded-full flex items-center justify-center transition-all duration-300 shadow-[0_0_15px_rgba(0,255,65,0.15)] hover:shadow-[0_0_20px_rgba(0,255,65,0.4)]"
        >
          {/* Scanning circular indicator ring */}
          <div className="absolute inset-0.5 rounded-full border border-dashed border-[#00FF41]/20 group-hover:animate-[spin_8s_linear_infinite]" />
          
          {/* Monospace Clock Icon */}
          <span className="font-mono text-[#00FF41] text-xs font-bold tracking-tighter group-hover:scale-115 transition-transform duration-200">
            LOGS
          </span>
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Dark translucent backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleOpen}
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-[1px] pointer-events-auto"
            />

            {/* Sliding Framer-Motion side-drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 24, stiffness: 220 }}
              className="fixed top-0 right-0 h-full w-full max-w-sm z-50 bg-black/95 border-l border-[#00FF41]/30 text-white font-mono flex flex-col p-6 shadow-[-10px_0_30px_rgba(0,255,65,0.1)] pointer-events-auto backdrop-blur-md"
            >
              {/* Scanline CRT simulation */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_4px,6px_100%] pointer-events-none" />

              {/* Title Header */}
              <div className="border-b border-[#00FF41]/30 pb-4 mb-4 select-none relative">
                <div className="flex justify-between items-center">
                  <h2 className="text-[#00FF41] text-lg font-bold tracking-widest uppercase flex items-center gap-2">
                    <span className="animate-pulse">⬡</span> SYSTEM LOGS
                  </h2>
                  <button
                    onClick={toggleOpen}
                    className="text-[#00FF41]/60 hover:text-[#00FF41] text-sm tracking-wider uppercase transition-colors"
                  >
                    [CLOSE]
                  </button>
                </div>
                <div className="text-[9px] text-[#00FF41]/40 uppercase tracking-widest mt-1">
                  Chronological Transformation Database
                </div>
              </div>

              {/* Log List Scroll Area */}
              <div className="flex-1 overflow-y-auto space-y-2.5 pr-2 custom-scrollbar relative">
                {logs.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center text-[#00FF41]/30 uppercase text-[10px] tracking-widest py-12 select-none">
                    <span>NO SYSTEM ENTRIES FOUND</span>
                    <span className="text-[8px] mt-1 text-[#00FF41]/20">Awaiting initial biometric sequence...</span>
                  </div>
                ) : (
                  logs.map((log, index) => (
                    <motion.div
                      key={log.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: Math.min(index * 0.05, 0.4) }}
                      className="border border-[#00FF41]/20 bg-black/40 hover:bg-[#00FF41]/5 p-3 rounded flex flex-col gap-1 transition-colors group select-none"
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-[#00FF41] font-bold text-xs uppercase tracking-wider group-hover:text-white transition-colors">
                          {log.alienName}
                        </span>
                        <span className="text-[10px] text-white/50 bg-[#00FF41]/10 px-1.5 py-0.5 rounded border border-[#00FF41]/10 font-bold">
                          {formatDuration(log.duration)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-[9px] text-[#00FF41]/40 font-semibold uppercase mt-0.5">
                        <span>SYS_ID: {log.id.slice(0, 8)}</span>
                        <span>{formatTimestamp(log.timestamp)}</span>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>

              {/* Clear Button Footer */}
              {logs.length > 0 && (
                <div className="border-t border-[#00FF41]/20 pt-4 mt-4 select-none">
                  <button
                    onClick={handleClear}
                    className="w-full py-2 bg-red-950/40 hover:bg-red-900/50 border border-red-500/40 hover:border-red-500 rounded text-red-400 font-bold uppercase tracking-widest text-[10px] text-center transition-all duration-300 hover:shadow-[0_0_15px_rgba(239,68,68,0.2)]"
                  >
                    PURGE TRANSACTION LOGS
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
