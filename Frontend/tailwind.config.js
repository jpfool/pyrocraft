/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        outfit: ['var(--font-outfit)', 'sans-serif'],
        jost: ['var(--font-jost)', 'sans-serif'],
        cinzel: ['var(--font-cinzel)', 'serif'],
        cormorant: ['Cormorant Garamond', 'serif'],
      },
      colors: {
        gold: '#c9a84c',
        'gold-light': '#e8c97a',
        'gold-dark': '#8a6a1e',
        'dark-bg': '#08080a',
        'dark-card': '#0e0e12',
        'dark-input': '#13131a',
        'border-color': '#2a2820',
        'text-light': '#f0ead6',
        'text-muted': '#8a8070',
      },
      animation: {
        marquee: 'marquee 20s linear infinite',
        badgePulse: 'badgePulse 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
        badgePop: 'badgePop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
        bannerPulse: 'bannerPulse 3s infinite',
        productionPulse: 'productionPulse 3s infinite',
        slideIn: 'slideIn 0.3s ease-out',
        slideInToast: 'slideInToast 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
        scrollPulse: 'scrollPulse 2s ease-in-out infinite',
        fadeUp: 'fadeUp 0.6s ease both',
        emojiFloat: 'emojiFloat 0.6s ease-in-out infinite',
      },
      keyframes: {
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },
        badgePulse: {
          '0%': { transform: 'scale(0) rotate(-45deg)' },
          '100%': { transform: 'scale(1) rotate(0)' },
        },
        badgePop: {
          '0%': { transform: 'scale(0) rotate(-45deg)', opacity: '0' },
          '100%': { transform: 'scale(1) rotate(0)', opacity: '1' },
        },
        bannerPulse: {
          '0%, 100%': { boxShadow: '0 2px 12px rgba(255, 107, 107, 0.3)' },
          '50%': { boxShadow: '0 4px 16px rgba(255, 107, 107, 0.5)' },
        },
        productionPulse: {
          '0%, 100%': { boxShadow: '0 2px 12px rgba(45, 170, 45, 0.3)' },
          '50%': { boxShadow: '0 4px 16px rgba(45, 170, 45, 0.5)' },
        },
        slideIn: {
          from: { opacity: '0', transform: 'translateY(-10px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        slideInToast: {
          from: { opacity: '0', transform: 'translateX(400px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        scrollPulse: {
          '0%, 100%': { opacity: '0.3', transform: 'scaleY(0.8)' },
          '50%': { opacity: '1', transform: 'scaleY(1)' },
        },
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        emojiFloat: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
    },
  },
  plugins: [],
}

