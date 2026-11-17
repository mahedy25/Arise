import type { Config } from 'tailwindcss';
const c = (n: string) => `rgb(var(--${n}) / <alpha-value>)`;

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: { paper: c('paper'), surface: c('surface'), ink: c('ink'), muted: c('muted'), line: c('line'), accent: c('accent'), link: c('link') },
      fontFamily: {
        display: ['var(--font-display)', 'sans-serif'],
        body: ['var(--font-body)', 'sans-serif'],
        reading: ['var(--font-reading)', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
export default config;
