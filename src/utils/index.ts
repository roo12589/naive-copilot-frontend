import JSZip from 'jszip'

export function exportJson(filename: string, data: string) {
    let blob = new Blob([data]) //  创建 blob 对象
    let link = document.createElement('a')
    link.href = URL.createObjectURL(blob) //  创建一个 URL 对象并传给 a 的 href
    link.download = filename + '.json' //  设置下载的默认文件名
    link.click()
}
interface JSONObj {
    /** 文件名 */
    name: string
    /** JSON内容 */
    content: string
}
export function exportZip(list: JSONObj[], zipName?: string) {
    const zip = new JSZip()
    for (const j of list) {
        zip.file(j.name + '.json', j.content)
    }
    // 生成 ZIP 文件
    zip.generateAsync({ type: 'blob' })
        .then((content) => {
            // 创建一个下载链接
            const downloadLink = document.createElement('a')
            downloadLink.href = URL.createObjectURL(content)
            // fix 适配band zip不能双击打开带空格zip的情况
            downloadLink.download =
                zipName || `作业_${formatDate(new Date(), 'YYYY-MM-DD_HH:mm:ss')}_${list.length}条.zip`

            // 触发点击事件以下载 ZIP 文件
            downloadLink.click()
        })
        .catch((error) => {
            console.error('Failed to generate ZIP file:', error)
        })
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

/**
 * @param {number | string | Date} timestamp - 13位时间戳 | new Date() | Date()
 * @param {string} [format='YYYY-MM-DD HH:mm:ss'] - YY：年，M：月，D：日，H：时，m：分钟，s：秒，SSS：毫秒
 *   Possible format options: YY, YYYY, M, MM, D, DD, H, HH, m, mm, s, ss, SSS.
 * @returns {string} The formatted timestamp string.
 */
export function formatDate(timestamp = new Date(), format = 'YYYY-MM-DD HH:mm:ss'): string {
    var date = new Date(timestamp)
    function fixedTwo(value: number): string {
        return value < 10 ? '0' + value : String(value)
    }
    var showTime = format
    if (showTime.includes('SSS')) {
        const S = date.getMilliseconds()
        showTime = showTime.replace('SSS', '0'.repeat(3 - String(S).length) + S)
    }
    if (showTime.includes('YY')) {
        const Y = date.getFullYear()
        showTime = showTime.includes('YYYY')
            ? showTime.replace('YYYY', String(Y))
            : showTime.replace('YY', String(Y).slice(2, 4))
    }
    if (showTime.includes('M')) {
        const M = date.getMonth() + 1
        showTime = showTime.includes('MM') ? showTime.replace('MM', fixedTwo(M)) : showTime.replace('M', String(M))
    }
    if (showTime.includes('D')) {
        const D = date.getDate()
        showTime = showTime.includes('DD') ? showTime.replace('DD', fixedTwo(D)) : showTime.replace('D', String(D))
    }
    if (showTime.includes('H')) {
        const H = date.getHours()
        showTime = showTime.includes('HH') ? showTime.replace('HH', fixedTwo(H)) : showTime.replace('H', String(H))
    }
    if (showTime.includes('m')) {
        var m = date.getMinutes()
        showTime = showTime.includes('mm') ? showTime.replace('mm', fixedTwo(m)) : showTime.replace('m', String(m))
    }
    if (showTime.includes('s')) {
        var s = date.getSeconds()
        showTime = showTime.includes('ss') ? showTime.replace('ss', fixedTwo(s)) : showTime.replace('s', String(s))
    }
    return showTime
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
