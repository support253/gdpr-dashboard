import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        sand: { 50: '#FAF8F5', 100: '#F5F0EB', 200: '#E8E2DA', 300: '#D4CBC0' },
        risk: {
          high: '#C44332',
          medium: '#C47832',
          low: '#5B7C3A',
        },
        accent: '#3A5F7C',
        muted: '#8B8178',
      },
      fontFamily: {
        heading: ['Newsreader', 'Georgia', 'serif'],
        body: ['DM Sans', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
