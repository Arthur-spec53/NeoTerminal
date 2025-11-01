// XBoard Geek Theme - 优惠券服务
// Coupon API Services

import { apiClient } from '../client'
import type { Coupon, ApiResponse } from '@/types'

/**
 * 优惠券服务
 */
export const couponService = {
  /**
   * 检查优惠券
   */
  async check(code: string, planId: number): Promise<ApiResponse<Coupon>> {
    return apiClient.post<Coupon>('/user/coupon/check', {
      code,
      plan_id: planId
    })
  }
}

