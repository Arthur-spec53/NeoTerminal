<template>
  <div class="hacker-loading">
    <div class="loading-spinner">{{ currentChar }}</div>
    <div v-if="text" class="loading-text">{{ text }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

interface Props {
  text?: string
  speed?: number
}

const props = withDefaults(defineProps<Props>(), {
  text: 'LOADING_DATA',
  speed: 100
})

const chars = ['|', '/', '-', '\\']
const currentChar = ref(chars[0])
let intervalId: number
let index = 0

onMounted(() => {
  intervalId = window.setInterval(() => {
    index = (index + 1) % chars.length
    currentChar.value = chars[index]
  }, props.speed)
})

onUnmounted(() => {
  clearInterval(intervalId)
})
</script>

<style scoped>
.hacker-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  font-family: var(--font-mono);
  color: var(--hacker-primary);
}

.loading-spinner {
  font-size: 24px;
  text-shadow: var(--glow-md);
}

.loading-text {
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 2px;
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
</style>
