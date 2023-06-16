interface Replacer {
    reg: RegExp | string
    component: JSX.Element | ((capture: string) => JSX.Element)
}
/**
 * 将字符串替换为指定jsx组件，返回拼接成的数组
 * 需要注意的是：不能包含捕获组！！前后规则顺序可能互相冲突！
 * @param {string} text - 要处理的输入字符串。
 * @param {Replacer[]} replacers - 包含替换规则的对象数组，需要注意规则的前后顺序可能冲突！！
 * @return {(string | JSX.Element)[]} 返回字符串和已被替换JSX元素拼接成数组
 */
export const useReplaceComponent = (text: string, replacers: Replacer[]) => {
    let parts: (string | JSX.Element)[] = [text]
    for (const replacer of replacers) {
        let { reg } = replacer
        parts = parts
            .map((p) => {
                if (typeof p === 'string' && p.match(reg)) {
                    return replaceComponent(p, replacer)
                }
                return p as JSX.Element
            })
            .flat()
    }
    return parts
}

const replaceComponent = (text: string, replacer: Replacer) => {
    let { reg, component } = replacer
    reg = convertToRegExpWithBrackets(reg)
    const parts = text.split(reg)
    return parts.map((part) => {
        if (part?.match(reg)) {
            if (typeof component === 'function' && part.match(reg)!.length >= 2) return component(part.match(reg)![1])

            return component as JSX.Element
        } else {
            return part
        }
    })
}

const convertToRegExpWithBrackets = (reg: string | RegExp) =>
    typeof reg === 'string' ? new RegExp(`(${reg})`) : (reg = new RegExp(`(${reg.source})`, reg.flags))
