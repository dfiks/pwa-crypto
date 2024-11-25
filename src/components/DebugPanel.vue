<script setup lang="ts">
import { ref, watch } from 'vue'
import { XMarkIcon, BeakerIcon } from '@heroicons/vue/24/outline'

const props = defineProps<{
  walletData: {
    apiKey: string
    balance: number
    change24h: number
    change7d: number
  }
}>()

const emit = defineEmits(['update:walletData'])
const isOpen = ref(false)
const isPanelVisible = ref(false)

const localWalletData = ref({ ...props.walletData })

watch(() => props.walletData, (newValue) => {
  localWalletData.value = { ...newValue }
}, { deep: true })

const togglePanel = () => {
  isPanelVisible.value = !isPanelVisible.value
}

const updateWalletData = () => {
  emit('update:walletData', { ...localWalletData.value })
}

const resetWalletData = () => {
  localWalletData.value = {
    apiKey: '',
    balance: 1234.56,
    change24h: 5.67,
    change7d: 12.34
  }
  updateWalletData()
}

const presetStates = {
  noApiKey: {
    apiKey: '',
    balance: 0,
    change24h: 0,
    change7d: 0
  },
  lowBalance: {
    apiKey: 'test-api-key',
    balance: 50,
    change24h: -15.5,
    change7d: -25.8
  },
  highBalance: {
    apiKey: 'test-api-key',
    balance: 50000,
    change24h: 45.7,
    change7d: 125.4
  }
}

const applyPreset = (preset: keyof typeof presetStates) => {
  localWalletData.value = { ...presetStates[preset] }
  updateWalletData()
}
</script>

<template>
  <div class="fixed right-0 top-1/2 -translate-y-1/2 z-50 flex items-start">
    <!-- Toggle Button -->
    <button
      @click="togglePanel"
      class="bg-gray-900 dark:bg-gray-800 text-white p-2 rounded-l-lg shadow-lg hover:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
      :class="{ 'rounded-lg': !isPanelVisible }"
    >
      <BeakerIcon class="w-5 h-5" />
    </button>

    <!-- Debug Panel -->
    <div
      class="bg-gray-900 dark:bg-gray-800 w-80 rounded-l-lg shadow-xl transition-transform duration-300 transform"
      :class="isPanelVisible ? 'translate-x-0' : 'translate-x-full'"
    >
      <div class="p-4">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-white">Debug Panel</h3>
          <button
            @click="togglePanel"
            class="text-gray-400 hover:text-white transition-colors"
          >
            <XMarkIcon class="w-5 h-5" />
          </button>
        </div>

        <!-- Presets -->
        <div class="space-y-2 mb-6">
          <h4 class="text-sm font-medium text-gray-400">Presets</h4>
          <div class="grid grid-cols-1 gap-2">
            <button
              v-for="(_, preset) in presetStates"
              :key="preset"
              @click="applyPreset(preset)"
              class="px-3 py-2 bg-gray-800 dark:bg-gray-700 text-white rounded-lg hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors text-sm text-left"
            >
              {{ preset.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()) }}
            </button>
          </div>
        </div>

        <!-- Manual Controls -->
        <div class="space-y-4">
          <h4 class="text-sm font-medium text-gray-400">Manual Controls</h4>
          
          <div class="space-y-2">
            <label class="block text-sm text-gray-300">API Key</label>
            <input
              v-model="localWalletData.apiKey"
              type="text"
              class="w-full px-3 py-2 bg-gray-800 dark:bg-gray-700 text-white rounded-lg border border-gray-700 focus:border-blue-500 focus:ring focus:ring-blue-500/20"
              @change="updateWalletData"
            />
          </div>

          <div class="space-y-2">
            <label class="block text-sm text-gray-300">Balance</label>
            <input
              v-model.number="localWalletData.balance"
              type="number"
              class="w-full px-3 py-2 bg-gray-800 dark:bg-gray-700 text-white rounded-lg border border-gray-700 focus:border-blue-500 focus:ring focus:ring-blue-500/20"
              @change="updateWalletData"
            />
          </div>

          <div class="space-y-2">
            <label class="block text-sm text-gray-300">24h Change (%)</label>
            <input
              v-model.number="localWalletData.change24h"
              type="number"
              class="w-full px-3 py-2 bg-gray-800 dark:bg-gray-700 text-white rounded-lg border border-gray-700 focus:border-blue-500 focus:ring focus:ring-blue-500/20"
              @change="updateWalletData"
            />
          </div>

          <div class="space-y-2">
            <label class="block text-sm text-gray-300">7d Change (%)</label>
            <input
              v-model.number="localWalletData.change7d"
              type="number"
              class="w-full px-3 py-2 bg-gray-800 dark:bg-gray-700 text-white rounded-lg border border-gray-700 focus:border-blue-500 focus:ring focus:ring-blue-500/20"
              @change="updateWalletData"
            />
          </div>
        </div>

        <!-- Reset Button -->
        <button
          @click="resetWalletData"
          class="w-full mt-6 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
        >
          Reset to Default
        </button>
      </div>
    </div>
  </div>
</template>