/** @type {import('tailwindcss').Config} */
export default {
    mode: "jit",
    content: [
        "./index.html",
        "./src/**/*.{vue,js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            transitionDuration: {
                DEFAULT: '0.3s',
            }
        },
    },
    plugins: [],
}

