<template>
  <div class="overflow-x-auto bg-[#141821] border border-cyan-500/20 rounded-lg">
    <table class="min-w-full divide-y divide-gray-700">
      <thead class="bg-gray-800">
        <tr>
          <th v-for="header in headers" :key="header.key" scope="col"
            class="px-6 py-3 text-left text-xs font-medium text-cyan-400 uppercase tracking-wider">
            {{ header.label }}
          </th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-800">
        <tr v-if="items.length === 0">
          <td :colspan="headers.length" class="px-6 py-4 text-center text-gray-400">
            没有可显示的数据
          </td>
        </tr>
        <tr v-for="(item, index) in items" :key="index" class="hover:bg-gray-800/50 transition-colors duration-200">
          <td v-for="header in headers" :key="header.key" class="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
            <slot :name="`cell(${header.key})`" :item="item">
              {{ item[header.key] }}
            </slot>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'

export interface TableHeader {
  key: string;
  label: string;
}

defineProps<{
  headers: TableHeader[];
  items: any[];
}>()
</script>
