/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        page: '#F7F6F2',
        surface: '#FFFFFF',
        primary: '#245642',
        primarySoft: '#EAF1E9',
        text: '#222D28',
        muted: '#727970',
        border: '#DEDED5',
        warnBg: '#F1E8D9',
        warnText: '#826031',
        mapBg: '#EBEDE4',
        mapGreen: '#D8E0CC',
      },
      borderRadius: {
        card: '16px',
        input: '12px',
        button: '10px',
      },
      boxShadow: {
        soft: '0 10px 24px rgba(22, 31, 26, 0.04)',
        card: '0 18px 36px rgba(36, 86, 66, 0.08)',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

