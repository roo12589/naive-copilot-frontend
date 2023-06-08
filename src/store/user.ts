import { UserCredentials, requestRefresh } from '@/apis/auth'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
    state: () => ({
        userCredentials: {
            token: '',
            refreshToken: '',
            validBefore: '',
            refreshTokenValidBefore: '',
            userInfo: {},
        } as UserCredentials,
    }),
    actions: {
        setUserCredentials(userCredentials: UserCredentials) {
            this.userCredentials = userCredentials
        },
        removeUserCredentials() {
            this.userCredentials = {
                token: '',
                refreshToken: '',
                validBefore: '',
                refreshTokenValidBefore: '',
                userInfo: {},
            } as UserCredentials
        },
        async refreshToken() {
            return await requestRefresh(this.userCredentials.token, this.userCredentials.refreshToken)
        },
    },
})
