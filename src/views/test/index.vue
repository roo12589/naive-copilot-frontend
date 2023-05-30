<template>
    <n-drawer v-model:show="show" width="80%" placement="right">
        <n-drawer-content>
            <template #header>
                <div class="flex justify-between">
                    <div class="text">{{ title }}</div>
                    <n-space class="button">
                        <n-button text quaternary type="primary" size="medium" @click="downloadOperation">
                            下载
                        </n-button>
                        <n-button text type="primary" size="medium" @click="copyCode">复制</n-button>
                    </n-space>
                </div>
            </template>
            <n-button :loading="loading" text type="primary" size="medium" @click="getComment">测试</n-button>
            <step-card :title="title" :action="action"></step-card>
        </n-drawer-content>
    </n-drawer>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { copyText, exportJson } from '@/utils'
import { useLoadingState } from '@/hooks/useLoadingState'
import { useCommentList } from '@/apis/comment'

const show = ref(true)
const title = '标题'
const action = ref({ name: 'a', direction: 'up', location: [1, 2] })
const downloadOperation = () => {
    exportJson('name', JSON.stringify({ name: 'a' }))
}
const copyCode = () => {
    copyText('text')
}

const { loading, fn: getComment } = useLoadingState(() => useCommentList('23460',2,5,'hot'), {
    loading: false,
    onSuccess: (res) => {
        console.log(res)
    },
} as any)
</script>

<style scoped>
:deep(.n-drawer-header__main) {
    width: 100%;
}
</style>
