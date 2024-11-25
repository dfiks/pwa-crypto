<script setup lang="ts">
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
</template>