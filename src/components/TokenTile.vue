<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowTrendingUpIcon } from '@heroicons/vue/24/solid'

const router = useRouter()

const props = defineProps<{
  token: {
    pair: string
    profit: number
    timeframe: string
    price: number
    volume: string
    marketCap: string
    size: 'large' | 'medium' | 'small'
  }
  loading?: boolean
}>()

const gradientClass = computed(() => {
  const profitLevel = props.token.profit
  if (profitLevel >= 300) return 'from-purple-500 to-pink-500'
  if (profitLevel >= 200) return 'from-blue-500 to-purple-500'
  return 'from-green-500 to-blue-500'
})

const formatProfit = (profit: number): string => {
  return `${profit}%`
}

const isMobileSize = computed(() => {
  return props.token.size === 'small' || window.innerWidth < 640
})

const showDetails = () => {
  const signal = {
    pair: props.token.pair,
    price: props.token.price,
    address: `0x${Math.random().toString(16).slice(2)}268357A8c2552623316e2562D90e642bB538E5`,
    fdv: props.token.marketCap,
    liquidity: (parseFloat(props.token.marketCap) * 0.2).toFixed(1) + 'M',
    volume: props.token.volume,
    age: '24h',
    ath: props.token.marketCap,
    athTime: '24h ago',
    hourChange: props.token.profit.toString(),
    hourVolume: props.token.volume,
    buyers: Math.floor(Math.random() * 2000),
    sellers: Math.floor(Math.random() * 1000),
    topHolders: [
      { value: 3.3, address: 'J3xbS5tgkCdppZ7uHuf1HdeqdWtm8WCdjDbE5meqhnCt' },
      { value: 2.6, address: 'GWzHD3cT13moqukUPWYZyVSySaSNysC7zkbprZ97HQHf' },
      { value: 2.5, address: '9vfpztyx6EgGPR5DkN3etAKBz9zP355VPCduCzKqV6kv' }
    ]
  }

  router.push({
    path: `/token/${signal.address}`,
    query: {
      signal: JSON.stringify(signal)
    }
  })
}
</script>

<template>
  <div 
    class="group relative overflow-hidden rounded-2xl transition-transform hover:-translate-y-1 hover:shadow-lg cursor-pointer"
    :class="[
      loading ? 'animate-pulse bg-gray-200 dark:bg-gray-700' : `bg-gradient-to-br ${gradientClass}`,
      token.size === 'small' ? 'aspect-square' : ''
    ]"
    @click="!loading && showDetails()"
  >
    <template v-if="!loading">
      <div class="absolute inset-0 bg-black/10"></div>
      
      <!-- Content -->
      <div class="relative h-full p-4 flex flex-col">
        <!-- Header -->
        <div class="flex items-start justify-between mb-2 flex-wrap gap-2">
          <h3 class="text-base sm:text-lg font-bold text-white break-all">
            {{ token.pair }}
          </h3>
          <div class="flex items-center bg-white/20 rounded-full px-2 py-1 whitespace-nowrap">
            <ArrowTrendingUpIcon class="w-3 h-3 sm:w-4 sm:h-4 text-white mr-1" />
            <span class="text-xs sm:text-sm font-medium text-white">
              {{ formatProfit(token.profit) }}
            </span>
          </div>
        </div>

        <!-- Price -->
        <div class="mb-auto">
          <p class="text-xs sm:text-sm text-white/80">Price</p>
          <p class="text-base sm:text-lg font-bold text-white">${{ token.price }}</p>
        </div>

        <!-- Footer Stats -->
        <div class="mt-4 grid grid-cols-2 gap-2 sm:gap-4">
          <div>
            <p class="text-xs sm:text-sm text-white/80">Volume</p>
            <p class="text-xs sm:text-base font-medium text-white">${{ token.volume }}</p>
          </div>
          <div>
            <p class="text-xs sm:text-sm text-white/80">Market Cap</p>
            <p class="text-xs sm:text-base font-medium text-white">${{ token.marketCap }}</p>
          </div>
        </div>
      </div>

      <!-- Hover Overlay -->
      <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
        <button class="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg backdrop-blur-sm transition-colors text-sm sm:text-base">
          View Details
        </button>
      </div>
    </template>

    <template v-else>
      <div class="relative h-full p-4 flex flex-col">
        <div class="flex items-start justify-between mb-2">
          <div class="h-6 w-24 bg-gray-300 dark:bg-gray-600 rounded"></div>
          <div class="h-6 w-16 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
        </div>
        
        <div class="mb-auto">
          <div class="h-4 w-12 bg-gray-300 dark:bg-gray-600 rounded mb-1"></div>
          <div class="h-6 w-20 bg-gray-300 dark:bg-gray-600 rounded"></div>
        </div>
        
        <div class="mt-4 grid grid-cols-2 gap-4">
          <div>
            <div class="h-4 w-16 bg-gray-300 dark:bg-gray-600 rounded mb-1"></div>
            <div class="h-5 w-14 bg-gray-300 dark:bg-gray-600 rounded"></div>
          </div>
          <div>
            <div class="h-4 w-16 bg-gray-300 dark:bg-gray-600 rounded mb-1"></div>
            <div class="h-5 w-14 bg-gray-300 dark:bg-gray-600 rounded"></div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: .7;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>