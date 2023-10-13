import { useReplaceComponent } from '@/hooks/useReplaceComponent'
import { OperationCombined } from '@/models/operation'
import { useArknightsStore } from '@/store/arknights'
import { useSettingStore } from '@/store/setting'
import { copyText } from '@/utils'
import { DataTableColumn, NButton, NTag, NTime } from 'naive-ui'
export type DataTableColumn2<T> = DataTableColumn<T> & {
    hidden?: boolean
}
const arknightsStore = useArknightsStore()
const settingStore = useSettingStore()

const _columns: DataTableColumn2<OperationCombined>[] = [
    {
        key: 'content',
        title: 'content',
        ellipsis: { tooltip: true },
        render: ({ content }) => JSON.stringify(content),
        hidden: true,
    },
    {
        key: 'stageName',
        title: '关卡名',
        width: 80,
        render: (row) => {
            const level = arknightsStore.levels.find((level) => level.stageId === row.content.stageName)
            return level?.catThree || row.content.stageName
        },
        sorter: (a, b) => a.content.stageName.localeCompare(b.content.stageName),
    },
    {
        key: 'title',
        title: '标题',
        render: (row) => {
            const docTitle = row.content.doc.title
            const rules = settingStore.getRules('title')
            if (!rules) return docTitle
            const replaced = useReplaceComponent(docTitle, rules)
            return <>{replaced}</>
        },
    },
    {
        key: 'difficulty',
        title: '难度',
        width: 80,
        render: (row: any) => {
            const difficulty = row.content.difficulty
            const map = new Map([
                [1, '普通'],
                [2, '突袭'],
                [3, '兼容'],
            ])
            const text = map.get(row.content.difficulty) || '未知'
            return (
                <>
                    <NTag type={difficulty === 3 ? 'success' : 'error'}> {text}</NTag>
                </>
            )
        },
    },
    {
        key: 'opers',
        title: '干员',
        render: (row) => {
            const operators = row.content.opers
            return (
                <>
                    <span>
                        {operators?.map((o) => o.name + o.skill).toString()} <span class="text-xs">共</span>
                        <b>{(operators?.length || 0) + (row.content.groups?.length || 0)}</b>
                    </span>
                    <br />
                    {row.content.groups?.map((group) => (
                        <span>
                            <span>
                                {group.name}： {group.opers?.map((o) => o.name + o.skill).join('|')}
                            </span>
                            <br />
                        </span>
                    ))}
                </>
            )
        },
        ellipsis: { lineClamp: 1, tooltip: true },
    },

    {
        key: 'details',
        title: '详情',
        render: (row) => {
            return row.content.doc.details
        },
        hidden: true,
    },

    {
        key: 'uploadTime',
        title: '上传时间',
        render: ({ uploadTime }) => <NTime time={new Date(uploadTime)} to={new Date()} type="relative" />,
        width: 80,
    },
    {
        key: 'uploader',
        title: '作者',
        width: 150,
    },
    {
        key: 'views',
        title: '浏览量',
        width: 80,
    },
    {
        key: 'hotScore',
        title: '热度',
        width: 80,
    },
    {
        key: 'available',
        title: 'available',
        hidden: true,
    },
    {
        key: 'ratingLevel',
        title: '评分',
        width: 60,
        render: (row) => {
            if (row.notEnoughRating) return <b style={{ color: `rgba(138,43,226,0.5)` }}>评分不足</b>
            return <b style={{ color: `rgba(138,43,226,${0.5 + row.ratingLevel / 20})` }}>{row.ratingLevel}</b>
        },
    },
    {
        key: 'likeOrNot',
        title: '赞/踩',
        render: (row) => {
            return (
                <>
                    <span style={{ color: '#18a058' }}>{row.like}</span>/
                    <span style={{ color: '#d03050' }}>{row.dislike}</span>
                    {/* <span>({((row.like / (row.like + row.dislike)) * 100).toFixed(2)}%)</span> */}
                </>
            )
        },
    },
    // {
    //     key: 'id',
    //     title: '代号',
    //     width: 120,
    //     fixed: 'right',
    //     render: ({ id }) => (
    //         <span>
    //             {/* <span>maa://{id}</span> */}
    //             <NButton size="small" onClick={() => copyText('maa://' + id)}>
    //                 复制
    //             </NButton>
    //         </span>
    //     ),
    // },
]
export const columns = _columns
    .filter((c) => c?.hidden !== true)
    .map((c) => {
        c.minWidth = 50
        c.resizable = true
        return c
    })
