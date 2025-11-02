<template>
  <header class="header-bar">
    <div class="flex items-center">
      <button @click="$emit('toggle-sidebar')" class="mobile-menu-btn">
        <Icon icon="lucide:menu" class="menu-icon" />
      </button>
    </div>
    <div class="flex items-center space-x-4">
      <!-- Traffic Info -->
      <div v-if="userStore.hasActiveSubscription" class="text-sm font-mono">
        <span>{{ trafficUsage.usedFormatted }} / {{ trafficUsage.totalFormatted }}</span>
      </div>
      <!-- Expire Info -->
      <div v-if="userStore.hasActiveSubscription" class="text-sm" :class="expirationInfo.isExpiringSoon ? 'text-yellow-400' : 'text-gray-300'">
        <span>{{ expirationInfo.formatted }}</span>
      </div>
      <!-- Notifications -->
      <button class="relative notification-btn">
        <Icon icon="lucide:bell" class="w-6 h-6" />
        <span class="absolute -top-1 -right-1 flex h-3 w-3">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
          <span class="relative inline-flex rounded-full h-3 w-3 bg-pink-500"></span>
        </span>
      </button>
      <!-- User Menu -->
      <div class="relative user-menu-wrapper">
        <button @click="toggleUserMenu" class="flex items-center space-x-2 user-menu-button">
          <img class="w-8 h-8 rounded-full user-avatar" :src="avatar" alt="User avatar">
          <span class="user-email-text">{{ email }}</span>
          <Icon icon="lucide:chevron-down" class="w-4 h-4 dropdown-arrow" />
        </button>
        <div v-if="userMenuOpen" class="absolute right-0 mt-2 w-48 bg-[#141821] rounded-md shadow-lg py-1 z-10 border border-cyan-500/20">
          <router-link to="/profile" class="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-cyan-400/10">
            <Icon icon="lucide:settings" class="w-4 h-4 mr-2" />
            个人设置
          </router-link>
          <router-link to="/profile/security" class="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-cyan-400/10">
            <Icon icon="lucide:shield" class="w-4 h-4 mr-2" />
            安全中心
          </router-link>
          <div class="border-t border-gray-700 my-1"></div>
          <a @click="logout" href="#" class="flex items-center px-4 py-2 text-sm text-pink-400 hover:bg-pink-400/10">
            <Icon icon="lucide:log-out" class="w-4 h-4 mr-2" />
            退出登录
          </a>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import { useUserStore } from '@/stores/user'
import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'

const userMenuOpen = ref(false)
const router = useRouter()

const userStore = useUserStore()
const authStore = useAuthStore()

const { email, avatar, trafficUsage, expirationInfo } = storeToRefs(userStore)

const toggleUserMenu = () => {
  userMenuOpen.value = !userMenuOpen.value
}

const logout = async () => {
  await authStore.logout()
  router.push('/login')
}

onMounted(() => {
  userStore.refreshAll()
})
</script>

<style scoped>
.header-bar {
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.5rem;
  background: rgba(10, 14, 23, 0.8);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(0, 255, 65, 0.2);
  position: fixed;
  top: 0;
  right: 0;
  left: 250px;
  z-index: 100;
  transition: left 0.3s ease;
}

.mobile-menu-btn {
  display: none;
  padding: 0.5rem;
  background: rgba(0, 0, 0, 0.6);
  border: 1px solid var(--hacker-primary);
  border-radius: 4px;
  color: var(--hacker-primary);
  cursor: pointer;
  transition: all 0.3s ease;
}

.mobile-menu-btn:hover {
  background: rgba(0, 255, 65, 0.1);
  box-shadow: 0 0 10px rgba(0, 255, 65, 0.5);
}

.menu-icon {
  width: 24px;
  height: 24px;
  filter: drop-shadow(0 0 5px rgba(0, 255, 65, 0.5));
}

/* 移动端适配 */
@media (max-width: 1023px) {
  .header-bar {
    left: 0;
    padding: 0 1rem;
  }
  
  .mobile-menu-btn {
    display: block;
  }
  
  /* 隐藏流量和到期信息 */
  .text-sm.font-mono,
  .text-sm {
    display: none !important;
  }
  
  /* 隐藏通知按钮 */
  .notification-btn {
    display: none !important;
  }
}

/* 小屏手机适配 */
@media (max-width: 640px) {
  .header-bar {
    padding: 0 0.75rem;
  }
  
  .header-bar .space-x-4 {
    gap: 0.5rem !important;
  }
  
  /* 用户菜单 - 只显示头像 */
  .user-email-text,
  .dropdown-arrow {
    display: none !important;
  }
  
  .user-menu-button {
    gap: 0 !important;
    padding: 0 !important;
  }
  
  .user-avatar {
    width: 32px !important;
    height: 32px !important;
    border: 2px solid var(--hacker-primary);
  }
}
</style>
