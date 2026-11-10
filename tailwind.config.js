/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // ============================================================
        // RELIF HOSPITAL DESIGN TOKENS — NO BLUE ALLOWED
        // ============================================================
        paper:          'var(--paper)',
        bone:           'var(--bone)',
        ink:            'var(--ink)',
        'ink-soft':     'var(--ink-soft)',
        verdigris:      'var(--verdigris)',
        'verdigris-deep': 'var(--verdigris-deep)',
        mint:           'var(--mint)',
        sage:           'var(--sage)',
        saffron:        'var(--saffron)',
        'saffron-deep': 'var(--saffron-deep)',
        clay:           'var(--clay)',
        signal:         'var(--signal)',
        'signal-deep':  'var(--signal-deep)',
        night:          'var(--night)',
        'night-soft':   'var(--night-soft)',
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        sans:    ['Instrument Sans', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        mono:    ['JetBrains Mono', 'Courier New', 'monospace'],
        devanagari: ['Noto Serif Devanagari', 'Noto Sans Devanagari', 'serif'],
      },
      borderRadius: {
        'sm':   '8px',
        DEFAULT: '12px',
        'md':   '16px',
        'lg':   '24px',
        'xl':   '32px',
        '2xl':  '40px',
        'pill': '999px',
        'arch': '50% 50% 0 0 / 60% 60% 0 0',
      },
      boxShadow: {
        'warm-sm':  '0 1px 3px rgba(16,38,31,0.06), 0 1px 2px rgba(16,38,31,0.04)',
        'warm':     '0 4px 16px rgba(16,38,31,0.08), 0 2px 4px rgba(16,38,31,0.04)',
        'warm-md':  '0 8px 24px rgba(16,38,31,0.10), 0 4px 8px rgba(16,38,31,0.06)',
        'warm-lg':  '0 16px 48px rgba(16,38,31,0.12), 0 8px 16px rgba(16,38,31,0.08)',
        'warm-xl':  '0 24px 64px rgba(16,38,31,0.16), 0 12px 24px rgba(16,38,31,0.10)',
        'saffron':  '0 4px 20px rgba(240,162,46,0.30)',
        'verdigris':'0 4px 20px rgba(31,122,107,0.25)',
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '30': '7.5rem',
        '34': '8.5rem',
        '38': '9.5rem',
        '42': '10.5rem',
      },
      animation: {
        'fade-up':      'fadeUp 0.6s cubic-bezier(0.22,1,0.36,1) forwards',
        'fade-in':      'fadeIn 0.5s cubic-bezier(0.22,1,0.36,1) forwards',
        'slide-in':     'slideIn 0.5s cubic-bezier(0.22,1,0.36,1) forwards',
        'pulse-dot':    'pulseDot 2s ease-in-out infinite',
        'line-draw':    'lineDraw 1.5s cubic-bezier(0.22,1,0.36,1) forwards',
        'shimmer':      'shimmer 2s ease-in-out infinite',
        'float':        'float 3s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%':   { opacity: '0', transform: 'translateX(-16px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        pulseDot: {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%':      { transform: 'scale(1.4)', opacity: '0.7' },
        },
        lineDraw: {
          '0%':   { strokeDashoffset: '1000' },
          '100%': { strokeDashoffset: '0' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-8px)' },
        },
      },
      transitionTimingFunction: {
        'relif':  'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      transitionDuration: {
        '400': '400ms',
        '600': '600ms',
        '700': '700ms',
      },
      screens: {
        'xs': '360px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1440px',
        '3xl': '1920px',
      },
      maxWidth: {
        'screen-2xl': '1440px',
        'screen-3xl': '1920px',
      },
      zIndex: {
        'emergency': '100',
        'header':    '90',
        'modal':     '80',
        'drawer':    '70',
        'toast':     '60',
        'dropdown':  '50',
        'assistant': '40',
        'float':     '30',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
  ],
  // Explicitly block blue-related classes to enforce the design brief
  blocklist: [
    // Blue family
    'bg-blue-50', 'bg-blue-100', 'bg-blue-200', 'bg-blue-300',
    'bg-blue-400', 'bg-blue-500', 'bg-blue-600', 'bg-blue-700',
    'bg-blue-800', 'bg-blue-900',
    'text-blue-50', 'text-blue-100', 'text-blue-200', 'text-blue-300',
    'text-blue-400', 'text-blue-500', 'text-blue-600', 'text-blue-700',
    'text-blue-800', 'text-blue-900',
    'border-blue-50', 'border-blue-100', 'border-blue-200', 'border-blue-300',
    'border-blue-400', 'border-blue-500', 'border-blue-600', 'border-blue-700',
    // Indigo family
    'bg-indigo-50', 'bg-indigo-100', 'bg-indigo-200', 'bg-indigo-300',
    'bg-indigo-400', 'bg-indigo-500', 'bg-indigo-600', 'bg-indigo-700',
    'bg-indigo-800', 'bg-indigo-900',
    // Sky family
    'bg-sky-50', 'bg-sky-100', 'bg-sky-200', 'bg-sky-300',
    'bg-sky-400', 'bg-sky-500', 'bg-sky-600', 'bg-sky-700',
    'bg-sky-800', 'bg-sky-900',
    // Slate family
    'bg-slate-50', 'bg-slate-100', 'bg-slate-200', 'bg-slate-300',
    'bg-slate-400', 'bg-slate-500', 'bg-slate-600', 'bg-slate-700',
    'bg-slate-800', 'bg-slate-900',
  ],
}

