<template>
  <div id="app" class="crt-effect">
    <!-- Matrix 背景（全局） -->
    <MatrixRain v-if="showMatrixBg" />
    
    <!-- 扫描线效果（全局） -->
    <ScanLines />
    
    <!-- 路由视图 -->
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import MatrixRain from './components/effects/MatrixRain.vue'
import ScanLines from './components/effects/ScanLines.vue'
import { useAuthStore } from '@/stores/auth'
import { useUserStore } from '@/stores/user'
import { log } from '@/utils/logger'

const route = useRoute()
const authStore = useAuthStore()
const userStore = useUserStore()

// 某些页面可能不需要 Matrix 背景
const showMatrixBg = ref(true)

// 应用初始化
onMounted(async () => {
  log('[App] 应用初始化...')
  
  // 恢复认证状态
  authStore.initialize()
  log('[App] ✅ 认证状态已恢复，isAuthenticated:', authStore.isAuthenticated)
  
  // 如果已登录，加载用户数据
  if (authStore.isAuthenticated) {
    try {
      await userStore.fetchUserInfo()
      log('[App] ✅ 用户数据已加载')
    } catch (err) {
      log('[App] ⚠️ 用户数据加载失败')
    }
  }
})
</script>

<style>
/* 全局样式已在 hacker-theme.css 中定义 */
#app {
  min-height: 100vh;
  position: relative;
}
</style>
