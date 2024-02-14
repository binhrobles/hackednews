import type { Config } from 'tailwindcss';

export default {
  content: ['./app/**/*.{ts,tsx}'],
  daisyui: {
    themes: [
      {
        hackernews: {
          primary: '#ff6600',
          secondary: '#f6f6ef',
          accent: '#828282',
          'base-100': '#ffffff',
        },
      },
    ],
  },
  theme: {
    extend: {},
  },
  plugins: [require('daisyui')],
} satisfies Config;
