/** @type {import('tailwindcss').Config} */
const config = {
    // This is the key setting for dark mode
    darkMode: 'class',

    // Tell Tailwind where to find your classes
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],

    theme: {
        extend: {
            // You can extend your theme here
        },
    },

    plugins: [],
};

// Use export default for .mjs files
export default config;