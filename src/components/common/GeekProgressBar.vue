<template>
  <div class="hacker-progress">
    <div v-if="label" class="progress-label">
      <span class="terminal-prompt"></span>{{ label }}
    </div>
    <div class="progress-container">
      <span class="progress-bracket">[</span>
      <span class="progress-bar">
        <span class="progress-fill">{{ fillBar }}</span>
        <span class="progress-empty">{{ emptyBar }}</span>
      </span>
      <span class="progress-bracket">]</span>
      <span class="progress-percentage">{{ percentage }}%</span>
    </div>
    <div v-if="showStats" class="progress-stats">
      {{ formatBytes(current) }} / {{ formatBytes(total) }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  current: number
  total: number
  label?: string
  showStats?: boolean
  barLength?: number
}

const props = withDefaults(defineProps<Props>(), {
  showStats: true,
  barLength: 20
})

const percentage = computed(() => {
  if (props.total === 0) return 0
  return Math.round((props.current / props.total) * 100)
})

const fillCount = computed(() => {
  return Math.round((percentage.value / 100) * props.barLength)
})

const fillBar = computed(() => {
  return '█'.repeat(fillCount.value)
})

const emptyBar = computed(() => {
  return '░'.repeat(props.barLength - fillCount.value)
})

const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
</script>

<style scoped>
.hacker-progress {
  font-family: var(--font-mono);
  color: var(--hacker-primary);
}

.progress-label {
  margin-bottom: 0.25rem;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.progress-container {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-shadow: var(--glow-sm);
}

.progress-bracket {
  color: var(--hacker-primary);
  font-weight: bold;
}

.progress-fill {
  color: var(--hacker-primary-bright);
}

.progress-empty {
  color: var(--hacker-primary-dim);
  opacity: 0.3;
}

.progress-percentage {
  min-width: 3rem;
  text-align: right;
  color: var(--hacker-primary-bright);
}

.progress-stats {
  margin-top: 0.25rem;
  font-size: 12px;
  color: var(--hacker-text-dim);
}
</style>
