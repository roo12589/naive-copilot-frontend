import camelcaseKeys from 'camelcase-keys'
import api from '.'
import { useUserStore } from '@/store/user'

export const login = async (email: string, password: string) => {
    try {
        const res: UserCredentials = camelcaseKeys(
            (
                await api.post('/user/login', {
                    email,
                    password,
                })
            ).data,
            { deep: true }
        )
        const userStore = useUserStore()
        userStore.setUserCredentials(res)
        localStorage.setItem('token', res.token)
        localStorage.setItem('userCredentials', JSON.stringify(res))
        window.$message.success('登录成功')
        return res
    } catch (error: any) {
        window.$message.error(error.message)
        return error
    }
}

export const requestRefresh = async (token: string, refreshToken: string): Promise<UserCredentials> => {
    const response = await api.post(
        '/user/refresh',
        {
            access_token: token,
            refresh_token: refreshToken,
        },
        {
            headers: { Authorization: '' },
        }
    )
    return camelcaseKeys(response.data, { deep: true })
}

export interface UserCredentials {
    token: string
    validBefore: string
    refreshToken: string
    refreshTokenValidBefore: string
    userInfo: UserInfo
}

export interface UserInfo {
    id: string
    userName: string
    role: string
    activated: boolean
    favoriteLists: Record<string, any>
    uploadCount: number
}

export interface LoginResponse extends UserCredentials {}
export interface RefreshResponse extends UserCredentials {}
