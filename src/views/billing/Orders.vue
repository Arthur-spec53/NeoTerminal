<template>
  <div class="orders-page">
    <!-- 页面标题 -->
    <div class="page-header">
      <TerminalPrompt />
      <h1 class="page-title">我的订单</h1>
    </div>
    
    <!-- 筛选器 -->
    <div class="filter-section">
      <GeekButton 
        :variant="filter === 'all' ? 'success' : 'primary'"
        @click="filter = 'all'"
      >
        全部订单
      </GeekButton>
      <GeekButton 
        :variant="filter === 'paid' ? 'success' : 'primary'"
        @click="filter = 'paid'"
      >
        已支付
      </GeekButton>
      <GeekButton 
        :variant="filter === 'unpaid' ? 'warning' : 'primary'"
        @click="filter = 'unpaid'"
      >
        待支付
      </GeekButton>
    </div>
    
    <!-- 订单列表 -->
    <GeekCard title="订单列表">
      <div class="orders-table">
        <div class="table-header">
          <div>[订单号]</div>
          <div>[套餐]</div>
          <div>[金额]</div>
          <div>[状态]</div>
          <div>[日期]</div>
          <div>[操作]</div>
        </div>
        
        <div 
          v-for="order in filteredOrders" 
          :key="order.id" 
          class="table-row"
        >
          <div>{{ order.trade_no }}</div>
          <div>{{ order.plan?.name || '无' }}</div>
          <div>¥{{ (order.total_amount / 100).toFixed(2) }}</div>
          <div>
            <span v-if="order.status === 3" class="success-marker">[✓]</span>
            <span v-else-if="order.status === 0" class="error-marker">[!]</span>
            {{ getStatusText(order.status) }}
          </div>
          <div>{{ formatDate(order.created_at) }}</div>
          <div>
            <GeekButton 
              v-if="order.status === 0"
              size="sm"
              variant="warning"
              @click="payOrder(order)"
            >
              立即支付
            </GeekButton>
            <GeekButton 
              v-else
              size="sm"
              variant="primary"
              @click="viewOrder(order)"
            >
              查看
            </GeekButton>
          </div>
        </div>
        <div v-if="filteredOrders.length === 0" class="no-data">
          [暂无订单]
        </div>
      </div>
    </GeekCard>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { orderService } from '@/api'
import type { Order } from '@/types'
import GeekCard from '@/components/common/GeekCard.vue'
import GeekButton from '@/components/common/GeekButton.vue'
import TerminalPrompt from '@/components/effects/TerminalPrompt.vue'

const router = useRouter()
const orders = ref<Order[]>([])
const filter = ref('all')

const filteredOrders = computed(() => {
  if (filter.value === 'all') return orders.value
  if (filter.value === 'paid') return orders.value.filter(o => o.status === 3)
  if (filter.value === 'unpaid') return orders.value.filter(o => o.status === 0)
  return orders.value
})

const fetchOrders = async () => {
  try {
    const response = await orderService.fetch()
    orders.value = response.data
  } catch (error) {
    console.error("Failed to fetch orders:", error)
  }
}

const getStatusText = (status: number) => {
  const statusMap: { [key: number]: string } = {
    0: '待支付',
    1: '处理中',
    2: '已取消',
    3: '已完成'
  }
  return statusMap[status] || '未知'
}

const formatDate = (dateString: string | number) => {
  return new Date(dateString).toLocaleString()
}

const payOrder = (order: Order) => {
  // 跳转到支付页面或打开支付模态框
  console.log('Redirecting to pay for order:', order.trade_no)
  // 实际项目中可能是 router.push(`/billing/pay/${order.trade_no}`)
}

const viewOrder = (order: Order) => {
  // 在模态框或新页面中显示订单详情
  console.log('Viewing order details:', order)
}

onMounted(() => {
  fetchOrders()
})
</script>

<style scoped>
.orders-page {
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
  text-shadow: var(--glow-md);
}

.filter-section {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.orders-table {
  display: flex;
  flex-direction: column;
}

.table-header,
.table-row {
  display: grid;
  grid-template-columns: 2fr 2fr 1fr 1fr 2fr 1fr;
  gap: 1rem;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--hacker-primary-dim);
  align-items: center;
}

.table-header {
  font-weight: bold;
  color: var(--hacker-primary-bright);
  text-transform: uppercase;
}

.table-row:hover {
  background: rgba(0, 255, 0, 0.05);
}

.no-data {
  text-align: center;
  padding: 2rem;
  color: var(--hacker-text-dim);
  opacity: 0.5;
}
</style>
