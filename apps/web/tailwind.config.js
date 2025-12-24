/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './app/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    darkMode: 'class',
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
            },
            colors: {
                main: '#0B0F1A',
                card: '#111827',
                muted: '#1F2933',
                accent: {
                    DEFAULT: '#6366F1',
                    hover: '#4F46E5',
                },
                success: '#22C55E',
                warning: '#FACC15',
                error: '#EF4444',
            },
            spacing: {
                '18': '72px',
                '22': '88px',
            },
            borderRadius: {
                'card': '12px',
                'btn': '10px',
            },
            fontSize: {
                'h1': ['48px', { lineHeight: '1.1', fontWeight: '700' }],
                'h2': ['36px', { lineHeight: '1.15', fontWeight: '600' }],
                'h3': ['24px', { lineHeight: '1.2', fontWeight: '600' }],
                'body': ['16px', { lineHeight: '1.6', fontWeight: '400' }],
                'small': ['14px', { lineHeight: '1.5', fontWeight: '400' }],
                'mono': ['13px', { lineHeight: '1.4', fontWeight: '400' }],
            },
        },
    },
    plugins: [],
}
