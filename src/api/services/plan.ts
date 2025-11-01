// XBoard Geek Theme - 套餐服务
// Plan API Services

import { apiClient } from '../client'
import type { Plan, ApiResponse } from '@/types'

/**
 * 套餐服务
 */
export const planService = {
  /**
   * 获取套餐列表（用户）
   */
  async fetch(): Promise<ApiResponse<Plan[]>> {
    return apiClient.get<Plan[]>('/user/plan/fetch')
  },

  /**
   * 获取套餐列表（访客，无需认证）
   */
  async fetchGuest(): Promise<ApiResponse<Plan[]>> {
    return apiClient.get<Plan[]>('/guest/plan/fetch')
  }
}

