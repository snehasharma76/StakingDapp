/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
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
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        christmas: {
          red: '#C41E3A',
          green: '#165B33',
          darkGreen: '#0B3B24',
          gold: '#FFD700',
          snow: '#FFFAFA',
          pine: '#0B6623',
          brown: '#4A2506'
        },
        'christmas-red': '#C41E3A',
        'christmas-green': '#165B33',
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
        snow: {
          '0%': { transform: 'translateY(-10vh) rotate(0deg)' },
          '100%': { transform: 'translateY(100vh) rotate(360deg)' }
        },
        twinkle: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.3 },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' }
        },
        jingle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' }
        },
        'fly-across': {
          '0%': { 
            transform: 'translateX(-100%) translateY(0)',
            opacity: 0 
          },
          '10%': { 
            opacity: 1 
          },
          '90%': { 
            opacity: 1 
          },
          '100%': { 
            transform: 'translateX(200%) translateY(-50px)',
            opacity: 0 
          }
        },
        'sleigh-bounce': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' }
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        snow: 'snow linear infinite',
        twinkle: 'twinkle 2s ease-in-out infinite',
        float: 'float 3s ease-in-out infinite',
        jingle: 'jingle 2s ease-in-out infinite',
        'fly-across': 'fly-across 10s ease-in-out forwards',
        'sleigh-bounce': 'sleigh-bounce 1s ease-in-out infinite'
      },
      backgroundImage: {
        'christmas-gradient': 'linear-gradient(to bottom, #041C32, #165B33)',
        'frost': 'linear-gradient(to right, rgba(255,255,255,0.5), rgba(255,255,255,0.2))',
        'card-gradient': 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      }
    }
  },
  plugins: [require("tailwindcss-animate")],
}
