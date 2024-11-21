module.exports = {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue",
  ],
  theme: {
    extend: {
      colors: {
        customBlue: '#2d3748',
      },
      keyframes: {
        slideFadeIn: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        zoomIn: {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.1)', opacity: '1' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        typing: {
          '0%': { width: '0', borderColor: 'transparent' },
          '100%': { width: '100%', borderColor: 'transparent' },
        },
      },
      animation: {
        slideFadeIn: 'slideFadeIn 0.8s ease-out forwards',
        zoomIn: 'zoomIn 8s ease-in-out infinite',
        typing: 'typing 3.5s steps(30) 1s forwards',
      },
    },
  },
  plugins: [],
}