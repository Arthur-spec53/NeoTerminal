<template>
  <div class="plans-page">
    <!-- 页面标题 -->
    <div class="page-header">
      <TerminalPrompt />
      <h1 class="page-title">购买订阅</h1>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-state">
      <LoadingSpinner />
      <span class="loading-text">正在加载订阅套餐...</span>
    </div>

    <!-- 错误状态 -->
    <div v-else-if="error" class="error-state">
      <div class="error-box">
        <div class="error-title">[错误]</div>
        <div class="error-message">{{ error }}</div>
        <GeekButton @click="fetchPlans" size="sm">重新加载</GeekButton>
      </div>
    </div>

    <!-- 套餐列表 -->
    <div v-else-if="plans.length > 0" class="plans-grid">
      <GeekCard 
        v-for="plan in plans" 
        :key="plan.id"
        :title="plan.name"
        hoverable
        clickable
        @click="selectPlan(plan)"
      >
        <div class="plan-content">
          <div class="plan-price">
            <span class="price-value">¥{{ getPlanPrice(plan) }}</span>
            <span class="price-period">/ {{ getPlanPeriod(plan) }}</span>
          </div>
          <div class="plan-details">
            <div class="detail-item">
              <span class="list-marker">[*]</span>
              流量配额: {{ formatBytes(plan.transfer_enable) }}
            </div>
            <div class="detail-item">
              <span class="list-marker">[*]</span>
              速度限制: {{ plan.speed_limit || '无限制' }} Mbps
            </div>
            <div class="detail-item">
              <span class="list-marker">[*]</span>
              设备数量: {{ plan.device_limit || '无限制' }}
            </div>
          </div>
          <!-- 套餐描述（经过 HTML 清洗，防止 XSS） -->
          <div class="plan-description" v-if="plan.content" v-html="sanitizeHtml(plan.content)"></div>
        </div>
        <template #footer>
          <GeekButton @click.stop="purchasePlan(plan)" size="sm" class="w-full">
            [ 选择此套餐 ]
          </GeekButton>
        </template>
      </GeekCard>
    </div>

    <!-- 空状态 -->
    <div v-else class="no-data">
      <div class="empty-box">
        <div class="empty-icon">[ ! ]</div>
        <div class="empty-text">暂无可用的订阅套餐</div>
        <GeekButton @click="fetchPlans" size="sm">重新加载</GeekButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { planService } from '@/api'
import { sanitizeHtml } from '@/utils/sanitize'
import type { Plan } from '@/types'
import GeekCard from '@/components/common/GeekCard.vue'
import GeekButton from '@/components/common/GeekButton.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import TerminalPrompt from '@/components/effects/TerminalPrompt.vue'

const router = useRouter()
const plans = ref<Plan[]>([])
const loading = ref(false)
const error = ref<string>('')

const fetchPlans = async () => {
  loading.value = true
  error.value = ''
  
  try {
    console.log('[Plans] 正在获取订阅套餐列表...')
    console.log('[Plans] 尝试使用 /user/plan/fetch 接口')
    
    let response = await planService.fetch()
    
    console.log('[Plans] User API 响应:', response)
    console.log('[Plans] 原始数据:', response.data)
    console.log('[Plans] 数据类型:', Array.isArray(response.data))
    console.log('[Plans] 数据长度:', response.data?.length)
    
    // 如果user接口返回空数据，尝试guest接口
    if (response.success && (!response.data || response.data.length === 0)) {
      console.log('[Plans] User API 返回空数据，尝试 Guest API...')
      try {
        response = await planService.fetchGuest()
        console.log('[Plans] Guest API 响应:', response)
      } catch (guestErr) {
        console.warn('[Plans] Guest API 失败:', guestErr)
        // 继续使用user API的空结果
      }
    }
    
    if (response.success && response.data) {
      // 先查看原始数据
      console.log('[Plans] 所有套餐数据（过滤前）:', response.data)
      
      // 过滤出可售卖的套餐
      // 兼容后端返回的不同字段名：sell (boolean) 或 is_sell (number)
      plans.value = response.data.filter((p: any) => {
        const isSell = p.sell !== undefined ? p.sell : (p.is_sell === 1 || p.is_sell === true)
        const isShow = p.show !== undefined ? p.show : (p.is_show === 1 || p.is_show === true)
        
        console.log(`[Plans] 套餐 ${p.id} - ${p.name}:`, {
          sell: p.sell,
          is_sell: p.is_sell,
          show: p.show,
          is_show: p.is_show,
          renew: p.renew,
          is_renew: p.is_renew,
          '→ isSell': isSell,
          '→ isShow': isShow
        })
        
        // 返回 sell=true 且 show=true 的套餐
        return isSell && isShow
      })
      
      console.log('[Plans] 可售卖套餐数量:', plans.value.length)
      console.log('[Plans] 可售卖套餐列表:', plans.value)
      
      if (plans.value.length === 0) {
        error.value = '后端没有可售卖的套餐，请联系管理员在后台添加套餐并设置为"可售卖"状态'
      }
    } else {
      error.value = response.message || '获取套餐列表失败'
      console.error('[Plans] 获取失败:', error.value)
    }
  } catch (err: any) {
    error.value = err.message || '网络请求失败，请检查网络连接'
    console.error('[Plans] 请求异常:', err)
  } finally {
    loading.value = false
  }
}

const getPlanPrice = (plan: Plan): string => {
  if (plan.month_price) return (plan.month_price / 100).toFixed(2)
  if (plan.quarter_price) return (plan.quarter_price / 100).toFixed(2)
  if (plan.half_year_price) return (plan.half_year_price / 100).toFixed(2)
  if (plan.year_price) return (plan.year_price / 100).toFixed(2)
  if (plan.onetime_price) return (plan.onetime_price / 100).toFixed(2)
  return '0.00'
}

const getPlanPeriod = (plan: Plan): string => {
  if (plan.month_price) return '月'
  if (plan.quarter_price) return '季'
  if (plan.half_year_price) return '半年'
  if (plan.year_price) return '年'
  if (plan.onetime_price) return '一次性'
  return ''
}

const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 GB'
  const gb = bytes / (1024 * 1024 * 1024)
  return `${gb.toFixed(0)} GB`
}

const selectPlan = (plan: Plan) => {
  console.log('[Plans] 选择套餐:', plan)
  purchasePlan(plan)
}

const purchasePlan = (plan: Plan) => {
  console.log('[Plans] 购买套餐 ID:', plan.id)
  router.push(`/billing/create-order?plan_id=${plan.id}`)
}

onMounted(() => {
  fetchPlans()
})
</script>

<style scoped>
.plans-page {
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
  letter-spacing: 2px;
  text-shadow: var(--glow-md);
}

/* 加载状态 */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  gap: 1rem;
}

.loading-text {
  color: var(--hacker-primary);
  font-size: 14px;
  animation: pulse 2s ease-in-out infinite;
}

/* 错误状态 */
.error-state {
  display: flex;
  justify-content: center;
  padding: 2rem;
}

.error-box {
  border: 2px solid var(--hacker-warning);
  padding: 2rem;
  max-width: 500px;
  text-align: center;
}

.error-title {
  color: var(--hacker-warning);
  font-size: 18px;
  margin-bottom: 1rem;
  text-shadow: var(--glow-sm);
}

.error-message {
  color: var(--hacker-text-dim);
  margin-bottom: 1.5rem;
  font-size: 14px;
}

/* 套餐列表 */
.plans-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.plan-content {
  padding: 1rem;
}

.plan-price {
  margin-bottom: 1.5rem;
  text-align: center;
}

.price-value {
  font-size: 32px;
  font-weight: bold;
  color: var(--hacker-primary-bright);
  text-shadow: var(--glow-md);
}

.price-period {
  font-size: 14px;
  color: var(--hacker-text-dim);
  margin-left: 0.5rem;
}

.plan-details {
  margin-bottom: 1.5rem;
}

.detail-item {
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--hacker-primary-dim);
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.detail-item:last-child {
  border-bottom: none;
}

.list-marker {
  color: var(--hacker-primary-bright);
}

.plan-description {
  font-size: 12px;
  color: var(--hacker-text-dim);
  min-height: 50px;
  padding: 0.5rem;
  border-top: 1px solid var(--hacker-primary-dim);
}

/* HTML内容样式 */
.plan-description :deep(ol),
.plan-description :deep(ul) {
  margin: 0;
  padding-left: 1.5rem;
  list-style: none;
}

.plan-description :deep(li) {
  margin: 0.25rem 0;
  color: var(--hacker-primary);
  position: relative;
}

.plan-description :deep(li)::before {
  content: '>';
  position: absolute;
  left: -1rem;
  color: var(--hacker-primary-bright);
}

.plan-description :deep(div) {
  margin: 0.25rem 0;
}

/* 空状态 */
.no-data {
  display: flex;
  justify-content: center;
  padding: 2rem;
}

.empty-box {
  border: 2px solid var(--hacker-primary-dim);
  padding: 3rem 2rem;
  text-align: center;
  max-width: 400px;
}

.empty-icon {
  font-size: 48px;
  color: var(--hacker-primary);
  margin-bottom: 1rem;
  text-shadow: var(--glow-md);
}

.empty-text {
  color: var(--hacker-text-dim);
  margin-bottom: 1.5rem;
  font-size: 14px;
}

.w-full {
  width: 100%;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
</style>
