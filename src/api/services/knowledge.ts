// XBoard Geek Theme - 知识库服务
// Knowledge API Services

import { apiClient } from '../client'
import type { Knowledge, KnowledgeCategory, ApiResponse } from '@/types'

/**
 * 知识库服务
 */
export const knowledgeService = {
  /**
   * 获取知识库列表
   */
  async fetch(category?: number): Promise<ApiResponse<Knowledge[]>> {
    return apiClient.get<Knowledge[]>('/user/knowledge/fetch', {
      params: category ? { category } : undefined
    })
  },

  /**
   * 获取知识库分类
   */
  async getCategories(): Promise<ApiResponse<KnowledgeCategory[]>> {
    return apiClient.get<KnowledgeCategory[]>('/user/knowledge/getCategory')
  }
}

