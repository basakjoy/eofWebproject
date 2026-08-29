import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  theme: {
    screens: {
      xs: '320px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
    extend: {
      fontFamily: {
        sans: ['var(--font-poppins)', 'Poppins', 'sans-serif'],
        poppins: ['var(--font-poppins)', 'Poppins', 'sans-serif'],
      },
      colors: {
        primary: '#FF6B00',
        'fiery-orange': '#FF6B00',
        'fiery-red': '#FF3D00',
        'fiery-amber': '#FFB800',
        obsidian: '#050508',
        'panel-dark': '#0C0C10',
        'card-dark': '#111116',
        foreground: '#FFFFFF',
        background: '#050508',
        'muted-foreground': '#8E8E93',
        border: 'rgba(255, 255, 255, 0.08)',
        sidebar: {
          DEFAULT: 'var(--sidebar-background)',
          foreground: 'var(--sidebar-foreground)',
          primary: 'var(--sidebar-primary)',
          'primary-foreground': 'var(--sidebar-primary-foreground)',
          accent: 'var(--sidebar-accent)',
          'accent-foreground': 'var(--sidebar-accent-foreground)',
          border: 'var(--sidebar-border)',
          ring: 'var(--sidebar-ring)',
        },
      },
      spacing: {
        'sidebar-expanded': '256px',
        'sidebar-collapsed': '80px',
      },
      maxWidth: {
        'site': '1280px',
      },
      boxShadow: {
        'fiery': '0 10px 40px -10px rgba(255, 107, 0, 0.35)',
        'fiery-lg': '0 20px 60px -15px rgba(255, 107, 0, 0.45)',
        'glass-card': '0 20px 50px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        fieryGlow: {
          '0%, 100%': { opacity: '0.5', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.05)' },
        },
      },
      animation: {
        marquee: 'marquee 30s linear infinite',
        'fiery-glow': 'fieryGlow 8s ease-in-out infinite',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;

