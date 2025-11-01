// XBoard Geek Theme - 用户状态管理
// User Store

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { userService } from '@/api'
import type { User, Subscription, TrafficUsage, ExpirationInfo } from '@/types'

export const useUserStore = defineStore('user', () => {
  // 状态
  const userInfo = ref<User | null>(null)
  const subscription = ref<Subscription | null>(null)
  const stats = ref<[number, number, number]>([0, 0, 0])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // 计算属性 - 用户基本信息
  const email = computed(() => userInfo.value?.email || '')
  const avatar = computed(() => userInfo.value?.avatar_url || '')
  const balance = computed(() => userInfo.value?.balance || 0)
  const commissionBalance = computed(() => userInfo.value?.commission_balance || 0)

  // 计算属性 - 统计数据
  const pendingOrders = computed(() => stats.value[0] || 0)
  const pendingTickets = computed(() => stats.value[1] || 0)
  const invitedUsers = computed(() => stats.value[2] || 0)

  // 计算属性 - 流量使用
  const trafficUsage = computed<TrafficUsage>(() => {
    if (!subscription.value) {
      return {
        used: 0,
        total: 0,
        remaining: 0,
        percentage: 0,
        usedFormatted: '0 B',
        totalFormatted: '0 B',
        remainingFormatted: '0 B'
      }
    }

    const used = subscription.value.u + subscription.value.d
    const total = subscription.value.transfer_enable
    const remaining = Math.max(0, total - used)
    const percentage = total > 0 ? (used / total) * 100 : 0

    return {
      used,
      total,
      remaining,
      percentage: Math.min(percentage, 100),
      usedFormatted: formatBytes(used),
      totalFormatted: formatBytes(total),
      remainingFormatted: formatBytes(remaining)
    }
  })

  // 计算属性 - 到期信息
  const expirationInfo = computed<ExpirationInfo>(() => {
    if (!subscription.value) {
      return {
        expiredAt: 0,
        daysLeft: 0,
        isExpiringSoon: false,
        isExpired: true,
        formatted: '未订阅'
      }
    }

    const expiredAt = subscription.value.expired_at
    
    // 如果 expired_at 为 null/undefined/0，表示永久订阅或无限期
    if (!expiredAt || expiredAt === 0) {
      console.log('[UserStore] expired_at 为空，视为永久订阅')
      return {
        expiredAt: 0,
        daysLeft: 999999, // 一个很大的数字表示"无限期"
        isExpiringSoon: false,
        isExpired: false, // 永久订阅不会过期
        formatted: '永久有效'
      }
    }
    
    const now = Math.floor(Date.now() / 1000)
    const daysLeft = Math.max(0, Math.ceil((expiredAt - now) / 86400))
    const isExpired = expiredAt < now
    const isExpiringSoon = !isExpired && daysLeft <= 7

    return {
      expiredAt,
      daysLeft,
      isExpiringSoon,
      isExpired,
      formatted: isExpired ? '已过期' : `剩余 ${daysLeft} 天`
    }
  })

  // 计算属性 - 是否有活跃订阅
  const hasActiveSubscription = computed(() => {
    const hasSubscription = subscription.value !== null
    const isExpired = expirationInfo.value.isExpired
    const result = hasSubscription && !isExpired
    
    console.log('[UserStore] hasActiveSubscription 计算:')
    console.log('  - subscription 存在:', hasSubscription)
    console.log('  - isExpired:', isExpired)
    console.log('  - 结果:', result)
    
    if (subscription.value) {
      console.log('  - expired_at:', subscription.value.expired_at)
      console.log('  - 当前时间:', Math.floor(Date.now() / 1000))
    }
    
    return result
  })

  // 计算属性 - 订阅链接
  const subscribeUrl = computed(() => subscription.value?.subscribe_url || '')

  /**
   * 获取用户信息
   */
  async function fetchUserInfo() {
    isLoading.value = true
    error.value = null

    try {
      const response = await userService.getInfo()
      if (response.success) {
        userInfo.value = response.data
      }
    } catch (err: any) {
      error.value = err.message || '获取用户信息失败'
    } finally {
      isLoading.value = false
    }
  }

  /**
   * 获取订阅信息
   */
  async function fetchSubscription() {
    isLoading.value = true
    error.value = null

    try {
      const response = await userService.getSubscribe()
      if (response.success) {
        subscription.value = response.data
      }
    } catch (err: any) {
      error.value = err.message || '获取订阅信息失败'
    } finally {
      isLoading.value = false
    }
  }

  /**
   * 获取统计数据
   */
  async function fetchStats() {
    try {
      const response = await userService.getStat()
      if (response.success) {
        stats.value = response.data
      }
    } catch (err: any) {
      console.error('获取统计数据失败:', err)
    }
  }

  /**
   * 刷新所有用户数据
   */
  async function refreshAll() {
    await Promise.all([
      fetchUserInfo(),
      fetchSubscription(),
      fetchStats()
    ])
  }

  /**
   * 修改密码
   */
  async function changePassword(oldPassword: string, newPassword: string) {
    isLoading.value = true
    error.value = null

    try {
      const response = await userService.changePassword({
        old_password: oldPassword,
        new_password: newPassword
      })
      return response.success
    } catch (err: any) {
      error.value = err.message || '修改密码失败'
      return false
    } finally {
      isLoading.value = false
    }
  }

  /**
   * 佣金划转
   */
  async function transferCommission(amount: number) {
    isLoading.value = true
    error.value = null

    try {
      const response = await userService.transfer(amount)
      if (response.success) {
        // 刷新用户信息
        await fetchUserInfo()
      }
      return response.success
    } catch (err: any) {
      error.value = err.message || '划转失败'
      return false
    } finally {
      isLoading.value = false
    }
  }

  /**
   * 重置订阅 URL
   */
  async function resetSubscription() {
    isLoading.value = true
    error.value = null

    try {
      const response = await userService.resetSubscribe()
      if (response.success) {
        // 重新获取订阅信息以更新 URL
        await fetchSubscription()
      }
      return response.success
    } catch (err: any) {
      error.value = err.message || '重置订阅链接失败'
      return false
    } finally {
      isLoading.value = false
    }
  }

  /**
   * 重置用户数据
   */
  function reset() {
    userInfo.value = null
    subscription.value = null
    stats.value = [0, 0, 0]
    error.value = null
  }

  /**
   * 清除错误
   */
  function clearError() {
    error.value = null
  }

  return {
    // 状态
    userInfo,
    subscription,
    stats,
    isLoading,
    error,

    // 计算属性
    email,
    avatar,
    balance,
    commissionBalance,
    pendingOrders,
    pendingTickets,
    invitedUsers,
    trafficUsage,
    expirationInfo,
    hasActiveSubscription,
    subscribeUrl,

    // 方法
    fetchUserInfo,
    fetchSubscription,
    fetchStats,
    refreshAll,
    changePassword,
    transferCommission,
    resetSubscription,
    reset,
    clearError
  }
})

/**
 * 格式化字节数
 */
function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B'
  
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`
}
