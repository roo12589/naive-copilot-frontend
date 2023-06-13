import { OperationCombined } from '@/models/operation'
import { copyText } from '@/utils'
import { DataTableColumn, NButton, NTime } from 'naive-ui'
type DataTableColumn2<T> = DataTableColumn<T> & {
    hidden?: boolean
}

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
        title: 'stageName',
        render: (row) => {
            return row.content.stageName
        },
    },
    {
        key: 'opers',
        title: 'opers',
        render: (row) => {
            const operators = row.content.opers
            return (
                <span>
                    {operators?.map((o) => o.name + o.skill).toString()} 共<b>{operators?.length}</b>
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
        key: 'uploadTime',
        title: 'uploadTime',
        render: ({ uploadTime }) => <NTime time={new Date(uploadTime)} to={new Date()} type="relative" />,
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
        key: 'hotScore',
        title: 'hotScore',
    },
    {
        key: 'available',
        title: 'available',
        hidden: true,
    },
    {
        key: 'ratingLevel',
        title: 'ratingLevel',
    },
    {
        key: 'ratingRatio',
        title: 'ratingRatio',
    },
    {
        key: 'ratingType',
        title: 'ratingType',
    },
    {
        key: 'notEnoughRating',
        title: 'notEnoughRating',
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
