import type { Config } from 'tailwindcss'

const config: Config = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            fontFamily: {
                display: ['var(--font-display)', 'serif'],
                body: ['var(--font-body)', 'sans-serif'],
            },
            colors: {
                portal: {
                    50:  '#f0f7ff',
                    100: '#dbeafe',
                    400: '#60a5fa',
                    500: '#3b82f6',
                    600: '#1d4ed8',
                    700: '#1e40af',
                    800: '#1e3a5f',
                    900: '#0f172a',
                },
                accent: {
                    400: '#f59e0b',
                    500: '#d97706',
                }
            },
        },
    },
    plugins: [],
}
export default config