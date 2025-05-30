/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './App.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
    './src/**/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        POPPINS_BLACK: ['Poppins-Black'],
        POPPINS_BOLD: ['Poppins-Bold'],
        POPPINS_EXTRA_BOLD: ['Poppins-ExtraBold'],
        POPPINS_EXTRA_LIGHT: ['Poppins-ExtraLight'],
        POPPINS_LIGHT: ['Poppins-Light'],
        POPPINS_MEDIUM: ['Poppins-Medium'],
        POPPINS_REGULAR: ['Poppins-Regular'],
        POPPINS_SEMI_BOLD: ['Poppins-SemiBold'],
      },
    },
    colors: {
      DEFAULT_BLACK: '#0E122B',
      DEFAULT_GREEN: '#0A8791',
      DEFAULT_YELLOW: '#FBA83C',
      DEFAULT_GREY: '#C2C2CB',
      DEFAULT_WHITE: '#FFFFFF',
      DEFAULT_RED: '#F53920',
      SECONDARY_RED: '#FF6F59',
      SECONDARY_WHITE: '#F8F8F8',
      SECONDARY_GREEN: '#24C869',
      SECONDARY_BLACK: '#191d35',
      LIGHT_GREEN: '#CEE8E7',
      LIGHT_GREY: '#F8F7F7',
      LIGHT_GREY2: '#EAEAEA',
      LIGHT_YELLOW: '#FCE6CD',
      LIGHT_RED: '#FFC8BF',
      TRANSPARENT: '',
      INACTIVE_GREY: '#A3A3A3',
    },
  },
  plugins: [],
};
