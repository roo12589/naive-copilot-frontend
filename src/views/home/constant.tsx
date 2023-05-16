import { Solution } from '@/types'
import { copyText } from '@/utils'
import { DataTableColumn, NButton, NTime } from 'naive-ui'
type DataTableColumn2<T> = DataTableColumn<T> & {
    hidden?: boolean
}
type User = {
    name: string
    age: number
    sex: string
}

const _columns: DataTableColumn2<Solution>[] = [
    {
        key: 'content',
        title: 'content',
        ellipsis: { tooltip: true },
        render: ({ content }) => JSON.stringify(content),
        hidden: true,
    },
    {
        key: 'stage_name',
        title: 'stage_name',
        render: (row) => {
            return row.content.stage_name
        },
    },
    {
        key: 'opers',
        title: 'opers',
        render: (row) => {
            const operators = row.content.opers
            return (
                <span>
                    {operators.map((o) => o.name + o.skill).toString()} 共<b>{operators.length}</b>
                </span>
            )
        },
    },

    {
        key: 'title',
        title: 'title',
        render: (row) => {
            return row.content.doc.title
        },
    },
    {
        key: 'details',
        title: 'details',
        render: (row) => {
            return row.content.doc.details
        },
        hidden: true,
    },

    {
        key: 'upload_time',
        title: 'upload_time',
        render: ({ upload_time }) => <NTime time={0} to={new Date(upload_time)} type="relative" />,
    },
    {
        key: 'uploader',
        title: 'uploader',
    },
    {
        key: 'views',
        title: 'views',
    },
    {
        key: 'hot_score',
        title: 'hot_score',
    },
    {
        key: 'available',
        title: 'available',
        hidden: true,
    },
    {
        key: 'rating_level',
        title: 'rating_level',
    },
    {
        key: 'rating_ratio',
        title: 'rating_ratio',
    },
    {
        key: 'rating_type',
        title: 'rating_type',
    },
    {
        key: 'not_enough_rating',
        title: 'not_enough_rating',
        hidden: true,
    },
    {
        key: 'difficulty',
        title: 'difficulty',
        hidden: true,
    },
    {
        key: 'id',
        title: 'id',
        width: 120,
        fixed: 'right',
        render: ({ id }) => (
            <span>
                <span>maa://{id}</span>
                <NButton size="small" onClick={() => copyText('maa://' + id)}>
                    复制代号
                </NButton>
            </span>
        ),
    },
]
export const columns = _columns.filter((c) => c?.hidden !== true)
