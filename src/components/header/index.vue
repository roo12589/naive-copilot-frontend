<template>
    <n-page-header class="py-4">
        <template #title>
            <a href="https://prts.plus/" class="no-underline" title="点击前往官方">
                Naive Copilot&nbsp;
                <span class="text-xs text-gray-500">Copied</span>
            </a>
            <n-divider vertical class="!ml-4 !mr-[-1rem]" />
        </template>
        <template #subtitle>
            <slot name="medium"></slot>
        </template>

        <template #extra>
            <div class="flex items-center gap-3">
                <slot name="right"></slot>
                <n-icon class="cursor-pointer" size="18" @click="showSettingModal = true"><SettingsOutline /></n-icon>

                <n-dropdown trigger="hover" :options="userDropdownOptions" v-if="isLogin" class="cursor-pointer">
                    <n-tag
                        :color="{
                            color: stringToRGB(userStore.userCredentials.userInfo.userName),
                            borderColor: 'transparent',
                        }"
                    >
                        <span
                            :style="{
                                color: isLightColor(stringToRGB(userStore.userCredentials.userInfo.userName))
                                    ? 'black'
                                    : 'white',
                            }"
                        >
                            {{ userStore.userCredentials.userInfo.userName }}
                        </span>
                    </n-tag>
                </n-dropdown>
                <n-button v-else @click="showLoginModal = true">登录/注册</n-button>
            </div>
        </template>
    </n-page-header>

    <n-modal
        v-model:show="showSettingModal"
        title="设置"
        :style="bodyStyle"
        size="huge"
        :bordered="false"
        preset="card"
    >
        <n-card>
            <template #header>
                高亮显示:
                <n-tooltip>
                    1. 支持文本或通过文本创建的正则
                    <br />
                    2. 前后顺序可能影响替换效果
                    <template #trigger>
                        <n-icon size="22" color="gray" class="align-middle">
                            <InformationCircleOutline />
                        </n-icon>
                    </template>
                </n-tooltip>

                <n-switch v-model:value="setting.highlight.enable"></n-switch>
            </template>
            <n-collapse :default-expanded-names="['title']">
                <n-collapse-item v-for="a in setting.highlight.aspect" :key="a.title" :title="a.title" :name="a.title">
                    <n-dynamic-input v-model:value="a.rules" :on-create="onAddRule">
                        <template #default="{ value }">
                            <div class="flex items-center w-full">
                                <n-switch v-model:value="value.enable" class="mr-3" />
                                <n-input placeholder="为空有惊喜" v-model:value="value.source" class="mr-3" />
                                <n-color-picker v-model:value="value.color" default-value="#8A2BE2" />
                            </div>
                        </template>
                    </n-dynamic-input>
                </n-collapse-item>
            </n-collapse>
        </n-card>
    </n-modal>
    <n-modal v-model:show="showLoginModal" :style="bodyStyle" size="huge" :bordered="false" preset="card">
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
                            <n-button
                                :loading="loginLoading"
                                @click="() => loginWithLoading(loginModel.email, loginModel.password)"
                                type="primary"
                            >
                                登录
                            </n-button>
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

<script lang="tsx" setup>
import { Ref, computed, onMounted, ref, watch } from 'vue'
import { FormInst, FormItemInst, FormItemRule, useMessage, FormRules } from 'naive-ui'
import { useUserStore } from '@/store/user'
import { login } from '@/apis/auth'
import { useLoadingState } from '@/hooks/useLoadingState'
import { DropdownMixedOption } from 'naive-ui/es/dropdown/src/interface'
import { stringToRGB, isLightColor } from '@/utils'
import { SettingsOutline } from '@vicons/ionicons5'
import { Setting } from '@/models/setting'
import { useSettingStore } from '@/store/setting'
import { InformationCircleOutline } from '@vicons/ionicons5'

const userStore = useUserStore()
const settingStore = useSettingStore()
settingStore.initSetting()

const isLogin = computed(() => Boolean(userStore.userCredentials.token))

const { loading: loginLoading, fn: loginWithLoading } = useLoadingState(login, {
    onSuccess: () => (showLoginModal.value = false),
})

const userDropdownOptions: DropdownMixedOption[] = [
    {
        label: '退出登录',
        key: '退出登录',
        props: {
            onClick: () => {
                userStore.removeUserCredentials()
                localStorage.setItem('token', '')
                localStorage.removeItem('userCredentials')
            },
        },
    },
]

const showSettingModal = ref(false)

const setting: Ref<Setting> = ref({
    highlight: {},
})
watch(
    setting,
    () => {
        settingStore.setSetting(setting.value)
    },
    { deep: true }
)

const showLoginModal = ref(false)
const bodyStyle = { width: '500px' }

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

const onAddRule = () => ({
    source: '文本或正则',
    enable: true,
    color: undefined,
})

onMounted(() => {
    loginModel.value = {
        email: 'asdad@qq.com',
        password: 'MaaAssistant',
    }
    if (!userStore.userCredentials.token) {
        const userCredentials = localStorage.getItem('userCredentials')
        if (userCredentials) {
            userStore.setUserCredentials(JSON.parse(userCredentials))
        }
    }
    setting.value = settingStore.setting
})
</script>

<style scoped lang="scss">
.header {
    padding: 1rem 0;
}
</style>
