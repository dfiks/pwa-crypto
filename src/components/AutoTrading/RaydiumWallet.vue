<script setup lang="ts">
import { WalletIcon, ArrowTrendingUpIcon, Cog8ToothIcon } from '@heroicons/vue/24/outline'
import { Switch } from '@headlessui/vue'

const props = defineProps<{
  data: {
    address: string
    balance: number
    change24h: number
    change7d: number
    autoTradingEnabled?: boolean
  }
}>()

const emit = defineEmits(['settings', 'update:autoTradingEnabled'])

const truncateAddress = (address: string | undefined): string => {
  if (!address) return ''
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

const copyAddress = async () => {
  try {
    if (props.data.address) {
      await navigator.clipboard.writeText(props.data.address)
    }
  } catch (err) {
    console.error('Failed to copy address')
  }
}

const toggleAutoTrading = (enabled: boolean) => {
  emit('update:autoTradingEnabled', enabled)
}
</script>

<template>
  <div class="bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl p-4 sm:p-6 text-white shadow-lg">
    <div class="flex items-start justify-between mb-4 sm:mb-6">
      <!-- Wallet Info -->
      <div class="flex items-center gap-2 sm:gap-3">
        <div class="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/20 flex items-center justify-center">
          <WalletIcon class="w-4 h-4 sm:w-5 sm:h-5 text-white" />
        </div>
        <div>
          <h3 class="text-base sm:text-lg font-semibold mb-0.5 sm:mb-1">Raydium Wallet</h3>
          <button 
            @click="copyAddress"
            class="text-xs sm:text-sm px-2 py-1 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
          >
            {{ truncateAddress(data.address) }}
          </button>
        </div>
      </div>

      <!-- Settings Button -->
      <div class="flex items-center gap-3">
        <Switch
          :model-value="data.autoTradingEnabled"
          @update:model-value="toggleAutoTrading"
          class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200"
          :class="data.autoTradingEnabled ? 'bg-green-400' : 'bg-white/20'"
        >
          <span class="sr-only">Enable auto-trading</span>
          <span
            class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200"
            :class="data.autoTradingEnabled ? 'translate-x-6' : 'translate-x-1'"
          />
        </Switch>
        <button 
          @click="emit('settings')"
          class="p-1.5 sm:p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
        >
          <Cog8ToothIcon class="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>
    </div>

    <div class="grid grid-cols-3 gap-2 sm:gap-4">
      <div>
        <p class="text-xs sm:text-sm text-white/80 mb-0.5 sm:mb-1">Balance</p>
        <p class="text-sm sm:text-xl font-bold">${{ data.balance.toLocaleString() }}</p>
      </div>
      <div>
        <p class="text-xs sm:text-sm text-white/80 mb-0.5 sm:mb-1">24h Change</p>
        <p class="text-sm sm:text-xl font-bold flex items-center gap-0.5 sm:gap-1">
          <ArrowTrendingUpIcon class="w-3 h-3 sm:w-5 sm:h-5" />
          {{ data.change24h }}%
        </p>
      </div>
      <div>
        <p class="text-xs sm:text-sm text-white/80 mb-0.5 sm:mb-1">7d Change</p>
        <p class="text-sm sm:text-xl font-bold flex items-center gap-0.5 sm:gap-1">
          <ArrowTrendingUpIcon class="w-3 h-3 sm:w-5 sm:h-5" />
          {{ data.change7d }}%
        </p>
      </div>
    </div>

    <!-- Auto-Trading Status -->
    <div class="mt-4 pt-4 border-t border-white/10">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <div class="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center">
            <ArrowTrendingUpIcon class="w-3 h-3" />
          </div>
          <span class="text-sm">Auto-Trading</span>
        </div>
        <span class="text-sm" :class="data.autoTradingEnabled ? 'text-green-300' : 'text-white/60'">
          {{ data.autoTradingEnabled ? 'Enabled' : 'Disabled' }}
        </span>
      </div>
    </div>
  </div>
</template>