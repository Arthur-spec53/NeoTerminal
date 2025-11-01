<template>
  <div class="ticket-page">
    <div class="page-header">
      <TerminalPrompt />
      <h1 class="page-title">TICKET_DETAILS</h1>
    </div>

    <GeekCard :title="ticket?.subject">
      <div class="ticket-meta">
        <span>ID: {{ ticket?.id }}</span>
        <span>STATUS: {{ getStatusText(ticket?.status) }}</span>
        <span>LEVEL: {{ getLevelText(ticket?.level) }}</span>
      </div>

      <div class="messages-list">
        <div v-for="message in ticket?.messages" :key="message.id" class="message-item" :class="{ 'admin-reply': message.is_admin }">
          <div class="message-content">{{ message.message }}</div>
          <div class="message-timestamp">{{ formatDate(message.created_at) }}</div>
        </div>
      </div>

      <div class="reply-section">
        <textarea v-model="replyMessage" class="hacker-textarea" placeholder="> Enter your reply..."></textarea>
        <GeekButton @click="handleReply">SEND_REPLY</GeekButton>
      </div>
    </GeekCard>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ticketService } from '@/api'
import GeekCard from '@/components/common/GeekCard.vue'
import GeekButton from '@/components/common/GeekButton.vue'
import TerminalPrompt from '@/components/effects/TerminalPrompt.vue'
import type { Ticket, TicketLevel } from '@/types'

const route = useRoute()
const ticket = ref<Ticket | null>(null)
const replyMessage = ref('')

const fetchTicket = async () => {
  const id = Number(route.params.id)
  const response = await ticketService.getDetail(id)
  if (response.success) {
    ticket.value = response.data
  }
}

const handleReply = async () => {
  if (!replyMessage.value || !ticket.value) return
  await ticketService.reply({
    id: ticket.value.id,
    message: replyMessage.value
  })
  replyMessage.value = ''
  fetchTicket()
}

const getLevelText = (level: TicketLevel | undefined) => {
  if (level === undefined) return ''
  const map = { 0: 'Low', 1: 'Medium', 2: 'High' }
  return map[level] || 'Unknown'
}

const getStatusText = (status: number | undefined) => {
  if (status === undefined) return ''
  return status === 0 ? 'Open' : 'Closed'
}

const formatDate = (timestamp: number) => {
  return new Date(timestamp * 1000).toLocaleString()
}

onMounted(() => {
  fetchTicket()
})
</script>

<style scoped>
.ticket-page {
  padding: 2rem;
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

.ticket-meta {
  display: flex;
  gap: 2rem;
  font-size: 12px;
  padding: 1rem;
  border-bottom: 1px solid var(--hacker-primary-dim);
}

.messages-list {
  padding: 1rem;
  max-height: 500px;
  overflow-y: auto;
}

.message-item {
  margin-bottom: 1.5rem;
  padding: 1rem;
  border: 1px solid var(--hacker-primary-dim);
}

.admin-reply {
  border-color: var(--hacker-warning);
}

.message-content {
  white-space: pre-wrap;
  margin-bottom: 0.5rem;
}

.message-timestamp {
  font-size: 10px;
  color: var(--hacker-primary-dim);
  text-align: right;
}

.reply-section {
  padding: 1rem;
  border-top: 1px solid var(--hacker-primary-dim);
}

.hacker-textarea {
  background: transparent;
  border: 1px solid var(--hacker-primary-dim);
  color: var(--hacker-primary);
  font-family: var(--font-mono);
  width: 100%;
  padding: 0.5rem;
  min-height: 100px;
  margin-bottom: 1rem;
}
</style>
