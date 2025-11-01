// XBoard Geek Theme - 工单服务
// Ticket API Services

import { apiClient } from '../client'
import type {
  Ticket,
  CreateTicketRequest,
  ReplyTicketRequest,
  ApiResponse
} from '@/types'

/**
 * 工单服务
 */
export const ticketService = {
  /**
   * 获取工单列表
   */
  async fetch(): Promise<ApiResponse<Ticket[]>> {
    return apiClient.get<Ticket[]>('/user/ticket/fetch')
  },

  /**
   * 获取工单详情
   */
  async getDetail(id: number): Promise<ApiResponse<Ticket>> {
    return apiClient.get<Ticket>(`/user/ticket/fetch`, {
      params: { id }
    })
  },

  /**
   * 创建工单
   */
  async create(data: CreateTicketRequest): Promise<ApiResponse<Ticket>> {
    return apiClient.post<Ticket>('/user/ticket/save', data)
  },

  /**
   * 回复工单
   */
  async reply(data: ReplyTicketRequest): Promise<ApiResponse<boolean>> {
    return apiClient.post<boolean>('/user/ticket/reply', data)
  },

  /**
   * 关闭工单
   */
  async close(id: number): Promise<ApiResponse<boolean>> {
    return apiClient.post<boolean>('/user/ticket/close', { id })
  },

  /**
   * 撤回工单
   */
  async withdraw(id: number): Promise<ApiResponse<boolean>> {
    return apiClient.post<boolean>('/user/ticket/withdraw', { id })
  }
}
