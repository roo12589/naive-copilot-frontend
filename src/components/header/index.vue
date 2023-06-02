<template>
    <n-page-header class="py-4">
        <template #title>
            <a href="https://prts.plus/" class="no-underline" title="点击前往官方">Naive Copilot&nbsp;<span class="text-xs text-gray-500">Copied</span></a>
        </template>
        <template #subtitle>
            <n-divider vertical />
            
            <n-button quaternary type="primary" size="medium" @click=""><router-link to="/home">首页</router-link></n-button>
            <n-button quaternary type="primary" size="medium" @click=""><router-link to="/test">test</router-link></n-button>
        </template>


        <template #extra>
            <n-space>
                <n-button>打开登录</n-button>
            </n-space>
        </template>
    </n-page-header>
</template>

<script lang="ts" setup>
const options = []
</script>

<style scoped lang="scss">
.header {
    padding: 1rem 0;
}
</style>
