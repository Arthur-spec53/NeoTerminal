// XBoard Geek Theme - 认证状态管理
// Auth Store

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authService } from '@/api/services/auth'
import { apiClient } from '@/api/client'
import type { LoginRequest, RegisterRequest, AuthResponse } from '@/types'
import { log, warn, logError } from '@/utils/logger'

export const useAuthStore = defineStore('auth', () => {
  // 状态
  const token = ref<string | null>(null)
  const isAuthenticated = ref(false)
  const isLoading = ref(false)
  const errorState = ref<string | null>(null)

  // 计算属性
  const hasToken = computed(() => !!token.value)

  /**
   * 初始化认证状态
   */
  function initialize() {
    const savedToken = apiClient.getToken()
    if (savedToken) {
      token.value = savedToken
      isAuthenticated.value = true
    }
  }

  /**
   * 设置 token
   */
  function setToken(newToken: string | null) {
    token.value = newToken
    isAuthenticated.value = !!newToken
    apiClient.setToken(newToken)
  }

  /**
   * 登录
   */
  async function login(credentials: LoginRequest) {
    isLoading.value = true
    errorState.value = null

    try {
      const response = await authService.login(credentials)
      
      log('🔐 Login response received')
      
      if (response.success && response.data) {
        // XBoard 返回 auth_data 字段，这才是真正需要的认证数据
        const authData = response.data.auth_data
        
        if (authData) {
          // 使用加密存储保存 auth_data
          token.value = authData
          isAuthenticated.value = true
          apiClient.setToken(authData)
          log('✅ Auth data saved successfully')
          return true
        } else {
          logError('❌ No auth_data in response')
          errorState.value = 'Auth data not found in response'
          return false
        }
      } else {
        errorState.value = response.message || '登录失败'
        warn('❌ Login failed:', response.message)
        return false
      }
    } catch (err: any) {
      logError('❌ Login error:', err)
      errorState.value = err.message || '登录失败，请稍后重试'
      return false
    } finally {
      isLoading.value = false
    }
  }

  /**
   * 注册
   */
  async function register(data: RegisterRequest) {
    isLoading.value = true
    errorState.value = null

    try {
      const response = await authService.register(data)
      
      if (response.success && response.data.token) {
        setToken(response.data.token)
        log('✅ Registration successful')
        return true
      } else {
        errorState.value = response.message || '注册失败'
        warn('❌ Registration failed:', response.message)
        return false
      }
    } catch (err: any) {
      errorState.value = err.message || '注册失败，请稍后重试'
      logError('❌ Registration error:', err)
      return false
    } finally {
      isLoading.value = false
    }
  }

  /**
   * 登出
   */
  function logout() {
    setToken(null)
    // 清除其他 store 的数据（如果需要）
    // 可以通过事件或直接调用其他 store 的 reset 方法
  }

  /**
   * 发送邮箱验证码
   */
  async function sendEmailCode(email: string) {
    isLoading.value = true
    errorState.value = null

    try {
      const response = await authService.sendEmailVerify(email)
      log('✅ Email code sent')
      return response.success
    } catch (err: any) {
      errorState.value = err.message || '发送验证码失败'
      logError('❌ Send email code failed:', err)
      return false
    } finally {
      isLoading.value = false
    }
  }

  /**
   * 忘记密码
   */
  async function forgetPassword(email: string) {
    isLoading.value = true
    errorState.value = null

    try {
      const response = await authService.forgetPassword(email)
      log('✅ Password reset request sent')
      return response.success
    } catch (err: any) {
      errorState.value = err.message || '操作失败'
      logError('❌ Forget password failed:', err)
      return false
    } finally {
      isLoading.value = false
    }
  }

  /**
   * 清除错误
   */
  function clearError() {
    errorState.value = null
  }

  return {
    // 状态
    token,
    isAuthenticated,
    isLoading,
    error: errorState,
    
    // 计算属性
    hasToken,
    
    // 方法
    initialize,
    setToken,
    login,
    register,
    logout,
    sendEmailCode,
    forgetPassword,
    clearError
  }
})
