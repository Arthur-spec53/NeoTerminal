<template>
  <div class="hacker-input-wrapper">
    <label v-if="label" class="input-label">
      <span class="label-prefix">></span> {{ label }}
    </label>
    <div class="input-container">
      <span v-if="prefix" class="input-prefix">{{ prefix }}</span>
      <input
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :required="required"
        class="hacker-input"
        @input="handleInput"
      />
      <div v-if="$slots.suffix" class="input-suffix">
        <slot name="suffix"></slot>
      </div>
    </div>
    <div v-if="error" class="input-error">
      <span class="error-prefix">[!]</span> {{ error }}
    </div>
    <div v-else-if="hint" class="input-hint">
      <span class="hint-prefix">[i]</span> {{ hint }}
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  modelValue: string | number
  type?: string
  label?: string
  placeholder?: string
  disabled?: boolean
  required?: boolean
  error?: string
  hint?: string
  prefix?: string // 输入框前缀，如 '$', '>', '#'
}

withDefaults(defineProps<Props>(), {
  type: 'text',
  disabled: false,
  required: false,
  prefix: '$'
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}
</script>

<style scoped>
.hacker-input-wrapper {
  margin-bottom: 1.5rem;
}

.input-label {
  display: block;
  color: var(--hacker-primary);
  font-family: var(--font-mono);
  font-size: 12px;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.label-prefix {
  color: var(--hacker-primary-bright);
  margin-right: 0.25rem;
}

.input-container {
  display: flex;
  align-items: center;
  position: relative;
}

.input-prefix {
  color: var(--hacker-primary-bright);
  font-family: var(--font-mono);
  margin-right: 0.5rem;
  font-weight: bold;
}

.hacker-input {
  background: transparent;
  border: none;
  border-bottom: 1px solid var(--hacker-primary-dim);
  color: var(--hacker-primary);
  font-family: var(--font-mono);
  font-size: 14px;
  padding: 0.5rem 0;
  outline: none;
  width: 100%;
  caret-color: var(--hacker-primary); /* 绿色光标 */
  text-shadow: var(--glow-sm);
  transition: all 0.3s ease;
}

.hacker-input::placeholder {
  color: var(--hacker-primary-dim);
  opacity: 0.5;
}

.hacker-input:focus {
  border-bottom-color: var(--hacker-primary-bright);
  box-shadow: 0 1px 0 0 var(--hacker-primary);
}

.hacker-input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.input-suffix {
  margin-left: 0.5rem;
  flex-shrink: 0;
}

.input-error {
  margin-top: 0.5rem;
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--hacker-error);
}

.input-hint {
  margin-top: 0.5rem;
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--hacker-text-dim);
}

.error-prefix,
.hint-prefix {
  margin-right: 0.25rem;
}
</style>
