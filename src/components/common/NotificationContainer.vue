<template>
  <div class="notification-container">
    <transition-group name="notification-fade">
      <div
        v-for="notification in notificationStore.notifications"
        :key="notification.id"
        class="notification"
        :class="`notification-${notification.type}`"
      >
        <span class="notification-message">{{ notification.message }}</span>
        <button class="close-button" @click="notificationStore.removeNotification(notification.id)">
          [x]
        </button>
      </div>
    </transition-group>
  </div>
</template>

<script setup lang="ts">
import { useNotificationStore } from '@/stores/notification'

const notificationStore = useNotificationStore()
</script>

<style scoped>
.notification-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.notification {
  padding: 1rem 1.5rem;
  border: 1px solid;
  background-color: var(--hacker-bg-translucent);
  backdrop-filter: blur(5px);
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-width: 250px;
  box-shadow: var(--glow-sm);
  font-family: var(--font-mono);
}

.notification-success {
  border-color: var(--hacker-success);
  color: var(--hacker-success);
}

.notification-error {
  border-color: var(--hacker-error);
  color: var(--hacker-error);
}

.notification-info {
  border-color: var(--hacker-primary);
  color: var(--hacker-primary);
}

.close-button {
  background: none;
  border: none;
  color: var(--hacker-text-dim);
  cursor: pointer;
  margin-left: 1rem;
}

.notification-fade-enter-active,
.notification-fade-leave-active {
  transition: all 0.3s ease;
}

.notification-fade-enter-from,
.notification-fade-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
