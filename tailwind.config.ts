import type { Config } from 'tailwindcss';

export default {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      // ═══════════════════════════════════════════════════════════
      // CORES DO SISTEMA (HSL para compatibilidade)
      // ═══════════════════════════════════════════════════════════
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },

      // ═══════════════════════════════════════════════════════════
      // BORDER RADIUS
      // ═══════════════════════════════════════════════════════════
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },

      // ═══════════════════════════════════════════════════════════
      // FONTES
      // ═══════════════════════════════════════════════════════════
      fontFamily: {
        sans: ['Montserrat', 'Proxima Nova', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['Fira Code', 'Consolas', 'Monaco', 'monospace'],
      },

      // ═══════════════════════════════════════════════════════════
      // KEYFRAMES E ANIMAÇÕES
      // ═══════════════════════════════════════════════════════════
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'fade-out': {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        'slide-in-from-top': {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'slide-in-from-bottom': {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'slide-in-from-left': {
          '0%': { transform: 'translateX(-20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        'slide-in-from-right': {
          '0%': { transform: 'translateX(20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        'scale-up': {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'scale-down': {
          '0%': { transform: 'scale(1.05)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 20px hsl(var(--primary) / 0.3)' },
          '50%': { boxShadow: '0 0 30px hsl(var(--primary) / 0.5)' },
        },
        'bounce-subtle': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        spin: {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
        ping: {
          '75%, 100%': {
            transform: 'scale(2)',
            opacity: '0',
          },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fade-in 0.3s ease-in-out',
        'fade-out': 'fade-out 0.3s ease-in-out',
        'slide-in-top': 'slide-in-from-top 0.4s ease-out',
        'slide-in-bottom': 'slide-in-from-bottom 0.4s ease-out',
        'slide-in-left': 'slide-in-from-left 0.4s ease-out',
        'slide-in-right': 'slide-in-from-right 0.4s ease-out',
        'scale-up': 'scale-up 0.3s ease-out',
        'scale-down': 'scale-down 0.3s ease-out',
        shimmer: 'shimmer 2s infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'bounce-subtle': 'bounce-subtle 2s ease-in-out infinite',
        spin: 'spin 1s linear infinite',
        ping: 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite',
      },

      // ═══════════════════════════════════════════════════════════
      // BACKGROUNDS GRADIENTES
      // ═══════════════════════════════════════════════════════════
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-premium':
          'linear-gradient(135deg, hsl(51 100% 50% / 0.15), hsl(357 87% 49% / 0.1))',
        'gradient-gold': 'linear-gradient(135deg, hsl(51 100% 60%), hsl(51 100% 40%))',
        'gradient-red': 'linear-gradient(135deg, hsl(357 87% 60%), hsl(357 87% 40%))',
        shimmer:
          'linear-gradient(90deg, hsl(var(--muted)) 0%, hsl(var(--muted-foreground) / 0.1) 50%, hsl(var(--muted)) 100%)',
      },

      // ═══════════════════════════════════════════════════════════
      // BOX SHADOWS CUSTOMIZADOS
      // ═══════════════════════════════════════════════════════════
      boxShadow: {
        'gold-glow': '0 0 20px hsl(51 100% 50% / 0.5), 0 0 40px hsl(51 100% 50% / 0.3)',
        'red-glow': '0 0 20px hsl(357 87% 49% / 0.5), 0 0 40px hsl(357 87% 49% / 0.3)',
        premium:
          '0 20px 60px hsl(0 0% 0% / 0.5), 0 0 40px hsl(var(--primary) / 0.1)',
        'inner-glow': 'inset 0 0 20px hsl(var(--primary) / 0.2)',
      },

      // ═══════════════════════════════════════════════════════════
      // TRANSITIONS E TIMING
      // ═══════════════════════════════════════════════════════════
      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
        premium: 'cubic-bezier(0.4, 0, 0.2, 1)',
      },

      // ═══════════════════════════════════════════════════════════
      // Z-INDEX
      // ═══════════════════════════════════════════════════════════
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      },

      // ═══════════════════════════════════════════════════════════
      // ASPECT RATIOS
      // ═══════════════════════════════════════════════════════════
      aspectRatio: {
        'video': '16 / 9',
        'video-wide': '21 / 9',
        'thumbnail': '16 / 9',
        'poster': '2 / 3',
      },

      // ═══════════════════════════════════════════════════════════
      // BACKDROP BLUR
      // ═══════════════════════════════════════════════════════════
      backdropBlur: {
        xs: '2px',
        premium: '12px',
      },

      // ═══════════════════════════════════════════════════════════
      // SPACING CUSTOM
      // ═══════════════════════════════════════════════════════════
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
    },
  },

  // ═══════════════════════════════════════════════════════════
  // PLUGINS
  // ═══════════════════════════════════════════════════════════
  plugins: [
    require('tailwindcss-animate'),
    require('@tailwindcss/typography'),
    
    // Plugin customizado para scrollbar
    function ({ addUtilities }: any) {
      const newUtilities = {
        '.scrollbar-thin': {
          'scrollbar-width': 'thin',
          'scrollbar-color': 'hsl(var(--primary) / 0.3) transparent',
        },
        '.scrollbar-webkit': {
          '&::-webkit-scrollbar': {
            width: '8px',
            height: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'hsl(var(--primary) / 0.3)',
            borderRadius: '10px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: 'hsl(var(--primary) / 0.5)',
          },
        },
        '.scrollbar-hide': {
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        },
      };
      addUtilities(newUtilities);
    },

    // Plugin para text-gradient
    function ({ addUtilities }: any) {
      const textGradients = {
        '.text-gradient-gold': {
          background: 'linear-gradient(135deg, hsl(51 100% 60%), hsl(51 100% 40%))',
          '-webkit-background-clip': 'text',
          '-webkit-text-fill-color': 'transparent',
          'background-clip': 'text',
        },
        '.text-gradient-red': {
          background: 'linear-gradient(135deg, hsl(357 87% 60%), hsl(357 87% 40%))',
          '-webkit-background-clip': 'text',
          '-webkit-text-fill-color': 'transparent',
          'background-clip': 'text',
        },
        '.text-gradient-premium': {
          background: 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--secondary)))',
          '-webkit-background-clip': 'text',
          '-webkit-text-fill-color': 'transparent',
          'background-clip': 'text',
        },
      };
      addUtilities(textGradients);
    },
  ],
} satisfies Config;
