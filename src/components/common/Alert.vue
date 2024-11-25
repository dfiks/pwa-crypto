<script setup lang="ts">
import { computed } from 'vue'
import { ExclamationTriangleIcon, XCircleIcon } from '@heroicons/vue/24/outline'

interface Props {
  type: 'warning' | 'error'
  message: string
  description?: string
}

const props = defineProps<Props>()

const styles = computed(() => ({
  warning: {
    bg: 'bg-orange-50 dark:bg-orange-900/30',
    icon: 'text-orange-400',
    iconBg: 'bg-orange-100 dark:bg-orange-900/50',
    title: 'text-orange-800 dark:text-orange-200',
    description: 'text-orange-700 dark:text-orange-300'
  },
  error: {
    bg: 'bg-red-50 dark:bg-red-900/30',
    icon: 'text-red-400',
    iconBg: 'bg-red-100 dark:bg-red-900/50',
    title: 'text-red-800 dark:text-red-200',
    description: 'text-red-700 dark:text-red-300'
  }
}))

const currentStyle = computed(() => styles.value[props.type])
</script>

<template>
  <div :class="[currentStyle.bg, 'rounded-lg p-4 mb-4']">
    <div class="flex">
      <div class="flex-shrink-0">
        <div :class="[currentStyle.iconBg, 'h-8 w-8 rounded-lg flex items-center justify-center']">
          <ExclamationTriangleIcon v-if="type === 'warning'" :class="[currentStyle.icon, 'h-5 w-5']" />
          <XCircleIcon v-else :class="[currentStyle.icon, 'h-5 w-5']" />
        </div>
      </div>
      <div class="ml-3">
        <h3 :class="[currentStyle.title, 'text-sm font-medium']">
          {{ message }}
        </h3>
        <div v-if="description" :class="[currentStyle.description, 'mt-2 text-sm']">
          {{ description }}
        </div>
      </div>
    </div>
  </div>
</template>