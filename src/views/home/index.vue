<template>
    <n-layout has-sider sider-placement="right">
        <n-layout-content>
            <n-card size="medium" class="rounded-lg my-2">
                <template #header>
                    <div class="flex justify-start items-center">
                        <n-icon size="22"><BookmarksOutline /></n-icon>
                        查找
                    </div>
                </template>
                <div>
                    <div class="flex" v-if="tab === 'single'">
                        <n-input
                            v-model:value="query.documentWord"
                            type="text"
                            placeholder="标题"
                            size="medium"
                            clearable
                            @change="handleSearch"
                            class="mb-1"
                        />
                        &nbsp;
                        <n-input
                            v-model:value="query.levelWord"
                            type="text"
                            placeholder="类型"
                            size="medium"
                            clearable
                            @change="handleSearch"
                            class="mb-1"
                        />
                    </div>
                    <div v-else>
                        <n-input
                            v-model:value="query.multipleDocumentWord"
                            type="text"
                            placeholder="输入关键词用','隔开"
                            size="medium"
                            clearable
                            @change="handleSearch"
                            class="mb-1"
                        />
                    </div>

                    <div class="flex">
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
            <n-tabs v-model:value="tab" @update:value="onTabChange" type="line" size="medium">
                <n-tab-pane name="single" tab="精确查询">
                    <div>
                        <n-dropdown
                            trigger="hover"
                            placement="bottom-start"
                            @select="handleSort"
                            :options="sortOptions"
                        >
                            <n-button text class="ml-6">
                                <n-icon><ListSharp /></n-icon>
                                &nbsp; 排序
                            </n-button>
                        </n-dropdown>

                        <n-spin size="medium" class="min-h-[20rem]" :show="loading">
                            <n-empty v-if="!loading && operations.length === 0" description="暂无数据"></n-empty>
                            <OperationCard
                                v-for="operation in operations"
                                :key="operation.id"
                                :operation="operation"
                                @click="showDrawer(operation)"
                            />
                        </n-spin>
                    </div>
                </n-tab-pane>
                <n-tab-pane name="multiple" tab="一键查询">
                    <div class="overflow-hidden">
                        <n-data-table :columns="columns" :data="tableData" :loading="loading" :scroll-x="1500" />
                    </div>
                </n-tab-pane>
            </n-tabs>
        </n-layout-content>
        <n-layout-sider
            content-style="padding:0 2rem;position:fixed;z-index:999;"
            :show-trigger="false"
            :collapsed="collapsed"
            collapse-mode="transform"
            width="300"
            :default-collapsed="collapsed"
            :collapsed-width="0"
            :native-scrollbar="true"
        >
            <n-icon
                size="20"
                class="z-50 cursor-pointer transition-all"
                :style="{ transform: `translate(-25px,calc(50vh - 76px)) rotate(${collapsed ? 180 : 0}deg)` }"
                @click="switchCollapsed"
            >
                <BasketballOutline />
            </n-icon>
            <n-card size="medium">
                <template #header>
                    <div class="flex justify-start items-center">
                        <n-icon size="22"><AddCircleOutline /></n-icon>
                        创建
                    </div>
                </template>
                <n-button quaternary type="primary" size="medium" @click="">启动编辑</n-button>
                <n-button quaternary type="primary" size="medium" @click="">上传</n-button>
            </n-card>
            <n-card size="medium">
                <template #header>
                    <div class="flex justify-start items-center">
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
            <div>
                <a v-for="link in friendlyLinks" :href="link.url">{{ link.title }}</a>
            </div>
        </n-layout-sider>
    </n-layout>
    <n-drawer v-model:show="drawerVisible" width="1000" placement="right" class="drawer">
        <n-drawer-content>
            <template #header>
                <div class="flex justify-between">
                    <div>{{ drawerData?.content.doc.title }}</div>
                    <n-space align="center" v-if="drawerData">
                        <n-button
                            text
                            type="primary"
                            size="medium"
                            @click="() => {
                            exportJson(drawerData!.content.doc.title||'error', JSON.stringify(drawerData!.content))
                        }"
                        >
                            下载JSON
                        </n-button>
                        <n-button
                            type="primary"
                            size="medium"
                            @click="
                                () => {
                                    copyText(`maa://${drawerData?.id}`)
                                }
                            "
                        >
                            复制代码
                        </n-button>
                    </n-space>
                </div>
            </template>
            <div v-if="drawerData">
                <div class="flex">
                    <div
                        class="w-2/4 h-full px-2 box-border flex flex-col justify-start items-start whitespace-pre-line text-left"
                    >
                        <!-- <p class="m-0 font-bold text-[18px]">{{ drawerData.content.doc.title }}</p> -->
                        <div>
                            <n-tag type="default" size="medium">
                                <b>
                                    {{ arknightsStore.levels.find(level => level.stageId === drawerData!.content.stageName)?.name || (drawerData.content.stageName) }}
                                </b>
                            </n-tag>
                        </div>
                        <RenderArticle :details="drawerData.content.doc.details || ''" />
                        <!-- <article v-html="renderArticle(drawerData.content.doc.details || '')" /> -->
                    </div>
                    <div class="w-2/4 h-full px-2 box-border flex flex-col">
                        <div class="flex flex-col items-end h-20">
                            <div class="flex justify-center items-center">
                                <!-- <n-icon><StarSharp /></n-icon> -->
                                <n-rate
                                    allow-half
                                    :default-value="(drawerData.ratingLevel || 0) / 2"
                                    readonly
                                    size="small"
                                />
                                &nbsp;&nbsp;
                                <n-icon><EyeOutline /></n-icon>
                                {{ drawerData.views }}&nbsp;&nbsp;
                                <n-icon><TimeOutline /></n-icon>
                                <n-time
                                    :time="new Date(drawerData.uploadTime).getTime()"
                                    :to="Date.now()"
                                    type="relative"
                                />
                            </div>
                            <div class="flex justify-center items-center">
                                <n-icon><PersonCircleOutline /></n-icon>
                                {{ drawerData.uploader }}
                            </div>
                        </div>
                        <div class="flex flex-wrap justify-start items-start">
                            <!-- <div class="w-full flex justify-start flex-wrap"> -->
                            <div>
                                <b>干员</b>
                                <div
                                    class="m-1 flex justify-start items-center"
                                    v-for="operator in drawerData.content.opers"
                                >
                                    <n-avatar size="medium" :src="getOperatorAvatarUrl(operator.name)"></n-avatar>
                                    {{ operator.name }}
                                    <div class="ml-auto">
                                        <span class="m-1 text-gray-400">技能</span>
                                        <b>{{ operator.skill }}</b>
                                    </div>
                                </div>
                            </div>
                            <div v-for="group in drawerData.content.groups">
                                <b>{{ group.name }}</b>
                                <div class="m-1 flex justify-start items-center" v-for="operator in group.opers">
                                    <n-avatar size="medium" :src="getOperatorAvatarUrl(operator.name)"></n-avatar>
                                    {{ operator.name }}
                                    <div class="ml-auto">
                                        <span class="m-1 text-gray-400">技能</span>
                                        <b>{{ operator.skill }}</b>
                                    </div>
                                </div>
                            </div>
                            <!-- </div> -->
                        </div>
                    </div>
                </div>
                <n-divider />

                <div>
                    <n-collapse>
                        <n-collapse-item title="动作序列" name="1">
                            <ActionCard
                                mark
                                v-for="(action, index) in drawerData.content.actions"
                                :action="(action as any)"
                            >
                                <template #mark>{{ index }}</template>
                            </ActionCard>
                        </n-collapse-item>
                    </n-collapse>
                </div>
                <n-divider />
                <div>
                    <n-collapse :default-expanded-names="['1']">
                        <n-collapse-item title="评论区" name="1">
                            <CommentCard
                                :author="drawerData.uploader"
                                v-for="comment in commentList"
                                :comment="comment"
                            />
                        </n-collapse-item>
                    </n-collapse>
                </div>
            </div>
            <n-empty v-else description="暂无数据" />
            <template #footer>
                <n-input type="textarea" v-model:value="commentText" :autosize="{ minRows: 2, maxRows: 6 }" />
                <n-button
                    class="absolute right-8 bottom-6"
                    type="primary"
                    @click="onAddComment"
                    :disabled="!commentText"
                >
                    发送
                </n-button>
            </template>
        </n-drawer-content>
    </n-drawer>
</template>

<script lang="tsx" setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { OPERATORS } from '@/models/generated/operators'
import OperationCard from './components/OperationCard.vue'
import ActionCard from './components/ActionCard.vue'
import CommentCard from './components/CommentCard.vue'
import { NButton, NIcon } from 'naive-ui'
import {
    AddCircleOutline,
    InformationCircleOutline,
    BookmarksOutline,
    BasketballOutline,
    EyeOutline,
    TimeOutline,
    PersonCircleOutline,
    ListSharp,
    FlameOutline,
} from '@vicons/ionicons5'
import { Link } from '@/types'
import type {
    OperationCombined as Operation,
    OperationCombined,
    PaginatedResponse,
    Operation as _Operation,
} from '@/models/operation'
import type { MainCommentInfo } from '@/models/comment'
import { OrderBy, getOperation, getOperationList } from '@/apis/operation'
import { DataTableColumn2, columns as _columns } from './constant'
import { copyText, exportJson } from '@/utils'
import camelcaseKeys from 'camelcase-keys'
import { addComment, useCommentList } from '@/apis/comment'
import { useArknightsStore } from '@/store/arknights'
import { RenderArticle, renderLabel, renderSortIcon, renderTagExclude, renderTagInclude } from './render'
import router from '@/router'
import { useRoute } from 'vue-router'

const arknightsStore = useArknightsStore()
arknightsStore.initLevels()

const columns: DataTableColumn2<OperationCombined>[] = [
    ..._columns,
    {
        key: 'operation',
        title: '操作',
        width: 130,
        fixed: 'right',
        render: (row: OperationCombined) => (
            <>
                <NButton type="primary" size="small" onClick={() => copyText('maa://' + row.id)}>
                    复制
                </NButton>
                &nbsp;
                <NButton size="small" onClick={() => showDrawer(row)}>
                    详情
                </NButton>
            </>
        ),
    },
]

const collapsed = ref(Boolean(localStorage.getItem('aside-collapsed')))
const switchCollapsed = () => {
    collapsed.value = !collapsed.value
    localStorage.setItem('aside-collapsed', '' + collapsed.value)
}

const commentText = ref('')
const onAddComment = async () => {
    try {
        await addComment(commentText.value, drawerData.value!.id)
        window.$message.success('评论成功')
    } catch (error: any) {
        console.error(error.message || error.cause || error)
        window.$message.error(error.message || '评论失败')
    }
}

const query = reactive({
    pageSize: 10,
    documentWord: '',
    multipleDocumentWord: '',
    levelWord: '',
    operatorInclude: [],
    operatorExclude: [],
})
const operatorWord = computed(
    () => query.operatorInclude.toString() + ',' + query.operatorExclude.map((s) => '~' + s).toString()
)

const operatorOptions = OPERATORS.map((operator: any) => {
    operator.label = operator.name
    operator.value = operator.name
    return operator
})

const getOperatorAvatarUrl = (name: string) => {
    const id = OPERATORS.find((operator) => operator.name === name)?.id
    return 'https://prts.plus/assets/operator-avatars/' + id + '.png'
}

const tab = ref<'single' | 'multiple'>('multiple')
const onTabChange = (tab: string) => {
    console.log(tab)
    handleSearch()
}
const tableData = ref<Operation[]>([])

async function handleSearch() {
    tab.value === 'single' ? await handleSingleSearch() : await handleMultipleSearch()
}
async function handleSingleSearch() {
    const { operationList } = await useOperationList(
        1,
        query.pageSize,
        'hot',
        true,
        query.documentWord,
        query.levelWord,
        operatorWord.value
    )
    operations.value = operationList
}
async function handleMultipleSearch() {
    console.log(query)
    const result: Operation[] = []
    const words = query.multipleDocumentWord.split(',')
    for (const word of words) {
        const { operationList } = await useOperationList(1, 3, 'hot', true, word, query.levelWord, operatorWord.value)
        operationList[0] && result.push(operationList[0])
    }
    console.log(result)

    tableData.value = result
}

const loading = ref(true)
const operations = ref<Operation[]>([])
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
async function handleSort(key: OrderBy) {
    const { operationList } = await useOperationList(
        1,
        query.pageSize,
        key,
        true,
        query.documentWord,
        query.levelWord,
        operatorWord.value
    )
    operations.value = operationList
}

const drawerVisible = ref(false)
const drawerData = ref<Operation | null>(null)
const showDrawer = async function (operation: Operation) {
    console.log('operation', operation)

    drawerData.value = operation
    const { commentList: c } = await useCommentList(operation.id)
    commentList.value = c
    drawerVisible.value = true
    router.push({
        path: '/home',
        query: {
            oid: operation.id,
        },
    })
}

const commentList = ref<MainCommentInfo[]>([])

const route = useRoute()

onMounted(async () => {
    if (tab.value === 'multiple') {
        const { operationList } = await useOperationList(1, query.pageSize)
        tableData.value = operationList
    } else {
        handleSort('hot')
    }

    friendlyLinks.value = [
        { url: 'http://', title: '链接1' },
        { url: 'http://', title: '链接2' },
        { url: 'http://', title: '链接3' },
    ]
    if (route.query?.oid) {
        const operation = await getOperation(route.query.oid as string)
        if (operation) {
            await showDrawer(operation)
            window.$message.success('已通过id打开详情页面，误关闭请刷新')
        }
    }
})

async function useOperationList(
    page: number,
    ...args: [
        limit?: number,
        order_by?: OrderBy,
        desc?: boolean,
        document?: string,
        level_keyword?: string,
        operator?: string
    ]
): Promise<{
    operationList: Operation[]
    operationListInfo: PaginatedResponse<_Operation>
}> {
    loading.value = true
    const operationListInfo = (await getOperationList(page, ...args)).data
    const operationList =
        operationListInfo?.data.map((o) => {
            o.content = JSON.parse(o.content)
            return o
        }) || []

    loading.value = false
    const transformed = camelcaseKeys(
        {
            operationList,
            operationListInfo,
        } as any,
        { deep: true }
    )
    console.log(transformed)
    return transformed
}
</script>
<style scoped>
:deep(.n-drawer-header__main) {
    width: 100%;
}
</style>
