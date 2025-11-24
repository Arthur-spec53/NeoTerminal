// XBoard Geek Theme - 应用全局状态管理
// App Store

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { configService } from '@/api'
import type { SystemConfig } from '@/types'

export const useAppStore = defineStore('app', () => {
  // 状态
  const config = ref<SystemConfig | null>(null)
  const sidebarCollapsed = ref(false)
  const isMobile = ref(false)
  const showMobileSidebar = ref(false)
  const isLoading = ref(false)
  const notifications = ref<Array<{ id: string; type: string; message: string; read: boolean }>>([])

  // 计算属性
  const unreadNotifications = computed(() => 
    notifications.value.filter(n => !n.read).length
  )

  // 站点显示名仅使用后端配置的 app_name，未配置时使用通用默认值
  const appName = computed(() => config.value?.app_name || 'XBoard')
  const appUrl = computed(() => config.value?.app_url || '')
  const logo = computed(() => config.value?.logo || null)
  const currency = computed(() => config.value?.currency || 'CNY')
  const currencySymbol = computed(() => config.value?.currency_symbol || '¥')

  /**
   * 获取系统配置
   */
  async function fetchConfig() {
    isLoading.value = true

    try {
      const response = await configService.fetchGuest()
      if (response.success) {
        config.value = response.data
      }
    } catch (err: any) {
      console.error('获取系统配置失败:', err)
    } finally {
      isLoading.value = false
    }
  }

  /**
   * 切换侧边栏状态
   */
  function toggleSidebar() {
    sidebarCollapsed.value = !sidebarCollapsed.value
    // 保存到 localStorage
    localStorage.setItem('sidebar_collapsed', String(sidebarCollapsed.value))
  }

  /**
   * 设置侧边栏状态
   */
  function setSidebarCollapsed(collapsed: boolean) {
    sidebarCollapsed.value = collapsed
    localStorage.setItem('sidebar_collapsed', String(collapsed))
  }

  /**
   * 切换移动端侧边栏
   */
  function toggleMobileSidebar() {
    showMobileSidebar.value = !showMobileSidebar.value
  }

  /**
   * 关闭移动端侧边栏
   */
  function closeMobileSidebar() {
    showMobileSidebar.value = false
  }

  /**
   * 设置移动端状态
   */
  function setMobile(mobile: boolean) {
    isMobile.value = mobile
    if (!mobile) {
      showMobileSidebar.value = false
    }
  }

  /**
   * 添加通知
   */
  function addNotification(notification: { type: string; message: string }) {
    const id = `notification-${Date.now()}-${Math.random()}`
    notifications.value.unshift({
      id,
      ...notification,
      read: false
    })

    // 最多保留 50 条通知
    if (notifications.value.length > 50) {
      notifications.value = notifications.value.slice(0, 50)
    }
  }

  /**
   * 标记通知为已读
   */
  function markNotificationAsRead(id: string) {
    const notification = notifications.value.find(n => n.id === id)
    if (notification) {
      notification.read = true
    }
  }

  /**
   * 标记所有通知为已读
   */
  function markAllNotificationsAsRead() {
    notifications.value.forEach(n => n.read = true)
  }

  /**
   * 清除所有通知
   */
  function clearNotifications() {
    notifications.value = []
  }

  /**
   * 初始化应用状态
   */
  function initialize() {
    // 从 localStorage 加载侧边栏状态
    const savedCollapsed = localStorage.getItem('sidebar_collapsed')
    if (savedCollapsed !== null) {
      sidebarCollapsed.value = savedCollapsed === 'true'
    }

    // 检测移动端
    const checkMobile = () => {
      setMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)

    // 获取系统配置
    fetchConfig()
  }

  return {
    // 状态
    config,
    sidebarCollapsed,
    isMobile,
    showMobileSidebar,
    isLoading,
    notifications,

    // 计算属性
    unreadNotifications,
    appName,
    appUrl,
    logo,
    currency,
    currencySymbol,

    // 方法
    fetchConfig,
    toggleSidebar,
    setSidebarCollapsed,
    toggleMobileSidebar,
    closeMobileSidebar,
    setMobile,
    addNotification,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    clearNotifications,
    initialize
  }
})

