<script setup lang="ts">
import { ref, watch, defineExpose } from 'vue'
import { 
  UsersIcon, 
  CurrencyDollarIcon,
  BanknotesIcon,
  ChartBarIcon,
  UserGroupIcon,
  ScaleIcon
} from '@heroicons/vue/24/outline'
import AutoTradingCard from './AutoTradingCard.vue'
import { useI18n } from '@/i18n'

const { t } = useI18n()

const emit = defineEmits(['change'])

const minWallets = ref(5)
const minFDV = ref(100000)
const minPurchaseAmount = ref(1000)
const minLiquidity = ref(50000)
const maxTopHolders = ref(10)
const maxTopHoldersPercentage = ref(50)
const investmentPerToken = ref(1000)

// Initial values for tracking changes
const initialValues = ref({
  minWallets: 5,
  minFDV: 100000,
  minPurchaseAmount: 1000,
  minLiquidity: 50000,
  maxTopHolders: 10,
  maxTopHoldersPercentage: 50,
  investmentPerToken: 1000
})

const saveInitialValues = () => {
  initialValues.value = {
    minWallets: minWallets.value,
    minFDV: minFDV.value,
    minPurchaseAmount: minPurchaseAmount.value,
    minLiquidity: minLiquidity.value,
    maxTopHolders: maxTopHolders.value,
    maxTopHoldersPercentage: maxTopHoldersPercentage.value,
    investmentPerToken: investmentPerToken.value
  }
}

const resetToInitial = () => {
  minWallets.value = initialValues.value.minWallets
  minFDV.value = initialValues.value.minFDV
  minPurchaseAmount.value = initialValues.value.minPurchaseAmount
  minLiquidity.value = initialValues.value.minLiquidity
  maxTopHolders.value = initialValues.value.maxTopHolders
  maxTopHoldersPercentage.value = initialValues.value.maxTopHoldersPercentage
  investmentPerToken.value = initialValues.value.investmentPerToken
}

const checkChanges = () => {
  const hasChanges = 
    minWallets.value !== initialValues.value.minWallets ||
    minFDV.value !== initialValues.value.minFDV ||
    minPurchaseAmount.value !== initialValues.value.minPurchaseAmount ||
    minLiquidity.value !== initialValues.value.minLiquidity ||
    maxTopHolders.value !== initialValues.value.maxTopHolders ||
    maxTopHoldersPercentage.value !== initialValues.value.maxTopHoldersPercentage ||
    investmentPerToken.value !== initialValues.value.investmentPerToken

  emit('change', hasChanges)
}

watch([minWallets, minFDV, minPurchaseAmount, minLiquidity, maxTopHolders, maxTopHoldersPercentage, investmentPerToken], () => {
  checkChanges()
}, { deep: true })

defineExpose({
  minWallets,
  minFDV,
  minPurchaseAmount,
  minLiquidity,
  maxTopHolders,
  maxTopHoldersPercentage,
  investmentPerToken,
  saveInitialValues,
  resetToInitial
})
</script>

<template>
  <div class="space-y-4">
    <!-- Investment per Token - Full Width -->
    <div class="col-span-full">
      <AutoTradingCard
        v-model="investmentPerToken"
        :title="t('autoTrading.investmentPerToken.title')"
        subtitle="Amount to invest in each token"
        prefix="$"
        :money="true"
        :icon="BanknotesIcon"
        :tooltip="t('autoTrading.investmentPerToken.tooltip')"
      />
    </div>

    <!-- Other Settings - Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <AutoTradingCard
        v-model="minWallets"
        :title="t('autoTrading.minWallets.title')"
        subtitle="Minimum wallets required for auto-buy"
        :min="1"
        :step="1"
        :icon="UsersIcon"
        :tooltip="t('autoTrading.minWallets.tooltip')"
      />
      
      <AutoTradingCard
        v-model="minFDV"
        :title="t('autoTrading.minFDV.title')"
        subtitle="Minimum FDV required for auto-buy"
        prefix="$"
        :money="true"
        :icon="CurrencyDollarIcon"
        :tooltip="t('autoTrading.minFDV.tooltip')"
      />
      
      <AutoTradingCard
        v-model="minPurchaseAmount"
        :title="t('autoTrading.minPurchaseAmount.title')"
        subtitle="Minimum amount required for token purchase"
        prefix="$"
        :money="true"
        :icon="BanknotesIcon"
        :tooltip="t('autoTrading.minPurchaseAmount.tooltip')"
      />
      
      <AutoTradingCard
        v-model="minLiquidity"
        :title="t('autoTrading.minLiquidity.title')"
        subtitle="Minimum liquidity required in token pool"
        prefix="$"
        :money="true"
        :icon="ChartBarIcon"
        :tooltip="t('autoTrading.minLiquidity.tooltip')"
      />
      
      <AutoTradingCard
        v-model="maxTopHolders"
        :title="t('autoTrading.maxTopHolders.title')"
        subtitle="Maximum number of top holders allowed"
        :min="1"
        :step="1"
        :icon="UserGroupIcon"
        :tooltip="t('autoTrading.maxTopHolders.tooltip')"
      />
      
      <AutoTradingCard
        v-model="maxTopHoldersPercentage"
        :title="t('autoTrading.maxTopHoldersPercentage.title')"
        subtitle="Maximum percentage held by top holders"
        suffix="%"
        :min="0"
        :max="100"
        :step="1"
        :icon="ScaleIcon"
        :tooltip="t('autoTrading.maxTopHoldersPercentage.tooltip')"
      />
    </div>
  </div>
</template>