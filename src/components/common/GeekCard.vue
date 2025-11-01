<template>
  <div class="hacker-card" :class="{ 'hoverable': hoverable, 'clickable': clickable }">
    <!-- 顶部边框 -->
    <div class="card-border-top">
      ╔{{ '═'.repeat(borderLength) }}╗
    </div>
    
    <!-- 头部 -->
    <div v-if="$slots.header || title" class="card-header">
      <div class="card-border-left">║</div>
      <div class="card-header-content">
        <slot name="header">
          <span class="terminal-prompt"></span>
          <span class="card-title">{{ title }}</span>
          <span v-if="$slots.badge" class="card-badge">
            <slot name="badge" />
          </span>
        </slot>
      </div>
      <div class="card-border-right">║</div>
    </div>
    
    <!-- 分隔线 -->
    <div v-if="$slots.header || title" class="card-divider">
      ╠{{ '═'.repeat(borderLength) }}╣
    </div>
    
    <!-- 主体内容 -->
    <div class="card-body">
      <div class="card-border-left">║</div>
      <div class="card-body-content">
        <slot />
      </div>
      <div class="card-border-right">║</div>
    </div>
    
    <!-- 底部 -->
    <div v-if="$slots.footer" class="card-footer">
      <div class="card-border-left">║</div>
      <div class="card-footer-content">
        <slot name="footer" />
      </div>
      <div class="card-border-right">║</div>
    </div>
    
    <!-- 底部边框 -->
    <div class="card-border-bottom">
      ╚{{ '═'.repeat(borderLength) }}╝
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface Props {
  title?: string
  hoverable?: boolean
  clickable?: boolean
}

withDefaults(defineProps<Props>(), {
  hoverable: false,
  clickable: false
})

const borderLength = ref(50)

onMounted(() => {
  // 根据卡片宽度动态调整边框长度
  // 这里使用固定值，实际项目中可以动态计算
})
</script>

<style scoped>
.hacker-card {
  font-family: var(--font-mono);
  color: var(--hacker-primary);
  margin-bottom: 1rem;
  transition: all 0.3s ease;
}

.hacker-card.hoverable:hover {
  transform: translateY(-2px);
  filter: brightness(1.2);
}

.hacker-card.clickable {
  cursor: pointer;
}

.card-border-top,
.card-border-bottom,
.card-divider {
  color: var(--hacker-primary);
  text-shadow: var(--glow-sm);
  font-size: 14px;
  line-height: 1;
  user-select: none;
  white-space: pre;
}

.card-header,
.card-body,
.card-footer {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 0.5rem;
}

.card-border-left,
.card-border-right {
  color: var(--hacker-primary);
  text-shadow: var(--glow-sm);
  user-select: none;
}

.card-header-content,
.card-footer-content {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0;
}

.card-body-content {
  padding: 1rem 0;
}

.card-title {
  color: var(--hacker-primary-bright);
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: bold;
}

.card-badge {
  margin-left: auto;
}
</style>
