// import { useEffect } from 'react'
// import useSWR from 'swr'
// import useSWRInfinite from 'swr/infinite'

import { Response, solutionListInfo } from '@/types'
import type { Operation, OperationListItem, PaginatedResponse } from '@/models/operation'

import { parseShortCode, shortCodeScheme } from '../models/shortCode'
import api from './index'

export type OrderBy = 'views' | 'hot' | 'id'

export interface UseOperationsParams {
    orderBy: OrderBy
    document?: string
    levelKeyword?: string
    operator?: string
    byMyself?: boolean
    suspense?: boolean
}
export function getSolutionList(
    page: number,
    limit = 50,
    order_by: OrderBy = 'hot',
    desc = true,
    document?: string,
    level_keyword?: string,
    operator?: string
): Promise<Response<solutionListInfo>> {
    let url: string = `/copilot/query?desc=${desc}&limit=${limit}&page=${page}&order_by=${order_by}`
    if (document) url += `&document=${document}`
    if (level_keyword) url += `&level_keyword=${level_keyword}`
    if (operator) url += `&operator=${operator}`
    return api.get(url)
}

/* export const useOperations = ({
  orderBy,
  document,
  levelKeyword,
  operator,
  byMyself,
  suspense,
}: UseOperationsParams) => {
  const isIdQuery = document?.startsWith(shortCodeScheme)

  const {
    data: listData,
    size,
    setSize,
    isValidating,
  } = useSWRInfinite<Response<PaginatedResponse<OperationListItem>>>(
    (pageIndex, previousPageData) => {
      if (isIdQuery) {
        return null
      }
      if (previousPageData && !previousPageData?.data.hasNext) {
        console.info('useOperations: No more pages')
        return null // reached the end
      }
      const searchParams = new URLSearchParams('?desc=true&limit=50')
      searchParams.set('page', (pageIndex + 1).toString())
      searchParams.set('order_by', orderBy)
      if (document) {
        searchParams.set('document', document)
      }
      if (levelKeyword) {
        searchParams.set('level_keyword', levelKeyword)
      if (operator) {
        searchParams.set('operator', operator)
      }
      if (byMyself) {
        searchParams.set('uploader_id', 'me')
      }

      return `/copilot/query?${searchParams.toString()}`
    },
    {
      suspense,
      focusThrottleInterval: 1000 * 60 * 30,
    },
  )

  const { data: singleData } = useSWR<Response<Operation>>(
    isIdQuery && `/copilot/get/${parseShortCode(document!) || ''}`,
  )

  const isReachingEnd = isIdQuery || listData?.some((el) => !el.data.hasNext)

  const operations: OperationListItem[] =
    (isIdQuery
      ? singleData && [singleData.data]
      : listData?.map((el) => el.data.data).flat()) || []

  useEffect(() => {
    setSize(1)
  }, [orderBy, document, levelKeyword, operator, isIdQuery])

  return { operations, size, setSize, isValidating, isReachingEnd }
}

export interface UseOperationParams {
  id?: Operation['id']
  suspense?: boolean
}

export const useOperation = ({ id, suspense }: UseOperationParams) => {
  return useSWR<Response<Operation>>(id ? `/copilot/get/${id}` : null, {
    suspense,
  })
}
 */
