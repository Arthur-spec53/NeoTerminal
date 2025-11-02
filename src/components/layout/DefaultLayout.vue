<template>
  <div class="default-layout">
    <ScanLines />
    <MatrixRain />
    
    <!-- 移动端遮罩层 -->
    <transition name="fade">
      <div v-if="isSidebarOpen" class="mobile-overlay" @click="closeSidebar"></div>
    </transition>
    
    <Header @toggle-sidebar="toggleSidebar" />
    <Sidebar :is-open="isSidebarOpen" @close="closeSidebar" />
    <main class="main-content" :class="{ 'sidebar-open': isSidebarOpen }">
      <router-view />
    </main>
    <NotificationContainer />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import Header from './Header.vue'
import Sidebar from './Sidebar.vue'
import ScanLines from '@/components/effects/ScanLines.vue'
import MatrixRain from '@/components/effects/MatrixRain.vue'
import NotificationContainer from '@/components/common/NotificationContainer.vue'

const isSidebarOpen = ref(false)

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}

const closeSidebar = () => {
  isSidebarOpen.value = false
}

// 监听屏幕尺寸变化
const handleResize = () => {
  // 在桌面端自动关闭侧边栏状态
  if (window.innerWidth >= 1024) {
    isSidebarOpen.value = false
  }
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.default-layout {
  display: flex;
  height: 100vh;
  background-color: var(--hacker-bg);
  color: var(--hacker-primary);
  font-family: var(--font-mono);
  overflow: hidden;
}

.main-content {
  flex-grow: 1;
  padding-left: 250px; /* Same as sidebar width */
  padding-top: 60px; /* Same as header height */
  overflow-y: auto;
  position: relative;
  z-index: 10;
}

/* 移动端遮罩层 */
.mobile-overlay {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  z-index: 999;
}

/* 遮罩层过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 平板和移动端适配 */
@media (max-width: 1023px) {
  .mobile-overlay {
    display: block;
  }
  
  .main-content {
    padding-left: 0;
    padding-top: 64px;
  }
  
  .main-content.sidebar-open {
    overflow: hidden;
  }
}

/* 小屏手机适配 */
@media (max-width: 640px) {
  .main-content {
    padding: 70px 10px 10px 10px;
  }
}
</style>
