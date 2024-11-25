<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'

const props = defineProps<{
  loading?: boolean
  symbol: string
}>()

const chartContainer = ref<HTMLElement | null>(null)
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
  if (!chartContainer.value || props.loading) return
  
  try {
    await loadTradingViewScript()
    
    // @ts-ignore
    widget = new TradingView.widget({
      autosize: true,
      symbol: props.symbol.replace('/', ''),
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

watch(() => props.loading, (newValue) => {
  if (!newValue) {
    initChart()
  }
})

onMounted(() => {
  if (!props.loading) {
    initChart()
  }
})
</script>

<template>
  <div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg dark:shadow-gray-900/50">
    <div class="h-[300px] bg-gray-100 dark:bg-gray-900 rounded-lg overflow-hidden">
      <template v-if="!loading">
        <div 
          :id="`tv-chart-${symbol}`" 
          ref="chartContainer"
          class="w-full h-full">
        </div>
      </template>
      <div v-else class="w-full h-full skeleton-item"></div>
    </div>
  </div>
</template>

<style scoped>
.skeleton-item {
  position: relative;
  overflow: hidden;
  background: rgba(156, 163, 175, 0.1);
}

.skeleton-item::after {
  content: '';
  position: absolute;
  inset: 0;
  transform: translateX(-100%);
  background-image: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0,
    rgba(255, 255, 255, 0.1) 20%,
    rgba(255, 255, 255, 0.2) 60%,
    rgba(255, 255, 255, 0)
  );
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  100% {
    transform: translateX(100%);
  }
}

.dark .skeleton-item {
  background: rgba(31, 41, 55, 0.4);
}

.dark .skeleton-item::after {
  background-image: linear-gradient(
    90deg,
    rgba(31, 41, 55, 0) 0,
    rgba(31, 41, 55, 0.3) 20%,
    rgba(31, 41, 55, 0.5) 60%,
    rgba(31, 41, 55, 0)
  );
}
</style>