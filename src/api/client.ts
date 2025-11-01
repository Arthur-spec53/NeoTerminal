// XBoard Geek Theme - HTTP 客户端封装
// 基于 Axios

import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse, type AxiosError } from 'axios'
import type { ApiResponse } from '@/types'
import { secureStorage } from '@/utils/crypto'
import { log, warn, logError } from '@/utils/logger'

/**
 * API 客户端类
 */
class ApiClient {
  private instance: AxiosInstance
  private token: string | null = null

  constructor() {
    // 创建 Axios 实例
    // 开发环境使用代理避免 CORS，生产环境使用完整 URL
    const baseURL = import.meta.env.DEV 
      ? '/api/v1'  // 开发环境：使用代理
      : (import.meta.env.VITE_API_BASE_URL || '/api/v1')  // 生产环境
    
    this.instance = axios.create({
      baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })

    // 从 localStorage 加载 token
    this.loadToken()

    // 设置请求拦截器
    this.setupRequestInterceptor()

    // 设置响应拦截器
    this.setupResponseInterceptor()
  }

  /**
   * 加载保存的 token（加密存储）
   */
  private loadToken(): void {
    try {
      const savedToken = secureStorage.getItem('auth_token')
      if (savedToken) {
        this.token = savedToken
        log('[API] Token已从安全存储加载')
      }
    } catch (err) {
      logError('Failed to load token from secure storage:', err)
    }
  }

  /**
   * 设置认证 token（加密存储）
   */
  public setToken(token: string | null): void {
    this.token = token
    if (token) {
      secureStorage.setItem('auth_token', token)
      log('[API] Token已保存到安全存储')
    } else {
      secureStorage.removeItem('auth_token')
      log('[API] Token已清除')
    }
  }

  /**
   * 获取当前 token
   */
  public getToken(): string | null {
    return this.token
  }

  /**
   * 清除 token
   */
  public clearToken(): void {
    this.setToken(null)
  }

  /**
   * 设置请求拦截器
   */
  private setupRequestInterceptor(): void {
    this.instance.interceptors.request.use(
      (config) => {
        // 检查是否是访客API（不需要认证）
        const isGuestApi = config.url?.includes('/guest/') || config.url?.includes('/passport/')
        
        // 只有非访客API才添加token
        if (!isGuestApi) {
          const currentToken = secureStorage.getItem('auth_token')
          if (currentToken) {
            this.token = currentToken
            // XBoard使用小写的authorization header
            config.headers['authorization'] = currentToken
            log('🔑 Token added to request')
          } else {
            warn('⚠️ No token found in secure storage')
          }
        } else {
          log('🌐 Guest API - 跳过token认证')
        }

        // 添加时间戳避免缓存
        if (config.method === 'get') {
          config.params = {
            ...config.params,
            _t: Date.now()
          }
        }

        // 添加请求签名（防重放攻击）
        if (!import.meta.env.DEV) {
          config.headers['X-Request-Time'] = Date.now().toString()
        }

        // 调试日志（仅开发环境）
        log('🚀 API Request:', {
          method: config.method?.toUpperCase(),
          url: config.url,
          isGuest: isGuestApi
        })

        return config
      },
      (err) => {
        logError('❌ Request Error:', err)
        return Promise.reject(err)
      }
    )
  }

  /**
   * 设置响应拦截器
   */
  private setupResponseInterceptor(): void {
    this.instance.interceptors.response.use(
      (response: AxiosResponse<any>) => {
        // 调试日志（仅开发环境）
        log('✅ API Response:', {
          url: response.config.url,
          status: response.status
        })

        // XBoard 后端返回格式：{ status: 'success'/'fail', message: '...', data: {...} }
        // 需要转换为统一格式：{ success: boolean, data: any, message?: string }
        const originalData = response.data
        
        // 如果后端返回的是 { status: 'success', ... } 格式
        if (originalData && typeof originalData.status === 'string') {
          response.data = {
            success: originalData.status === 'success',
            data: originalData.data,
            message: originalData.message,
            error: originalData.error
          } as ApiResponse
        }
        // 如果已经是 { success: boolean, ... } 格式，保持不变
        else if (originalData && typeof originalData.success === 'boolean') {
          // 已经是正确格式，不需要转换
        }
        // 其他情况，假设整个响应就是 data
        else {
          response.data = {
            success: true,
            data: originalData,
            message: 'OK'
          } as ApiResponse
        }

        // 返回响应数据
        return response
      },
      (error: AxiosError<ApiResponse>) => {
        // 处理错误响应
        const response = error.response

        if (response) {
          const { status, data } = response

          // 401 未授权 - token 失效
          if (status === 401) {
            this.handleUnauthorized()
          }

          // 403 禁止访问
          if (status === 403) {
            this.handleForbidden()
          }

          // 500 服务器错误
          if (status === 500) {
            this.handleServerError()
          }

          // 调试日志（仅开发环境）
          logError('❌ API Error:', {
            status,
            url: response.config.url,
            message: data?.message || error.message
          })

          // 返回错误信息
          return Promise.reject({
            status,
            message: data?.message || error.message,
            data: data?.data
          })
        }

        // 网络错误或请求超时
        if (error.code === 'ECONNABORTED') {
          return Promise.reject({
            status: 0,
            message: '请求超时，请检查网络连接'
          })
        }

        return Promise.reject({
          status: 0,
          message: error.message || '网络错误，请检查连接'
        })
      }
    )
  }

  /**
   * 处理未授权错误
   */
  private handleUnauthorized(): void {
    // 清除 token
    this.clearToken()

    // 触发全局事件
    window.dispatchEvent(new CustomEvent('auth:unauthorized'))

    // 跳转到登录页（如果不在登录页）
    if (!window.location.pathname.includes('/login')) {
      window.location.href = '/login'
    }
  }

  /**
   * 处理禁止访问错误
   */
  private handleForbidden(): void {
    // 触发全局事件
    window.dispatchEvent(new CustomEvent('auth:forbidden'))
  }

  /**
   * 处理服务器错误
   */
  private handleServerError(): void {
    // 触发全局事件
    window.dispatchEvent(new CustomEvent('api:server-error'))
  }

  /**
   * GET 请求
   */
  public async get<T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await this.instance.get<ApiResponse<T>>(url, config)
    return response.data
  }

  /**
   * POST 请求
   */
  public async post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await this.instance.post<ApiResponse<T>>(url, data, config)
    return response.data
  }

  /**
   * PUT 请求
   */
  public async put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await this.instance.put<ApiResponse<T>>(url, data, config)
    return response.data
  }

  /**
   * DELETE 请求
   */
  public async delete<T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await this.instance.delete<ApiResponse<T>>(url, config)
    return response.data
  }

  /**
   * PATCH 请求
   */
  public async patch<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await this.instance.patch<ApiResponse<T>>(url, data, config)
    return response.data
  }

  /**
   * 直接访问 axios 实例（用于特殊需求）
   */
  public getInstance(): AxiosInstance {
    return this.instance
  }
}

// 导出单例
export const apiClient = new ApiClient()

// 导出类型
export type { ApiClient }

