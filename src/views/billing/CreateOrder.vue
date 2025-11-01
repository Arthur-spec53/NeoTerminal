<template>
  <div class="create-order-page">
    <div class="page-header">
      <TerminalPrompt />
      <h1 class="page-title">CREATE_ORDER</h1>
    </div>

    <div v-if="isLoading" class="loading-container">
      <LoadingSpinner />
      <p>Loading plan details...</p>
    </div>

    <div v-if="plan" class="order-summary-card">
      <GeekCard :title="'Confirm Order: ' + plan.name">
        <div class="order-details">
          <div class="detail-row">
            <span class="label">PLAN_NAME:</span>
            <span class="value">{{ plan.name }}</span>
          </div>
          <div class="detail-row">
            <span class="label">TRAFFIC:</span>
            <span class="value">{{ formatBytes(plan.transfer_enable) }}</span>
          </div>
          <div v-if="selectedCycle" class="detail-row">
            <span class="label">CYCLE:</span>
            <span class="value">{{ selectedCycle.name }}</span>
          </div>
          <div v-if="selectedCycle" class="detail-row price-row">
            <span class="label">PRICE:</span>
            <span class="value price-value">${{ (selectedCycle.price / 100).toFixed(2) }}</span>
          </div>
        </div>

        <div v-if="availableCycles.length > 1" class="cycle-selector">
          <h3 class="selector-title">SELECT_BILLING_CYCLE</h3>
          <div class="cycle-options">
            <GeekButton
              v-for="cycle in availableCycles"
              :key="cycle.period"
              :class="{ 'active': selectedCycle && selectedCycle.period === cycle.period }"
              @click="selectCycle(cycle)"
            >
              {{ cycle.name }}
            </GeekButton>
          </div>
        </div>
        
        <template #footer>
          <div class="order-actions">
            <GeekButton @click="cancelOrder" variant="secondary">CANCEL</GeekButton>
            <GeekButton @click="submitOrder" :is-loading="isSubmitting">
              SUBMIT_ORDER
            </GeekButton>
          </div>
        </template>
      </GeekCard>
    </div>

    <div v-if="error" class="error-message">
      <p>{{ error }}</p>
      <GeekButton @click="goBack" variant="secondary">GO_BACK</GeekButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { planService, orderService } from '@/api'
import type { Plan } from '@/types'
import TerminalPrompt from '@/components/effects/TerminalPrompt.vue'
import GeekCard from '@/components/common/GeekCard.vue'
import GeekButton from '@/components/common/GeekButton.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

interface Cycle {
  period: 'month' | 'quarter' | 'half_year' | 'year' | 'onetime';
  name: string;
  price: number;
}

const route = useRoute()
const router = useRouter()

const plan = ref<Plan | null>(null)
const isLoading = ref(true)
const isSubmitting = ref(false)
const error = ref<string | null>(null)

const availableCycles = ref<Cycle[]>([])
const selectedCycle = ref<Cycle | null>(null)

const fetchPlanDetails = async () => {
  const planId = Number(route.query.plan_id)
  if (isNaN(planId)) {
    error.value = 'Invalid Plan ID.'
    isLoading.value = false
    return
  }

  try {
    const response = await planService.fetch()
    const foundPlan = response.data.find(p => p.id === planId)
    if (foundPlan) {
      plan.value = foundPlan
      generateAvailableCycles(foundPlan)
    } else {
      error.value = 'Plan not found.'
    }
  } catch (e) {
    console.error(e)
    error.value = 'Failed to fetch plan details.'
  } finally {
    isLoading.value = false
  }
}

const generateAvailableCycles = (p: Plan) => {
  const cycles: Cycle[] = []
  if (p.month_price) cycles.push({ period: 'month', name: 'MONTH', price: p.month_price })
  if (p.quarter_price) cycles.push({ period: 'quarter', name: 'QUARTER', price: p.quarter_price })
  if (p.half_year_price) cycles.push({ period: 'half_year', name: 'HALF_YEAR', price: p.half_year_price })
  if (p.year_price) cycles.push({ period: 'year', name: 'YEAR', price: p.year_price })
  if (p.onetime_price) cycles.push({ period: 'onetime', name: 'ONE_TIME', price: p.onetime_price })
  
  availableCycles.value = cycles
  if (cycles.length > 0) {
    selectCycle(cycles[0])
  }
}

const selectCycle = (cycle: Cycle) => {
  selectedCycle.value = cycle
}

const submitOrder = async () => {
  if (!plan.value || !selectedCycle.value) return
  isSubmitting.value = true
  try {
    const response = await orderService.create({
      plan_id: plan.value.id,
      period: selectedCycle.value.period
    })
    if (response.data.trade_no) {
      // Redirect to payment page or order details
      router.push(`/billing/orders`)
    } else {
      throw new Error('Trade number not received.')
    }
  } catch (e) {
    console.error(e)
    error.value = 'Failed to create order.'
  } finally {
    isSubmitting.value = false
  }
}

const cancelOrder = () => {
  router.back()
}

const goBack = () => {
  router.push('/subscription/plans')
}

const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 GB'
  const gb = bytes / (1024 * 1024 * 1024)
  return `${gb.toFixed(0)} GB`
}

onMounted(() => {
  fetchPlanDetails()
})
</script>

<style scoped>
.create-order-page {
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
.loading-container, .error-message {
  text-align: center;
  padding: 4rem 0;
  color: var(--hacker-text-dim);
}
.order-summary-card {
  max-width: 600px;
  margin: 0 auto;
}
.order-details {
  padding: 1rem;
}
.detail-row {
  display: flex;
  justify-content: space-between;
  padding: 0.75rem 0;
  border-bottom: 1px dashed var(--hacker-primary-dim);
  font-size: 14px;
}
.detail-row:last-child {
  border-bottom: none;
}
.label {
  color: var(--hacker-text-dim);
}
.value {
  color: var(--hacker-primary-bright);
}
.price-row .price-value {
  font-size: 20px;
  font-weight: bold;
  text-shadow: var(--glow-sm);
}
.cycle-selector {
  padding: 1rem;
  border-top: 1px solid var(--hacker-border);
  margin-top: 1rem;
}
.selector-title {
  font-size: 14px;
  margin-bottom: 1rem;
  color: var(--hacker-text-dim);
  text-align: center;
}
.cycle-options {
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
}
.cycle-options .active {
  background-color: var(--hacker-primary);
  color: var(--hacker-bg);
  box-shadow: var(--glow-md);
}
.order-actions {
  display: flex;
  justify-content: space-between;
}
</style>
