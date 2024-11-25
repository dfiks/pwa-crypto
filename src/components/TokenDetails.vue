<script setup lang="ts">
import { ref, onMounted, nextTick, watch } from 'vue'
import type { LastSignal } from '../types/signal'
import BottomSheet from './BottomSheet.vue'
import { toast } from 'vue3-toastify'

const props = defineProps<{
  signal: LastSignal
  isOpen: boolean
}>()

const emit = defineEmits(['update:isOpen'])
const chartContainer = ref<HTMLElement | null>(null)
let tvScriptLoadingPromise: Promise<void>
let widget: any = null

const loadTradingViewScript = (): Promise<void> => {
  return new Promise((resolve) => {
    if (document.getElementById('tradingview-widget')) {
      resolve()
      return
    }
    const script = document.createElement('script')
    script.id = 'tradingview-widget'
    script.src = 'https://s3.tradingview.com/tv.js'
    script.type = 'text/javascript'
    script.onload = () => resolve()
    document.head.appendChild(script)
  })
}

const initChart = async () => {
  if (!chartContainer.value) return
  
  try {
    await loadTradingViewScript()
    await nextTick()
    
    if (widget) {
      widget.remove()
      widget = null
    }

    // @ts-ignore
    widget = new TradingView.widget({
      autosize: true,
      symbol: props.signal.pair.replace('/', ''),
      interval: "D",
      timezone: "Etc/UTC",
      theme: "dark",
      style: "1",
      locale: "en",
      toolbar_bg: "#f1f3f6",
      enable_publishing: false,
      hide_top_toolbar: true,
      save_image: false,
      container_id: chartContainer.value.id
    })
  } catch (error) {
    console.error('Failed to initialize TradingView widget:', error)
  }
}

watch(() => props.isOpen, async (newValue) => {
  if (newValue) {
    await nextTick()
    initChart()
  } else if (widget) {
    widget.remove()
    widget = null
  }
})

const copyAddress = async (address: string) => {
  try {
    await navigator.clipboard.writeText(address)
    toast.success('Address copied to clipboard!')
  } catch (err) {
    toast.error('Failed to copy address')
  }
}

const truncateAddress = (address: string): string => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}
</script>

<template>
  <BottomSheet
    :is-open="isOpen"
    :title="signal.pair"
    @update:is-open="emit('update:isOpen', $event)"
  >
    <div class="space-y-6">
      <!-- Chart -->
      <div class="h-[300px] bg-gray-100 dark:bg-gray-900 rounded-xl overflow-hidden">
        <div 
          :id="`tv-chart-${signal.address}`" 
          ref="chartContainer"
          class="w-full h-full">
        </div>
      </div>

      <!-- Key Metrics -->
      <div class="grid grid-cols-2 gap-4">
        <div class="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-3">
          <p class="text-sm text-gray-500 dark:text-gray-400">Price USD</p>
          <p class="font-medium text-gray-900 dark:text-gray-100">${{ signal.price }}</p>
        </div>
        <div class="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-3">
          <p class="text-sm text-gray-500 dark:text-gray-400">FDV</p>
          <p class="font-medium text-gray-900 dark:text-gray-100">${{ signal.fdv }}</p>
        </div>
        <div class="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-3">
          <p class="text-sm text-gray-500 dark:text-gray-400">Liquidity</p>
          <p class="font-medium text-gray-900 dark:text-gray-100">${{ signal.liquidity }}</p>
        </div>
        <div class="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-3">
          <p class="text-sm text-gray-500 dark:text-gray-400">Volume</p>
          <p class="font-medium text-gray-900 dark:text-gray-100">${{ signal.volume }}</p>
        </div>
      </div>

      <!-- Trading Activity -->
      <div class="space-y-3">
        <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">Trading Activity</h3>
        <div class="grid grid-cols-2 gap-4">
          <div class="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-3">
            <p class="text-sm text-gray-500 dark:text-gray-400">Buyers</p>
            <p class="font-medium text-green-600 dark:text-green-400">{{ signal.buyers }}</p>
          </div>
          <div class="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-3">
            <p class="text-sm text-gray-500 dark:text-gray-400">Sellers</p>
            <p class="font-medium text-red-600 dark:text-red-400">{{ signal.sellers }}</p>
          </div>
          <div class="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-3">
            <p class="text-sm text-gray-500 dark:text-gray-400">1H Change</p>
            <p class="font-medium text-green-600 dark:text-green-400">+{{ signal.hourChange }}%</p>
          </div>
          <div class="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-3">
            <p class="text-sm text-gray-500 dark:text-gray-400">1H Volume</p>
            <p class="font-medium text-gray-900 dark:text-gray-100">${{ signal.hourVolume }}</p>
          </div>
        </div>
      </div>

      <!-- Contract Info -->
      <div class="space-y-3">
        <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">Contract Information</h3>
        <button 
          @click="copyAddress(signal.address)"
          class="w-full bg-gray-50 dark:bg-gray-900/50 rounded-lg p-3 text-left hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
        >
          <p class="text-sm text-gray-500 dark:text-gray-400">Contract Address</p>
          <p class="font-medium text-gray-900 dark:text-gray-100">{{ truncateAddress(signal.address) }}</p>
        </button>
      </div>

      <!-- Top Holders -->
      <div class="space-y-3">
        <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">Top Holders</h3>
        <div class="space-y-2">
          <div v-for="holder in signal.topHolders" 
               :key="holder.address"
               class="flex justify-between items-center bg-gray-50 dark:bg-gray-900/50 rounded-lg p-3">
            <span class="font-medium text-gray-900 dark:text-gray-100">{{ holder.value }}%</span>
            <span class="text-sm text-gray-500 dark:text-gray-400">{{ truncateAddress(holder.address) }}</span>
          </div>
        </div>
      </div>
    </div>
  </BottomSheet>
</template>