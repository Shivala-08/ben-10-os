'use client';

class WebAudioSynth {
  private ctx: AudioContext | null = null;
  private ambientOscs: (OscillatorNode | BiquadFilterNode | GainNode)[] = [];
  private ambientGain: GainNode | null = null;
  private masterGain: GainNode | null = null;
  private isMuted: boolean = false;
  private ambientInterval: NodeJS.Timeout | null = null;

  constructor() {
    // Audio Context is initialized lazily on user gesture
  }

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.8, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMute(muted: boolean) {
    this.isMuted = muted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(muted ? 0 : 0.8, this.ctx.currentTime, 0.1);
    }
  }

  // Play a quick sci-fi mechanical click
  public playClick() {
    this.initCtx();
    if (!this.ctx || this.isMuted) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.connect(gain);
    gain.connect(this.masterGain || this.ctx.destination);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(120, this.ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.08);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.09);
  }

  // Play an epic alien transformation frequency sweep with explosion noise
  public playTransform() {
    this.initCtx();
    if (!this.ctx || this.isMuted) return;

    const time = this.ctx.currentTime;

    // Synthesizer frequency sweep
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(60, time);
    osc1.frequency.exponentialRampToValueAtTime(1800, time + 0.6);

    osc2.type = 'square';
    osc2.frequency.setValueAtTime(63, time);
    osc2.frequency.exponentialRampToValueAtTime(1810, time + 0.6);

    filter.type = 'peaking';
    filter.frequency.setValueAtTime(100, time);
    filter.frequency.exponentialRampToValueAtTime(2500, time + 0.6);
    filter.Q.setValueAtTime(10, time);

    gain.gain.setValueAtTime(0.01, time);
    gain.gain.linearRampToValueAtTime(0.4, time + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.01, time + 0.8);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain || this.ctx.destination);

    osc1.start(time);
    osc2.start(time);
    osc1.stop(time + 0.8);
    osc2.stop(time + 0.8);

    // Dynamic White Noise explosion burst
    try {
      const bufferSize = this.ctx.sampleRate * 1.0; // 1 second buffer
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noiseNode = this.ctx.createBufferSource();
      noiseNode.buffer = buffer;

      const noiseFilter = this.ctx.createBiquadFilter();
      noiseFilter.type = 'lowpass';
      noiseFilter.frequency.setValueAtTime(1000, time);
      noiseFilter.frequency.exponentialRampToValueAtTime(80, time + 0.8);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.3, time);
      noiseGain.gain.exponentialRampToValueAtTime(0.01, time + 0.8);

      noiseNode.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(this.masterGain || this.ctx.destination);

      noiseNode.start(time);
      noiseNode.stop(time + 0.85);
    } catch (e) {
      console.warn('Procedural white noise not supported in this environment.', e);
    }
  }

  // Stop current ambient loops
  public stopAmbient() {
    if (this.ambientInterval) {
      clearInterval(this.ambientInterval);
      this.ambientInterval = null;
    }
    
    const time = this.ctx ? this.ctx.currentTime : 0;
    if (this.ambientGain && this.ctx) {
      this.ambientGain.gain.setTargetAtTime(0, time, 0.2);
    }

    setTimeout(() => {
      this.ambientOscs.forEach(node => {
        try {
          (node as any).stop();
        } catch(e) {}
      });
      this.ambientOscs = [];
    }, 3000);
  }

  // Play themed ambient loops
  public playAmbient(alienId: string) {
    this.initCtx();
    this.stopAmbient();
    
    if (!this.ctx || this.isMuted) return;
    const time = this.ctx.currentTime;

    // Create a dedicated ambient gain node
    this.ambientGain = this.ctx.createGain();
    this.ambientGain.gain.setValueAtTime(0.01, time);
    this.ambientGain.gain.linearRampToValueAtTime(0.2, time + 1.0);
    this.ambientGain.connect(this.masterGain || this.ctx.destination);

    // Deep rhythmic background hum (base carrier)
    const subOsc1 = this.ctx.createOscillator();
    subOsc1.type = 'sine';
    subOsc1.frequency.setValueAtTime(55, time); // A1 note
    
    const subOsc2 = this.ctx.createOscillator();
    subOsc2.type = 'sine';
    subOsc2.frequency.setValueAtTime(55.6, time); // detuned sine

    const lowpass = this.ctx.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.setValueAtTime(100, time);

    subOsc1.connect(lowpass);
    subOsc2.connect(lowpass);
    lowpass.connect(this.ambientGain);

    subOsc1.start(time);
    subOsc2.start(time);

    this.ambientOscs.push(subOsc1, subOsc2, lowpass);

    // Alien specific synthesized textures
    if (alienId === 'heatblast') {
      // Fire crackle noise bursts
      this.ambientInterval = setInterval(() => {
        if (!this.ctx || this.isMuted) return;
        const clickTime = this.ctx.currentTime;
        const clickOsc = this.ctx.createOscillator();
        const clickGain = this.ctx.createGain();
        clickOsc.type = 'triangle';
        clickOsc.frequency.setValueAtTime(20 + Math.random() * 50, clickTime);
        clickGain.gain.setValueAtTime(0.05 + Math.random() * 0.1, clickTime);
        clickGain.gain.exponentialRampToValueAtTime(0.001, clickTime + 0.05);

        clickOsc.connect(clickGain);
        clickGain.connect(this.ambientGain!);
        clickOsc.start(clickTime);
        clickOsc.stop(clickTime + 0.06);
      }, 150);
    } else if (alienId === 'xlr8') {
      // Fast static charging pulses
      this.ambientInterval = setInterval(() => {
        if (!this.ctx || this.isMuted) return;
        const tickTime = this.ctx.currentTime;
        const tickOsc = this.ctx.createOscillator();
        const tickGain = this.ctx.createGain();
        tickOsc.type = 'sawtooth';
        tickOsc.frequency.setValueAtTime(300 + Math.random() * 800, tickTime);
        tickGain.gain.setValueAtTime(0.03, tickTime);
        tickGain.gain.exponentialRampToValueAtTime(0.001, tickTime + 0.02);

        tickOsc.connect(tickGain);
        tickGain.connect(this.ambientGain!);
        tickOsc.start(tickTime);
        tickOsc.stop(tickTime + 0.03);
      }, 80);
    } else if (alienId === 'upgrade') {
      // Digital computer cybernetic glitches
      this.ambientInterval = setInterval(() => {
        if (!this.ctx || this.isMuted) return;
        const tickTime = this.ctx.currentTime;
        const tickOsc = this.ctx.createOscillator();
        const tickGain = this.ctx.createGain();
        tickOsc.type = 'square';
        tickOsc.frequency.setValueAtTime(1000 + Math.random() * 3000, tickTime);
        tickGain.gain.setValueAtTime(0.02, tickTime);
        tickGain.gain.exponentialRampToValueAtTime(0.001, tickTime + 0.06);

        tickOsc.connect(tickGain);
        tickGain.connect(this.ambientGain!);
        tickOsc.start(tickTime);
        tickOsc.stop(tickTime + 0.07);
      }, 250);
    } else if (alienId === 'ghostfreak') {
      // Eerie, sweeping detuned chorus
      const ghOsc = this.ctx.createOscillator();
      ghOsc.type = 'triangle';
      ghOsc.frequency.setValueAtTime(110, time);
      
      const lfo = this.ctx.createOscillator();
      lfo.frequency.setValueAtTime(1.5, time); // 1.5 Hz frequency sweep
      const lfoGain = this.ctx.createGain();
      lfoGain.gain.setValueAtTime(12, time); // swing pitch by 12Hz

      lfo.connect(lfoGain);
      lfoGain.connect(ghOsc.frequency);
      ghOsc.connect(this.ambientGain);

      lfo.start(time);
      ghOsc.start(time);
      this.ambientOscs.push(ghOsc, lfo, lfoGain);
    } else if (alienId === 'ripjaws') {
      // Under-water bubbling drops
      this.ambientInterval = setInterval(() => {
        if (!this.ctx || this.isMuted) return;
        const bubbleTime = this.ctx.currentTime;
        const bubOsc = this.ctx.createOscillator();
        const bubGain = this.ctx.createGain();
        
        bubOsc.type = 'sine';
        bubOsc.frequency.setValueAtTime(150 + Math.random() * 300, bubbleTime);
        bubOsc.frequency.exponentialRampToValueAtTime(600 + Math.random() * 400, bubbleTime + 0.12);
        
        bubGain.gain.setValueAtTime(0.08, bubbleTime);
        bubGain.gain.exponentialRampToValueAtTime(0.001, bubbleTime + 0.12);

        bubOsc.connect(bubGain);
        bubGain.connect(this.ambientGain!);
        bubOsc.start(bubbleTime);
        bubOsc.stop(bubbleTime + 0.13);
      }, 350);
    }
  }
}

// Export singleton instance
export const synth = new WebAudioSynth();
export default synth;
