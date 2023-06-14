/**
 *
 * @param text
 * @param reg 需要用括号包裹才能正确识别
 * @param component 用于替换的组件或返回组件的函数
 * @returns 返回已将命中字段替换为组件的数组
 * @todo 问题： 1. 正则必须用括号捕获组包裹
 *             2. 正则不能使用g修饰符
 *             3. 不能用于重复替换
 *             4. 返回数组 渲染需要用<></>包裹
 */
export const useReplaceComponent = (
    text: string,
    reg: RegExp,
    component: JSX.Element | ((capture: string) => JSX.Element)
) => {
    const parts = text.split(reg)
    const replacedArr = parts.map((part) => {
        console.log(part.match(reg))

        if (part.match(reg)) {
            if (typeof component === 'function' && part.match(reg)?.length === 2) return component(part.match(reg)![1])

            return component as JSX.Element
        } else {
            return part
        }
    })
    return replacedArr
}
