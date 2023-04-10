<template>
    <n-drawer v-model:show="show" width="80%" placement="right">
        <n-drawer-content>
            <template #header>
                <div class="title">
                    <div class="text">{{ title }}</div>
                    <n-space class="button">
                        <n-button text quaternary type="primary" size="medium" @click="downloadSolution">下载</n-button>
                        <n-button text type="primary" size="medium" @click="copyCode">复制</n-button>
                    </n-space>
                </div>
            </template>
            <step-card :title="title" :action="action"></step-card>
        </n-drawer-content>
    </n-drawer>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import StepCard from '@/components/StepCard/index.vue'
import { copyText, exportJson } from '@/utils'

const show = ref(true)
const title = '标题'
const action = ref({ name: 'a', direction: 'up', location: [1, 2] })
const downloadSolution = () => {
    exportJson('name', JSON.stringify({ name: 'a' }))
}
const copyCode = () => {
    copyText('text')
}
</script>

<style scoped lang="scss">
.title {
    display: flex;
    justify-content: space-between;
}
::v-deep(.n-drawer-header__main) {
    width: 100%;
}
</style>
