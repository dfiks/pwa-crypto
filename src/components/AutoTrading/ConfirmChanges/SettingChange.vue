<script setup lang="ts">
import { ExclamationTriangleIcon, InformationCircleIcon } from '@heroicons/vue/24/outline'
import type { Warning } from '@/utils/warningSettings'

const props = defineProps<{
  label: string
  original: number
  current: number
  prefix?: string
  suffix?: string
  warning?: Warning
}>()
</script>

<template>
  <div class="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4">
    <p class="text-sm text-gray-500 dark:text-gray-400 mb-2">{{ label }}</p>
    <div class="flex items-center gap-2">
      <span class="text-red-600 dark:text-red-400 line-through">
        {{ prefix || '' }}{{ original }}{{ suffix || '' }}
      </span>
      <span class="text-gray-500 dark:text-gray-400">→</span>
      <span class="text-blue-600 dark:text-blue-400 font-medium">
        {{ prefix || '' }}{{ current }}{{ suffix || '' }}
      </span>
    </div>

    <!-- Warning Message -->
    <div v-if="warning" 
         :class="[
           'mt-3 flex items-start gap-2 rounded-lg p-3',
           {
             'bg-red-50 dark:bg-red-900/30': warning.type === 'danger',
             'bg-orange-50 dark:bg-orange-900/30': warning.type === 'warning',
             'bg-blue-50 dark:bg-blue-900/30': warning.type === 'info'
           }
         ]">
      <div :class="[
        'flex-shrink-0 w-5 h-5',
        {
          'text-red-400 dark:text-red-300': warning.type === 'danger',
          'text-orange-400 dark:text-orange-300': warning.type === 'warning',
          'text-blue-400 dark:text-blue-300': warning.type === 'info'
        }
      ]">
        <ExclamationTriangleIcon v-if="warning.type === 'danger' || warning.type === 'warning'" class="w-5 h-5" />
        <InformationCircleIcon v-else class="w-5 h-5" />
      </div>
      <p :class="[
        'text-sm',
        {
          'text-red-700 dark:text-red-200': warning.type === 'danger',
          'text-orange-700 dark:text-orange-200': warning.type === 'warning',
          'text-blue-700 dark:text-blue-200': warning.type === 'info'
        }
      ]">
        {{ warning.message }}
      </p>
    </div>
  </div>
</template>