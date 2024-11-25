<script setup lang="ts">
import { toast } from 'vue3-toastify'
import type { LastSignal } from '../types/signal'

const props = defineProps<{
  signal: LastSignal
  loading?: boolean
}>()

const copyAddress = async (address: string) => {
  try {
    await navigator.clipboard.writeText(address)
    toast.success('Address copied to clipboard!')
  } catch (err) {
    toast.error('Failed to copy address')
  }
}

const truncateAddress = (address: string): string => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}
</script>

<template>
  <div class="signal-plate bg-white dark:bg-gray-800 rounded-xl p-4 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] dark:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_25px_-5px_rgba(0,0,0,0.15)] dark:hover:shadow-[0_8px_25px_-5px_rgba(0,0,0,0.4)] transition-all duration-300">
    <div class="flex justify-between items-start mb-3">
      <template v-if="!loading">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          {{ signal.pair }}
          <span class="inline-block w-1.5 h-1.5 rounded-full bg-green-500"></span>
        </h3>
        <div class="bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded-full">
          <span class="text-xs font-medium text-blue-600 dark:text-blue-400">{{ signal.age }} ago</span>
        </div>
      </template>
      <template v-else>
        <div class="skeleton-item h-7 w-32 rounded-lg"></div>
        <div class="skeleton-item h-6 w-20 rounded-full"></div>
      </template>
    </div>

    <div class="grid grid-cols-2 gap-3 mb-3">
      <template v-if="!loading">
        <div class="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-2 shadow-[inset_0_1px_2px_rgba(0,0,0,0.05)] dark:shadow-[inset_0_1px_2px_rgba(0,0,0,0.2)]">
          <p class="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Price USD</p>
          <p class="font-medium text-gray-900 dark:text-gray-100">${{ signal.price }}</p>
        </div>
        <div class="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-2 shadow-[inset_0_1px_2px_rgba(0,0,0,0.05)] dark:shadow-[inset_0_1px_2px_rgba(0,0,0,0.2)]">
          <p class="text-xs text-gray-500 dark:text-gray-400 mb-0.5">FDV</p>
          <p class="font-medium text-gray-900 dark:text-gray-100">${{ signal.fdv }}</p>
        </div>
        <div class="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-2 shadow-[inset_0_1px_2px_rgba(0,0,0,0.05)] dark:shadow-[inset_0_1px_2px_rgba(0,0,0,0.2)]">
          <p class="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Volume</p>
          <p class="font-medium text-gray-900 dark:text-gray-100">${{ signal.volume }}</p>
        </div>
        <div class="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-2 shadow-[inset_0_1px_2px_rgba(0,0,0,0.05)] dark:shadow-[inset_0_1px_2px_rgba(0,0,0,0.2)]">
          <p class="text-xs text-gray-500 dark:text-gray-400 mb-0.5">1H Change</p>
          <p class="font-medium text-green-600 dark:text-green-400">+{{ signal.hourChange }}%</p>
        </div>
      </template>
      <template v-else>
        <div v-for="i in 4" :key="i" class="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-2">
          <div class="skeleton-item h-3 w-16 rounded-full mb-1"></div>
          <div class="skeleton-item h-5 w-20 rounded-full"></div>
        </div>
      </template>
    </div>

    <div class="flex justify-between items-center text-sm pt-3 border-t border-gray-100/50 dark:border-gray-700/50">
      <template v-if="!loading">
        <div class="flex gap-4">
          <div class="flex items-center">
            <span class="text-green-600 dark:text-green-400 font-medium">{{ signal.buyers }}</span>
            <span class="text-gray-500 dark:text-gray-400 text-xs ml-1">buys</span>
          </div>
          <div class="flex items-center">
            <span class="text-red-600 dark:text-red-400 font-medium">{{ signal.sellers }}</span>
            <span class="text-gray-500 dark:text-gray-400 text-xs ml-1">sells</span>
          </div>
        </div>
        <button 
          @click="copyAddress(signal.address)"
          class="text-xs px-2 py-1 rounded bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 transition-colors shadow-sm dark:shadow-[0_1px_2px_rgba(0,0,0,0.3)]"
        >
          {{ truncateAddress(signal.address) }}
        </button>
      </template>
      <template v-else>
        <div class="flex gap-4">
          <div class="skeleton-item h-5 w-20 rounded-full"></div>
          <div class="skeleton-item h-5 w-20 rounded-full"></div>
        </div>
        <div class="skeleton-item h-6 w-24 rounded-lg"></div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.signal-plate {
  transform: translateZ(0);
  backface-visibility: hidden;
}

.signal-plate:hover {
  transform: translateY(-1px);
}

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