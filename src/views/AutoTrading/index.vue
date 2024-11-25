<script setup lang="ts">
import { ref } from 'vue'
import { 
  UsersIcon, 
  CurrencyDollarIcon,
  BanknotesIcon,
  ChartBarIcon,
  ClockIcon,
  UserGroupIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ClipboardDocumentCheckIcon,
  ScaleIcon,
  Cog6ToothIcon,
  ShoppingCartIcon,
  ArrowsRightLeftIcon
} from '@heroicons/vue/24/outline'
import PageHeader from '@/components/PageHeader.vue'
import Accordion from '@/components/common/Accordion.vue'
import AutoTradingCard from '@/components/AutoTrading/AutoTradingCard.vue'
import TransactionHistory from '@/components/AutoTrading/TransactionHistory.vue'
import { useI18n } from '@/i18n'

const { t } = useI18n()
const activeTab = ref('settings')

// Buy Settings
const minWallets = ref(5)
const minFDV = ref(100000)
const minPurchaseAmount = ref(1000)
const minLiquidity = ref(50000)
const maxTopHolders = ref(10)
const maxTopHoldersPercentage = ref(50)

// Sell Settings
const targetMultiplier = ref(2)
const exitPercentage = ref(50)
const stopLoss = ref(20)
const holdingPeriod = ref(24)
const subsequentExitPercentage = ref(50)

// Risk Model
const investmentPerToken = ref(1000)
</script>

<template>
  <div class="min-h-screen pb-24">
    <PageHeader :title="t('autoTrading.title')" />

    <!-- Content -->
    <div class="p-4 space-y-6">
      <!-- Tabs -->
      <div class="flex gap-2">
        <button 
          v-for="tab in ['settings', 'transactions']" 
          :key="tab"
          @click="activeTab = tab"
          class="px-4 py-2 rounded-lg transition-colors"
          :class="[
            activeTab === tab 
              ? 'bg-blue-600 text-white' 
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
          ]"
        >
          {{ t(`autoTrading.${tab}`) }}
        </button>
      </div>

      <!-- Settings Content -->
      <div v-if="activeTab === 'settings'" class="space-y-4">
        <!-- Buy Settings -->
        <Accordion 
          :title="t('autoTrading.buySettings')"
          :icon="ShoppingCartIcon"
          :default-open="true"
        >
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <AutoTradingCard
              :title="t('autoTrading.minWallets.title')"
              v-model="minWallets"
              :min="1"
              :step="1"
              :icon="UsersIcon"
              :tooltip="t('autoTrading.minWallets.tooltip')"
            />
            
            <AutoTradingCard
              :title="t('autoTrading.minFDV.title')"
              v-model="minFDV"
              prefix="$"
              :money="true"
              :icon="CurrencyDollarIcon"
              :tooltip="t('autoTrading.minFDV.tooltip')"
            />
            
            <AutoTradingCard
              :title="t('autoTrading.minPurchaseAmount.title')"
              v-model="minPurchaseAmount"
              prefix="$"
              :money="true"
              :icon="BanknotesIcon"
              :tooltip="t('autoTrading.minPurchaseAmount.tooltip')"
            />
            
            <AutoTradingCard
              :title="t('autoTrading.minLiquidity.title')"
              v-model="minLiquidity"
              prefix="$"
              :money="true"
              :icon="ChartBarIcon"
              :tooltip="t('autoTrading.minLiquidity.tooltip')"
            />
            
            <AutoTradingCard
              :title="t('autoTrading.maxTopHolders.title')"
              v-model="maxTopHolders"
              :min="1"
              :step="1"
              :icon="UserGroupIcon"
              :tooltip="t('autoTrading.maxTopHolders.tooltip')"
            />
            
            <AutoTradingCard
              :title="t('autoTrading.maxTopHoldersPercentage.title')"
              v-model="maxTopHoldersPercentage"
              suffix="%"
              :min="0"
              :max="100"
              :step="1"
              :icon="ScaleIcon"
              :tooltip="t('autoTrading.maxTopHoldersPercentage.tooltip')"
            />
          </div>
        </Accordion>

        <!-- Sell Settings -->
        <Accordion 
          :title="t('autoTrading.sellSettings')"
          :icon="ArrowsRightLeftIcon"
          :default-open="true"
        >
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <AutoTradingCard
              :title="t('autoTrading.targetMultiplier.title')"
              v-model="targetMultiplier"
              suffix="x"
              :min="1"
              :step="0.1"
              :icon="ArrowTrendingUpIcon"
              :tooltip="t('autoTrading.targetMultiplier.tooltip')"
            />
            
            <AutoTradingCard
              :title="t('autoTrading.exitPercentage.title')"
              v-model="exitPercentage"
              suffix="%"
              :min="0"
              :max="100"
              :step="1"
              :icon="ArrowTrendingDownIcon"
              :tooltip="t('autoTrading.exitPercentage.tooltip')"
            />
            
            <AutoTradingCard
              :title="t('autoTrading.stopLoss.title')"
              v-model="stopLoss"
              suffix="%"
              :min="0"
              :max="100"
              :step="1"
              :icon="ClipboardDocumentCheckIcon"
              :tooltip="t('autoTrading.stopLoss.tooltip')"
            />
            
            <AutoTradingCard
              :title="t('autoTrading.holdingPeriod.title')"
              v-model="holdingPeriod"
              suffix="h"
              :min="1"
              :step="1"
              :icon="ClockIcon"
              :tooltip="t('autoTrading.holdingPeriod.tooltip')"
            />
            
            <AutoTradingCard
              :title="t('autoTrading.subsequentExitPercentage.title')"
              v-model="subsequentExitPercentage"
              suffix="%"
              :min="0"
              :max="100"
              :step="1"
              :icon="ScaleIcon"
              :tooltip="t('autoTrading.subsequentExitPercentage.tooltip')"
            />
          </div>
        </Accordion>

        <!-- Risk Model -->
        <Accordion 
          :title="t('autoTrading.riskModel')"
          :icon="Cog6ToothIcon"
          :default-open="true"
        >
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <AutoTradingCard
              :title="t('autoTrading.investmentPerToken.title')"
              v-model="investmentPerToken"
              prefix="$"
              :money="true"
              :icon="BanknotesIcon"
              :tooltip="t('autoTrading.investmentPerToken.tooltip')"
            />
          </div>
        </Accordion>
      </div>

      <!-- Transaction History -->
      <div v-else>
        <TransactionHistory />
      </div>
    </div>
  </div>
</template>