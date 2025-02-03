// tailwind.config.js
const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{js,jsx}",
    ],
    darkMode: 'class', // Active le mode sombre
    theme: {
        extend: {
            colors: {
                // Couleurs principales
                primary: {
                    50: '#f0f9ff',
                    100: '#e0f2fe',
                    200: '#bae6fd',
                    300: '#7dd3fc',
                    400: '#38bdf8',
                    500: '#0ea5e9',
                    600: '#0284c7',
                    700: '#0369a1',
                    800: '#075985',
                    900: '#0c4a6e',
                },
                // Couleurs secondaires pour le mode sombre
                dark: {
                    bg: '#0f172a',
                    card: '#1e293b',
                    border: '#334155',
                    text: '#e2e8f0',
                },
            },
            fontFamily: {
                sans: ['Inter var', ...defaultTheme.fontFamily.sans],
            },
            screens: {
                'xs': '475px',
                ...defaultTheme.screens,
            },
            spacing: {
                '18': '4.5rem',
                '88': '22rem',
                '112': '28rem',
                '128': '32rem',
            },
        },
    },
    plugins: [
        require('@tailwindcss/forms'),
        require('@tailwindcss/typography'),
    ],
}