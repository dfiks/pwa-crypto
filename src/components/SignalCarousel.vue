<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Pagination, EffectCreative } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/effect-creative'
import type { LastSignal } from '../types/signal'
import LastSignalCard from './LastSignalCard.vue'
import SignalCardSkeleton from './SignalCardSkeleton.vue'
import TokenDetails from './TokenDetails.vue'

const signals = ref<LastSignal[]>([])
const isLoading = ref(true)
const activeIndex = ref(0)
const selectedSignal = ref<LastSignal | null>(null)
const showDetails = ref(false)

const onShowDetails = (signal: LastSignal) => {
  selectedSignal.value = signal
  showDetails.value = true
}

onMounted(async () => {
  await new Promise(resolve => setTimeout(resolve, 1500))
  
  signals.value = [
    {
      pair: 'SOL/PEPA',
      price: 0.0003403,
      address: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
      fdv: '340K',
      liquidity: '81.6K',
      volume: '2M',
      age: '6h',
      ath: '476K',
      athTime: '17m ago',
      hourChange: '2K',
      hourVolume: '822K',
      buyers: 1500,
      sellers: 1000,
      topHolders: [
        { value: 3.3, address: 'J3xbS5tgkCdppZ7uHuf1HdeqdWtm8WCdjDbE5meqhnCt' },
        { value: 2.6, address: 'GWzHD3cT13moqukUPWYZyVSySaSNysC7zkbprZ97HQHf' },
        { value: 2.5, address: '9vfpztyx6EgGPR5DkN3etAKBz9zP355VPCduCzKqV6kv' }
      ]
    },
    {
      pair: 'SOL/BONK',
      price: 0.000012,
      address: '0x9d9f33471c10ef275c0b8939b943c25c48c8b6f4',
      fdv: '520K',
      liquidity: '156.3K',
      volume: '3.5M',
      age: '2h',
      ath: '680K',
      athTime: '45m ago',
      hourChange: '1.5K',
      hourVolume: '1.2M',
      buyers: 2200,
      sellers: 800,
      topHolders: [
        { value: 4.1, address: 'K4xbS5tgkCdppZ7uHuf1HdeqdWtm8WCdjDbE5meqhnCt' },
        { value: 3.2, address: 'HWzHD3cT13moqukUPWYZyVSySaSNysC7zkbprZ97HQHf' },
        { value: 2.8, address: '8vfpztyx6EgGPR5DkN3etAKBz9zP355VPCduCzKqV6kv' }
      ]
    },
    {
      pair: 'SOL/DOGE',
      price: 0.000789,
      address: '0x3f5CE5FBFe3E9af3971dD833D26bA9b5C936f0bE',
      fdv: '280K',
      liquidity: '95.2K',
      volume: '1.8M',
      age: '4h',
      ath: '390K',
      athTime: '2h ago',
      hourChange: '900',
      hourVolume: '650K',
      buyers: 1800,
      sellers: 600,
      topHolders: [
        { value: 3.8, address: 'L5xbS5tgkCdppZ7uHuf1HdeqdWtm8WCdjDbE5meqhnCt' },
        { value: 2.9, address: 'IWzHD3cT13moqukUPWYZyVSySaSNysC7zkbprZ97HQHf' },
        { value: 2.4, address: '7vfpztyx6EgGPR5DkN3etAKBz9zP355VPCduCzKqV6kv' }
      ]
    }
  ]
  
  isLoading.value = false
})

const onSlideChange = (swiper: any) => {
  activeIndex.value = swiper.realIndex
}
</script>

<template>
  <div class="signal-carousel relative">
    <!-- Custom Pagination -->
    <div class="custom-pagination mb-4 flex justify-center items-center gap-1.5">
      <div v-if="!isLoading" 
           v-for="(_, index) in signals" 
           :key="index"
           :class="[
             'pagination-dot',
             index === activeIndex ? 'active' : ''
           ]"
           :style="{
             transformOrigin: index <= activeIndex ? 'right center' : 'left center'
           }">
      </div>
      <div v-else 
           v-for="i in 3" 
           :key="i"
           class="pagination-dot">
      </div>
    </div>

    <div class="carousel-mask">
      <div class="carousel-container">
        <template v-if="!isLoading">
          <swiper
            :modules="[Pagination, EffectCreative]"
            :pagination="false"
            :effect="'creative'"
            :creativeEffect="{
              prev: {
                translate: ['-85%', 0, -500],
                scale: 0.85,
                opacity: 0.3
              },
              next: {
                translate: ['85%', 0, -500],
                scale: 0.85,
                opacity: 0.3
              },
            }"
            :speed="600"
            :loop="false"
            class="w-full"
            @slideChange="onSlideChange"
          >
            <swiper-slide v-for="signal in signals" :key="signal.address" class="py-2">
              <LastSignalCard 
                :signal="signal" 
                @show-details="onShowDetails(signal)"
              />
            </swiper-slide>
          </swiper>
        </template>
        
        <template v-else>
          <div class="py-2">
            <SignalCardSkeleton />
          </div>
        </template>
      </div>
    </div>

    <TokenDetails
      v-if="selectedSignal"
      :signal="selectedSignal"
      :is-open="showDetails"
      @update:is-open="showDetails = $event"
    />
  </div>
</template>

<style scoped>
.signal-carousel {
  width: 100%;
  margin: 1rem 0 3rem;
  overflow: visible;
}

.carousel-mask {
  position: relative;
  overflow: hidden;
  padding: 0 1rem;
}

.carousel-container {
  position: relative;
  width: 100%;
  overflow: visible;
}

:deep(.swiper) {
  overflow: visible;
  padding: 1rem 0;
}

:deep(.swiper-wrapper) {
  align-items: center;
}

:deep(.swiper-slide) {
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  transform-style: preserve-3d;
}

:deep(.swiper-slide-active) {
  z-index: 2;
}

.custom-pagination {
  position: absolute;
  top: -2rem;
  left: 0;
  right: 0;
  z-index: 20;
  pointer-events: none;
}

.pagination-dot {
  width: 0.375rem;
  height: 0.375rem;
  background: rgba(209, 213, 219, 0.5);
  border-radius: 9999px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.pagination-dot.active {
  width: 2rem;
  background: rgba(65, 88, 208, 0.8);
}
</style>