<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { 
  ArrowTrendingUpIcon,
  ChartBarIcon,
  SignalIcon
} from '@heroicons/vue/24/outline'

const containerRef = ref<HTMLElement | null>(null)
const mousePosition = ref({ x: 0, y: 0 })

const handleMouseMove = (event: MouseEvent) => {
  if (!containerRef.value) return
  
  const rect = containerRef.value.getBoundingClientRect()
  const x = (event.clientX - rect.left) / rect.width - 0.5
  const y = (event.clientY - rect.top) / rect.height - 0.5
  
  mousePosition.value = { x, y }
}

const totalProfit = ref(124500)
const activeSignals = ref(42)
const tradingVolume = ref('2.1M')

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value)
}

onMounted(() => {
  // Start animations
  const interval = setInterval(() => {
    totalProfit.value += Math.random() > 0.5 ? 100 : -100
    activeSignals.value += Math.random() > 0.5 ? 1 : -1
    const volume = parseFloat(tradingVolume.value) + (Math.random() > 0.5 ? 0.1 : -0.1)
    tradingVolume.value = volume.toFixed(1) + 'M'
  }, 2000)

  onUnmounted(() => {
    clearInterval(interval)
  })
})
</script>

<template>
  <div 
    ref="containerRef"
    class="hidden lg:block lg:w-[70%] bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 relative overflow-hidden"
    @mousemove="handleMouseMove"
  >
    <!-- Background Elements -->
    <div class="absolute inset-0 overflow-hidden">
      <!-- Gradient Orbs -->
      <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/30 to-purple-400/30 rounded-full filter blur-3xl animate-float-slow"></div>
      <div class="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-400/30 to-pink-400/30 rounded-full filter blur-3xl animate-float-normal"></div>
      
      <!-- Grid Pattern -->
      <div class="absolute inset-0" 
           style="background-image: radial-gradient(circle at 1px 1px, rgba(156, 163, 175, 0.1) 1px, transparent 0); background-size: 40px 40px;">
      </div>
    </div>

    <!-- Content Container -->
    <div class="absolute inset-0 flex items-center justify-center">
      <div class="relative w-[800px] h-[600px]">
        <!-- Total Profit Card -->
        <div class="absolute top-0 left-0 w-[300px] bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-2xl p-6 shadow-2xl animate-float-slow transform hover:scale-105 transition-transform duration-300"
             :style="{ transform: `translate(${mousePosition.x * 10}px, ${mousePosition.y * 10}px)` }">
          <div class="flex items-center gap-4 mb-4">
            <div class="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <ArrowTrendingUpIcon class="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">Total Profit</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">Last 30 days</p>
            </div>
          </div>
          <p class="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {{ formatCurrency(totalProfit) }}
          </p>
        </div>

        <!-- Active Signals Card -->
        <div class="absolute top-0 right-0 w-[300px] bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-2xl p-6 shadow-2xl animate-float-fast transform hover:scale-105 transition-transform duration-300"
             :style="{ transform: `translate(${mousePosition.x * -15}px, ${mousePosition.y * 15}px)` }">
          <div class="flex items-center gap-4 mb-4">
            <div class="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <SignalIcon class="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">Active Signals</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">Currently tracking</p>
            </div>
          </div>
          <p class="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {{ activeSignals }}
          </p>
        </div>

        <!-- Trading Volume Card -->
        <div class="absolute bottom-0 right-0 w-[300px] bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-2xl p-6 shadow-2xl animate-float-normal transform hover:scale-105 transition-transform duration-300"
             :style="{ transform: `translate(${mousePosition.x * -10}px, ${mousePosition.y * -10}px)` }">
          <div class="flex items-center gap-4 mb-4">
            <div class="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <ChartBarIcon class="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">Trading Volume</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">24h volume</p>
            </div>
          </div>
          <p class="text-2xl font-bold text-gray-900 dark:text-gray-100">
            ${{ tradingVolume }}
          </p>
        </div>

        <!-- Center Content -->
        <div class="absolute inset-0 flex items-center justify-center">
          <!-- Character Image -->
          <div class="relative">
            <img 
              src="/trading-illustration.svg" 
              alt="Trading Illustration"
              class="w-96 h-96 object-contain animate-float-normal"
              :style="{ transform: `translate(${mousePosition.x * -20}px, ${mousePosition.y * -20}px)` }"
            />
            
            <!-- Decorative Circles -->
            <div class="absolute -inset-4">
              <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-full animate-spin-slow"></div>
              <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-full animate-spin-slow-reverse"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes float-slow {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}

@keyframes float-normal {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-15px); }
}

@keyframes float-fast {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

@keyframes spin-slow {
  from { transform: translate(-50%, -50%) rotate(0deg); }
  to { transform: translate(-50%, -50%) rotate(360deg); }
}

@keyframes spin-slow-reverse {
  from { transform: translate(-50%, -50%) rotate(360deg); }
  to { transform: translate(-50%, -50%) rotate(0deg); }
}

.animate-float-slow {
  animation: float-slow 6s ease-in-out infinite;
}

.animate-float-normal {
  animation: float-normal 5s ease-in-out infinite;
}

.animate-float-fast {
  animation: float-fast 4s ease-in-out infinite;
}

.animate-spin-slow {
  animation: spin-slow 20s linear infinite;
}

.animate-spin-slow-reverse {
  animation: spin-slow-reverse 25s linear infinite;
}
</style>