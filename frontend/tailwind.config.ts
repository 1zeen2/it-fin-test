import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      screens: {
        laptop: { max: '1365px' },
        tablet: { max: '1152px' },
        mobile: { max: '768px' },
      },
    },
  },
};

export default config;
