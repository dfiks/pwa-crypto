<script setup>
// No props needed for skeleton
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 pb-24">
    <!-- Header -->
    <div class="fixed top-0 left-0 right-0 z-50">
      <div class="max-w-md mx-auto px-4 py-3">
        <div class="flex items-center gap-3 bg-white dark:bg-gray-800 rounded-full shadow-lg dark:shadow-gray-900/50 px-4 py-3">
          <div class="p-2 -ml-2 rounded-full">
            <div class="w-5 h-5 skeleton-item rounded-full"></div>
          </div>
          <div class="flex-1">
            <div class="skeleton-item h-6 w-32 rounded-full mb-1"></div>
            <div class="skeleton-item h-4 w-24 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-md mx-auto px-4 pt-24 pb-6 space-y-6">
      <!-- Chart -->
      <div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg dark:shadow-gray-900/50">
        <div class="h-[300px] skeleton-item rounded-lg"></div>
      </div>

      <!-- Key Metrics -->
      <div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg dark:shadow-gray-900/50">
        <div class="skeleton-item h-6 w-28 rounded-full mb-4"></div>
        <div class="grid grid-cols-2 gap-4">
          <div v-for="i in 4" :key="i" class="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-3">
            <div class="skeleton-item h-3 w-16 rounded-full mb-2"></div>
            <div class="skeleton-item h-5 w-20 rounded-full"></div>
          </div>
        </div>
      </div>

      <!-- Trading Activity -->
      <div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg dark:shadow-gray-900/50">
        <div class="skeleton-item h-6 w-32 rounded-full mb-4"></div>
        <div class="grid grid-cols-2 gap-4">
          <div v-for="i in 4" :key="i" class="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-3">
            <div class="skeleton-item h-3 w-16 rounded-full mb-2"></div>
            <div class="skeleton-item h-5 w-20 rounded-full"></div>
          </div>
        </div>
      </div>

      <!-- Contract Info -->
      <div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg dark:shadow-gray-900/50">
        <div class="skeleton-item h-6 w-40 rounded-full mb-4"></div>
        <div class="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-3">
          <div class="skeleton-item h-3 w-24 rounded-full mb-2"></div>
          <div class="skeleton-item h-5 w-32 rounded-full"></div>
        </div>
      </div>

      <!-- Top Holders -->
      <div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg dark:shadow-gray-900/50">
        <div class="skeleton-item h-6 w-24 rounded-full mb-4"></div>
        <div class="space-y-2">
          <div v-for="i in 3" :key="i" 
               class="flex justify-between items-center bg-gray-50 dark:bg-gray-900/50 rounded-lg p-3">
            <div class="skeleton-item h-5 w-12 rounded-full"></div>
            <div class="skeleton-item h-4 w-24 rounded-full"></div>
          </div>
        </div>
      </div>
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