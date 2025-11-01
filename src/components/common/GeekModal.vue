<template>
  <transition name="modal-fade">
    <div v-if="modelValue" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70" @click.self="$emit('update:modelValue', false)">
      <div class="bg-[#141821] border border-purple-500/20 rounded-lg shadow-lg w-full max-w-lg mx-4">
        <div class="flex items-center justify-between p-4 border-b border-gray-700">
          <h3 class="text-lg font-semibold text-purple-400">{{ title }}</h3>
          <button @click="$emit('update:modelValue', false)" class="text-gray-400 hover:text-white">
            <Icon icon="lucide:x" class="w-6 h-6" />
          </button>
        </div>
        <div class="p-6">
          <slot></slot>
        </div>
        <div v-if="$slots.footer" class="flex justify-end p-4 border-t border-gray-700">
          <slot name="footer"></slot>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'

defineProps<{
  modelValue: boolean
  title: string
}>()

defineEmits(['update:modelValue'])
</script>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>
