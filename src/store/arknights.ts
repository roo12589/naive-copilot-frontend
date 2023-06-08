import { useLevel } from '@/apis/arknights'
import { Level } from '@/models/operation'
import { defineStore } from 'pinia'

export const useArknightsStore = defineStore('arknights', {
    state: () => ({
        levels: [] as Level[],
    }),
    actions: {
        async initLevels() {
            this.levels = await useLevel()
        },
    },
})
