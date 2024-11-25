<script setup lang="ts">
import { ref, computed } from 'vue'
import Modal from '@/components/common/Modal.vue'
import SettingsSection from './SettingsSection.vue'
import OverallRiskLevel from './OverallRiskLevel.vue'
import { useI18n } from '@/i18n'
import { getWarningForSetting } from '@/utils/warningSettings'

const { t } = useI18n()

const props = defineProps<{
  isOpen: boolean
  changes?: Record<string, any>
  initialValues?: Record<string, any>
}>()

const emit = defineEmits(['close', 'confirm'])

const getChanges = computed(() => {
  if (!props.changes || !props.initialValues) return []

  const sections = []

  // Buy Settings
  if (props.changes.buy && props.initialValues.buy) {
    const buyChanges = []
    const buySettings = {
      minWallets: { label: t('autoTrading.minWallets.title') },
      minFDV: { label: t('autoTrading.minFDV.title'), prefix: '$' },
      minPurchaseAmount: { label: t('autoTrading.minPurchaseAmount.title'), prefix: '$' },
      minLiquidity: { label: t('autoTrading.minLiquidity.title'), prefix: '$' },
      maxTopHolders: { label: t('autoTrading.maxTopHolders.title') },
      maxTopHoldersPercentage: { label: t('autoTrading.maxTopHoldersPercentage.title'), suffix: '%' }
    }

    Object.entries(buySettings).forEach(([key, config]) => {
      if (props.changes.buy[key] !== props.initialValues.buy[key]) {
        const warning = getWarningForSetting(key, props.changes.buy[key])
        buyChanges.push({
          label: config.label,
          original: props.initialValues.buy[key],
          current: props.changes.buy[key],
          prefix: config.prefix,
          suffix: config.suffix,
          warning
        })
      }
    })

    if (buyChanges.length > 0) {
      sections.push({
        section: t('autoTrading.buySettings'),
        changes: buyChanges
      })
    }
  }

  // Sell Settings
  if (props.changes.sell && props.initialValues.sell) {
    const sellChanges = []

    // Target Multiplier
    if (props.changes.sell.targetMultiplier !== props.initialValues.sell.targetMultiplier) {
      const warning = getWarningForSetting('targetMultiplier', props.changes.sell.targetMultiplier)
      sellChanges.push({
        label: t('autoTrading.targetMultiplier.title'),
        original: props.initialValues.sell.targetMultiplier,
        current: props.changes.sell.targetMultiplier,
        suffix: 'x',
        warning
      })
    }

    // Strategies
    if (JSON.stringify(props.changes.sell.strategies) !== JSON.stringify(props.initialValues.sell.strategies)) {
      sellChanges.push({
        type: 'strategies',
        label: 'Selling Strategies',
        original: props.initialValues.sell.strategies,
        current: props.changes.sell.strategies
      })
    }

    if (sellChanges.length > 0) {
      sections.push({
        section: t('autoTrading.sellSettings'),
        changes: sellChanges
      })
    }
  }

  // Risk Settings
  if (props.changes.risk && props.initialValues.risk) {
    const riskChanges = []

    if (props.changes.risk.investmentPerToken !== props.initialValues.risk.investmentPerToken) {
      const warning = getWarningForSetting('investmentPerToken', props.changes.risk.investmentPerToken)
      riskChanges.push({
        label: t('autoTrading.investmentPerToken.title'),
        original: props.initialValues.risk.investmentPerToken,
        current: props.changes.risk.investmentPerToken,
        prefix: '$',
        warning
      })
    }

    if (riskChanges.length > 0) {
      sections.push({
        section: t('autoTrading.riskModel'),
        changes: riskChanges
      })
    }
  }

  return sections
})
</script>

<template>
  <Modal 
    :is-open="isOpen" 
    title="Confirm Changes"
    @close="emit('close')"
  >
    <div class="space-y-6">
      <!-- Overall Risk Level -->
      <OverallRiskLevel 
        v-if="changes"
        :settings="changes"
      />

      <!-- Changes Summary -->
      <div v-for="(section, index) in getChanges" 
           :key="index"
           class="space-y-4">
        <SettingsSection 
          :section="section.section"
          :changes="section.changes"
        />
      </div>

      <!-- Actions -->
      <div class="flex justify-end gap-3">
        <button
          @click="emit('close')"
          class="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
        >
          Back to Editing
        </button>
        <button
          @click="emit('confirm')"
          class="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-lg transition-colors"
        >
          Yes, Save Changes
        </button>
      </div>
    </div>
  </Modal>
</template>