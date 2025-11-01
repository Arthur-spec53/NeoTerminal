// XBoard Geek Theme - 统计服务
// Stat API Services

import { apiClient } from '../client'
import type { TrafficLog, ApiResponse } from '@/types'

/**
 * 统计服务
 */
export const statService = {
  /**
   * 获取流量日志
   */
  async getTrafficLog(): Promise<ApiResponse<TrafficLog[]>> {
    return apiClient.get<TrafficLog[]>('/user/stat/getTrafficLog')
  }
}

