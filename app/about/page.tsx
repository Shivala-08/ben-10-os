'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { synth } from '@/lib/utils/WebAudioSynth';

export default function AboutCaseStudy() {
  const handleNavClick = () => {
    synth.playClick();
  };

  return (
    <main className="min-h-screen bg-black text-[#00FF41] font-mono p-6 md:p-12 relative overflow-x-hidden selection:bg-[#00FF41]/20 selection:text-white">
      {/* High-Tech CRT Scanlines overlay */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.3)_50%)] bg-[size:100%_4px] pointer-events-none z-40 opacity-70" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,#000_90%)] pointer-events-none z-40" />

      {/* Cybernetic grid overlay */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(0,255,65,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,65,0.03)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none z-0" />

      <div className="max-w-4xl mx-auto space-y-12 relative z-10 pt-20 pb-16">
        {/* Navigation back */}
        <div className="select-none">
          <Link
            href="/"
            onClick={handleNavClick}
            className="inline-flex items-center gap-2 border border-[#00FF41]/30 hover:border-[#00FF41] bg-black/40 hover:bg-[#00FF41]/10 px-4 py-2 rounded text-[10px] uppercase font-bold tracking-widest text-[#00FF41] hover:text-white transition-all shadow-[0_0_10px_rgba(0,255,65,0.1)]"
          >
            <span>&larr;</span> RE-ALIGN OMNITRIX DIAL
          </Link>
        </div>

        {/* Dynamic Title Block */}
        <div className="border border-[#00FF41]/40 rounded-md p-6 bg-black/80 shadow-[0_0_20px_rgba(0,255,65,0.15)] relative overflow-hidden select-none">
          <div className="absolute top-0 right-0 w-24 h-24 border-t border-r border-[#00FF41]/50 rounded-tr-md" />
          <div className="absolute bottom-0 left-0 w-24 h-24 border-b border-l border-[#00FF41]/50 rounded-bl-md" />
          
          <h1 className="text-3xl md:text-5xl font-display font-black tracking-widest uppercase mb-3 drop-shadow-[0_0_12px_rgba(0,255,65,0.7)]">
            ⬡ OMNITRIX_SYSTEM_REPORT
          </h1>
          <p className="text-[#00FF41]/60 text-[11px] uppercase tracking-widest leading-relaxed">
            POST-LAUNCH STACK REVIEW &bull; RE-ENGINEERING DIAGNOSTICS &bull; ARCHITECTURAL SCHEMATICS
          </p>
        </div>

        {/* Section 1: Core Stack Overview */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 border-b border-[#00FF41]/20 pb-2">
            <span className="w-2 h-2 rounded-full bg-[#00FF41] animate-pulse" />
            <h2 className="text-sm font-bold uppercase tracking-widest text-white">01 / SYSTEM_ARCHITECTURE</h2>
          </div>

          <p className="text-white/80 text-xs md:text-sm leading-relaxed">
            OmnitrixOS v2.0 is designed as a standalone digital replication of the classic Ben 10 watch interface. Built on a modular, decentralized React architecture, it establishes asynchronous data connections to external biometrics and maps reactive 3D spaces into traditional layouts.
          </p>

          {/* Stack Table */}
          <div className="border border-[#00FF41]/20 rounded overflow-x-auto bg-black/60 shadow-[0_0_15px_rgba(0,255,65,0.05)]">
            <table className="w-full text-left text-[11px] leading-relaxed">
              <thead className="bg-[#00FF41]/10 text-[#00FF41] border-b border-[#00FF41]/20 uppercase tracking-widest font-bold">
                <tr>
                  <th className="p-3">MATRIX COMPONENT</th>
                  <th className="p-3">TECHNOLOGY</th>
                  <th className="p-3">OPERATIONAL PURPOSE</th>
                </tr>
              </thead>
              <tbody className="text-white/90 divide-y divide-[#00FF41]/10 uppercase">
                <tr>
                  <td className="p-3 font-semibold text-[#00FF41]">APPLICATION CORE</td>
                  <td className="p-3">NEXT.JS 16 (APP ROUTER)</td>
                  <td className="p-3">DYNAMIC ENGINE & METADATA INJECTION</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-[#00FF41]">3D RENDER SPACE</td>
                  <td className="p-3">REACT THREE FIBER & THREE.JS</td>
                  <td className="p-3">GL GRAPHICS CARTOGRAPHY & DIAL</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-[#00FF41]">INTERACTION CONTROLS</td>
                  <td className="p-3">GSAP & FRAMER MOTION</td>
                  <td className="p-3">DOLLY DECAY & INTERTIAL DRAGGING</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-[#00FF41]">BIOMETRIC STATE</td>
                  <td className="p-3">ZUSTAND</td>
                  <td className="p-3">DECENTRALISED MATRIX PROFILE STATE</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-[#00FF41]">NETWORK DATAFEED</td>
                  <td className="p-3">TANSTACK QUERY (V5)</td>
                  <td className="p-3">ASYNCHRONOUS DNA DECK PREFETCH</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-[#00FF41]">AURAL TEXTURE</td>
                  <td className="p-3">HOWLER.JS & AUDIO CONTEXT</td>
                  <td className="p-3">BIOPHONIC SOUND OSCILLATIONS</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 2: 3D Dial Mechanics */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 border-b border-[#00FF41]/20 pb-2">
            <span className="w-2 h-2 rounded-full bg-[#00FF41] animate-pulse" />
            <h2 className="text-sm font-bold uppercase tracking-widest text-white">02 / 3D_DIAL_GEOMETRICS</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-[#00FF41]/20 rounded p-5 bg-black/60 space-y-3">
              <h3 className="text-white text-xs font-bold uppercase tracking-wider border-b border-[#00FF41]/10 pb-1.5 flex justify-between">
                <span>ANGULAR MATRIX</span>
                <span className="text-[#00FF41]">&theta; = 2&pi; / 10</span>
              </h3>
              <p className="text-white/70 text-[11px] leading-relaxed">
                The watch dial features 10 dynamic cartridges spaced precisely at 36&deg; radial offsets. Rotational positions are captured through continuous dragging deltas.
              </p>
              <div className="text-[10px] text-[#00FF41]/80 font-bold bg-[#00FF41]/5 p-2 rounded border border-[#00FF41]/10">
                ACTIVE RADIAN STEP = 0.628318 RADIANS
              </div>
            </div>

            <div className="border border-[#00FF41]/20 rounded p-5 bg-black/60 space-y-3">
              <h3 className="text-white text-xs font-bold uppercase tracking-wider border-b border-[#00FF41]/10 pb-1.5 flex justify-between">
                <span>CINEMATIC PIPELINE</span>
                <span className="text-[#00FF41]">BLOOM.FX</span>
              </h3>
              <p className="text-white/70 text-[11px] leading-relaxed">
                Render quality is achieved using WebGL postprocessing pipelines: high-intensity Bloom filters glow emissive materials, screensaver static adds film grain, and Chromatic Aberration spikes during mutation.
              </p>
              <div className="text-[10px] text-[#00FF41]/80 font-bold bg-[#00FF41]/5 p-2 rounded border border-[#00FF41]/10">
                BLOOM INTENSITY = 1.50 // SHIFT RE-FLUID
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Engineering Features */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 border-b border-[#00FF41]/20 pb-2">
            <span className="w-2 h-2 rounded-full bg-[#00FF41] animate-pulse" />
            <h2 className="text-sm font-bold uppercase tracking-widest text-white">03 / CODES_&_DIAGNOSTICS</h2>
          </div>

          <p className="text-white/80 text-xs md:text-sm leading-relaxed">
            Several innovative subsystems enrich the user experience, transforming the site from a simple portfolio showcase into a living simulation.
          </p>

          <div className="space-y-4">
            <div className="border border-[#00FF41]/20 hover:border-[#00FF41]/50 rounded-md p-5 bg-black/70 transition-all">
              <h3 className="text-[#00FF41] text-xs font-bold uppercase tracking-wider mb-2">
                &bull; DNA SPEECH PARSER (VOICE INTERFACE)
              </h3>
              <p className="text-white/75 text-[11px] leading-relaxed">
                Utilizes the native browser **Web Speech API** to construct a real-time speech processing pipeline. Once activated, raw transcripts are scrutinized for commands like `&quot;activate heatblast&quot;` or `&quot;random alien&quot;` to execute high-energy transitions directly.
              </p>
            </div>

            <div className="border border-[#00FF41]/20 hover:border-[#00FF41]/50 rounded-md p-5 bg-black/70 transition-all">
              <h3 className="text-[#00FF41] text-xs font-bold uppercase tracking-wider mb-2">
                &bull; OMNITRIX SHELL DICTIONARY (TERMINAL)
              </h3>
              <p className="text-white/75 text-[11px] leading-relaxed">
                A command-line terminal simulation (`/terminal`) enabling system overrides. Commands include `activate [slug]`, `scan`, `stats`, `history`, `fusion`, and the override `unlock all` which bypasses locked sequences. Console outputs scroll with realistic typewriter speeds.
              </p>
            </div>

            <div className="border border-[#00FF41]/20 hover:border-[#00FF41]/50 rounded-md p-5 bg-black/70 transition-all">
              <h3 className="text-[#00FF41] text-xs font-bold uppercase tracking-wider mb-2">
                &bull; DYNAMIC CACHING & OFFLINE PWA CAPABILITY
              </h3>
              <p className="text-white/75 text-[11px] leading-relaxed">
                PWA setup using standard browser Service Worker APIs caching large media and sound files. Dynamic deep-link navigation routes (`/alien/[slug]`) static prerenders matching DNA slots. This ensures immediate load times on mobile, fully operational offline.
              </p>
            </div>
          </div>
        </section>

        {/* Footer info */}
        <div className="border-t border-[#00FF41]/20 pt-6 flex flex-col md:flex-row justify-between items-center text-[10px] text-[#00FF41]/40 gap-4 select-none">
          <span>OMNITRIX OS CASE STUDY // DEVELOPED UNDER SECURE DIRECTIVES</span>
          <span>SYSTEM TIME: {new Date().toLocaleDateString()} SECURED</span>
        </div>
      </div>
    </main>
  );
}
