// XBoard Geek Theme - 认证服务
// Auth API Services

import { apiClient } from '../client'
import type {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  ApiResponse
} from '@/types'

/**
 * 认证服务
 */
export const authService = {
  /**
   * 用户登录
   */
  async login(data: LoginRequest): Promise<ApiResponse<AuthResponse>> {
    return apiClient.post<AuthResponse>('/passport/auth/login', data)
  },

  /**
   * 用户注册
   */
  async register(data: RegisterRequest): Promise<ApiResponse<AuthResponse>> {
    return apiClient.post<AuthResponse>('/passport/auth/register', data)
  },

  /**
   * 发送邮箱验证码（通用）
   */
  async sendEmailVerify(email: string): Promise<ApiResponse<boolean>> {
    return apiClient.post<boolean>('/passport/comm/sendEmailVerify', { email })
  },

  /**
   * 发送邮箱验证码（注册用）
   */
  async sendEmailVerifyCode(email: string): Promise<ApiResponse<boolean>> {
    return apiClient.post<boolean>('/passport/comm/sendEmailVerify', { email })
  },

  /**
   * 发送密码重置验证码
   */
  async sendPasswordResetCode(email: string): Promise<ApiResponse<boolean>> {
    return apiClient.post<boolean>('/passport/auth/forget', { email })
  },

  /**
   * 重置密码
   */
  async resetPassword(data: {
    email: string
    email_code: string
    password: string
    password_confirmation: string
  }): Promise<ApiResponse<boolean>> {
    return apiClient.post<boolean>('/passport/auth/reset', data)
  },

  /**
   * 忘记密码（旧方法，保持兼容）
   */
  async forgetPassword(email: string): Promise<ApiResponse<boolean>> {
    return apiClient.post<boolean>('/passport/auth/forget', { email })
  },

  /**
   * 通过邮件链接登录
   */
  async loginWithMailLink(email: string, redirect?: string): Promise<ApiResponse<any>> {
    return apiClient.post<any>('/passport/auth/loginWithMailLink', {
      email,
      redirect
    })
  },

  /**
   * 获取快速登录 URL
   */
  async getQuickLoginUrl(redirect?: string): Promise<ApiResponse<string>> {
    return apiClient.post<string>('/passport/auth/getQuickLoginUrl', { redirect })
  }
}

