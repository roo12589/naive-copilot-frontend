import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import vueSetupExtend from 'vite-plugin-vue-setup-extend'
// import { visualizer } from 'rollup-plugin-visualizer'
import { UserConfig } from 'vite'
// import eslintPlugin from 'vite-plugin-eslint'
import Components from 'unplugin-vue-components/vite'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
    // const isProduction = false

    const config: UserConfig = {
        plugins: [
            vue(),
            vueSetupExtend(),
            /**
             * * 组件库按需引入插件
             * usage: 直接使用组件,无需在任何地方导入组件
             */
            Components({
                resolvers: [NaiveUiResolver()],
            }),

        ],
        base:  '/',
        define: {
            'process.env': {},
        },
        resolve: {
            alias: {
                '@': path.resolve(__dirname, './src'),
            },
        },
        css: {
            preprocessorOptions: {
                scss: {
                    additionalData: `@import '@/styles/variables.scss';`,
                },
            },
        },
        server: {
            open: false,
            host: '127.0.0.1',
            port: 3000,
            proxy: {
                '^/api/': {
                    target: 'http://localhost:8080', // 后台服务器地址
                    changeOrigin: true /* 允许跨域 */,
                    rewrite: (path) => path.replace(/^\/api/, ''),
                },
            },
        },
    }
    // if (isProduction) {
    //     config.plugins.push(
    //         // 打包优化-可视化视图
    //         visualizer({
    //             open: true,
    //             gzipSize: true, //搜集gzip压缩包的大小到图表
    //             brotliSize: true, //搜集brotli压缩包的大小到图表
    //         })
    //     )
    // }

    return config
})
