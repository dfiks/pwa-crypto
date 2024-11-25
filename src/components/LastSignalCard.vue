<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import type { LastSignal } from '../types/signal'

const props = defineProps<{
  signal: LastSignal
}>()

const router = useRouter()
const cardRef = ref<HTMLElement | null>(null)
const maxTilt = 3

const handleOrientation = (event: DeviceOrientationEvent) => {
  if (!cardRef.value) return
  
  const gamma = event.gamma
  const beta = event.beta
  
  if (gamma === null || beta === null) return

  const x = Math.min(Math.max(gamma, -maxTilt), maxTilt) / maxTilt
  const y = (Math.min(Math.max(beta, -maxTilt), maxTilt) / maxTilt) * -1

  cardRef.value.style.transform = `
    perspective(1000px)
    rotateY(${x * 2}deg)
    rotateX(${y * 2}deg)
    scale3d(1, 1, 1)
  `
}

const showDetails = () => {
  router.push({
    path: `/token/${props.signal.address}`,
    query: {
      signal: JSON.stringify(props.signal)
    }
  })
}

const setupParallax = async () => {
  if (typeof DeviceOrientationEvent !== 'undefined' && 
      typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
    try {
      const permission = await (DeviceOrientationEvent as any).requestPermission()
      if (permission === 'granted') {
        window.addEventListener('deviceorientation', handleOrientation)
      }
    } catch (error) {
      console.error('Error requesting device orientation permission:', error)
    }
  } else {
    window.addEventListener('deviceorientation', handleOrientation)
  }
}

onMounted(() => {
  setupParallax()
})

onUnmounted(() => {
  window.removeEventListener('deviceorientation', handleOrientation)
})
</script>

<template>
  <div class="card-container">
    <div 
      ref="cardRef"
      class="signal-card rounded-2xl p-6 text-white"
    >
      <div class="grid grid-cols-2 gap-4">
        <!-- Header -->
        <div class="col-span-2 flex justify-between items-start mb-2">
          <h2 class="text-2xl font-bold">{{ signal.pair }}</h2>
          <div class="bg-white/20 px-3 py-1 rounded-full">
            <span class="text-sm">{{ signal.buyers }} buys</span>
          </div>
        </div>

        <!-- Price and FDV -->
        <div>
          <p class="text-sm opacity-80">Price USD</p>
          <p class="font-medium">${{ signal.price }}</p>
        </div>
        <div>
          <p class="text-sm opacity-80">FDV</p>
          <p class="font-medium">${{ signal.fdv }}</p>
        </div>

        <!-- Liquidity and Volume -->
        <div>
          <p class="text-sm opacity-80">Liquidity</p>
          <p class="font-medium">${{ signal.liquidity }}</p>
        </div>
        <div>
          <p class="text-sm opacity-80">Volume</p>
          <p class="font-medium">${{ signal.volume }}</p>
        </div>

        <!-- ATH -->
        <div>
          <p class="text-sm opacity-80">ATH</p>
          <p class="font-medium">${{ signal.ath }} <span class="text-xs">({{ signal.athTime }})</span></p>
        </div>
        <div>
          <p class="text-sm opacity-80">1H Change</p>
          <p class="font-medium">+{{ signal.hourChange }}%</p>
        </div>

        <!-- Buyers and Sellers -->
        <div>
          <p class="text-sm opacity-80">Buyers</p>
          <p class="font-medium">{{ signal.buyers }}</p>
        </div>
        <div>
          <p class="text-sm opacity-80">Sellers</p>
          <p class="font-medium">{{ signal.sellers }}</p>
        </div>

        <!-- Details Button -->
        <div class="col-span-2">
          <button 
            @click="showDetails"
            class="w-full bg-white/10 rounded-lg p-3 text-left hover:bg-white/20 transition-colors"
          >
            <p class="text-sm opacity-80">Подробнее о токене</p>
            <p class="font-medium">Просмотр графика и информации</p>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card-container {
  position: relative;
  overflow: hidden;
  border-radius: 1rem;
  transform-style: preserve-3d;
  perspective: 1000px;
}

.signal-card {
  background: linear-gradient(210deg, #4158D0 0%, #4158D0 26%, #C850C0 100%);
  transform-style: preserve-3d;
  will-change: transform;
  transition: transform 0.3s ease;
}

.signal-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: inherit;
  filter: blur(8px);
  opacity: 0.05;
  z-index: -1;
  border-radius: inherit;
  transform: translateZ(-1px);
}
</style>