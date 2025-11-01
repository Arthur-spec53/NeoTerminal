<template>
  <div class="default-layout">
    <ScanLines />
    <MatrixRain />
    <Header />
    <Sidebar />
    <main class="main-content">
      <router-view />
    </main>
    <NotificationContainer />
  </div>
</template>

<script setup lang="ts">
import Header from './Header.vue'
import Sidebar from './Sidebar.vue'
import ScanLines from '@/components/effects/ScanLines.vue'
import MatrixRain from '@/components/effects/MatrixRain.vue'
import NotificationContainer from '@/components/common/NotificationContainer.vue'
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
</style>
