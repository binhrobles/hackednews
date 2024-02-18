import type { Config } from 'tailwindcss';

export default {
  content: ['./app/**/*.{ts,tsx}'],
  daisyui: {
    themes: ['business'],
  },
  theme: {
    extend: {},
  },
  plugins: [require('daisyui')],
} satisfies Config;
