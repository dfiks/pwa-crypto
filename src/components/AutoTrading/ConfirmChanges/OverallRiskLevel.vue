<script setup lang="ts">
import { computed } from 'vue'
import { ShieldExclamationIcon } from '@heroicons/vue/24/outline'
import { calculateTotalRiskPoints, getRiskLevel, getRecommendationsForSettings } from '@/utils/warningSettings'

const props = defineProps<{
  settings: Record<string, any>
}>()

const allSettings = computed(() => {
  const settings: Record<string, number> = {}
  
  // Buy Settings
  if (props.settings.buy) {
    Object.entries(props.settings.buy).forEach(([key, value]) => {
      settings[key] = value as number
    })
  }

  // Sell Settings
  if (props.settings.sell) {
    settings.targetMultiplier = props.settings.sell.targetMultiplier
    if (props.settings.sell.strategies?.[0]) {
      const firstStrategy = props.settings.sell.strategies[0]
      settings.exitPercentage = firstStrategy.retainPercentage
      settings.stopLoss = firstStrategy.stopLoss
      settings.holdingPeriod = firstStrategy.holdingPeriod
      settings.subsequentExitPercentage = firstStrategy.retainPercentage
    }
  }

  // Risk Settings
  if (props.settings.risk) {
    settings.investmentPerToken = props.settings.risk.investmentPerToken
  }

  return settings
})

const totalRiskPoints = computed(() => calculateTotalRiskPoints(allSettings.value))
const riskLevel = computed(() => getRiskLevel(totalRiskPoints.value))
const recommendations = computed(() => getRecommendationsForSettings(allSettings.value))

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
    <!-- Risk Level -->
    <div class="flex items-start gap-3 mb-4">
      <div class="flex-shrink-0 w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
        <ShieldExclamationIcon :class="[getIconClass, 'w-6 h-6']" />
      </div>
      <div>
        <h4 class="text-base font-medium" :class="[riskLevel.color]">
          Overall {{ riskLevel.level }} Risk Level
        </h4>
        <p class="text-sm text-gray-600 dark:text-gray-400">
          Combined Risk Score: {{ totalRiskPoints }} points
        </p>
      </div>
    </div>

    <!-- Recommendations -->
    <div v-if="recommendations.length > 0" class="mt-4 space-y-2">
      <h5 class="text-sm font-medium text-gray-700 dark:text-gray-300">
        Recommendations to reduce risk:
      </h5>
      <ul class="space-y-1">
        <li v-for="(rec, index) in recommendations" 
            :key="index"
            class="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2">
          <span class="select-none">•</span>
          <span>{{ rec }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>