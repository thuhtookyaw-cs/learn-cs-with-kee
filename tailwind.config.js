/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class',
    content: [
        './app/**/*.{js,jsx,ts,tsx}',
        './components/**/*.{js,jsx,ts,tsx}',
    ],
    theme: {
        extend: {
            fontFamily: {
                serif: ['Merriweather', 'Georgia', 'serif'],
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
            colors: {
                parchment: '#F4F1EA',
                parchment2: '#FAF9F6',
                ink: '#1F2937',
                'ink-muted': '#4B5563',
                'paper-border': '#D1D5DB',
                'dark-bg': '#121212',
                'dark-card': '#1E1E24',
                'dark-card2': '#2A2A32',
                'dark-border': '#374151',
            },
            boxShadow: {
                paper: '0 1px 3px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.06)',
                'paper-lg': '0 4px 16px rgba(0,0,0,0.10), 0 1px 4px rgba(0,0,0,0.06)',
                'paper-hover': '0 8px 28px rgba(0,0,0,0.14), 0 2px 6px rgba(0,0,0,0.08)',
            },
            animation: {
                'fade-in': 'fadeIn 0.25s ease-in-out',
                'slide-down': 'slideDown 0.25s ease-in-out',
            },
            keyframes: {
                fadeIn: { from: { opacity: '0', transform: 'translateY(4px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
                slideDown: { from: { opacity: '0', maxHeight: '0', transform: 'translateY(-4px)' }, to: { opacity: '1', maxHeight: '2000px', transform: 'translateY(0)' } },
            },
        },
    },
    plugins: [
        require('@tailwindcss/typography'),
    ],
}
