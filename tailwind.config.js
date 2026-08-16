export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: "#0d1b2a",     // very dark navy (background)
        navyMid: "#1b263b",  // secondary navy
        midGray: "#415A77",  // muted slate
        lightGray: "#e0e1dd",// off-white / paper
        yellow: "#ffd16f",   // pale yellow (accent)
        orange: "#ff6b35",   // primary orange
      },
    },
  },
  plugins: [],
};
