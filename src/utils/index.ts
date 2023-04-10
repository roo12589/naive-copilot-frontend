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
