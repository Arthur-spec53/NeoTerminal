<template>
  <span class="typing-text">{{ displayText }}<span v-if="showCursor" class="cursor">█</span></span>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'

interface Props {
  text: string
  speed?: number // 打字速度（毫秒）
  showCursor?: boolean
  onComplete?: () => void
}

const props = withDefaults(defineProps<Props>(), {
  speed: 50,
  showCursor: true
})

const displayText = ref('')
let currentIndex = 0
let intervalId: number

const typeText = () => {
  if (currentIndex < props.text.length) {
    displayText.value += props.text[currentIndex]
    currentIndex++
  } else {
    clearInterval(intervalId)
    if (props.onComplete) {
      props.onComplete()
    }
  }
}

onMounted(() => {
  intervalId = window.setInterval(typeText, props.speed)
})

watch(() => props.text, () => {
  displayText.value = ''
  currentIndex = 0
  clearInterval(intervalId)
  intervalId = window.setInterval(typeText, props.speed)
})
</script>

<style scoped>
.typing-text {
  display: inline-block;
  font-family: var(--font-mono);
  color: var(--hacker-primary);
  text-shadow: var(--glow-sm);
}

.cursor {
  animation: blink 1s step-end infinite;
  margin-left: 2px;
}

@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}
</style>
