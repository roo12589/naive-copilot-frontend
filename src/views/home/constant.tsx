import { useReplaceComponent } from '@/hooks/useReplaceComponent'
import { OperationCombined } from '@/models/operation'
import { useArknightsStore } from '@/store/arknights'
import { useSettingStore } from '@/store/setting'
import { copyText } from '@/utils'
import { InformationCircleOutline } from '@vicons/ionicons5'
import { DataTableColumn, NButton, NIcon, NTag, NTime, NTooltip } from 'naive-ui'
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
            let isAccurate = true
            let text = map.get(row.content.difficulty) || '未知'
            let type: 'success' | 'error' | 'warning' | 'info' = difficulty === 3 ? 'success' : 'error'
            if (row.content.stageName.includes('tough')) {
                isAccurate = false
                text = '磨难'
                type = 'warning'
            }

            const slots = {
                trigger: () => (
                    <NIcon size="16" color="gray" class="align-sub">
                        <InformationCircleOutline />
                    </NIcon>
                ),
            }
            return (
                <>
                    <NTag type={type}>
                        {text}
                        {!isAccurate && <NTooltip v-slots={slots}>根据关键词检测，可能不准</NTooltip>}
                    </NTag>
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

export const qqSvg = (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        role="img"
        class="mr-2"
        font-size="16px"
        width="1em"
        height="1em"
        preserveAspectRatio="xMidYMid meet"
        viewBox="0 0 24 24"
    >
        <path
            fill="currentColor"
            d="M21.395 15.035a39.548 39.548 0 0 0-.803-2.264l-1.079-2.695c.001-.032.014-.562.014-.836C19.526 4.632 17.351 0 12 0S4.474 4.632 4.474 9.241c0 .274.013.804.014.836l-1.08 2.695a38.97 38.97 0 0 0-.802 2.264c-1.021 3.283-.69 4.643-.438 4.673c.54.065 2.103-2.472 2.103-2.472c0 1.469.756 3.387 2.394 4.771c-.612.188-1.363.479-1.845.835c-.434.32-.379.646-.301.778c.343.578 5.883.369 7.482.189c1.6.18 7.14.389 7.483-.189c.078-.132.132-.458-.301-.778c-.483-.356-1.233-.646-1.846-.836c1.637-1.384 2.393-3.302 2.393-4.771c0 0 1.563 2.537 2.103 2.472c.251-.03.581-1.39-.438-4.673zM12.662 4.846c.039-1.052.659-1.878 1.385-1.846s1.281.912 1.242 1.964c-.039 1.051-.659 1.878-1.385 1.846s-1.282-.912-1.242-1.964zM9.954 3c.725-.033 1.345.794 1.384 1.846c.04 1.052-.517 1.931-1.242 1.963c-.726.033-1.346-.794-1.385-1.845C8.672 3.912 9.228 3.033 9.954 3zM7.421 8.294c.194-.43 2.147-.908 4.566-.908h.026c2.418 0 4.372.479 4.566.908a.14.14 0 0 1 .014.061c0 .031-.01.059-.026.083c-.163.238-2.333 1.416-4.553 1.416h-.026c-2.221 0-4.39-1.178-4.553-1.416a.136.136 0 0 1-.014-.144zm10.422 8.622c-.22 3.676-2.403 5.987-5.774 6.021h-.137c-3.37-.033-5.554-2.345-5.773-6.021c-.081-1.35.001-2.496.147-3.43c.318.063.638.122.958.176v3.506s1.658.334 3.318.103v-3.225c.488.027.96.04 1.406.034h.025c1.678.021 3.714-.204 5.683-.594c.146.934.227 2.08.147 3.43zM10.48 5.804c.313-.041.542-.409.508-.825c-.033-.415-.314-.72-.629-.679c-.313.04-.541.409-.508.824c.034.417.315.72.629.68zm3.999-.648c.078.037.221.042.289-.146c.035-.095.025-.165-.009-.214c-.023-.033-.133-.118-.371-.176c-.904-.22-1.341.384-1.405.499c-.04.072-.012.176.056.227c.067.051.139.037.179-.006c.58-.628 1.21-.208 1.261-.184z"
        ></path>
    </svg>
)

export const naiveSvg = <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 207.74 252.58"><defs></defs><title>Naive UI - LOGO</title><g id="Layer_2" data-name="Layer 2"><g id="Layer_1-2" data-name="Layer 1"><path class="cls-1" d="M60.37,205.2c0,2.5,0,5,.05,7.5,0,.54,0,1.07-.05,1.58Z"/><path class="cls-1" d="M147.29,37.68v85.2c-.06-27.24-.19-54.49-.22-81.73A29,29,0,0,1,147.29,37.68Z"/><path class="cls-2" d="M147.06,125.43a16.9,16.9,0,0,0,.23-2.55v79.66l-41.74-38.17-21-19.15L71.91,133.6l-5.62-5.13-2.07-1.89-.15-.13c-.51-.41-1-.84-1.47-1.23s-.88-.73-1.44-.56a1.25,1.25,0,0,0-.79.9v-75l.43.39,8.57,7.75c4.51,4,9.06,8,13.56,12Q92.53,79.3,102.07,88q7.55,6.86,15.08,13.74c6,5.47,11.92,11,17.92,16.43,2.7,2.44,5.42,4.83,8.15,7.23.58.51,1.15,1,1.74,1.52a1.47,1.47,0,0,0,1.4.18,1.16,1.16,0,0,0,.56-.72C147,126,147,125.74,147.06,125.43Z"/><path class="cls-3" d="M60.28,126a15.67,15.67,0,0,0-.1,2.74c0,25.5,0,51,.19,76.49v9.08a14.85,14.85,0,0,1-5.87,11.09c-6.81,5.69-13.16,11.91-19.73,17.89-2.75,2.5-5.48,5-8.31,7.44s-10.11,2.74-14.14-.63a78.48,78.48,0,0,1-8.54-8.66,12.76,12.76,0,0,1-3.73-8.69c0-.72-.06-1.51,0-2.38,0-1.5,0-3,.05-4.51.05-4.3,0-8.61,0-12.91V72.71a12.64,12.64,0,0,1,.38-3.18,18.42,18.42,0,0,1,1-2.64A22.16,22.16,0,0,1,3.5,63.31l16-16L29.69,37.13a7.84,7.84,0,0,1,1.84-1.38,8.05,8.05,0,0,1,3.21-1h0a13.85,13.85,0,0,1,9.71,1.79h0a13.59,13.59,0,0,1,2.09,1.57L60.37,50.53v75A3.38,3.38,0,0,0,60.28,126Z"/><path class="cls-4" d="M60.28,126a3.38,3.38,0,0,1,.09-.41V205.2c-.15-25.5-.14-51-.19-76.49A15.67,15.67,0,0,1,60.28,126Z"/><path class="cls-3" d="M205.59,187.21l-29.39,27a3.75,3.75,0,0,1-.36.24l-.11.08-.2.12A14,14,0,0,1,158.77,213L157,211.45l-9.75-8.91V37.68c.16-1.39.4-2.78.67-4.14.7-3.55,3.82-5.31,6.2-7.53,5.17-4.8,10.5-9.42,15.77-14.12,3.63-3.24,7.25-6.49,10.91-9.71,3.19-2.81,9.37-2.67,12.37-.93a10.11,10.11,0,0,1,2.08,1.61l3.38,3.26,2.73,2.61,2.49,2.41a11.45,11.45,0,0,1,1.78,2.09,11.73,11.73,0,0,1,1.7,6.46c-.05,14.66.06,29.32.09,44q.09,37.35.16,74.7,0,19.14.07,38.27c0,.59,0,1.17,0,1.75C207.8,182.21,207.72,184.72,205.59,187.21Z"/></g></g></svg>