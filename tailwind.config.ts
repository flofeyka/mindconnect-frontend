import type { Config } from "tailwindcss";
import { nextui } from '@nextui-org/react';

const config: Config = {
  content: [

    "./src/app/**/*.{ts,tsx,mdx}",
    "./src/components/**/*.{ts,tsx,mdx}",
    "./src/containers/**/*.{ts,tsx,mdx}",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      backgroundColor: {
        secondary: 'rgba(255, 255, 255, 0.1)'
      },
      borderColor: {
        separator: 'rgba(255, 255, 255, 0.05)',
        separatorHigh: 'rgba(255, 255, 255, 0.3)',
      },
      transitionDuration: {
        DEFAULT: '300ms',
      },
    },
  },
  darkMode: "class",
  plugins: [nextui({
    themes: {
      dark: {
        colors: {
          primary: '#1CA66F'
        }
      }
    }
  })]
}; 

export default config;
