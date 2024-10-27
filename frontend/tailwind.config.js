/** @type {import('tailwindcss').Config} */

const config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ['var(--font-noto-sans-sc)'],
        serif: ['var(--font-noto-sans-sc)'],
      },
      gridTemplateColumns: {
        '25': 'repeat(25, minmax(0, 1fr))',
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        warmpaper: 'hsl(var(--color-warm-paper) / <alpha-value>)',
        'card-text': 'hsl(var(--card-text) / <alpha-value>)',
        'code-keyword': 'var(--code-keyword)',
        'code-string': 'var(--code-string)',
        'code-number': 'var(--code-number)',
        'code-comment': 'var(--code-comment)',
        'code-function': 'var(--code-function)',
        'code-operator': 'var(--code-operator)',
        'code-variable': 'var(--code-variable)',
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        reference: {
          'to-bg': 'hsl(var(--reference-to-bg) / <alpha-value>)',
          'to-text': 'hsl(var(--reference-to-text) / <alpha-value>)',
          'from-bg': 'hsl(var(--reference-from-bg) / <alpha-value>)',
          'from-text': 'hsl(var(--reference-from-text) / <alpha-value>)',
        },
        opacity: {
          'icon': '0.8', // 设置你想要的默认不透明度值
        },
        images: {
          domains: ['chrome.google.com'],
        },
      },
      borderColor: {
        'heatmap-cell': 'rgba(var(--border), 0.1)',
        'heatmap-cell-dark': 'rgba(var(--border), 0.2)',
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require('@tailwindcss/typography'),
    require('tailwind-scrollbar'),
  ],
  corePlugins: {
    lineClamp: true,
  }
  
}

export default config