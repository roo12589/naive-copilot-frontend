import { Setting } from '@/models/setting'
import { parseJson, stringifyJson } from '@/utils/JSON'
import { defineStore } from 'pinia'

export const useSettingStore = defineStore('setting', {
    state: () => {
        return {
            setting: {} as Setting,
        }
    },
    getters: {},
    actions: {
        setSetting(setting: Setting) {
            console.log('setSetting')

            this.setting = setting
            localStorage.setItem('setting', stringifyJson(setting))
        },
        initSetting() {
            this.setting = parseJson(
                localStorage.getItem('setting') ||
                    '{"highlight":{"enable":false,"aspect":[{"title":"title","rules":[]}]}}'
            )
        },
    },
})
