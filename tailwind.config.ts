import type { Config } from 'tailwindcss';
import plugin from 'tailwindcss/plugin';

export default {
  content: ['./app/**/*.{ts,tsx}'],
  daisyui: {
    themes: ['business'],
  },
  plugins: [
    require('daisyui'),
    plugin(({ addVariant }) => {
      addVariant('cp', '&::-webkit-calendar-picker-indicator');
    }),
  ],
} satisfies Config;
