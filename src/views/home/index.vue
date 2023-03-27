<template>
    <n-layout has-sider>
        <n-layout-content>
            <n-card title="查找" size="medium" :header-style="{ textAlign: 'left' }">
                <n-input
                    v-model:value="query.documentWord"
                    type="text"
                    placeholder="标题"
                    size="medium"
                    clearable
                    @change=""
                ></n-input>
                <n-input
                    v-model:value="query.levelWord"
                    type="text"
                    placeholder="类型"
                    size="medium"
                    clearable
                    @change=""
                ></n-input>
                <n-select
                    v-model:value="selectedValues"
                    multiple
                    filterable
                    placeholder="选择"
                    :options="options"
                    :render-label="renderLabel"
                />
            </n-card>
        </n-layout-content>
        <n-layout-sider content-style="padding: 24px;">
            <n-card  size="medium" :header-style="{ textAlign: 'left' }">
                <template #header>icon创建</template>
                <n-button quaternary type="primary" size="medium" @click="">启动编辑</n-button>
                <n-button quaternary type="primary" size="medium" @click="">上传</n-button>
            </n-card>
            <n-card  size="medium" :header-style="{ textAlign: 'left' }">
                <template #header>icon公告</template>
                <n-button quaternary type="primary" size="medium" @click="">启动编辑</n-button>
                <n-button quaternary type="primary" size="medium" @click="">上传</n-button>
            </n-card>
        </n-layout-sider>
    </n-layout>
</template>

<script lang="tsx" setup>
import { ref, reactive } from 'vue'
import { OPERATORS } from '@/models/generated/operators'
import { SelectOption } from 'naive-ui'

const query = reactive({
    documentWord: '',
    levelWord: '',
})

const selectedValues = ref([])
const options = OPERATORS.map((operator: any) => {
    operator.label = operator.name
    operator.value = operator.id
    return operator
})
const renderLabel = (option: SelectOption) => {
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <n-avatar size="small" src={'https://prts.plus/assets/operator-avatars/' + option.id + '.png'}></n-avatar>
            <span>{option.label}</span>
        </div>
    )
}
</script>

<style scoped></style>
