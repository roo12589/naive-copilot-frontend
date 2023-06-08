// import config from "@/config"
// import router from "@/router"
// import store from "@/store"

import api from '@/apis'
import { useUserStore } from '@/store/user'
import type { AxiosResponse } from 'axios'
let isRefreshing = false
// 重试队列，每一项将是一个待执行的函数形式
let retryRequests = []

export default [
    (response: AxiosResponse) => {
        // 因为后端不使用响应体状态码 而是使用data内自定 需要判断data并抛出错误
        if (response.data.status_code === 200) {
            return response.data
        } else {
            const message = response.data?.message
            throw new Error(message, { cause: response.data })
        }
    },
    async (error: any) => {
        console.log(error)

        if (error.response?.data?.status_code === 401||error.cause.code===1001) {
            const config = error.config
            if (!isRefreshing) {
                isRefreshing = true
                try {
                    const userStore = useUserStore()
                    // 重新设置token
                    const res = await userStore.refreshToken()
                    userStore.setUserCredentials(res)
                    localStorage.setItem('token', res.token)
                    localStorage.setItem('userCredentials', JSON.stringify(res))
                    config.headers['Authorization'] = `Bearer ${res.token}`
                    // 已经刷新了token，将所有队列中的请求进行重试
                    retryRequests.forEach((cb: any) => cb())
                    // 重试完清空这个队列
                    retryRequests = []
                    // 这边不需要baseURL是因为会重新请求url，url中已经包含baseURL的部分了
                    config.baseURL = ''
                    return api(config)
                } catch (error) {
                    window.$message.error('请求错误，请重新登录')
                } finally {
                    isRefreshing = false
                }
            } else {
                // 正在刷新token，返回一个未执行resolve的promise
                return new Promise((resolve) => {
                    // 将resolve放进队列，用一个函数形式来保存，等token刷新后直接执行
                    // @ts-ignore
                    retryRequests.push((token: any) => {
                        config.baseURL = ''
                        config.headers['Authorization'] = token
                        resolve(api(config))
                    })
                })
            }
        } /* 
        refresh token无效 暂不处理
         else if (error.response.data.code === 1002) {
            window.$message.error('请求错误，请重新登录')
        }  */ else {
            window.$message.error('请求错误，请重新登录')
            return Promise.reject(error)
        }
        return Promise.reject(error)
    },
]
