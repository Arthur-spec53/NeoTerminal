<template>
  <div class="invite-page">
    <!-- 页面标题 -->
    <div class="page-header">
      <TerminalPrompt />
      <h1 class="page-title">我的邀请</h1>
    </div>

    <div v-if="isLoading" class="loading-container">
      <LoadingSpinner text="正在加载邀请数据..." />
    </div>

    <div v-else>
      <!-- 邀请统计 -->
      <div class="section">
        <div class="section-title">
          <span class="terminal-prompt"></span>邀请统计
        </div>
        <div class="stats-grid">
          <GeekCard title="佣金余额">
            <div class="stat-value">¥{{ (userStore.commissionBalance / 100).toFixed(2) }}</div>
          </GeekCard>
          <GeekCard title="注册用户">
            <div class="stat-value">{{ stats?.registered_count || 0 }} 人</div>
          </GeekCard>
          <GeekCard title="佣金比例">
            <div class="stat-value">{{ stats?.commission_rate || 0 }}%</div>
          </GeekCard>
          <GeekCard title="累计佣金">
            <div class="stat-value">¥{{ ((stats?.total_commission || 0) / 100).toFixed(2) }}</div>
          </GeekCard>
        </div>
      </div>

      <!-- 邀请链接 -->
      <div class="section">
        <div class="section-title">
          <span class="terminal-prompt"></span>邀请链接
        </div>
        <GeekCard>
          <div class="invite-link-container">
            <input :value="stats?.link" readonly class="hacker-input" />
            <GeekButton @click="copyLink" size="sm">{{ copied ? '已复制' : '复制链接' }}</GeekButton>
          </div>
          <template #footer>
            <div class="invite-actions">
              <GeekButton @click="generateNewCode" :loading="isGenerating">生成新邀请码</GeekButton>
              <p class="hint">[提示] 生成新邀请码将使旧邀请码失效</p>
            </div>
          </template>
        </GeekCard>
      </div>

      <!-- 佣金记录 -->
      <div class="section">
        <div class="section-title">
          <span class="terminal-prompt"></span>佣金记录
        </div>
        <GeekCard>
          <div class="table">
            <div class="table-header">
              <div>[订单金额]</div>
              <div>[佣金]</div>
              <div>[状态]</div>
              <div>[日期]</div>
            </div>
            <div v-for="detail in commissionDetails" :key="detail.id" class="table-row">
              <div>¥{{ (detail.order_amount / 100).toFixed(2) }}</div>
              <div>¥{{ (detail.get_amount / 100).toFixed(2) }}</div>
              <div>
                <span :class="getCommissionStatusClass(detail.status)"></span>
                {{ getCommissionStatusText(detail.status) }}
              </div>
              <div>{{ formatDate(detail.created_at) }}</div>
            </div>
            <div v-if="commissionDetails.length === 0" class="no-data">[暂无佣金记录]</div>
          </div>
        </GeekCard>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useUserStore } from '@/stores/user'
import { inviteService } from '@/api'
import type { InviteStat, InviteDetail } from '@/types'
import { useClipboard } from '@vueuse/core'
import GeekCard from '@/components/common/GeekCard.vue'
import GeekButton from '@/components/common/GeekButton.vue'
import TerminalPrompt from '@/components/effects/TerminalPrompt.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

const userStore = useUserStore()
const { copy, copied } = useClipboard()

const stats = ref<InviteStat | null>(null)
const details = ref<InviteDetail[]>([])
const isLoading = ref(true)
const isGenerating = ref(false)

const commissionDetails = computed(() => {
  // 确保 details.value 是数组
  if (!Array.isArray(details.value)) {
    console.warn('[Invite] details.value is not an array:', details.value)
    return []
  }
  return details.value.filter(d => d.get_amount > 0)
})

const fetchInviteData = async () => {
  isLoading.value = true
  try {
    console.log('[Invite] 正在获取邀请数据...')
    const [statsRes, detailsRes] = await Promise.all([
      inviteService.fetch(),
      inviteService.getDetails()
    ])
    
    console.log('[Invite] 统计数据响应:', statsRes)
    console.log('[Invite] 详情数据响应:', detailsRes)
    
    if (statsRes.success && statsRes.data) {
      stats.value = statsRes.data
      console.log('[Invite] ✅ 统计数据加载成功')
    }
    
    if (detailsRes.success) {
      // 确保返回的是数组
      if (Array.isArray(detailsRes.data)) {
        details.value = detailsRes.data
        console.log('[Invite] ✅ 详情数据加载成功，共', details.value.length, '条记录')
      } else if (detailsRes.data && typeof detailsRes.data === 'object') {
        // 如果返回的是对象，尝试提取数组
        if (Array.isArray(detailsRes.data.data)) {
          details.value = detailsRes.data.data
          console.log('[Invite] ✅ 从嵌套data中提取详情数据，共', details.value.length, '条记录')
        } else {
          console.warn('[Invite] ⚠️ 详情数据格式异常:', detailsRes.data)
          details.value = []
        }
      } else {
        console.warn('[Invite] ⚠️ 详情数据不是数组:', detailsRes.data)
        details.value = []
      }
    }
  } catch (error) {
    console.error('[Invite] ❌ 获取邀请数据失败:', error)
    details.value = []
  } finally {
    isLoading.value = false
  }
}

const copyLink = () => {
  if (stats.value?.link) {
    copy(stats.value.link)
  }
}

const generateNewCode = async () => {
  isGenerating.value = true
  try {
    const response = await inviteService.create()
    if (response.success) {
      // Refresh data to get the new link
      await fetchInviteData()
    }
  } catch (error) {
    console.error("Failed to generate new code:", error)
  } finally {
    isGenerating.value = false
  }
}

const getCommissionStatusText = (status: number) => {
  const statusMap: { [key: number]: string } = {
    0: '待确认',
    1: '已确认',
    2: '已取消'
  }
  return statusMap[status] || '未知'
}

const getCommissionStatusClass = (status: number) => {
  const classMap: { [key: number]: string } = {
    0: 'warning-marker',
    1: 'success-marker',
    2: 'error-marker'
  }
  return classMap[status] || ''
}

const formatDate = (timestamp: number) => {
  if (!timestamp) return 'N/A'
  return new Date(timestamp * 1000).toLocaleString()
}

onMounted(() => {
  fetchInviteData()
})
</script>

<style scoped>
.invite-page {
  padding: 2rem;
  font-family: var(--font-mono);
  color: var(--hacker-primary);
}

.page-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.page-title {
  font-size: 24px;
  color: var(--hacker-primary-bright);
  text-transform: uppercase;
  letter-spacing: 2px;
  text-shadow: var(--glow-md);
}

.loading-container {
  text-align: center;
  padding: 4rem 0;
}

.section {
  margin-bottom: 3rem;
}

.section-title {
  font-size: 16px;
  font-weight: bold;
  color: var(--hacker-primary-bright);
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-bottom: 1rem;
  text-shadow: var(--glow-sm);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.5rem;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: var(--hacker-primary-bright);
  margin: 1rem 0;
  text-shadow: var(--glow-md);
}

.invite-link-container {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.hacker-input {
  background: transparent;
  border: none;
  border-bottom: 1px solid var(--hacker-primary-dim);
  color: var(--hacker-primary);
  font-family: var(--font-mono);
  font-size: 14px;
  padding: 0.5rem;
  outline: none;
  width: 100%;
  text-shadow: var(--glow-sm);
}

.invite-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.hint {
  font-size: 12px;
  color: var(--hacker-text-dim);
}

.table {
  font-size: 12px;
}

.table-header,
.table-row {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1.5fr;
  gap: 1rem;
  padding: 0.75rem;
  border-bottom: 1px solid var(--hacker-primary-dim);
  align-items: center;
}

.table-header {
  color: var(--hacker-primary-bright);
  font-weight: bold;
  text-shadow: var(--glow-sm);
}

.table-row:hover {
  background: rgba(0, 255, 0, 0.05);
}

.no-data {
  text-align: center;
  padding: 2rem 0;
  color: var(--hacker-text-dim);
  opacity: 0.7;
}

.success-marker,
.warning-marker,
.error-marker {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 0.5rem;
}

.success-marker {
  background: var(--hacker-primary);
  box-shadow: 0 0 5px var(--hacker-primary);
}

.warning-marker {
  background: #ffff00;
  box-shadow: 0 0 5px #ffff00;
}

.error-marker {
  background: var(--hacker-error);
  box-shadow: 0 0 5px var(--hacker-error);
}
</style>
