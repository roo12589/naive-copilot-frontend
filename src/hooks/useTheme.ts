import { Ref, computed, ref } from 'vue'
import { GlobalTheme, darkTheme } from 'naive-ui'
export type Theme = Ref<GlobalTheme | null>

export default function useTheme() {
    const defaultTheme = localStorage.getItem('theme') === 'dark' ? darkTheme : null
    let theme: Theme = ref(defaultTheme)
    const isLightTheme = computed(() => theme.value?.name !== 'dark')

    function toggleTheme() {
        theme.value = theme.value === null ? darkTheme : null
        localStorage.setItem('theme', isLightTheme.value ? 'light' : 'dark')
    }
    return {
        theme,
        toggleTheme,
        isLightTheme
    }
}
