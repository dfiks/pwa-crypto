<script setup>
import { ref } from 'vue'
import SignalPlate from './SignalPlate.vue'
import BottomSheet from './BottomSheet.vue'
import DotsLoader from './DotsLoader.vue'

const isOpen = ref(false)
const isLoading = ref(false)
const hasMore = ref(true)
const itemsPerPage = 10

const allSignals = Array.from({ length: 50 }, (_, i) => ({
  pair: `SOL/TOKEN${i + 1}`,
  price: Math.random() * 0.001,
  address: `0x${Math.random().toString(16).slice(2)}268357A8c2552623316e2562D90e642bB538E5`,
  fdv: `${Math.floor(Math.random() * 500)}K`,
  liquidity: `${Math.floor(Math.random() * 100)}K`,
  volume: `${Math.floor(Math.random() * 2000)}K`,
  age: `${Math.floor(Math.random() * 24)}h`,
  ath: `${Math.floor(Math.random() * 600)}K`,
  athTime: `${Math.floor(Math.random() * 12)}h ago`,
  hourChange: `${Math.floor(Math.random() * 2000)}`,
  hourVolume: `${Math.floor(Math.random() * 1000)}K`,
  buyers: Math.floor(Math.random() * 2000),
  sellers: Math.floor(Math.random() * 1000),
  topHolders: []
}))

const displayedSignals = ref(allSignals.slice(0, itemsPerPage))

const loadMore = async () => {
  if (isLoading.value || !hasMore.value) return
  
  isLoading.value = true
  
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const startIndex = displayedSignals.value.length
    const endIndex = startIndex + itemsPerPage
    const newSignals = allSignals.slice(startIndex, endIndex)
    
    if (newSignals.length > 0) {
      displayedSignals.value.push(...newSignals)
    }
    
    hasMore.value = endIndex < allSignals.length
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="px-4 mt-8">
    <button 
      @click="isOpen = true"
      class="w-full text-left"
    >
      <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
        Earlier Signals
        <span class="ml-2 text-sm text-gray-500 dark:text-gray-400">({{ displayedSignals.length }})</span>
      </h2>
      <SignalPlate 
        :signal="displayedSignals[0]"
        class="mb-2"
      />
      <div class="text-center text-sm text-gray-500 dark:text-gray-400 mt-2">
        Tap to view all signals
      </div>
    </button>

    <BottomSheet
      v-model:isOpen="isOpen"
      title="Earlier Signals"
      @scroll-end="loadMore"
    >
      <div class="space-y-4">
        <SignalPlate 
          v-for="signal in displayedSignals" 
          :key="signal.address" 
          :signal="signal" 
        />
        
        <div v-if="isLoading" class="py-4 flex justify-center">
          <DotsLoader color="var(--dots-color)" />
        </div>
        
        <div v-if="!hasMore && !isLoading" class="py-4 text-center text-gray-500 dark:text-gray-400 text-sm">
          No more signals to load
        </div>
      </div>
    </BottomSheet>
  </div>
</template>

<style>
:root {
  --dots-color: #4158D0;
}

:root.dark {
  --dots-color: #646cff;
}
</style>