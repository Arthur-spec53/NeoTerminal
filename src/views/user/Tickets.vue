<template>
  <div class="tickets-page">
    <div class="page-header">
      <TerminalPrompt />
      <h1 class="page-title">我的工单</h1>
      <GeekButton @click="showCreateModal = true">创建工单</GeekButton>
    </div>

    <GeekCard title="工单列表">
      <div class="tickets-table">
        <div class="table-header">
          <div>[主题]</div>
          <div>[级别]</div>
          <div>[状态]</div>
          <div>[最后回复]</div>
          <div>[操作]</div>
        </div>
        <div v-if="tickets.length === 0" class="no-data">[暂无工单]</div>
        <div v-for="ticket in tickets" :key="ticket.id" class="table-row" @click="viewTicket(ticket)">
          <div class="subject-cell">{{ ticket.subject }}</div>
          <div>
            <GeekBadge :variant="levelVariant(ticket.level)">
              {{ getLevelText(ticket.level) }}
            </GeekBadge>
          </div>
          <div>
            <GeekBadge :variant="statusVariant(ticket.status)">
              {{ getStatusText(ticket.status) }}
            </GeekBadge>
          </div>
          <div>{{ formatDate(ticket.updated_at) }}</div>
          <div><GeekButton size="sm" prefix="">查看</GeekButton></div>
        </div>
      </div>
    </GeekCard>

    <!-- Create Ticket Modal -->
    <div v-if="showCreateModal" class="modal-overlay" @click.self="showCreateModal = false">
      <GeekCard title="创建新工单" class="modal-card">
        <GeekInput v-model="newTicket.subject" label="主题" />
        <div class="form-group">
          <label class="input-label">> 优先级</label>
          <select v-model="newTicket.level" class="hacker-select">
            <option :value="0">低</option>
            <option :value="1">中</option>
            <option :value="2">高</option>
          </select>
        </div>
        <div class="form-group">
          <label class="input-label">> 消息内容</label>
          <textarea v-model="newTicket.message" class="hacker-textarea"></textarea>
        </div>
        <template #footer>
          <div class="modal-actions">
            <GeekButton @click="showCreateModal = false" variant="secondary">取消</GeekButton>
            <GeekButton @click="handleCreateTicket" :is-loading="isCreating">提交工单</GeekButton>
          </div>
        </template>
      </GeekCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ticketService } from '@/api'
import GeekCard from '@/components/common/GeekCard.vue'
import GeekButton from '@/components/common/GeekButton.vue'
import GeekInput from '@/components/common/GeekInput.vue'
import TerminalPrompt from '@/components/effects/TerminalPrompt.vue'
import GeekBadge from '@/components/common/GeekBadge.vue'
import { useNotificationStore } from '@/stores/notification'
import type { Ticket, TicketLevel, TicketStatus } from '@/types'

const router = useRouter()
const notificationStore = useNotificationStore()
const tickets = ref<Ticket[]>([])
const showCreateModal = ref(false)
const isCreating = ref(false)
const newTicket = ref({
  subject: '',
  level: 0 as TicketLevel,
  message: ''
})

const fetchTickets = async () => {
  try {
    const response = await ticketService.fetch()
    if (response.success) {
      tickets.value = response.data
    }
  } catch (error) {
    notificationStore.addNotification('Failed to fetch tickets.', 'error')
  }
}

const handleCreateTicket = async () => {
  if (!newTicket.value.subject || !newTicket.value.message) {
    notificationStore.addNotification('Subject and message are required.', 'error')
    return
  }
  isCreating.value = true
  try {
    await ticketService.create(newTicket.value)
    notificationStore.addNotification('Ticket created successfully.', 'success')
    showCreateModal.value = false
    newTicket.value = { subject: '', level: 0, message: '' }
    await fetchTickets()
  } catch (error) {
    notificationStore.addNotification('Failed to create ticket.', 'error')
  } finally {
    isCreating.value = false
  }
}

const viewTicket = (ticket: Ticket) => {
  router.push(`/user/tickets/${ticket.id}`)
}

const getLevelText = (level: TicketLevel) => ({ 0: '低', 1: '中', 2: '高' }[level] || '未知')
const getStatusText = (status: TicketStatus) => ({ 0: '开启', 1: '已关闭' }[status] || '未知')

type BadgeVariant = 'success' | 'warning' | 'danger' | 'secondary' | 'primary'

const levelVariant = (level: TicketLevel): BadgeVariant => ({ 0: 'success', 1: 'warning', 2: 'danger' }[level] as BadgeVariant)
const statusVariant = (status: TicketStatus): BadgeVariant => ({ 0: 'success', 1: 'secondary' }[status] as BadgeVariant)

const formatDate = (timestamp: number) => {
  return new Date(timestamp * 1000).toLocaleString()
}

onMounted(() => {
  fetchTickets()
})
</script>

<style scoped>
.tickets-page {
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
  margin-right: auto;
}

.tickets-table {
  font-size: 12px;
}

.table-header,
.table-row {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1.5fr 1fr;
  gap: 1rem;
  padding: 0.75rem 0;
  border-bottom: 1px solid var(--hacker-primary-dim);
  align-items: center;
}

.table-row {
  cursor: pointer;
  transition: background-color 0.2s;
}

.subject-cell {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.no-data {
  text-align: center;
  padding: 2rem;
  color: var(--hacker-text-dim);
}

.table-row:hover {
  background: rgba(0, 255, 0, 0.05);
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.modal-card {
  width: 90%;
  max-width: 600px;
}

.modal-actions {
  display: flex;
  justify-content: space-between;
}

.form-group {
  margin-bottom: 1rem;
}

.input-label {
  display: block;
  color: var(--hacker-primary);
  font-family: var(--font-mono);
  font-size: 12px;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
}

.hacker-select, .hacker-textarea {
  background: transparent;
  border: 1px solid var(--hacker-primary-dim);
  color: var(--hacker-primary);
  font-family: var(--font-mono);
  width: 100%;
  padding: 0.5rem;
}

.hacker-textarea {
  min-height: 150px;
  resize: vertical;
}
</style>
