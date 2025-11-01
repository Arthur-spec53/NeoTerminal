// XBoard Geek Theme - 安全防护
// 生产环境的额外安全措施

/**
 * 检测开发者工具是否打开
 */
let devtoolsOpen = false

export const detectDevTools = () => {
  const threshold = 160
  
  const widthThreshold = window.outerWidth - window.innerWidth > threshold
  const heightThreshold = window.outerHeight - window.innerHeight > threshold
  
  if (widthThreshold || heightThreshold) {
    if (!devtoolsOpen) {
      devtoolsOpen = true
      onDevToolsOpen()
    }
  } else {
    devtoolsOpen = false
  }
}

const onDevToolsOpen = () => {
  console.log('[Security] 检测到开发者工具')
  // 生产环境可以选择：
  // 1. 清除敏感数据
  // 2. 跳转到警告页面
  // 3. 刷新页面
  if (!import.meta.env.DEV) {
    // 清除localStorage中的敏感数据
    localStorage.removeItem('auth_token')
    
    // 可选：跳转到警告页
    // window.location.href = '/security-warning'
  }
}

/**
 * 禁用右键菜单
 */
export const disableContextMenu = () => {
  if (!import.meta.env.DEV) {
    document.addEventListener('contextmenu', (e) => {
      e.preventDefault()
      return false
    })
  }
}

/**
 * 禁用键盘快捷键
 */
export const disableShortcuts = () => {
  if (!import.meta.env.DEV) {
    document.addEventListener('keydown', (e) => {
      // 禁用 F12
      if (e.key === 'F12') {
        e.preventDefault()
        return false
      }
      
      // 禁用 Ctrl+Shift+I (开发者工具)
      if (e.ctrlKey && e.shiftKey && e.key === 'I') {
        e.preventDefault()
        return false
      }
      
      // 禁用 Ctrl+Shift+J (控制台)
      if (e.ctrlKey && e.shiftKey && e.key === 'J') {
        e.preventDefault()
        return false
      }
      
      // 禁用 Ctrl+U (查看源代码)
      if (e.ctrlKey && e.key === 'u') {
        e.preventDefault()
        return false
      }
      
      // 禁用 Ctrl+S (保存页面)
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault()
        return false
      }
    })
  }
}

/**
 * 禁用文本选择和复制
 */
export const disableTextSelection = () => {
  if (!import.meta.env.DEV) {
    document.addEventListener('selectstart', (e) => {
      // 允许input和textarea选择
      const target = e.target as HTMLElement
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        return true
      }
      e.preventDefault()
      return false
    })
    
    document.addEventListener('copy', (e) => {
      // 允许input和textarea复制
      const target = e.target as HTMLElement
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        return true
      }
      e.preventDefault()
      return false
    })
  }
}

/**
 * 防止iframe嵌入
 */
export const preventIframeEmbedding = () => {
  if (window.self !== window.top) {
    // 如果页面被嵌入iframe中，跳转到顶层
    window.top!.location.href = window.self.location.href
  }
}

/**
 * 清除页面卸载时的敏感数据
 */
export const clearSensitiveDataOnUnload = () => {
  window.addEventListener('beforeunload', () => {
    // 可选：清除内存中的敏感数据
    // 注意：这会导致用户需要重新登录
    // sessionStorage.clear()
  })
}

/**
 * 初始化所有安全措施
 */
export const initSecurity = (options: {
  disableDevTools?: boolean
  disableContextMenu?: boolean
  disableShortcuts?: boolean
  disableSelection?: boolean
  detectDevTools?: boolean
  preventIframe?: boolean
} = {}) => {
  const {
    disableDevTools = false,  // 默认不禁用（可能影响用户体验）
    disableContextMenu = false,
    disableShortcuts = false,
    disableSelection = false,
    detectDevTools = true,
    preventIframe = true
  } = options

  console.log('[Security] 初始化安全措施...')
  console.log('[Security] 环境:', import.meta.env.DEV ? '开发' : '生产')
  
  if (preventIframe) {
    preventIframeEmbedding()
  }
  
  if (disableContextMenu) {
    disableContextMenu()
  }
  
  if (disableShortcuts) {
    disableShortcuts()
  }
  
  if (disableSelection) {
    disableTextSelection()
  }
  
  if (detectDevTools) {
    // 每秒检测一次
    setInterval(detectDevTools, 1000)
  }
  
  clearSensitiveDataOnUnload()
  
  console.log('[Security] ✅ 安全措施已启用')
}

