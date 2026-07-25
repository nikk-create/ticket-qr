/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#122420',
        sand: '#F7F2E7',
        'sand-dim': '#EFE7D6',
        stub: '#DCD2BC',
        teal: {
          50: '#EAF3F1',
          100: '#CFE4DF',
          300: '#6FA79C',
          500: '#1E8272',
          700: '#146357',
          900: '#0B4F47',
          950: '#07332E',
        },
        amber: {
          400: '#EFB959',
          500: '#E2A63B',
          600: '#C48A25',
        },
        rust: {
          500: '#C0553A',
        },
      },
      fontFamily: {
        display: ['"Fraunces"', 'ui-serif', 'Georgia', 'serif'],
        body: ['"Inter"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.5rem',
      },
      boxShadow: {
        card: '0 1px 2px rgba(11,79,71,0.06), 0 8px 24px -12px rgba(11,79,71,0.25)',
        stub: '0 12px 40px -16px rgba(11,79,71,0.45)',
      },
      backgroundImage: {
        'perf-h': 'radial-gradient(circle, var(--tw-perf-color, #F7F2E7) 3.5px, transparent 3.6px)',
      },
    },
  },
  plugins: [],
}
