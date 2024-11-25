<script setup lang="ts">
defineProps<{
  title: string
  value: string | number
  subtitle?: string
  icon?: any
  gradient?: string
  iconClass?: string
  iconBgClass?: string
  loading?: boolean
}>()
</script>

<template>
  <div 
    class="rounded-2xl p-3 sm:p-6 shadow-lg"
    :class="[gradient || 'bg-white dark:bg-gray-800']"
  >
    <div class="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-4">
      <div 
        v-if="icon"
        class="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center"
        :class="iconBgClass"
      >
        <component 
          :is="icon" 
          class="w-4 h-4 sm:w-5 sm:h-5"
          :class="iconClass"
        />
      </div>
      <h3 :class="[
        'text-sm sm:text-lg font-semibold',
        gradient ? 'text-white' : 'text-gray-900 dark:text-gray-100'
      ]">{{ title }}</h3>
    </div>
    <p :class="[
      'text-xl sm:text-2xl font-bold',
      gradient ? 'text-white' : 'text-gray-900 dark:text-gray-100'
    ]">{{ value }}</p>
    <p v-if="subtitle" :class="[
      'text-xs sm:text-sm',
      gradient ? 'text-white/80' : 'text-gray-500'
    ]">{{ subtitle }}</p>
    <slot></slot>
  </div>
</template>