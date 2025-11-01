<template>
  <div class="profile-page">
    <div class="page-header">
      <TerminalPrompt />
      <h1 class="page-title">个人中心</h1>
    </div>

    <div class="profile-grid">
      <GeekCard title="钱包信息">
        <div class="wallet-section">
          <div class="balance-display">
            <span class="label">当前余额:</span>
            <span class="value">¥{{ formattedBalance }}</span>
          </div>
          <GeekButton disabled>充值功能未开启</GeekButton>
        </div>
      </GeekCard>

      <GeekCard title="订阅管理">
        <div class="action-section">
          <p>重置您的订阅链接，这将使旧链接失效。</p>
          <GeekButton @click="handleResetSubscription" :is-loading="isResetting">
            重置订阅链接
          </GeekButton>
        </div>
      </GeekCard>

      <GeekCard title="修改密码">
        <div class="password-section">
          <GeekInput v-model="oldPassword" type="password" label="旧密码" />
          <GeekInput v-model="newPassword" type="password" label="新密码" />
          <GeekButton @click="handleChangePassword" :is-loading="isChangingPassword">
            确认修改
          </GeekButton>
        </div>
      </GeekCard>

      <GeekCard title="Telegram绑定">
        <div class="action-section">
          <div v-if="userStore.userInfo?.telegram_id">
            <p>已绑定 Telegram ID: {{ userStore.userInfo.telegram_id }}</p>
            <GeekButton variant="danger" disabled>解绑功能未开启</GeekButton>
          </div>
          <div v-else>
            <p>尚未绑定 Telegram 账号</p>
            <GeekButton disabled>绑定功能未开启</GeekButton>
          </div>
        </div>
      </GeekCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useUserStore } from '@/stores/user'
import { useNotificationStore } from '@/stores/notification'
import GeekCard from '@/components/common/GeekCard.vue'
import GeekButton from '@/components/common/GeekButton.vue'
import GeekInput from '@/components/common/GeekInput.vue'
import TerminalPrompt from '@/components/effects/TerminalPrompt.vue'

const userStore = useUserStore()
const notificationStore = useNotificationStore()

const oldPassword = ref('')
const newPassword = ref('')
const isChangingPassword = ref(false)
const isResetting = ref(false)

const formattedBalance = computed(() => {
  const balance = userStore.userInfo?.balance ?? 0
  return (balance / 100).toFixed(2)
})

const handleChangePassword = async () => {
  if (!oldPassword.value || !newPassword.value) {
    notificationStore.addNotification('Please fill in both password fields.', 'error')
    return
  }
  isChangingPassword.value = true
  try {
    await userStore.changePassword(oldPassword.value, newPassword.value)
    notificationStore.addNotification('Password changed successfully.', 'success')
    oldPassword.value = ''
    newPassword.value = ''
  } catch (error) {
    notificationStore.addNotification('Failed to change password.', 'error')
  } finally {
    isChangingPassword.value = false
  }
}

const handleResetSubscription = async () => {
  isResetting.value = true
  try {
    await userStore.resetSubscription()
    notificationStore.addNotification('Subscription URL reset successfully.', 'success')
  } catch (error) {
    notificationStore.addNotification('Failed to reset subscription URL.', 'error')
  } finally {
    isResetting.value = false
  }
}
</script>

<style scoped>
.profile-page {
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

.profile-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 1.5rem;
}

.wallet-section,
.action-section,
.password-section {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.balance-display {
  font-size: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  border: 1px solid var(--hacker-border);
}

.balance-display .label {
  color: var(--hacker-text-dim);
}

.balance-display .value {
  color: var(--hacker-primary-bright);
  font-weight: bold;
  font-size: 20px;
}

.action-section p {
  color: var(--hacker-text-dim);
  font-size: 14px;
  min-height: 40px;
}
</style>
