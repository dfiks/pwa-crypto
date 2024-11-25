<script setup lang="ts">
import { ChevronDownIcon } from '@heroicons/vue/24/solid'

const props = defineProps<{
  strategy: any
  strategyIndex: number
  originalStrategy?: any
  isExpanded: boolean
}>()

const emit = defineEmits(['toggle'])

const isModified = computed(() => {
  return props.originalStrategy && JSON.stringify(props.strategy) !== JSON.stringify(props.originalStrategy)
})

const isNew = computed(() => {
  return !props.originalStrategy
})

const getStatusClass = computed(() => {
  if (isNew.value) return 'bg-green-50/50 dark:bg-green-900/20'
  if (isModified.value) return 'bg-blue-50/50 dark:bg-blue-900/20'
  return ''
})

const getStatusLabel = computed(() => {
  if (isNew.value) {
    return {
      text: 'New Strategy',
      class: 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30'
    }
  }
  if (isModified.value) {
    return {
      text: 'Modified',
      class: 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30'
    }
  }
  return null
})

const getChevronClass = computed(() => {
  if (isNew.value) return 'text-green-500'
  if (isModified.value) return 'text-blue-500'
  return 'text-gray-400'
})
</script>

<template>
  <div :class="['rounded-lg overflow-hidden', getStatusClass]">
    <button 
      @click="emit('toggle')"
      class="w-full flex items-center justify-between p-4 text-left"
    >
      <div class="flex items-center gap-2">
        <span class="text-sm font-medium text-gray-900 dark:text-gray-100">
          Strategy {{ strategyIndex + 1 }}
        </span>
        <span v-if="getStatusLabel" 
              :class="['text-xs font-medium px-2 py-0.5 rounded-full', getStatusLabel.class]">
          {{ getStatusLabel.text }}
        </span>
      </div>
      <ChevronDownIcon 
        class="w-4 h-4 transition-transform duration-200"
        :class="[isExpanded ? 'rotate-180' : '', getChevronClass]"
      />
    </button>
    
    <div v-show="isExpanded" class="px-4 pb-4">
      <div class="grid grid-cols-2 gap-4">
        <template v-if="originalStrategy">
          <!-- Modified Strategy Values -->
          <div v-if="strategy.retainPercentage !== originalStrategy.retainPercentage" 
               class="col-span-2 sm:col-span-1">
            <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">Retain Percentage</p>
            <div class="flex items-center gap-2">
              <span class="text-red-600 dark:text-red-400 line-through">
                {{ originalStrategy.retainPercentage }}%
              </span>
              <span class="text-gray-500 dark:text-gray-400">→</span>
              <span class="text-white font-medium">
                {{ strategy.retainPercentage }}%
              </span>
            </div>
          </div>

          <div v-if="strategy.holdingPeriod !== originalStrategy.holdingPeriod" 
               class="col-span-2 sm:col-span-1">
            <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">Holding Period</p>
            <div class="flex items-center gap-2">
              <span class="text-red-600 dark:text-red-400 line-through">
                {{ originalStrategy.holdingPeriod }}h
              </span>
              <span class="text-gray-500 dark:text-gray-400">→</span>
              <span class="text-white font-medium">
                {{ strategy.holdingPeriod }}h
              </span>
            </div>
          </div>

          <div v-if="strategy.stopLoss !== originalStrategy.stopLoss" 
               class="col-span-2 sm:col-span-1">
            <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">Stop Loss</p>
            <div class="flex items-center gap-2">
              <span class="text-red-600 dark:text-red-400 line-through">
                {{ originalStrategy.stopLoss }}%
              </span>
              <span class="text-gray-500 dark:text-gray-400">→</span>
              <span class="text-white font-medium">
                {{ strategy.stopLoss }}%
              </span>
            </div>
          </div>

          <div v-if="strategy.nextMultiplier !== originalStrategy.nextMultiplier || 
                     strategy.nextTargetType !== originalStrategy.nextTargetType" 
               class="col-span-2">
            <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">Next Target</p>
            <div class="flex items-center gap-2">
              <span class="text-red-600 dark:text-red-400 line-through">
                {{ originalStrategy.nextMultiplier }}x
                {{ originalStrategy.nextTargetType === 'initial' ? '(from initial)' : '(from current)' }}
              </span>
              <span class="text-gray-500 dark:text-gray-400">→</span>
              <span class="text-white font-medium">
                {{ strategy.nextMultiplier }}x
                {{ strategy.nextTargetType === 'initial' ? '(from initial)' : '(from current)' }}
              </span>
            </div>
          </div>
        </template>

        <!-- New Strategy Values -->
        <template v-else>
          <div class="space-y-2 text-sm">
            <div>
              <p class="text-gray-500 dark:text-gray-400">Retain Percentage</p>
              <p class="font-medium text-white">
                {{ strategy.retainPercentage }}%
              </p>
            </div>
            <div>
              <p class="text-gray-500 dark:text-gray-400">Holding Period</p>
              <p class="font-medium text-white">
                {{ strategy.holdingPeriod }}h
              </p>
            </div>
            <div>
              <p class="text-gray-500 dark:text-gray-400">Stop Loss</p>
              <p class="font-medium text-white">
                {{ strategy.stopLoss }}%
              </p>
            </div>
            <div>
              <p class="text-gray-500 dark:text-gray-400">Next Target</p>
              <p class="font-medium text-white">
                {{ strategy.nextMultiplier }}x
                {{ strategy.nextTargetType === 'initial' ? '(from initial)' : '(from current)' }}
              </p>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>