<template>
    <AppProvider :theme="theme">
        <!-- <n-button type="primary" size="medium" @click="toggleTheme">toggle</n-button> -->
        <Header>
            <template #right>
                <n-icon class="cursor-pointer" size="18" @click="toggleTheme"><SunnyOutline /></n-icon>
            </template>
        </Header>
        <router-view></router-view>
    </AppProvider>
</template>

<script setup lang="ts">
import AppProvider from '@/components/appProvider/index.vue'
import Header from '@/components/header/index.vue'
import { SunnyOutline } from '@vicons/ionicons5'
import useTheme from './hooks/useTheme'
import { onMounted } from 'vue'
const { theme, toggleTheme } = useTheme()
onMounted(() => {
    window.$loadingBar.start()
    setTimeout(() => {
        window.$loadingBar.finish()
        window.$message.success('加载完成，Perfect~')
    }, 500)
})
</script>
