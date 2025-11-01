<template>
  <div class="traffic-page">
    <div class="page-header">
      <TerminalPrompt />
      <h1 class="page-title">流量明细</h1>
    </div>

    <GeekCard title="使用详情">
      <div class="traffic-table">
        <div class="table-header">
          <div>[日期]</div>
          <div>[上传]</div>
          <div>[下载]</div>
          <div>[总计]</div>
          <div class="text-right">[可视化]</div>
        </div>
        <div v-if="trafficLogs.length === 0" class="no-data">[暂无流量记录]</div>
        <div v-for="log in trafficLogs" :key="log.date" class="table-row">
          <div>{{ log.date }}</div>
          <div>{{ formatBytes(log.u) }}</div>
          <div>{{ formatBytes(log.d) }}</div>
          <div>{{ formatBytes(log.u + log.d) }}</div>
          <div class="bar-cell">{{ generateUsageBar(log.u + log.d) }}</div>
        </div>
      </div>
    </GeekCard>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { statService } from '@/api'
import GeekCard from '@/components/common/GeekCard.vue'
import TerminalPrompt from '@/components/effects/TerminalPrompt.vue'
import type { TrafficLog } from '@/types'
import { useNotificationStore } from '@/stores/notification'

const trafficLogs = ref<TrafficLog[]>([])
const notificationStore = useNotificationStore()
let maxUsage = 0

const fetchTrafficLogs = async () => {
  try {
    const response = await statService.getTrafficLog()
    if (response.success) {
      trafficLogs.value = response.data
      calculateMaxUsage()
    }
  } catch (error) {
    notificationStore.addNotification('Failed to fetch traffic logs.', 'error')
  }
}

const calculateMaxUsage = () => {
  if (trafficLogs.value.length === 0) return
  maxUsage = Math.max(...trafficLogs.value.map(log => log.u + log.d))
}

const generateUsageBar = (usage: number) => {
  const barLength = 20
  if (maxUsage === 0) return '['.padEnd(barLength + 1, ' ') + ']'
  const percentage = usage / maxUsage
  const filledLength = Math.round(barLength * percentage)
  const bar = '█'.repeat(filledLength).padEnd(barLength, '░')
  return `[${bar}]`
}

const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`
}

onMounted(() => {
  fetchTrafficLogs()
})
</script>

<style scoped>
.traffic-page {
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

.traffic-table {
  font-size: 12px;
}

.table-header,
.table-row {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 2fr;
  gap: 1rem;
  padding: 0.75rem 0;
  border-bottom: 1px solid var(--hacker-primary-dim);
  align-items: center;
}

.bar-cell {
  color: var(--hacker-success);
  text-shadow: 0 0 3px var(--hacker-success);
  text-align: right;
}

.no-data {
  grid-column: 1 / -1;
  text-align: center;
  padding: 2rem;
  color: var(--hacker-text-dim);
}

.table-header {
  color: var(--hacker-primary-bright);
  font-weight: bold;
  text-shadow: var(--glow-sm);
}

.table-row:hover {
  background: rgba(0, 255, 0, 0.05);
}
</style>
