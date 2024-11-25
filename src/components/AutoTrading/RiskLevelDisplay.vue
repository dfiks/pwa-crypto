<script setup lang="ts">
import OverallRiskLevel from './ConfirmChanges/OverallRiskLevel.vue'

const props = defineProps<{
  buySettings: Record<string, number>
  sellSettings: {
    targetMultiplier: number
    strategies: Array<{
      retainPercentage: number
      stopLoss: number
      holdingPeriod: number
    }>
  }
  riskSettings: {
    investmentPerToken: number
  }
}>()

const settings = {
  buy: props.buySettings,
  sell: {
    targetMultiplier: props.sellSettings.targetMultiplier,
    strategies: props.sellSettings.strategies
  },
  risk: props.riskSettings
}
</script>

<template>
  <OverallRiskLevel :settings="settings" />
</template>