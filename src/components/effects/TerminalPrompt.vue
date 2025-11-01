<template>
  <div class="terminal-prompt">
    <span class="prompt-user">{{ user }}</span>
    <span class="prompt-separator">@</span>
    <span class="prompt-host">{{ host }}</span>
    <span class="prompt-separator"> ~</span>
    <span class="prompt-symbol">{{ symbol }}</span>
    <span class="cursor">█</span>
  </div>
</template>

<script setup lang="ts">
interface Props {
  user?: string
  host?: string
  symbol?: string
}

withDefaults(defineProps<Props>(), {
  user: 'root',
  host: 'xboard',
  symbol: '$'
})
</script>

<style scoped>
.terminal-prompt {
  font-family: var(--font-mono);
  color: var(--hacker-primary);
  text-shadow: var(--glow-sm);
  display: flex;
  align-items: center;
  gap: 0;
}

.prompt-user {
  color: var(--hacker-primary-bright);
  font-weight: bold;
}

.prompt-host {
  color: var(--hacker-primary);
}

.prompt-separator {
  color: var(--hacker-text-dim);
}

.prompt-symbol {
  color: var(--hacker-primary-bright);
  font-weight: bold;
  margin: 0 0.5rem;
}

.cursor {
  animation: blink 1s step-end infinite;
  color: var(--hacker-primary);
}

@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}
</style>
