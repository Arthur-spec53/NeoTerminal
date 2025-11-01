// XBoard Geek Theme - 礼品卡服务
// Gift Card API Services

import { apiClient } from '../client'
import type {
  GiftCardType,
  RedeemGiftCardRequest,
  ApiResponse
} from '@/types'

/**
 * 礼品卡服务
 */
export const giftCardService = {
  /**
   * 检查礼品卡
   */
  async check(code: string): Promise<ApiResponse<any>> {
    return apiClient.post<any>('/user/gift-card/check', { code })
  },

  /**
   * 兑换礼品卡
   */
  async redeem(data: RedeemGiftCardRequest): Promise<ApiResponse<boolean>> {
    return apiClient.post<boolean>('/user/gift-card/redeem', data)
  },

  /**
   * 获取礼品卡兑换历史
   */
  async getHistory(): Promise<ApiResponse<any[]>> {
    return apiClient.get<any[]>('/user/gift-card/history')
  },

  /**
   * 获取礼品卡详情
   */
  async getDetail(code: string): Promise<ApiResponse<any>> {
    return apiClient.get<any>('/user/gift-card/detail', {
      params: { code }
    })
  },

  /**
   * 获取礼品卡类型列表
   */
  async getTypes(): Promise<ApiResponse<GiftCardType[]>> {
    return apiClient.get<GiftCardType[]>('/user/gift-card/types')
  }
}

