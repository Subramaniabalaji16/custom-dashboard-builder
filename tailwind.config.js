/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#54bd95',
        'primary-dark': '#3da87d',
      },
    },
  },
  plugins: [],
}
