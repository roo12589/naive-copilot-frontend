<template>
    <n-config-provider :theme="theme" :locale="zhCN"  :date-locale="dateZhCN" :theme-overrides="themeOverrides">
        <n-loading-bar-provider>
            <n-dialog-provider>
                <n-notification-provider>
                    <n-message-provider>
                        <slot></slot>
                        <NaiveProviderContent />
                    </n-message-provider>
                </n-notification-provider>
            </n-dialog-provider>
        </n-loading-bar-provider>
        <n-global-style />
    </n-config-provider>
</template>

<script lang="ts" setup>
import { defineComponent, h } from 'vue'
import { createDiscreteApi,zhCN,dateZhCN } from 'naive-ui'
import { themeOverrides } from './themeVariables'
// import { NThemeEditor } from 'naive-ui'

defineProps<{
    theme: any
}>()


// 挂载naive组件的方法至window, 以便在全局使用
function setupNaiveTools() {
    const { message, notification, dialog, loadingBar } = createDiscreteApi([
        'message',
        'dialog',
        'notification',
        'loadingBar',
    ])
    window.$message = message
    window.$notification = notification
    window.$dialog = dialog
    window.$loadingBar = loadingBar
}
const NaiveProviderContent = defineComponent({
    setup() {
        setupNaiveTools()
    },
    render() {
        return h('div')
    },
})
</script>
