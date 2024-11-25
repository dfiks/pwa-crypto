<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { 
  Cog6ToothIcon,
  ClockIcon
} from '@heroicons/vue/24/outline'
import BuySettings from './BuySettings.vue'
import SellSettings from './SellSettings.vue'
import RiskSettings from './RiskSettings.vue'
import RiskLevelDisplay from './RiskLevelDisplay.vue'
import { useI18n } from '@/i18n'

const { t } = useI18n()
const activeCard = ref<string | null>(null)

const buySettingsRef = ref()
const sellSettingsRef = ref()
const riskSettingsRef = ref()
const riskLevelKey = ref(0)

// Store initial values
const initialValues = ref({
  buy: null,
  sell: null,
  risk: null
})

const emit = defineEmits(['change'])

const toggleCard = async (cardId: string) => {
  if (activeCard.value === cardId) {
    activeCard.value = null
    return
  }
  activeCard.value = cardId
}

const getCurrentValues = () => ({
  buy: buySettingsRef.value ? {
    minWallets: buySettingsRef.value.minWallets,
    minFDV: buySettingsRef.value.minFDV,
    minPurchaseAmount: buySettingsRef.value.minPurchaseAmount,
    minLiquidity: buySettingsRef.value.minLiquidity,
    maxTopHolders: buySettingsRef.value.maxTopHolders,
    maxTopHoldersPercentage: buySettingsRef.value.maxTopHoldersPercentage
  } : null,
  sell: sellSettingsRef.value ? {
    targetMultiplier: sellSettingsRef.value.targetMultiplier,
    strategies: JSON.parse(JSON.stringify(sellSettingsRef.value.strategies))
  } : null,
  risk: riskSettingsRef.value ? {
    investmentPerToken: riskSettingsRef.value.investmentPerToken
  } : null
})

const saveInitialValues = () => {
  initialValues.value = getCurrentValues()
}

const checkChanges = () => {
  const currentValues = getCurrentValues()
  let hasChanges = false

  if (buySettingsRef.value && initialValues.value.buy) {
    const buyData = currentValues.buy
    hasChanges = Object.keys(initialValues.value.buy).some(key =>
      buyData[key] !== initialValues.value.buy[key]
    )
  }

  if (!hasChanges && sellSettingsRef.value && initialValues.value.sell) {
    const sellData = currentValues.sell
    hasChanges = sellData.targetMultiplier !== initialValues.value.sell.targetMultiplier ||
                 JSON.stringify(sellData.strategies) !== JSON.stringify(initialValues.value.sell.strategies)
  }

  if (!hasChanges && riskSettingsRef.value && initialValues.value.risk) {
    const riskData = currentValues.risk
    hasChanges = Object.keys(initialValues.value.risk).some(key =>
      riskData[key] !== initialValues.value.risk[key]
    )
  }

  emit('change', hasChanges, currentValues, initialValues.value)
}

const saveChanges = () => {
  saveInitialValues()
  checkChanges()
  // Force risk level component to re-render
  riskLevelKey.value++
}

const discardChanges = () => {
  if (buySettingsRef.value && initialValues.value.buy) {
    Object.keys(initialValues.value.buy).forEach(key => {
      buySettingsRef.value[key] = initialValues.value.buy[key]
    })
  }
  if (sellSettingsRef.value && initialValues.value.sell) {
    sellSettingsRef.value.targetMultiplier = initialValues.value.sell.targetMultiplier
    sellSettingsRef.value.strategies = JSON.parse(JSON.stringify(initialValues.value.sell.strategies))
  }
  if (riskSettingsRef.value && initialValues.value.risk) {
    Object.keys(initialValues.value.risk).forEach(key => {
      riskSettingsRef.value[key] = initialValues.value.risk[key]
    })
  }
  checkChanges()
  // Force risk level component to re-render
  riskLevelKey.value++
}

const applyPreset = (settings: any) => {
  if (buySettingsRef.value) {
    Object.keys(settings.buy).forEach(key => {
      buySettingsRef.value[key] = settings.buy[key]
    })
  }

  if (sellSettingsRef.value) {
    sellSettingsRef.value.targetMultiplier = settings.sell.targetMultiplier
    sellSettingsRef.value.strategies = JSON.parse(JSON.stringify(settings.sell.strategies))
  }

  if (riskSettingsRef.value) {
    riskSettingsRef.value.investmentPerToken = settings.risk.investmentPerToken
  }

  checkChanges()
  riskLevelKey.value++
}

// Initialize initial values when components are mounted
onMounted(() => {
  if (buySettingsRef.value && sellSettingsRef.value && riskSettingsRef.value) {
    saveInitialValues()
  }
})

defineExpose({
  buySettingsRef,
  sellSettingsRef,
  riskSettingsRef,
  saveInitialValues,
  saveChanges,
  discardChanges,
  applyPreset
})
</script>

<template>
  <div class="grid grid-cols-1 gap-4">
    <!-- Risk Level Display -->
    <RiskLevelDisplay 
      v-if="buySettingsRef && sellSettingsRef && riskSettingsRef"
      :key="riskLevelKey"
      :buy-settings="{
        minWallets: buySettingsRef.minWallets,
        minFDV: buySettingsRef.minFDV,
        minPurchaseAmount: buySettingsRef.minPurchaseAmount,
        minLiquidity: buySettingsRef.minLiquidity,
        maxTopHolders: buySettingsRef.maxTopHolders,
        maxTopHoldersPercentage: buySettingsRef.maxTopHoldersPercentage
      }"
      :sell-settings="{
        targetMultiplier: sellSettingsRef.targetMultiplier,
        strategies: sellSettingsRef.strategies
      }"
      :risk-settings="{
        investmentPerToken: riskSettingsRef.investmentPerToken
      }"
    />

    <!-- Buy Settings -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
      <button 
        @click="toggleCard('buy')"
        class="w-full flex items-center justify-between p-3 sm:p-4 text-left"
      >
        <div class="flex items-center gap-2 sm:gap-3">
          <div class="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
            <Cog6ToothIcon class="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h3 class="text-base sm:text-lg font-medium text-gray-900 dark:text-gray-100">
              {{ t('autoTrading.buySettings') }}
            </h3>
            <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Configure automatic purchase settings</p>
          </div>
        </div>
      </button>
      
      <div 
        class="overflow-hidden transition-all duration-300"
        :style="{ maxHeight: activeCard === 'buy' ? '2000px' : '0' }"
      >
        <div class="p-3 sm:p-4 border-t border-gray-100 dark:border-gray-700">
          <BuySettings ref="buySettingsRef" @change="checkChanges" />
        </div>
      </div>
    </div>

    <!-- Sell Settings -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
      <button 
        @click="toggleCard('sell')"
        class="w-full flex items-center justify-between p-3 sm:p-4 text-left"
      >
        <div class="flex items-center gap-2 sm:gap-3">
          <div class="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
            <ClockIcon class="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h3 class="text-base sm:text-lg font-medium text-gray-900 dark:text-gray-100">
              {{ t('autoTrading.sellSettings') }}
            </h3>
            <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Configure automatic sell settings</p>
          </div>
        </div>
      </button>
      
      <div 
        class="overflow-hidden transition-all duration-300"
        :style="{ maxHeight: activeCard === 'sell' ? '2000px' : '0' }"
      >
        <div class="p-3 sm:p-4 border-t border-gray-100 dark:border-gray-700">
          <SellSettings ref="sellSettingsRef" @change="checkChanges" />
        </div>
      </div>
    </div>

    <!-- Risk Settings -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
      <button 
        @click="toggleCard('risk')"
        class="w-full flex items-center justify-between p-3 sm:p-4 text-left"
      >
        <div class="flex items-center gap-2 sm:gap-3">
          <div class="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
            <Cog6ToothIcon class="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h3 class="text-base sm:text-lg font-medium text-gray-900 dark:text-gray-100">
              {{ t('autoTrading.riskModel') }}
            </h3>
            <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Configure risk management settings</p>
          </div>
        </div>
      </button>
      
      <div 
        class="overflow-hidden transition-all duration-300"
        :style="{ maxHeight: activeCard === 'risk' ? '2000px' : '0' }"
      >
        <div class="p-3 sm:p-4 border-t border-gray-100 dark:border-gray-700">
          <RiskSettings ref="riskSettingsRef" @change="checkChanges" />
        </div>
      </div>
    </div>
  </div>
</template>