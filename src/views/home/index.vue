<template>
    <n-layout has-sider sider-placement="right">
        <n-layout-content>
            <n-card size="medium">
                <template #header>
                    <div class="flex-left-center">
                        <n-icon size="22"><BookmarksOutline /></n-icon>
                        查找
                    </div>
                </template>
                <div class="query">
                    <div class="input">
                        <n-input
                            v-model:value="query.documentWord"
                            type="text"
                            placeholder="标题"
                            size="medium"
                            clearable
                            @change="handleSearch"
                        >
                            <!-- <template #prefix>
                        <n-icon><BookmarksOutline /></n-icon>
                    </template> -->
                        </n-input>
                        <n-input
                            v-model:value="query.levelWord"
                            type="text"
                            placeholder="类型"
                            size="medium"
                            clearable
                            @change="handleSearch"
                        >
                            <!-- <template #prefix>
                        <n-icon><BookmarksOutline /></n-icon>
                    </template> -->
                        </n-input>
                    </div>
                    <div class="select">
                        <n-select
                            v-model:value="query.operatorInclude"
                            multiple
                            filterable
                            clearable
                            placeholder="选择"
                            :options="operatorOptions"
                            :render-label="renderLabel"
                            :render-tag="renderTagInclude"
                            @update:value="handleSearch"
                        />
                        &nbsp;
                        <n-select
                            v-model:value="query.operatorExclude"
                            multiple
                            filterable
                            clearable
                            placeholder="排除"
                            :options="operatorOptions"
                            :render-label="renderLabel"
                            :render-tag="renderTagExclude"
                            @update:value="handleSearch"
                        />
                    </div>
                </div>
            </n-card>
            <div class="solutions-container">
                <div class="sort">
                    <n-dropdown trigger="hover" placement="bottom-start" @select="handleSort" :options="sortOptions">
                        <n-button text style="margin-left: 24px">
                            <n-icon><ListSharp /></n-icon>
                            &nbsp; 排序
                        </n-button>
                    </n-dropdown>
                </div>
                <n-spin size="medium" class="solutions" :show="loading">
                    <n-empty v-if="!loading && solutions.length === 0" description="暂无数据"></n-empty>

                    <SolutionItem v-for="solution in solutions" :solution="solution" @click="showDrawer(solution)" />
                </n-spin>
            </div>
        </n-layout-content>
        <n-layout-sider
            content-style="padding:0 24px;"
            show-trigger="bar   "
            collapse-mode="width"
            width="300"
            :default-collapsed="true"
            :collapsed-width="10"
            :native-scrollbar="true"
        >
            <n-card size="medium">
                <template #header>
                    <div class="flex-left-center">
                        <n-icon size="22"><AddCircleOutline /></n-icon>
                        创建
                    </div>
                </template>
                <n-button quaternary type="primary" size="medium" @click="">启动编辑</n-button>
                <n-button quaternary type="primary" size="medium" @click="">上传</n-button>
            </n-card>
            <n-card size="medium">
                <template #header>
                    <div class="flex-left-center">
                        <n-icon size="22"><InformationCircleOutline /></n-icon>
                        公告
                    </div>
                </template>
                <n-list>
                    <span>item1</span>
                    <br />
                    <span>item2</span>
                    <br />
                    <span>item3</span>
                    <br />
                </n-list>
            </n-card>
            <div class="friendly-links">
                <a v-for="link in friendlyLinks" :href="link.url" class="primary-link">{{ link.title }}</a>
            </div>
        </n-layout-sider>
    </n-layout>
    <n-drawer v-model:show="drawerVisible" width="1000" placement="right" class="drawer">
        <n-drawer-content title="title" closable>
            <div class="solution-info">
                <div class="left">
                    <p class="title">{{ drawerData?.content.doc.title }}</p>
                    <div>
                        <n-tag type="default" size="medium">
                            <b>{{ drawerData?.content.stage_name }}</b>
                        </n-tag>
                    </div>
                    {{ drawerData?.content.doc.details }}
                </div>
                <div class="right">
                    <div class="top">
                        <div class="flex-center">
                            <!-- <n-icon><StarSharp /></n-icon> -->
                            <n-rate
                                allow-half
                                :default-value="(drawerData?.rating_level || 0) / 2"
                                readonly
                                size="small"
                            />
                            &nbsp;&nbsp;
                            <n-icon><EyeOutline /></n-icon>
                            {{ drawerData?.views }}&nbsp;&nbsp;
                            <n-icon><TimeOutline /></n-icon>
                            <n-time :time="drawerData?.upload_time" :to="Date.now()" type="relative" />
                        </div>
                        <div class="flex-center">
                            <n-icon><PersonCircleOutline /></n-icon>
                            {{ drawerData?.uploader }}
                        </div>
                    </div>
                    <div class="bottom">
                        <b>操作员</b>
                        <div class="operators">
                            <n-tag
                                class="margin-5"
                                type="default"
                                size="medium"
                                v-for="operator in drawerData?.content.opers"
                            >
                                op skill{{ operator.skill }}
                            </n-tag>
                        </div>
                    </div>
                </div>
            </div>
            <n-divider />
            <div class="operators">
                <div class="operator-item" v-for="operator in drawerData?.content.opers">
                    <n-avatar size="medium" :src="getOperatorAvatarUrl(operator.name)"></n-avatar>
                    {{ operator.name }}
                    技能
                    <b>{{ operator.skill }}</b>
                </div>
            </div>
            <div class="steps">
                <StepCard v-for="(action,index) in drawerData?.content.actions" :action="action" mark>
                <template #mark>{{index}}</template>
                </StepCard>
            </div>
        </n-drawer-content>
    </n-drawer>
</template>

<script lang="tsx" setup>
import { ref, reactive, onMounted, Component, h } from 'vue'
import { OPERATORS } from '@/models/generated/operators'
import { NIcon, SelectOption } from 'naive-ui'
import {
    AddCircleOutline,
    InformationCircleOutline,
    BookmarksOutline,
    StarSharp,
    EyeOutline,
    TimeOutline,
    PersonCircleOutline,
    ListSharp,
    FlameOutline,
} from '@vicons/ionicons5'
import { Link, Solution } from '@/types'
import { getSolutionList } from '@/apis/solution'
import SolutionItem from './SolutionItem.vue'
import StepCard from '@/components/StepCard/index.vue'

const query = reactive({
    pageSize: 3,
    documentWord: '',
    levelWord: '',
    operatorInclude: [],
    operatorExclude: [],
})

const operatorOptions = OPERATORS.map((operator: any) => {
    operator.label = operator.name
    operator.value = operator.name
    return operator
})
const getOperatorAvatarUrl = (name: string) => {
    const id = OPERATORS.find((operator) => operator.name === name)?.id
    return 'https://prts.plus/assets/operator-avatars/' + id + '.png'
}

const renderLabel = (option: SelectOption) => {
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <n-avatar size="small" src={'https://prts.plus/assets/operator-avatars/' + option.id + '.png'}></n-avatar>
            <span>{option.label}</span>
        </div>
    )
}
const renderTagInclude = ({ option, handleClose }) => {
    return (
        <n-tag type="success" closable onClose={handleClose}>
            {option.label}
        </n-tag>
    )
}
const renderTagExclude = ({ option, handleClose }) => {
    return (
        <n-tag type="error" closable onClose={handleClose}>
            {option.label}
        </n-tag>
    )
}

async function handleSearch() {
    const operatorWord = query.operatorInclude.toString() + query.operatorExclude.map((s) => '~' + s).toString()
    const { solutionList } = await useSolutionList(
        1,
        query.pageSize,
        'hot',
        true,
        query.documentWord,
        query.levelWord,
        operatorWord
    )
    solutions.value = solutionList
}
const loading = ref(true)
const solutions = ref<Solution[]>([])
const friendlyLinks = ref<Link[]>([])

const sortOptions = [
    {
        label: '最高热度',
        key: 'hot',
        icon: renderSortIcon(FlameOutline),
    },
    {
        label: '最新时间',
        key: 'id',
        icon: renderSortIcon(TimeOutline),
    },

    {
        label: '最多访问',
        key: 'views',
        icon: renderSortIcon(EyeOutline),
    },
]
async function handleSort(key: string) {
    const { solutionList } = await useSolutionList(1, query.pageSize, key)
    solutions.value = solutionList
}
function renderSortIcon(icon: Component) {
    return () => {
        return h(NIcon, null, {
            default: () => h(icon),
        })
    }
}

const drawerVisible = ref(false)
const drawerData = ref<Solution | null>(null)
const showDrawer = function (solution: Solution) {
    drawerData.value = solution
    drawerVisible.value = true
}

onMounted(async () => {
    const { solutionList } = await useSolutionList(1, query.pageSize)
    solutions.value = solutionList
    // console.log(arr)
    friendlyLinks.value = [
        { url: 'http://', title: '链接1' },
        { url: 'http://', title: '链接2' },
        { url: 'http://', title: '链接3' },
    ]
})

async function useSolutionList(page: number, ...args: any[]) {
    loading.value = true
    const solutionListInfo = (await getSolutionList(page, ...args)).data
    console.log(solutionListInfo)
    const solutionList = solutionListInfo?.data || []
    solutionList.forEach((s: any) => (s.content = JSON.parse(s.content)))
    loading.value = false
    return {
        solutionList,
        solutionListInfo,
    }
}
</script>

<style lang="scss" scoped>
.n-card {
    @extend .border-radius-10;
    @extend .margin-col-10;
}
.query {
    .input {
        // display: flex;
        .n-input {
            margin-bottom: 5px;
        }
    }
    .select {
        display: flex;
    }
}
.solutions-container {
    .solutions {
        min-height: 300px;
    }
}
.drawer .solution-info {
    border: none;
    &:hover {
        box-shadow: none;
    }
}
</style>
