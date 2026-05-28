# ⬡ Omnitrix OS — Version 2.0

An immersive, high-fidelity interactive digital replication of the classic Ben 10 watch interface. Deployed live as a premium Next.js 16 WebGL experience.

---

## 🚀 Key Features

### 1. Cinematic Visual Polish (WebGL & Three.js)
- **Cinematic Bloom Filter**: Postprocessing pipeline using `@react-three/postprocessing` that drives emissive light glows.
- **Chromatic Aberration**: Visual screen distortion spikes triggered automatically during dynamic mutations.
- **Micro-Breathing Animations**: Continuous organic wobbles and GSAP-staggered UI shimmers keep interface elements alive.
- **Tactile Drag Dial**: Fully interactive 3D dial with rotational velocity decay and spring snapping alignment.

### 2. Audio & Aural Feedback
- **Aural Oscillation Synth**: Sound effects manager built with `Howler.js` to play mechanical clicks, transformation hums, error buzzes, and diagnostic ambient noise.

### 3. Voice Control Matrix
- **Speech Command Shell**: Native **Web Speech API** integration enabling hands-free system commands (e.g. `activate heatblast`, `random alien`, `mute matrix`).
- **Dynamic Waveform**: Rendered using HTML5 canvas connecting directly to browser microphone analyser frequencies.

### 4. Interactive Consoles & HUD Panels
- **DNA Codex**: Real-time holographic filter grid displaying 62 species with detail sliders and search metrics.
- **Signal Radar**: Canvas-rendered radial grid scanner that periodically spots atmospheric bio-strands.
- **DNA Fusion Lab**: An interactive mixing grid to drag two cards and fuse species names, abilities, and palette gradients.
- **Chrono Clock**: Working analog clock mapped onto 12-hour slots with full mechanical spinning overlays on the hour.
- **Metamorphic Logs & Stats**: Session stats tracking total mutations, favorites, and time-lapse history stored in localStorage.
- **Konami Code Exploits**: Typing standard sequence triggers absolute system malfunctions with visual screen shakes.

### 5. Offline Installable PWA Support
- **Standalone Mode**: Configured high-fidelity vector manifest properties for standalone mobile launch.
- **Dynamic Caching**: Service worker managing aggressive cache-first policies for audio feeds and fonts to enable complete offline access.

---

## 🛠️ Technical Stack Specs

| Component | Technology |
| :--- | :--- |
| **Framework Engine** | Next.js 16 (App Router) & React 19 |
| **3D Rendering** | Three.js & React Three Fiber (R3F) |
| **Motion Physics** | GSAP & Framer Motion |
| **State Deck** | Zustand |
| **Network Query** | TanStack Query v5 |
| **Sound System** | Howler.js |

---

## 🛠️ Getting Started

### 1. Installation
Install project dependencies:
```bash
npm install
```

### 2. Run the Development Server
Run the Turbopack hot-reload compiler locally:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the digital database.

### 3. Compile Production Bundle
Verify TypeScript validation and export static assets:
```bash
npm run build
```

---

## 🧬 Diagnostic Documentation
To review deep architectural blueprints, trigonometric layout specifications, and lazy-loading optimizations, navigate to the `/about` route (accessible via the navbar **SYS_REPORT** button).
