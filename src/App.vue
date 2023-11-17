<template>
    <AppProvider :theme="theme">
        <!-- <n-button type="primary" size="medium" @click="toggleTheme">toggle</n-button> -->
        <Header>
            <template #medium>
                <n-button quaternary type="primary" size="medium" @click="">
                    <router-link to="/home">首页</router-link>
                </n-button>
                <n-button quaternary type="primary" size="medium" @click="">
                    <router-link to="/yuhun">御魂分析</router-link>
                </n-button>
            </template>
            <template #right>
                <n-icon class="cursor-pointer" size="18" @click="toggleTheme">
                    <SunnyOutline v-if="isLightTheme" />
                    <MoonOutline v-else />
                </n-icon>
            </template>
        </Header>
        <Suspense>
            <router-view></router-view>
        </Suspense>
    </AppProvider>
</template>

<script setup lang="ts">
import AppProvider from '@/components/appProvider/index.vue'
import Header from '@/components/header/index.vue'
import { SunnyOutline, MoonOutline } from '@vicons/ionicons5'
import useTheme from './hooks/useTheme'
import { onMounted } from 'vue'
const { theme, isLightTheme, toggleTheme } = useTheme()

onMounted(() => {
    window.$loadingBar.start()
    setTimeout(() => {
        window.$loadingBar.finish()
    }, 500)
})
</script>
