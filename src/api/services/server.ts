// XBoard Geek Theme - 节点服务
// Server API Services

import { apiClient } from '../client'
import type { Server, ApiResponse } from '@/types'

/**
 * 节点服务
 */
export const serverService = {
  /**
   * 获取节点列表
   */
  async fetch(): Promise<ApiResponse<Server[]>> {
    return apiClient.get<Server[]>('/user/server/fetch')
  }
}

