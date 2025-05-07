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
      fill: ['hover', 'focus'], // Enables `hover` and `focus` variants for `fill`
      stroke: ['hover', 'focus'],
      colors: {
        customBlue: '#2d3748',
        customeBlueElements: '#122C4F',
        customBlueHover: '#2e629a',
        customPeach: '#fdd487',
        customQuestionGray: "#9d9d9a",
        customQuestionLightGray: "#c4c4c2",
        lighterBlue: '#123A6B',
        LighterGold: '#C2963A',
        moduleGold: '#A97D21FF',
        cwhite: '#ffffff',
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
        typing: 'typing 4s steps(1000) 1s',
      },
    },
  },
  plugins: [],
}
