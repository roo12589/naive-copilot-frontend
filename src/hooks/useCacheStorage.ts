/* api需要直接得到数据，默认缓存有效一天 */
export const useCacheStorage = async (
    key: string,
    options: { api: () => Promise<any>; interval?: number; refresh?: boolean }
) => {
    const { api, interval = 86400 * 1000, refresh = false } = options
    const cacheTime = parseInt(localStorage.getItem(`${key}_cacheTime`) || '') || new Date(0).getTime()

    if (refresh || Date.now() - cacheTime > interval) {
        const data = await api()
        localStorage.setItem(key, JSON.stringify(data))
        localStorage.setItem(`${key}_cacheTime`, JSON.stringify(Date.now()))
        return data
    }
    const cached = localStorage.getItem(key)
    if (cached) {
        return JSON.parse(cached)
    }
}
