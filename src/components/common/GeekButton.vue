<template>
  <button
    class="hacker-btn"
    :class="[variantClass, sizeClass, { 'loading': loading, 'disabled': disabled }]"
    :disabled="disabled || loading"
    @click="handleClick"
  >
    <span v-if="loading" class="loading-indicator">{{ loadingChar }}</span>
    <span v-else class="btn-content">
      <span class="bracket-left">[ </span>
      <span v-if="prefix" class="prefix">{{ prefix }} </span>
      <slot />
      <span class="bracket-right"> ]</span>
    </span>
  </button>
</template>

<script setup lang="ts">
import { ref, computed, onUnmounted, watch } from 'vue'

interface Props {
  variant?: 'primary' | 'danger' | 'warning' | 'success' | 'secondary'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  disabled?: boolean
  prefix?: string // 按钮前缀，如 '>', '$', '✓'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  loading: false,
  disabled: false,
  prefix: '>'
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const loadingChars = ['|', '/', '-', '\\']
const loadingChar = ref(loadingChars[0])
let loadingInterval: number | undefined = undefined;

const variantClass = computed(() => {
  const variants = {
    primary: 'btn-primary',
    danger: 'btn-danger',
    warning: 'btn-warning',
    success: 'btn-success',
    secondary: 'btn-secondary'
  }
  return variants[props.variant || 'primary']
})

const sizeClass = computed(() => {
  const sizes = {
    sm: 'btn-sm',
    md: 'btn-md',
    lg: 'btn-lg'
  }
  return sizes[props.size]
})

const handleClick = (event: MouseEvent) => {
  if (!props.disabled && !props.loading) {
    emit('click', event)
  }
}

watch(() => props.loading, (newVal: boolean) => {
  if (newVal) {
    let index = 0
    loadingInterval = window.setInterval(() => {
      index = (index + 1) % loadingChars.length
      loadingChar.value = loadingChars[index]
    }, 100)
  } else {
    if (loadingInterval) {
      clearInterval(loadingInterval)
      loadingInterval = undefined
    }
  }
})

onUnmounted(() => {
  if (loadingInterval) {
    clearInterval(loadingInterval)
  }
})
</script>

<style scoped>
.hacker-btn {
  background: transparent;
  border: 1px solid var(--hacker-primary);
  color: var(--hacker-primary);
  font-family: var(--font-mono);
  cursor: pointer;
  transition: all 0.2s ease;
  text-shadow: var(--glow-sm);
  text-transform: uppercase;
  letter-spacing: 1px;
  position: relative;
  overflow: hidden;
  z-index: 1;
}

.hacker-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: var(--hacker-primary);
  transition: left 0.3s ease;
  z-index: -1;
}

.hacker-btn:hover::before {
  left: 0;
}

.hacker-btn:hover {
  color: var(--hacker-bg);
  box-shadow: var(--glow-md);
  text-shadow: none;
  transform: translateY(-2px);
}

.hacker-btn:active {
  transform: translateY(0) scale(0.98);
}

.hacker-btn.disabled,
.hacker-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}

.loading-indicator {
  display: inline-block;
}

.hacker-btn.loading .loading-indicator {
  animation: spin 0.4s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}


/* 按钮尺寸 */
.btn-sm {
  padding: 0.3rem 1rem;
  font-size: 12px;
}

.btn-md {
  padding: 0.5rem 1.5rem;
  font-size: 14px;
}

.btn-lg {
  padding: 0.7rem 2rem;
  font-size: 16px;
}

/* 按钮变体 */
.btn-danger {
  border-color: var(--hacker-error);
  color: var(--hacker-error);
}

.btn-danger::before {
  background: var(--hacker-error);
}

.btn-danger:hover {
  color: var(--hacker-bg);
}

.btn-warning {
  border-color: var(--hacker-warning);
  color: var(--hacker-warning);
}

.btn-warning::before {
  background: var(--hacker-warning);
}

.btn-warning:hover {
  color: var(--hacker-bg);
}

.btn-success {
  border-color: var(--hacker-success);
  color: var(--hacker-success);
}

.btn-success::before {
  background: var(--hacker-success);
}

.btn-success:hover {
  color: var(--hacker-bg);
}

.btn-secondary {
  border-color: var(--hacker-primary-dim);
  color: var(--hacker-text-dim);
  text-shadow: none;
}

.btn-secondary::before {
  background: var(--hacker-primary-dim);
}

.btn-secondary:hover {
  color: var(--hacker-bg);
  border-color: var(--hacker-primary-dim);
  box-shadow: var(--glow-sm);
}

.prefix {
  color: var(--hacker-primary-bright);
  font-weight: bold;
}
</style>
