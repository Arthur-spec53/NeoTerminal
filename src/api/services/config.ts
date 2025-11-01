// XBoard Geek Theme - 配置服务
// Config API Services

import { apiClient } from '../client'
import type { SystemConfig, ApiResponse } from '@/types'

/**
 * 配置服务
 */
export const configService = {
  /**
   * 获取系统配置（用户）
   */
  async fetch(): Promise<ApiResponse<SystemConfig>> {
    return apiClient.get<SystemConfig>('/user/comm/config')
  },

  /**
   * 获取系统配置（访客，无需认证）
   */
  async fetchGuest(): Promise<ApiResponse<SystemConfig>> {
    return apiClient.get<SystemConfig>('/guest/comm/config')
  },

  /**
   * 获取 Stripe 公钥
   */
  async getStripePublicKey(): Promise<ApiResponse<string>> {
    return apiClient.post<string>('/user/comm/getStripePublicKey')
  }
}

