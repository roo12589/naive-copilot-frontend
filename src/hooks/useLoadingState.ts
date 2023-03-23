import { ref } from 'vue'

type ApiFunc = (...args: any[]) => Promise<any>
interface Options {
    loading?: boolean
    onSuccess?: () => any
}

export function useLoadingState(apiFunc: ApiFunc, options?: Options) {
    const { loading: l, onSuccess } = options || { loading: false }
    let loading = ref(l)

    const fn = async (...args) => {
        try {
            loading.value = true
            const res = await apiFunc(...args)
            console.log(res);
            
            onSuccess && onSuccess()
            return res
        } catch (error) {
            console.log(error)
        } finally {
            loading.value = false
        }
    }

    return {
        loading,
        fn,
    }
}
