/** @type {import('tailwindcss').Config} */
export default {
    mode: "jit",
    // 禁用预加载，修复tailwind样式 与 naive-ui button等样式等冲突问题
    corePlugins: {
        preflight: false
    },
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

