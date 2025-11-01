// XBoard Geek Theme - 用户服务
// User API Services

import { apiClient } from '../client'
import type {
  User,
  UserStat,
  Subscription,
  ChangePasswordRequest,
  UserSession,
  ApiResponse
} from '@/types'

/**
 * 用户服务
 */
export const userService = {
  /**
   * 获取用户信息
   */
  async getInfo(): Promise<ApiResponse<User>> {
    return apiClient.get<User>('/user/info')
  },

  /**
   * 获取用户订阅信息
   */
  async getSubscribe(): Promise<ApiResponse<Subscription>> {
    return apiClient.get<Subscription>('/user/getSubscribe')
  },

  /**
   * 重置订阅链接
   */
  async resetSubscribe(): Promise<ApiResponse<boolean>> {
    return apiClient.get<boolean>('/user/resetSubscribe')
  },

  /**
   * 获取用户统计数据
   */
  async getStat(): Promise<ApiResponse<[number, number, number]>> {
    return apiClient.get<[number, number, number]>('/user/getStat')
  },

  /**
   * 检查登录状态
   */
  async checkLogin(): Promise<ApiResponse<{ is_login: boolean; is_admin?: boolean }>> {
    return apiClient.get<{ is_login: boolean; is_admin?: boolean }>('/user/checkLogin')
  },

  /**
   * 修改密码
   */
  async changePassword(data: ChangePasswordRequest): Promise<ApiResponse<boolean>> {
    return apiClient.post<boolean>('/user/changePassword', data)
  },

  /**
   * 更新用户信息
   */
  async update(data: Partial<User>): Promise<ApiResponse<boolean>> {
    return apiClient.post<boolean>('/user/update', data)
  },

  /**
   * 佣金划转到余额
   */
  async transfer(amount: number): Promise<ApiResponse<boolean>> {
    return apiClient.post<boolean>('/user/transfer', { amount })
  },

  /**
   * 获取活跃会话列表
   */
  async getActiveSessions(): Promise<ApiResponse<UserSession[]>> {
    return apiClient.get<UserSession[]>('/user/getActiveSession')
  },

  /**
   * 移除指定会话
   */
  async removeSession(sessionId: string): Promise<ApiResponse<boolean>> {
    return apiClient.post<boolean>('/user/removeActiveSession', {
      session_id: sessionId
    })
  },

  /**
   * 重置安全设置
   */
  async resetSecurity(): Promise<ApiResponse<boolean>> {
    return apiClient.get<boolean>('/user/resetSecurity')
  }
}
