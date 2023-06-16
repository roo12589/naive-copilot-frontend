import { useReplaceComponent } from '@/hooks/useReplaceComponent'
import { OperationCombined } from '@/models/operation'
import { useArknightsStore } from '@/store/arknights'
import { copyText } from '@/utils'
import { DataTableColumn, NButton, NTag, NTime } from 'naive-ui'
export type DataTableColumn2<T> = DataTableColumn<T> & {
    hidden?: boolean
}
const arknightsStore = useArknightsStore()

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
        key: 'title',
        title: '标题',
        render: (row) => {
            return (
                <>
                    {useReplaceComponent(row.content.doc.title, [
                        {
                            reg: /蚀刻章?/,
                            component: (capture) => <span class="text-[#8A2BE2]">{capture}</span>,
                        },
                    ])}
                </>
            )
        },
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
        render: (row) => {
            if (row.notEnoughRating) return <b style={{ color: `rgba(138,43,226,0.5)` }}>评分不足</b>
            return <b style={{ color: `rgba(138,43,226,${0.5 + row.ratingLevel / 20})` }}>{row.ratingLevel}</b>
        },
    },

    {
        key: 'difficulty',
        title: 'difficulty',
        hidden: true,
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
