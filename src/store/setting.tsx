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
        getRules(title: string) {
            const { highlight } = this.setting
            const { enable } = highlight
            if (enable === false) return false
            const rules =
                highlight.aspect
                    ?.find((a) => a.title === title)
                    ?.rules.filter((r) => r.enable !== false)
                    .map((r) => ({
                        reg: r.source,
                        component: (c: any) => <span style={{ color: r.color || '#8A2BE2' }}>{c}</span>,
                    })) || []

            return rules
        },
        initSetting() {
            this.setting = parseJson(
                localStorage.getItem('setting') ||
                    '{"highlight":{"enable":false,"aspect":[{"title":"title","rules":[]}]}}'
            )
        },
    },
})
