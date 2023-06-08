import { useUserStore } from '@/store/user'
import type { InternalAxiosRequestConfig } from 'axios'
export default [
    async (config: InternalAxiosRequestConfig) => {
        const userStore = useUserStore()

        if (new Date() > new Date(userStore.userCredentials.validBefore)) {
            // console.log(new Date() > new Date(userStore.userCredentials.validBefore));
            throw new Error('refresh_token失效', { cause: { message: 'refresh_token_expired', code: 1001 } })
        }
        const token = userStore.userCredentials.token || localStorage.getItem('token')
        config.headers['Authorization'] = `Bearer ${token}`
        // 时间过期

        return config
    },
    (error: any) => {
        if (error) {
            window.$message.error('请求错误')
        }
        return Promise.reject(error)
    },
]
