<script setup lang="ts">
import { ref } from 'vue'
import StrategyChange from './StrategyChange.vue'
import RemovedStrategy from './RemovedStrategy.vue'

const props = defineProps<{
  current: any[]
  original: any[]
}>()

const expandedStrategies = ref(new Set())

const toggleStrategy = (id: string | number) => {
  if (expandedStrategies.value.has(id)) {
    expandedStrategies.value.delete(id)
  } else {
    expandedStrategies.value.add(id)
  }
}
</script>

<template>
  <div class="space-y-3">
    <!-- Strategy Count Change -->
    <div v-if="current.length !== original.length" 
         class="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4">
      <p class="text-sm text-gray-500 dark:text-gray-400 mb-2">Number of Strategies</p>
      <div class="flex items-center gap-2">
        <span class="text-red-600 dark:text-red-400 line-through">
          {{ original.length }}
        </span>
        <span class="text-gray-500 dark:text-gray-400">→</span>
        <span :class="[
          current.length > original.length 
            ? 'text-green-600 dark:text-green-400'
            : 'text-red-600 dark:text-red-400',
          'font-medium'
        ]">
          {{ current.length }}
        </span>
      </div>
    </div>

    <!-- Strategy Changes -->
    <template v-for="(strategy, strategyIndex) in current" :key="strategy.id">
      <StrategyChange
        v-if="!original[strategyIndex] || JSON.stringify(strategy) !== JSON.stringify(original[strategyIndex])"
        :strategy="strategy"
        :strategy-index="strategyIndex"
        :original-strategy="original[strategyIndex]"
        :is-expanded="expandedStrategies.has(strategyIndex)"
        @toggle="toggleStrategy(strategyIndex)"
      />
    </template>

    <!-- Removed Strategies -->
    <template v-for="(strategy, strategyIndex) in original" :key="strategy.id">
      <RemovedStrategy
        v-if="!current[strategyIndex]"
        :strategy="strategy"
        :strategy-index="strategyIndex"
        :is-expanded="expandedStrategies.has(`removed-${strategyIndex}`)"
        @toggle="toggleStrategy(`removed-${strategyIndex}`)"
      />
    </template>
  </div>
</template>