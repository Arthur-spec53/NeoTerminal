<template>
  <div class="scanlines" />
</template>

<script setup lang="ts">
// 纯 CSS 实现，无需逻辑
</script>

<style scoped>
.scanlines {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0) 50%,
    rgba(0, 255, 0, 0.02) 50%
  );
  background-size: 100% 4px;
  pointer-events: none;
  z-index: 9998;
  animation: scan 8s linear infinite;
}

@keyframes scan {
  0% { background-position: 0 0; }
  100% { background-position: 0 4px; }
}
</style>
