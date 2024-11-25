<script setup lang="ts">
defineProps<{
  loading?: boolean
  title: string
  metrics: Array<{
    label: string
    value: string | number
    valueClass?: string
  }>
}>()
</script>

<template>
  <div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg dark:shadow-gray-900/50">
    <h2 v-if="!loading" class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">{{ title }}</h2>
    <div v-else class="skeleton-item h-6 w-28 rounded-full mb-4"></div>
    
    <div class="grid grid-cols-2 gap-4">
      <template v-if="!loading">
        <div v-for="(metric, index) in metrics" 
             :key="index"
             class="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-3">
          <p class="text-sm text-gray-500 dark:text-gray-400">{{ metric.label }}</p>
          <p :class="[
            'font-medium',
            metric.valueClass || 'text-gray-900 dark:text-gray-100'
          ]">{{ metric.value }}</p>
        </div>
      </template>
      <template v-else>
        <div v-for="i in 4" :key="i" class="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-3">
          <div class="skeleton-item h-3 w-16 rounded-full mb-2"></div>
          <div class="skeleton-item h-5 w-20 rounded-full"></div>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.skeleton-item {
  position: relative;
  overflow: hidden;
  background: rgba(156, 163, 175, 0.1);
}

.skeleton-item::after {
  content: '';
  position: absolute;
  inset: 0;
  transform: translateX(-100%);
  background-image: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0,
    rgba(255, 255, 255, 0.1) 20%,
    rgba(255, 255, 255, 0.2) 60%,
    rgba(255, 255, 255, 0)
  );
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  100% {
    transform: translateX(100%);
  }
}

.dark .skeleton-item {
  background: rgba(31, 41, 55, 0.4);
}

.dark .skeleton-item::after {
  background-image: linear-gradient(
    90deg,
    rgba(31, 41, 55, 0) 0,
    rgba(31, 41, 55, 0.3) 20%,
    rgba(31, 41, 55, 0.5) 60%,
    rgba(31, 41, 55, 0)
  );
}
</style>