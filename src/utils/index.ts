export function exportJson(filename: string, data: string) {
    let blob = new Blob([data]) //  创建 blob 对象
    let link = document.createElement('a')
    link.href = URL.createObjectURL(blob) //  创建一个 URL 对象并传给 a 的 href
    link.download = filename //  设置下载的默认文件名
    link.click()
}

// 复制到剪切板
export async function copyText(text) {
    try {
        if (navigator.clipboard && window.isSecureContext) {
            const clipboardObj = navigator.clipboard
            await clipboardObj.writeText(text)
        } else {
            let textArea = document.createElement('textarea')
            textArea.value = text
            // 使text area不在viewport，同时设置不可见
            textArea.style.position = 'absolute'
            textArea.style.opacity = '0'
            textArea.style.left = '-999999px'
            textArea.style.top = '-999999px'
            document.body.appendChild(textArea)
            textArea.focus()
            textArea.select()
            await new Promise((res: any, rej: any) => {
                // 执行复制命令并移除文本框
                document.execCommand('copy') ? res() : rej()
                textArea.remove()
            })
        }
        window.$message.success('复制成功')
    } catch (err) {
        window.$message.error('复制失败' + err)
    }
}
export function stringToRGB(str) {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash)
    }

    let r = Math.abs((hash >> 16) & 0xff)
    let g = Math.abs((hash >> 8) & 0xff)
    let b = Math.abs(hash & 0xff)

    return `rgb(${r}, ${g}, ${b})`
}
export function isLightColor(str) {
    const regex = /rgb\((\d+),\s?(\d+),\s?(\d+)\)/
    const matches = str.match(regex)
    const [, r, g, b] = matches
    // 转换为 HSL 值
    const hsl = rgbToHsl(r, g, b)
    // 判断亮度是否大于 50
    return hsl[2] > 0.5
}

// 将 RGB 转换为 HSL 值
function rgbToHsl(r, g, b) {
    r /= 255
    g /= 255
    b /= 255

    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    let h,
        s,
        l = (max + min) / 2

    if (max === min) {
        h = s = 0
    } else {
        const d = max - min
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
        switch (max) {
            case r:
                h = (g - b) / d + (g < b ? 6 : 0)
                break
            case g:
                h = (b - r) / d + 2
                break
            case b:
                h = (r - g) / d + 4
                break
        }
        h /= 6
    }
    return [h, s, l]
}

export const requireImg = (imgPath: string) => {
    return new URL(`../assets/images/${imgPath}`, import.meta.url).href
}
