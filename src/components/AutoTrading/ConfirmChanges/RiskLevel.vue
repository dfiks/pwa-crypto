<script setup lang="ts">
import { computed } from 'vue'
import { ShieldExclamationIcon } from '@heroicons/vue/24/outline'
import { calculateTotalRiskPoints, getRiskLevel } from '@/utils/warningSettings'

const props = defineProps<{
  settings: Record<string, number>
}>()

const totalRiskPoints = computed(() => calculateTotalRiskPoints(props.settings))
const riskLevel = computed(() => getRiskLevel(totalRiskPoints.value))

const getBgClass = computed(() => {
  switch (riskLevel.value.level) {
    case 'Low':
      return 'bg-green-50 dark:bg-green-900/30'
    case 'Medium':
      return 'bg-yellow-50 dark:bg-yellow-900/30'
    case 'High':
      return 'bg-orange-50 dark:bg-orange-900/30'
    case 'Extreme':
      return 'bg-red-50 dark:bg-red-900/30'
  }
})

const getIconClass = computed(() => {
  switch (riskLevel.value.level) {
    case 'Low':
      return 'text-green-500 dark:text-green-400'
    case 'Medium':
      return 'text-yellow-500 dark:text-yellow-400'
    case 'High':
      return 'text-orange-500 dark:text-orange-400'
    case 'Extreme':
      return 'text-red-500 dark:text-red-400'
  }
})
</script>

<template>
  <div :class="[getBgClass, 'rounded-lg p-4']">
    <div class="flex items-start gap-3">
      <div class="flex-shrink-0 w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
        <ShieldExclamationIcon :class="[getIconClass, 'w-6 h-6']" />
      </div>
      <div>
        <h4 class="text-base font-medium" :class="[riskLevel.color]">
          {{ riskLevel.level }} Risk Level
        </h4>
        <p class="text-sm text-gray-600 dark:text-gray-400">
          Risk Score: {{ totalRiskPoints }} points
        </p>
      </div>
    </div>
  </div>
</template>