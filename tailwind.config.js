/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    // Lock spacing to the approved scale only (px): 8,16,24,32,48,64,96,128.
    // 0 / px / full kept for resets and edge cases.
    spacing: {
      0: '0px',
      px: '1px',
      1: '8px',
      2: '16px',
      3: '24px',
      4: '32px',
      6: '48px',
      8: '64px',
      12: '96px',
      16: '128px',
      full: '100%',
    },
    extend: {
      colors: {
        canvas: '#0B0B0D',
        surface: '#141417',
        border: 'rgba(255,255,255,0.08)',
        primary: '#FFFFFF',
        secondary: '#9A9A9F',
        accent: '#E8001D',
        positive: '#2ECC71',
      },
      fontFamily: {
        // Display: condensed technical sans. Body: Inter.
        display: ['"Barlow Condensed"', 'Archivo', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        tightest: '-0.02em',
      },
      maxWidth: {
        content: '1280px',
      },
      borderColor: {
        DEFAULT: 'rgba(255,255,255,0.08)',
      },
      transitionTimingFunction: {
        // F1 = precision. Ease-out only.
        out: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
}
