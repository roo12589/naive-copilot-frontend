import { useReplaceComponent } from '@/hooks/useReplaceComponent'
import { NAvatar, NIcon, NImage, NTag } from 'naive-ui'
import type { SelectOption } from 'naive-ui'
import { Component, h } from 'vue'

export const RenderArticle = ({ details }) => {
    const biliHttpReg =
        /https?:\/\/(?:www\.)?bilibili\.com\/video\/(?:[AaBb][Vv][a-zA-Z0-9]+)(?:[\w\-\.,@?^=%&:\/~\+#]*[\w\-\@?^=%&\/~\+#])?/
    const BVReg = /[AaBb][Vv][a-zA-Z0-9]+/
    const imgHttpReg =
        /((ht|f)tps?):\/\/[\w\-]+(\.[\w\-]+)+([\w\-\.,@?^=%&:\/~\+#]*[\w\-\@?^=%&\/~\+#])?\.(png|jpg|jpeg|gif)/
    const httpReg =
        /(?:(?:ht|f)tps?):\/\/[\w\-]+(?:\.(?!bilibili)[\w\-]+)+(?:[\w\-\.,@?^=%&:\/~\+#]*[\w\-\@?^=%&\/~\+#])?/
    const replaced = useReplaceComponent(details, [
        {
            reg: biliHttpReg,
            component: (c) => (
                <a href={c} onClick={(e) => e.stopPropagation()}>
                    {c}
                </a>
            ),
        },
        {
            reg: BVReg,
            component: (bv) => (
                <a href={'https://www.bilibili.com/video/' + bv} onClick={(e) => e.stopPropagation()}>
                    {bv}
                </a>
            ),
        },
        {
            reg: imgHttpReg,
            component: (c) => (
                <a onClick={(e) => e.stopPropagation()}>
                    <NImage fallback-src width="100" src={c} alt="如图片加载失败，请尝试点击前往" />,
                </a>
            ),
        },
        {
            reg: httpReg,
            component: (c) => (
                <a href={c} onClick={(e) => e.stopPropagation()}>
                    {c}
                </a>
            ),
        },
    ])
    return <>{replaced}</>
}
export const renderLabel = (option: SelectOption) => {
    return (
        <div class="flex justify-center items-center">
            <NAvatar size="small" src={'https://prts.plus/assets/operator-avatars/' + option.id + '.png'}></NAvatar>
            <span>{option.label}</span>
        </div>
    )
}
export const renderTagInclude = ({ option, handleClose }) => {
    return (
        <NTag type="success" closable onClose={handleClose}>
            {option.label}
        </NTag>
    )
}
export const renderTagExclude = ({ option, handleClose }) => {
    return (
        <NTag type="error" closable onClose={handleClose}>
            {option.label}
        </NTag>
    )
}
export function renderSortIcon(icon: Component) {
    return () => {
        return h(NIcon, null, {
            default: () => h(icon),
        })
    }
}
