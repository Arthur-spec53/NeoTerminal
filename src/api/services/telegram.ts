// XBoard Geek Theme - Telegram 服务
// Telegram API Services

import { apiClient } from '../client'
import type { TelegramBotInfo, ApiResponse } from '@/types'

/**
 * Telegram 服务
 */
export const telegramService = {
  /**
   * 获取 Telegram Bot 信息
   */
  async getBotInfo(): Promise<ApiResponse<TelegramBotInfo>> {
    return apiClient.get<TelegramBotInfo>('/user/telegram/getBotInfo')
  }
}

