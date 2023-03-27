<template>
    <n-page-header class="header">
        <template #title>
            <a href="https://anyway.fm/" style="text-decoration: none; color: inherit">Anyway.FM</a>
        </template>
        <template #subtitle>
            <n-divider vertical />
            <n-button quaternary type="primary" size="medium" @click="">&nbsp;&nbsp;b1&nbsp;&nbsp;</n-button>
            <n-button quaternary type="primary" size="medium" @click="">&nbsp;&nbsp;b2&nbsp;&nbsp;</n-button>
        </template>

        <template #avatar>
            <n-avatar src="https://cdnimg103.lizhi.fm/user/2017/02/04/2583325032200238082_160x160.jpg" />
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
