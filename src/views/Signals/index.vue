<script setup>
import { ref, computed, onMounted } from 'vue'
import { ArrowTrendingUpIcon } from '@heroicons/vue/24/solid'
import TokenTile from '@/components/TokenTile.vue'
import PageHeader from '@/components/PageHeader.vue'

const isLoading = ref(true)
const profitableTokens = ref([
  {
    id: 1,
    pair: 'SOL/PEPE',
    profit: 312,
    timeframe: '24h',
    price: 0.0003403,
    volume: '2.1M',
    marketCap: '4.2M',
    size: 'large'
  },
  {
    id: 2,
    pair: 'SOL/BONK',
    profit: 285,
    timeframe: '24h',
    price: 0.000012,
    volume: '1.8M',
    marketCap: '3.1M',
    size: 'medium'
  },
  {
    id: 3,
    pair: 'SOL/DOGE',
    profit: 245,
    timeframe: '24h',
    price: 0.000789,
    volume: '1.5M',
    marketCap: '2.8M',
    size: 'medium'
  },
  {
    id: 4,
    pair: 'ETH/SHIB',
    profit: 198,
    timeframe: '24h',
    price: 0.000023,
    volume: '1.2M',
    marketCap: '2.5M',
    size: 'small'
  },
  {
    id: 5,
    pair: 'BTC/WOJAK',
    profit: 178,
    timeframe: '24h',
    price: 0.000045,
    volume: '980K',
    marketCap: '1.9M',
    size: 'small'
  }
])

const sortedTokens = computed(() => {
  return [...profitableTokens.value].sort((a, b) => b.profit - a.profit)
})

onMounted(() => {
  setTimeout(() => {
    isLoading.value = false
  }, 1500)
})
</script>

<template>
  <div class="min-h-screen pb-24">
    <PageHeader title="Profitable Tokens" showTimeframe />

    <!-- Content -->
    <div class="p-4">
      <div class="profitable-grid">
        <div class="grid gap-4 grid-cols-2 md:grid-cols-3 auto-rows-auto">
          <TokenTile 
            v-for="token in sortedTokens" 
            :key="token.id"
            :token="token"
            :loading="isLoading"
            :class="[
              token.size === 'large' ? 'col-span-2 row-span-2' : 
              token.size === 'medium' ? 'col-span-1 row-span-2' : 
              'col-span-1 row-span-1'
            ]"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.profitable-grid {
  container-type: inline-size;
}

@container (min-width: 768px) {
  .profitable-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>