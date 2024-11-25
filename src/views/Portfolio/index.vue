<content><script setup>
import { ref } from 'vue'
import { Line } from 'vue-chartjs'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js'
import PageHeader from '@/components/PageHeader.vue'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

const positions = ref([
  {
    id: 1,
    pair: 'BTC/USD',
    amount: 0.15,
    entryPrice: 47500,
    currentPrice: 48250,
    pnl: 112.5
  },
  {
    id: 2,
    pair: 'ETH/USD',
    amount: 2.5,
    entryPrice: 2800,
    currentPrice: 2850,
    pnl: 125
  }
])

const performanceData = {
  labels: ['1D', '1W', '1M', '3M', '6M', 'YTD'],
  datasets: [{
    label: 'Portfolio Performance',
    data: [2.5, 5.8, 12.3, 18.5, 25.7, 32.1],
    borderColor: '#646cff',
    tension: 0.4
  }]
}
</script>

<template>
  <div class="min-h-screen pb-24">
    <PageHeader title="Portfolio" showTimeframe />
    
    <div class="p-4">
      <div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg mb-6">
        <h2 class="text-lg font-semibold mb-4">Performance</h2>
        <Line :data="performanceData" :options="{ responsive: true }" />
      </div>
      
      <div class="space-y-4">
        <div v-for="position in positions" :key="position.id"
             class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg">
          <div class="flex justify-between items-center mb-3">
            <h3 class="text-lg font-semibold">{{ position.pair }}</h3>
            <span :class="position.pnl >= 0 ? 'text-green-500' : 'text-red-500'"
                  class="font-medium">
              {{ position.pnl >= 0 ? '+' : '' }}${{ position.pnl }}
            </span>
          </div>
          
          <div class="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p class="text-gray-500">Amount</p>
              <p class="font-medium">{{ position.amount }}</p>
            </div>
            <div>
              <p class="text-gray-500">Entry Price</p>
              <p class="font-medium">${{ position.entryPrice }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template></content></file>

<boltAction type="file" filePath="src/views/Settings/index.vue"><content><script setup>
import { ref } from 'vue'
import PageHeader from '@/components/PageHeader.vue'

const settings = ref({
  notifications: true,
  darkMode: false,
  riskLevel: 'medium',
  currency: 'USD'
})

const currencies = ['USD', 'EUR', 'GBP', 'JPY']
const riskLevels = ['low', 'medium', 'high']

const updateSetting = (key, value) => {
  settings.value[key] = value
}
</script>

<template>
  <div class="min-h-screen pb-24">
    <PageHeader title="Settings" />
    
    <div class="p-4">
      <div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg space-y-6">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="font-medium">Notifications</h3>
            <p class="text-sm text-gray-500">Receive signal alerts</p>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" v-model="settings.notifications" class="sr-only peer">
            <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          </label>
        </div>
        
        <div class="flex items-center justify-between">
          <div>
            <h3 class="font-medium">Dark Mode</h3>
            <p class="text-sm text-gray-500">Toggle dark theme</p>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" v-model="settings.darkMode" class="sr-only peer">
            <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          </label>
        </div>
        
        <div>
          <h3 class="font-medium mb-2">Risk Level</h3>
          <select v-model="settings.riskLevel"
                  class="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50">
            <option v-for="level in riskLevels" :key="level" :value="level">
              {{ level.charAt(0).toUpperCase() + level.slice(1) }}
            </option>
          </select>
        </div>
        
        <div>
          <h3 class="font-medium mb-2">Currency</h3>
          <select v-model="settings.currency"
                  class="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50">
            <option v-for="currency in currencies" :key="currency" :value="currency">
              {{ currency }}
            </option>
          </select>
        </div>
      </div>
    </div>
  </div>
</template></content></file>

<boltAction type="file" filePath="src/views/TokenDetails/index.vue"><content><script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ArrowLeftIcon } from '@heroicons/vue/24/outline'
import type { LastSignal } from '@/types/signal'
import TokenChart from '@/components/TokenChart.vue'
import TokenMetrics from '@/components/TokenMetrics.vue'

const route = useRoute()
const router = useRouter()
const isLoading = ref(true)
const signal = ref<LastSignal | null>(route.query.signal ? JSON.parse(route.query.signal as string) : null)

onMounted(() => {
  setTimeout(() => {
    isLoading.value = false
  }, 1000)
})

const goBack = () => {
  router.back()
}

const truncateAddress = (address: string): string => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

const keyMetrics = computed(() => signal.value ? [
  { label: 'Price USD', value: `$${signal.value.price}` },
  { label: 'FDV', value: `$${signal.value.fdv}` },
  { label: 'Liquidity', value: `$${signal.value.liquidity}` },
  { label: 'Volume', value: `$${signal.value.volume}` }
] : [])

const tradingActivity = computed(() => signal.value ? [
  { label: 'Buyers', value: signal.value.buyers, valueClass: 'text-green-600 dark:text-green-400' },
  { label: 'Sellers', value: signal.value.sellers, valueClass: 'text-red-600 dark:text-red-400' },
  { label: '1H Change', value: `+${signal.value.hourChange}%`, valueClass: 'text-green-600 dark:text-green-400' },
  { label: '1H Volume', value: `$${signal.value.hourVolume}` }
] : [])

const topHolders = computed(() => signal.value?.topHolders.map(holder => ({
  label: truncateAddress(holder.address),
  value: `${holder.value}%`
})) || [])
</script>

<template>
  <div v-if="signal" class="min-h-screen transition-colors duration-300">
    <!-- Header - Always visible -->
    <div class="fixed top-0 left-0 right-0 z-50">
      <div class="mx-auto px-4 py-3 md:max-w-3xl lg:max-w-4xl">
        <div class="flex items-center gap-3 bg-white dark:bg-gray-800 rounded-full shadow-lg dark:shadow-gray-900/50 px-4 py-3">
          <button 
            @click="goBack"
            class="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <ArrowLeftIcon class="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
          <div>
            <h1 class="text-lg font-semibold text-gray-900 dark:text-gray-100">{{ signal.pair }}</h1>
            <div class="text-sm text-gray-500 dark:text-gray-400">
              Token Details
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="mx-auto px-4 pt-24 pb-6">
      <div class="md:grid md:grid-cols-2 md:gap-6">
        <div class="space-y-6">
          <TokenChart 
            :loading="isLoading"
            :symbol="signal.pair"
          />

          <TokenMetrics
            :loading="isLoading"
            title="Key Metrics"
            :metrics="keyMetrics"
          />
        </div>

        <div class="space-y-6 md:mt-0 mt-6">
          <TokenMetrics
            :loading="isLoading"
            title="Trading Activity"
            :metrics="tradingActivity"
          />

          <TokenMetrics
            :loading="isLoading"
            title="Contract Information"
            :metrics="[{ label: 'Contract Address', value: truncateAddress(signal.address) }]"
          />

          <TokenMetrics
            :loading="isLoading"
            title="Top Holders"
            :metrics="topHolders"
          />
        </div>
      </div>
    </div>
  </div>
</template></content></file>

<boltAction type="file" filePath="src/views/AutoTrading/index.vue"><content><script setup lang="ts">
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
  ScaleIcon
} from '@heroicons/vue/24/outline'
import PageHeader from '@/components/PageHeader.vue'
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
      <div v-if="activeTab === 'settings'" class="space-y-6">
        <!-- Buy Settings -->
        <div>
          <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
            {{ t('autoTrading.buySettings') }}
          </h3>
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
        </div>

        <!-- Sell Settings -->
        <div>
          <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
            {{ t('autoTrading.sellSettings') }}
          </h3>
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
        </div>

        <!-- Risk Model -->
        <div>
          <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
            {{ t('autoTrading.riskModel') }}
          </h3>
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
        </div>
      </div>

      <!-- Transaction History -->
      <div v-else>
        <TransactionHistory />
      </div>
    </div>
  </div>
</template></content></file>

<boltAction type="start">
<command>npm run dev</command>