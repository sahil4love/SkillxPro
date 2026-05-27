/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: '#F1F3F4', // Light Grey Google base
        bg2: '#FFFFFF', // Pure White Google card/surface base
        textPrimary: '#202124', // Google Dark Black
        textSecondary: '#5F6368', // Google Grey Text
        textTertiary: '#9AA0A6', // Google Light Grey Text
        
        // M3 Design System Tokens from Stitch
        surface: '#faf9fd',
        'surface-dim': '#dbd9dd',
        'surface-bright': '#faf9fd',
        'surface-container-lowest': '#ffffff',
        'surface-container-low': '#f4f3f7',
        'surface-container': '#efedf1',
        'surface-container-high': '#e9e7eb',
        'surface-container-highest': '#e3e2e6',
        'on-surface': '#1a1b1e',
        'on-surface-variant': '#424753',
        outline: '#727785',
        'outline-variant': '#c2c6d5',
        'primary-fixed': '#d8e2ff',
        'primary-fixed-dim': '#adc6ff',
        'on-primary-fixed': '#001a41',
        'on-primary-fixed-variant': '#004494',
        'secondary-fixed': '#89fa9b',
        'secondary-fixed-dim': '#6ddd81',
        'on-secondary-fixed': '#002108',
        'on-secondary-fixed-variant': '#005320',
        'tertiary-fixed': '#ffdfa0',
        'tertiary-fixed-dim': '#fbbc05',
        'on-tertiary-fixed': '#261a00',
        'on-tertiary-fixed-variant': '#5c4300',

        // Google Core Palette (Blue, Green, Red, Yellow)
        primary: {
          DEFAULT: '#4285F4', // Google Medium Blue
          dark: '#174EA6', // Google Dark Blue
          light: '#D2E3FC', // Google Light Blue
        },
        accent: {
          DEFAULT: '#34A853', // Google Medium Green
          dark: '#0D652D', // Google Dark Green
          light: '#CEEAD6', // Google Light Green
        },
        warning: {
          DEFAULT: '#FBBC04', // Google Yellow
          dark: '#E37400', // Google Dark Orange
          light: '#FEEFC3', // Google Light Yellow
        },
        danger: {
          DEFAULT: '#EA4335', // Google Medium Red
          dark: '#A50E0E', // Google Dark Red
          light: '#FAD2CF', // Google Light Red
        },
      },
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
      },
      boxShadow: {
        // Material Design 3 elevation models
        elevation1: '0 1px 2px 0 rgba(60,64,67,0.3), 0 1px 3px 1px rgba(60,64,67,0.15)',
        elevation2: '0 1px 3px 0 rgba(60,64,67,0.3), 0 4px 8px 3px rgba(60,64,67,0.15)',
        elevation3: '0 4px 8px 3px rgba(60,64,67,0.15), 0 12px 15px 6px rgba(60,64,67,0.1)',
        googleFocus: '0 0 0 3px rgba(66, 133, 244, 0.45)',
        micro: '0 1px 3px rgba(0,0,0,0.1)',
        hover: '0 4px 8px rgba(0,0,0,0.12)'
      }
    },
  },
  plugins: [],
}
