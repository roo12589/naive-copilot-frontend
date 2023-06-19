export interface Setting {
    highlight: {
        enable?: boolean
        aspect?: { title: string; rules: Rule[] }[]
        // aspect?: { title: string; rules: Rule[] }[]
    }
}

// jsx不能持久化到storage 暂时放弃
// 可以加点颜色之类的
interface Rule {
    source: string
    //  | RegExp 不输入正则 而是用字符串创建
    enable: boolean
    color?: string
    // component?: JSX.Element | ((capture: string) => JSX.Element)
}
