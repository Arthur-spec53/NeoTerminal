// XBoard Geek Theme - 安全日志工具
// 生产环境自动禁用日志，防止信息泄露

/**
 * 安全日志类
 * 开发环境：正常输出日志
 * 生产环境：禁用所有日志（除了critical error）
 */
class Logger {
  private isDev: boolean

  constructor() {
    this.isDev = import.meta.env.DEV
  }

  /**
   * 调试日志 - 仅开发环境
   */
  log(...args: any[]) {
    if (this.isDev) {
      console.log(...args)
    }
  }

  /**
   * 信息日志 - 仅开发环境
   */
  info(...args: any[]) {
    if (this.isDev) {
      console.info(...args)
    }
  }

  /**
   * 警告日志 - 仅开发环境
   */
  warn(...args: any[]) {
    if (this.isDev) {
      console.warn(...args)
    }
  }

  /**
   * 错误日志 - 生产环境也会输出（但过滤敏感信息）
   */
  error(...args: any[]) {
    // 过滤敏感信息
    const safeArgs = args.map(arg => {
      if (typeof arg === 'object' && arg !== null) {
        return this.filterSensitiveData(arg)
      }
      return arg
    })
    
    if (this.isDev) {
      console.error(...safeArgs)
    } else {
      // 生产环境只记录错误，不显示详细信息
      console.error('[ERROR]', safeArgs[0]?.message || 'An error occurred')
    }
  }

  /**
   * 过滤对象中的敏感数据
   */
  private filterSensitiveData(obj: any): any {
    const sensitiveKeys = [
      'password', 'token', 'auth_data', 'authorization',
      'email_code', 'invite_code', 'secret', 'key',
      'old_password', 'new_password', 'password_confirmation'
    ]

    if (Array.isArray(obj)) {
      return obj.map(item => this.filterSensitiveData(item))
    }

    if (typeof obj === 'object' && obj !== null) {
      const filtered: any = {}
      for (const key in obj) {
        if (sensitiveKeys.some(sensitive => key.toLowerCase().includes(sensitive))) {
          filtered[key] = '***HIDDEN***'
        } else if (typeof obj[key] === 'object') {
          filtered[key] = this.filterSensitiveData(obj[key])
        } else {
          filtered[key] = obj[key]
        }
      }
      return filtered
    }

    return obj
  }

  /**
   * 禁用所有console方法（生产环境额外保护）
   */
  disableConsole() {
    if (!this.isDev) {
      const noop = () => {}
      window.console.log = noop
      window.console.info = noop
      window.console.warn = noop
      window.console.debug = noop
      // 保留 console.error 用于监控
    }
  }
}

// 导出单例
export const logger = new Logger()

// 便捷方法
export const log = (...args: any[]) => logger.log(...args)
export const info = (...args: any[]) => logger.info(...args)
export const warn = (...args: any[]) => logger.warn(...args)
export const logError = (...args: any[]) => logger.error(...args)

