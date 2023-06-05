import camelcaseKeys from 'camelcase-keys'
import api from './index'
import { Level } from '@/models/operation'

export const useLevel = async (): Promise<Level[]> => {
    const levels = (await getLevel()).data
    const transformed = camelcaseKeys(levels, { deep: true })
    return transformed
}
function getLevel() {
    return api.get('/arknights/level')
}
