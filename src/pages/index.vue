<script setup>
import { ref } from 'vue'
import SignalCarousel from '@/components/SignalCarousel.vue'
import OlderSignals from '@/components/OlderSignals.vue'
import PageHeader from '@/components/PageHeader.vue'

const quickTransfers = ref([
  { id: 1, name: 'BTC', avatar: '🔸' },
  { id: 2, name: 'ETH', avatar: '🔹' },
  { id: 3, name: 'USDT', avatar: '💵' },
  { id: 4, name: 'BNB', avatar: '🟡' },
])
</script>

<template>
  <div class="pb-24 bg-gray-50 dark:bg-gray-900 min-h-screen">
    <PageHeader title="My Wallet" />

    <div class="md:grid md:grid-cols-2 md:gap-6 md:px-4">
      <!-- Signal Carousel -->
      <div class="mb-6 md:mb-0">
        <SignalCarousel />
      </div>

      <!-- Older signals -->
      <div class="md:mt-8">
        <OlderSignals />
      </div>
    </div>
  </div>
</template>