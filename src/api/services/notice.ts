// XBoard Geek Theme - 公告服务
// Notice API Services

import { apiClient } from '../client'
import type { Notice, ApiResponse } from '@/types'

/**
 * 公告服务
 */
export const noticeService = {
  /**
   * 获取公告列表
   */
  async fetch(): Promise<ApiResponse<Notice[]>> {
    return apiClient.get<Notice[]>('/user/notice/fetch')
  }
}

