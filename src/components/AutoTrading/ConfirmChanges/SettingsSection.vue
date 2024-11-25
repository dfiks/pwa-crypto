<script setup lang="ts">
import { computed } from 'vue'
import SettingChange from './SettingChange.vue'
import StrategyChanges from './StrategyChanges.vue'
import RiskLevel from './RiskLevel.vue'

const props = defineProps<{
  section: string
  changes: any[]
}>()

const currentSettings = computed(() => {
  const settings: Record<string, number> = {}

  props.changes.forEach(change => {
    if (change.type === 'strategies') {
      // Add strategy-related settings
      if (change.current && change.current.length > 0) {
        const firstStrategy = change.current[0]
        settings.exitPercentage = firstStrategy.retainPercentage
        settings.stopLoss = firstStrategy.stopLoss
        settings.holdingPeriod = firstStrategy.holdingPeriod
        settings.subsequentExitPercentage = firstStrategy.retainPercentage
      }
    } else {
      // Map UI labels to warning settings keys
      const labelToKey: Record<string, string> = {
        'Minimum Wallets': 'minWallets',
        'Minimum FDV': 'minFDV',
        'Minimum Purchase Amount': 'minPurchaseAmount',
        'Minimum Liquidity': 'minLiquidity',
        'Max Top Holders': 'maxTopHolders',
        'Max Top Holders %': 'maxTopHoldersPercentage',
        'Target Multiplier': 'targetMultiplier',
        'Investment per Token': 'investmentPerToken'
      }

      const key = labelToKey[change.label]
      if (key) {
        settings[key] = change.current
      }
    }
  })

  return settings
})

const hasRiskSettings = computed(() => {
  const settingsKeys = Object.keys(currentSettings.value)
  if (settingsKeys.length === 0) return false

  // Check if we have any buy settings
  const buySettings = ['minWallets', 'minFDV', 'minPurchaseAmount', 'minLiquidity', 'maxTopHolders', 'maxTopHoldersPercentage']
  const hasBuySettings = buySettings.some(key => key in currentSettings.value)

  // Check if we have any sell settings
  const sellSettings = ['targetMultiplier', 'exitPercentage', 'stopLoss', 'holdingPeriod', 'subsequentExitPercentage']
  const hasSellSettings = sellSettings.some(key => key in currentSettings.value)

  // Check if we have risk model settings
  const riskSettings = ['investmentPerToken']
  const hasRiskSettings = riskSettings.some(key => key in currentSettings.value)

  // Show risk level if we have any complete section of settings
  return hasBuySettings || hasSellSettings || hasRiskSettings
})
</script>

<template>
  <div class="space-y-4">
    <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">
      {{ section }}
    </h3>

    <RiskLevel v-if="hasRiskSettings" :settings="currentSettings" />

    <div class="space-y-4">
      <template v-for="(change, changeIndex) in changes" :key="changeIndex">
        <SettingChange v-if="change.type !== 'strategies'"
          v-bind="change"
        />
        <StrategyChanges v-else
          :current="change.current"
          :original="change.original"
        />
      </template>
    </div>
  </div>
</template>