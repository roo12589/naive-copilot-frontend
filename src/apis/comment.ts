import type { PaginatedResponse } from '@/models/operation'
import type { MainCommentInfo } from '@/models/comment'

import api from './index'
import camelcaseKeys from 'camelcase-keys'

export async function useCommentList(
    copilotId: string | number,
    page = 1,
    limit = 10,
    orderBy = 'uploadTime',
    desc = true
    // justSeeId
): Promise<{
    commentList: MainCommentInfo[]
    commentListResponse: PaginatedResponse<MainCommentInfo>
}> {
    const CommentListResponse = (await getCommentList(copilotId, page, limit, orderBy, desc)).data
    const CommentList = CommentListResponse?.data || []
    const transformed = camelcaseKeys(
        {
            CommentList,
            CommentListResponse,
        },
        { deep: true }
    )
    return transformed
}

export const addComment = (
    message: string,
    operationId: string | number,
    fromCommentId?: string,
  ) => {
    return api.post('/comments/add', {
      copilot_id: operationId,
      message,
      from_comment_id: fromCommentId,
    })
  }
  
function getCommentList(copilotId: string | number, page = 1, limit = 10, orderBy = 'uploadTime', desc = true) {
    let url: string = `/comments/query?page=${page}&copilotId=${copilotId}&orderBy=${orderBy}&desc=${desc}&limit=${limit}`
    return api.get(url)
}
