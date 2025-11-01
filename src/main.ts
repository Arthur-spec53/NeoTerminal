import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import './styles/hacker-theme.css'
import App from './App.vue'
import { configService } from './api'
import { initSecurity } from './utils/security'
import { logger, log, warn, logError } from './utils/logger'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

app.mount('#app')

// 初始化安全措施
if (!import.meta.env.DEV) {
  log('[Security] 初始化生产环境安全措施...')
  
  // 禁用console（生产环境）
  logger.disableConsole()
  
  // 启用安全防护
  initSecurity({
    disableDevTools: false,      // 不完全禁用，避免影响用户体验
    disableContextMenu: false,   // 不禁用右键，允许正常使用
    disableShortcuts: false,     // 不禁用快捷键
    disableSelection: false,     // 不禁用选择
    detectDevTools: true,        // 检测开发者工具（温和处理）
    preventIframe: true          // 防止被iframe嵌入
  })
  
  log('[Security] ✅ 安全措施已启用')
}

// 从后端获取站点配置并更新页面标题和图标
const initSiteConfig = async () => {
  try {
    log('[App] 正在获取站点配置...')
    const response = await configService.fetchGuest()
    log('[App] API响应:', response)
    
    if (response && response.data) {
      const { app_name, app_description, logo } = response.data
      
      log('[App] 配置数据:', { app_name, app_description, logo })
      log('[App] app_name类型:', typeof app_name, '值:', app_name)
      log('[App] app_description类型:', typeof app_description, '值:', app_description)
      
      // 更新页面标题 - 优先使用app_name（但必须是非空字符串）
      // 临时硬编码为"奇库"，等后端配置修复后再改回动态获取
      let title = '奇库' // 默认值
      if (app_name && typeof app_name === 'string' && app_name.trim() !== '' && app_name !== 'XBoard') {
        title = app_name.trim()
        log('[App] ✅ 使用 app_name 作为标题')
      } else {
        log('[App] ✅ 使用默认标题: 奇库')
      }
      
      document.title = title
      log('[App] ✅ 标题已更新为:', title)
      
      // 更新 favicon
      if (logo) {
        // 移除旧的favicon
        const oldFavicon = document.getElementById('favicon')
        if (oldFavicon) {
          oldFavicon.remove()
        }
        
        // 创建新的favicon link
        const newFavicon = document.createElement('link')
        newFavicon.id = 'favicon'
        newFavicon.rel = 'icon'
        newFavicon.type = 'image/x-icon'
        newFavicon.href = logo
        
        // 添加到head
        document.head.appendChild(newFavicon)
        
        log('[App] ✅ 图标已更新为:', logo)
      }
      
      // 更新 meta description
      if (app_description) {
        const metaDescription = document.querySelector('meta[name="description"]')
        if (metaDescription) {
          metaDescription.setAttribute('content', app_description)
          log('[App] ✅ 描述已更新为:', app_description)
        }
      }
    } else {
      warn('[App] ⚠️ 配置响应为空或无效')
      // 使用默认值
      document.title = '奇库'
    }
  } catch (err: any) {
    // 配置API失败不影响主要功能
    warn('[App] ⚠️ 获取站点配置失败，使用默认值')
    document.title = '奇库'
    // 不打印详细错误，避免干扰
  }
}

// 初始化站点配置（静默失败）
initSiteConfig().catch(() => {
  // 静默处理，不影响应用启动
})
