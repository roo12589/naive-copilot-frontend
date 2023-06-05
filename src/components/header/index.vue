<template>
    <n-page-header class="py-4">
        <template #title>
            <a href="https://prts.plus/" class="no-underline" title="点击前往官方">
                Naive Copilot&nbsp;
                <span class="text-xs text-gray-500">Copied</span>
            </a>
        </template>
        <template #subtitle>
            <n-divider vertical />

            <n-button quaternary type="primary" size="medium" @click="">
                <router-link to="/home">首页</router-link>
            </n-button>
            <n-button quaternary type="primary" size="medium" @click="">
                <router-link to="/test">test</router-link>
            </n-button>
        </template>

        <template #extra>
            <div class="flex items-center gap-3">
                <slot name="right"></slot>
                <n-button @click="showModal = true">登录/注册</n-button>
            </div>
        </template>
    </n-page-header>
    <n-modal v-model:show="showModal" :style="bodyStyle" size="huge" :bordered="false" preset="card">
        <template #header>
            <span class="flex justify-center">登录或注册账户</span>
        </template>
        <n-tabs type="line" animated>
            <n-tab-pane name="login" tab="登录">
                <n-form ref="form" :model="loginModel" :rules="rules" show-feedback>
                    <n-form-item path="email" label="邮箱">
                        <n-auto-complete
                            v-model:value="loginModel.email"
                            :options="loginEmailOptions"
                            blur-after-select
                            @keydown.enter.prevent
                        />
                    </n-form-item>
                    <n-form-item path="password" label="密码">
                        <n-input
                            v-model:value="loginModel.password"
                            type="password"
                            @input="handlePasswordInput"
                            @keydown.enter.prevent
                        />
                    </n-form-item>
                    <n-row :gutter="[0, 24]">
                        <n-col :span="24" class="flex justify-center">
                            <n-button type="primary">登录</n-button>
                        </n-col>
                    </n-row>
                </n-form>
            </n-tab-pane>
            <n-tab-pane name="register" tab="注册">
                <n-form ref="form" :model="registerModel" :rules="rules" show-feedback>
                    <n-form-item path="email" label="邮箱">
                        <n-auto-complete
                            v-model:value="registerModel.email"
                            :options="registerEmailOptions"
                            blur-after-select
                            @keydown.enter.prevent
                        />
                    </n-form-item>
                    <n-form-item path="username" label="用户名">
                        <n-input v-model:value="registerModel.username" @keydown.enter.prevent />
                    </n-form-item>

                    <n-form-item path="password" label="密码">
                        <n-input
                            v-model:value="registerModel.password"
                            type="password"
                            @input="handlePasswordInput"
                            @keydown.enter.prevent
                        />
                    </n-form-item>
                    <n-form-item ref="rPasswordFormItem" first path="reenteredPassword" label="重复密码">
                        <n-input
                            v-model:value="registerModel.reenteredPassword"
                            :disabled="!registerModel.password"
                            type="password"
                            @keydown.enter.prevent
                        />
                    </n-form-item>
                    <n-row :gutter="[0, 24]">
                        <n-col :span="24" class="flex justify-center">
                            <n-button type="primary">注册</n-button>
                        </n-col>
                    </n-row>
                </n-form>
            </n-tab-pane>
        </n-tabs>
    </n-modal>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { FormInst, FormItemInst, FormItemRule, useMessage, FormRules } from 'naive-ui'

const options = []
const bodyStyle = { width: '500px' },
    showModal = ref(false)

interface ModelType {
    email: string | undefined
    password: string | undefined
    username: string | undefined
    reenteredPassword: string | undefined
}

const form = ref<FormInst | null>(null)
const rPasswordFormItem = ref<FormItemInst | null>(null)
const message = useMessage()
const loginModel = ref<Partial<ModelType>>({
    email: undefined,
    password: undefined,
})
const registerModel = ref<ModelType>({
    email: undefined,
    password: undefined,
    username: undefined,
    reenteredPassword: undefined,
})
const loginEmailOptions = computed(() => {
    return ['@gmail.com', '@163.com', '@qq.com'].map((suffix) => {
        const value = loginModel.value.email === undefined ? '' : loginModel.value.email
        const prefix = value.split('@')[0]
        return {
            label: prefix + suffix,
            value: prefix + suffix,
        }
    })
})
const registerEmailOptions = computed(() => {
    return ['@gmail.com', '@163.com', '@qq.com'].map((suffix) => {
        const value = registerModel.value.email === undefined ? '' : registerModel.value.email
        const prefix = value.split('@')[0]
        return {
            label: prefix + suffix,
            value: prefix + suffix,
        }
    })
})
function validatePasswordStartWith(rule: FormItemRule, value: string): boolean {
    return (
        !!registerModel.value.password &&
        registerModel.value.password.startsWith(value) &&
        registerModel.value.password.length >= value.length
    )
}
function validatePasswordSame(rule: FormItemRule, value: string): boolean {
    return value === registerModel.value.password
}
const rules: FormRules = {
    email: [
        {
            required: true,
            validator(rule: FormItemRule, value: string) {
                const emailReg =
                    /^[A-Za-z\d]+([-_\.][A-Za-z\d]+)*@([A-Za-z\d]+[-\.])+[A-Za-z\d]{2,4}(,[A-Za-z\d]+([-_\.][A-Za-z\d]+)*@([A-Za-z\d]+[-\.])+[A-Za-z\d]{2,4})*$/
                if (!value) {
                    return new Error('请输入邮箱')
                } else if (!emailReg.test(value)) {
                    return new Error('邮箱格式不正确')
                }
                return true
            },
            trigger: ['input', 'blur'],
        },
    ],
    username: [
        {
            required: true,
            message: '请输入用户名',
            trigger: ['blur'],
        },
    ],
    password: [
        {
            required: true,
            message: '请输入密码',
            trigger: ['blur'],
        },
    ],
    reenteredPassword: [
        {
            required: true,
            message: '请再次输入密码',
            trigger: ['input', 'blur'],
        },
        {
            validator: validatePasswordStartWith,
            message: '两次密码输入不一致',
            trigger: 'input',
        },
        {
            validator: validatePasswordSame,
            message: '两次密码输入不一致',
            trigger: ['blur', 'password-input'],
        },
    ],
}

const handlePasswordInput = () => {
    if (registerModel.value.reenteredPassword) {
        rPasswordFormItem.value?.validate({ trigger: 'password-input' })
    }
}
</script>

<style scoped lang="scss">
.header {
    padding: 1rem 0;
}
</style>
