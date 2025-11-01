<template>
  <header class="h-16 flex items-center justify-between px-6 bg-[#0a0e17]/80 backdrop-blur-md border-b border-cyan-500/20">
    <div class="flex items-center">
      <button @click="$emit('toggle-sidebar')" class="text-gray-500 focus:outline-none lg:hidden">
        <Icon icon="lucide:menu" class="w-6 h-6" />
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
      <button class="relative">
        <Icon icon="lucide:bell" class="w-6 h-6" />
        <span class="absolute -top-1 -right-1 flex h-3 w-3">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
          <span class="relative inline-flex rounded-full h-3 w-3 bg-pink-500"></span>
        </span>
      </button>
      <!-- User Menu -->
      <div class="relative">
        <button @click="toggleUserMenu" class="flex items-center space-x-2">
          <img class="w-8 h-8 rounded-full" :src="avatar" alt="User avatar">
          <span>{{ email }}</span>
          <Icon icon="lucide:chevron-down" class="w-4 h-4" />
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
