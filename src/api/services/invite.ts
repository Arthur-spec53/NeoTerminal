// XBoard Geek Theme - 邀请服务
// Invite API Services

import { apiClient } from '../client'
import type { InviteStat, InviteDetail, ApiResponse } from '@/types'

/**
 * 邀请服务
 */
export const inviteService = {
  /**
   * 获取邀请信息和统计
   */
  async fetch(): Promise<ApiResponse<InviteStat>> {
    return apiClient.get<InviteStat>('/user/invite/fetch')
  },

  /**
   * 生成新的邀请码
   */
  async create(): Promise<ApiResponse<boolean>> {
    return apiClient.get<boolean>('/user/invite/save')
  },

  /**
   * 获取邀请详情列表
   */
  async getDetails(): Promise<ApiResponse<InviteDetail[]>> {
    return apiClient.get<InviteDetail[]>('/user/invite/details')
  }
}

