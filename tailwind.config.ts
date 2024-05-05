import type { Config } from 'tailwindcss';

import defaultTheme from 'tailwindcss/defaultTheme';

export default {
  content: ['./app/**/*.{js,jsx,ts,tsx}'],
  theme: {
    fontFamily: {
      sans: ['Questrial', ...defaultTheme.fontFamily.sans],
    },
    extend: {
      colors: {
        'theme-blue': '#2F4858',
        'theme-tan': '#f8e4c7',
        'theme-orange': '#fb5416',
        'theme-burgundy': '#400215',
        'theme-brown': '#905942',
      },
    },
  },
  plugins: [],
} satisfies Config;
