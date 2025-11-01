// XBoard Geek Theme - 订单服务
// Order API Services

import { apiClient } from '../client'
import type {
  Order,
  CreateOrderRequest,
  CheckoutOrderRequest,
  CheckoutOrderResponse,
  PaymentMethod,
  ApiResponse
} from '@/types'

/**
 * 订单服务
 */
export const orderService = {
  /**
   * 创建订单
   */
  async create(data: CreateOrderRequest): Promise<ApiResponse<string>> {
    return apiClient.post<string>('/user/order/save', data)
  },

  /**
   * 订单结账
   */
  async checkout(data: CheckoutOrderRequest): Promise<ApiResponse<CheckoutOrderResponse>> {
    return apiClient.post<CheckoutOrderResponse>('/user/order/checkout', data)
  },

  /**
   * 检查订单状态
   */
  async check(tradeNo: string): Promise<ApiResponse<Order>> {
    return apiClient.get<Order>(`/user/order/check`, {
      params: { trade_no: tradeNo }
    })
  },

  /**
   * 获取订单详情
   */
  async getDetail(tradeNo: string): Promise<ApiResponse<Order>> {
    return apiClient.get<Order>(`/user/order/detail`, {
      params: { trade_no: tradeNo }
    })
  },

  /**
   * 获取订单列表
   */
  async fetch(): Promise<ApiResponse<Order[]>> {
    return apiClient.get<Order[]>('/user/order/fetch')
  },

  /**
   * 获取支付方式列表
   */
  async getPaymentMethods(): Promise<ApiResponse<PaymentMethod[]>> {
    return apiClient.get<PaymentMethod[]>('/user/order/getPaymentMethod')
  },

  /**
   * 取消订单
   */
  async cancel(tradeNo: string): Promise<ApiResponse<boolean>> {
    return apiClient.post<boolean>('/user/order/cancel', {
      trade_no: tradeNo
    })
  }
}

