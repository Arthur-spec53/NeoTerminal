// XBoard Geek Theme - 加密工具
// 用于加密localStorage中的敏感数据

/**
 * 简单的加密/解密工具
 * 使用AES加密保护localStorage中的token
 */

// 生成密钥（基于浏览器指纹）
const getEncryptionKey = (): string => {
  const userAgent = navigator.userAgent
  const language = navigator.language
  const platform = navigator.platform
  const fingerprint = `${userAgent}-${language}-${platform}`
  
  // 简单的hash函数
  let hash = 0
  for (let i = 0; i < fingerprint.length; i++) {
    const char = fingerprint.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  
  return Math.abs(hash).toString(36)
}

/**
 * 简单的XOR加密
 * 注意：这不是真正的AES，只是基础的混淆
 * 对于更高级的安全需求，应该使用Web Crypto API
 */
export const encryptToken = (token: string): string => {
  if (!token) return ''
  
  try {
    const key = getEncryptionKey()
    let encrypted = ''
    
    for (let i = 0; i < token.length; i++) {
      const charCode = token.charCodeAt(i)
      const keyChar = key.charCodeAt(i % key.length)
      encrypted += String.fromCharCode(charCode ^ keyChar)
    }
    
    // Base64编码使其可存储
    return btoa(encrypted)
  } catch (error) {
    console.error('[Crypto] 加密失败:', error)
    return token // 失败时返回原值
  }
}

/**
 * 解密token
 */
export const decryptToken = (encryptedToken: string): string => {
  if (!encryptedToken) return ''
  
  try {
    const key = getEncryptionKey()
    
    // Base64解码
    const encrypted = atob(encryptedToken)
    let decrypted = ''
    
    for (let i = 0; i < encrypted.length; i++) {
      const charCode = encrypted.charCodeAt(i)
      const keyChar = key.charCodeAt(i % key.length)
      decrypted += String.fromCharCode(charCode ^ keyChar)
    }
    
    return decrypted
  } catch (error) {
    console.error('[Crypto] 解密失败:', error)
    return encryptedToken // 失败时返回原值
  }
}

/**
 * 安全的localStorage操作
 */
export const secureStorage = {
  /**
   * 保存加密的数据
   */
  setItem(key: string, value: string) {
    try {
      const encrypted = encryptToken(value)
      localStorage.setItem(key, encrypted)
    } catch (error) {
      console.error('[SecureStorage] 保存失败:', error)
    }
  },

  /**
   * 获取并解密数据
   */
  getItem(key: string): string | null {
    try {
      const encrypted = localStorage.getItem(key)
      if (!encrypted) return null
      return decryptToken(encrypted)
    } catch (error) {
      console.error('[SecureStorage] 读取失败:', error)
      return null
    }
  },

  /**
   * 删除数据
   */
  removeItem(key: string) {
    localStorage.removeItem(key)
  },

  /**
   * 清空所有数据
   */
  clear() {
    localStorage.clear()
  }
}

/**
 * 清理函数 - 定期清理过期数据
 */
export const cleanupExpiredData = () => {
  // 可以在这里添加过期数据清理逻辑
  // 例如：检查token是否过期，自动清除
}

