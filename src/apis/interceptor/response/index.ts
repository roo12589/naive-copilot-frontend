// import config from "@/config"
// import router from "@/router"
// import store from "@/store"

import type { AxiosResponse } from 'axios'

export default [
    (response: AxiosResponse) => {
        if (response.status === 200) {
            return response.data
            // 10002002 token失效
        }
        return response
    },
    (error: any) => {
        return Promise.reject(error)
    },
]
