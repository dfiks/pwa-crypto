<script setup lang="ts">
import { ChevronDownIcon } from '@heroicons/vue/24/solid'

const props = defineProps<{
  strategy: any
  strategyIndex: number
  isExpanded: boolean
}>()

const emit = defineEmits(['toggle'])
</script>

<template>
  <div class="bg-red-50/50 dark:bg-red-900/20 rounded-lg overflow-hidden">
    <button 
      @click="emit('toggle')"
      class="w-full flex items-center justify-between p-4 text-left"
    >
      <div class="flex items-center gap-2">
        <span class="text-sm font-medium text-gray-900 dark:text-gray-100">
          Strategy {{ strategyIndex + 1 }}
        </span>
        <span class="text-xs font-medium text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30 px-2 py-0.5 rounded-full">
          Removed
        </span>
      </div>
      <ChevronDownIcon 
        class="w-4 h-4 text-red-500 transition-transform duration-200"
        :class="[isExpanded ? 'rotate-180' : '']"
      />
    </button>
    
    <div v-show="isExpanded" class="px-4 pb-4">
      <div class="grid grid-cols-2 gap-4">
        <div class="col-span-2 sm:col-span-1">
          <p class="text-sm text-gray-500 dark:text-gray-400">Retain Percentage</p>
          <p class="font-medium text-white">
            {{ strategy.retainPercentage }}%
          </p>
        </div>
        <div class="col-span-2 sm:col-span-1">
          <p class="text-sm text-gray-500 dark:text-gray-400">Holding Period</p>
          <p class="font-medium text-white">
            {{ strategy.holdingPeriod }}h
          </p>
        </div>
        <div class="col-span-2 sm:col-span-1">
          <p class="text-sm text-gray-500 dark:text-gray-400">Stop Loss</p>
          <p class="font-medium text-white">
            {{ strategy.stopLoss }}%
          </p>
        </div>
        <div class="col-span-2">
          <p class="text-sm text-gray-500 dark:text-gray-400">Next Target</p>
          <p class="font-medium text-white">
            {{ strategy.nextMultiplier }}x
            {{ strategy.nextTargetType === 'initial' ? '(from initial)' : '(from current)' }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>