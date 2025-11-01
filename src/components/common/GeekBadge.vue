<template>
  <span class="hacker-badge" :class="variantClass">
    <slot></slot>
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

type BadgeVariant = 'success' | 'warning' | 'danger' | 'secondary' | 'primary'

const props = withDefaults(defineProps<{
  variant?: BadgeVariant
}>(), {
  variant: 'secondary'
})

const variantClass = computed(() => {
  return `badge-${props.variant}`
})
</script>

<style scoped>
.hacker-badge {
  display: inline-block;
  padding: 0.2em 0.6em;
  font-size: 10px;
  font-weight: bold;
  text-transform: uppercase;
  border-radius: 0;
  border: 1px solid;
  line-height: 1;
  text-align: center;
  white-space: nowrap;
  vertical-align: baseline;
}

.badge-primary {
  background-color: var(--hacker-primary-translucent);
  border-color: var(--hacker-primary);
  color: var(--hacker-primary-bright);
}

.badge-secondary {
  background-color: var(--hacker-bg-light);
  border-color: var(--hacker-border);
  color: var(--hacker-text-dim);
}

.badge-success {
  background-color: var(--hacker-success-translucent);
  border-color: var(--hacker-success);
  color: var(--hacker-success);
}

.badge-warning {
  background-color: var(--hacker-warning-translucent);
  border-color: var(--hacker-warning);
  color: var(--hacker-warning);
}

.badge-danger {
  background-color: var(--hacker-error-translucent);
  border-color: var(--hacker-error);
  color: var(--hacker-error);
}
</style>
