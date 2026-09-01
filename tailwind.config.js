/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        field: 'rgb(var(--bg-rgb) / <alpha-value>)',
        on: 'rgb(var(--on-rgb) / <alpha-value>)',
        on2: 'rgb(var(--on2-rgb) / <alpha-value>)',
        on3: 'rgb(var(--on3-rgb) / <alpha-value>)',
        accent: 'rgb(var(--accent-rgb) / <alpha-value>)',
        shade: 'rgb(var(--shade-rgb) / <alpha-value>)',
        paper: 'rgb(var(--paper-rgb) / <alpha-value>)',
        rule: 'var(--rule)',
        'rule-soft': 'var(--rule-soft)',
        well: 'var(--well)',
      },
      fontFamily: {
        display: ['Zodiak', 'Iowan Old Style', 'Georgia', 'serif'],
        sans: ['Switzer', 'ui-sans-serif', 'system-ui', 'Helvetica Neue', 'sans-serif'],
      },
      transitionDuration: { 400: '400ms', 600: '600ms' },
      transitionTimingFunction: {
        out: 'cubic-bezier(0.16,1,0.3,1)',
        inout: 'cubic-bezier(0.83,0,0.17,1)',
      },
    },
  },
  plugins: [],
}
