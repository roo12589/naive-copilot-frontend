<template>
    <n-card title="查找" size="medium">
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
        <n-select v-model:value="selectedValues" multiple filterable placeholder="选择" :options="options" />
    </n-card>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { OPERATORS } from '@/models/generated/operators'

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
</script>

<style scoped></style>
