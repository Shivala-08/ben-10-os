/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    // Or if using src directory:
    // "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Define your alien-themed colors here, for example:
        // 'omnitrix-heatblast-primary': '#FF4500',
        // 'omnitrix-xlr8-primary': '#00BFFF',
      },
      fontFamily: {
        // Define your fonts here, e.g.:
        // 'orbitron': ['Orbitron', 'sans-serif'],
        // 'space-grotesk': ['Space Grotesk', 'sans-serif'],
      },
      backgroundImage: {
        // Example for a default background if needed
        // 'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      animation: {
        // Add any custom animations here
      },
      // CSS variable schema from PRD
      // :root[data-alien='heatblast'] {
      //   --color-primary:     #FF4500;
      //   --color-secondary:   #FF8C00;
      //   --color-bg:          #0D0200;
      //   --color-surface:     #1A0500;
      //   --color-text:        #FFD0A0;
      //   --color-glow:        #FF6600;
      //   --particle-color:    #FF4400;
      //   --font-display:      'Orbitron', sans-serif;
      //   --cursor-url:        url('/cursors/heatblast.svg');
      //   --transition-easing: cubic-bezier(0.25, 0.46, 0.45, 0.94);
      // }
    },
  },
  plugins: [],
}
export default config
