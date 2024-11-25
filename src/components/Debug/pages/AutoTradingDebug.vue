<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import DebugSection from '../DebugSection.vue'
import DebugPreset from '../DebugPreset.vue'

const props = defineProps<{
  walletData: {
    apiKey: string
    balance: number
    change24h: number
    change7d: number
    autoTradingEnabled: boolean
  }
}>()

const emit = defineEmits(['update:walletData'])
const localWalletData = ref({ ...props.walletData })
const activePreset = ref<string | null>(localStorage.getItem('debug_active_preset') || 'highBalance')

watch(() => props.walletData, (newValue) => {
  localWalletData.value = { ...newValue }
}, { deep: true })

const presetStates = {
  noApiKey: {
    title: 'No API Key',
    description: 'Simulates state when API key is not provided',
    affects: ['Wallet Card', 'API Key Modal'],
    values: {
      apiKey: '',
      balance: 0,
      change24h: 0,
      change7d: 0,
      autoTradingEnabled: false
    }
  },
  lowBalance: {
    title: 'Low Balance',
    description: 'Simulates low balance state with negative changes',
    affects: ['Wallet Card', 'Balance Display', 'Trading Limits'],
    values: {
      apiKey: 'test-api-key',
      balance: 50,
      change24h: -15.5,
      change7d: -25.8,
      autoTradingEnabled: false
    }
  },
  highBalance: {
    title: 'High Balance',
    description: 'Simulates high balance state with positive changes',
    affects: ['Wallet Card', 'Balance Display', 'Trading Capabilities'],
    values: {
      apiKey: 'test-api-key',
      balance: 50000,
      change24h: 45.7,
      change7d: 125.4,
      autoTradingEnabled: false
    }
  }
}

const updateWalletData = () => {
  emit('update:walletData', { ...localWalletData.value })
}

const resetWalletData = () => {
  activePreset.value = null
  localStorage.removeItem('debug_active_preset')
  localWalletData.value = {
    apiKey: '',
    balance: 1234.56,
    change24h: 5.67,
    change7d: 12.34,
    autoTradingEnabled: false
  }
  updateWalletData()
}

const applyPreset = (preset: keyof typeof presetStates) => {
  activePreset.value = preset
  localStorage.setItem('debug_active_preset', preset)
  localWalletData.value = { ...presetStates[preset].values }
  updateWalletData()
}

// Watch for manual changes to detect if we should clear the active preset
watch(localWalletData, (newValue) => {
  if (activePreset.value) {
    const activePresetValues = presetStates[activePreset.value].values
    const hasChanged = Object.keys(activePresetValues).some(key => {
      return newValue[key as keyof typeof newValue] !== activePresetValues[key as keyof typeof activePresetValues]
    })
    if (hasChanged) {
      activePreset.value = null
      localStorage.removeItem('debug_active_preset')
    }
  }
}, { deep: true })

// Initialize state from localStorage if exists
onMounted(() => {
  const savedPreset = localStorage.getItem('debug_active_preset') || 'highBalance'
  if (presetStates[savedPreset as keyof typeof presetStates]) {
    applyPreset(savedPreset as keyof typeof presetStates)
  }
})
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="bg-gray-800 dark:bg-gray-700 rounded-lg p-4">
      <h2 class="text-lg font-semibold text-white mb-2">Auto Trading Debug</h2>
      <p class="text-sm text-gray-300">
        Debug tools for auto trading functionality and wallet states
      </p>
    </div>

    <!-- Presets -->
    <DebugSection title="Presets">
      <div class="space-y-3">
        <div v-for="(state, preset) in presetStates" 
             :key="preset"
             class="relative bg-gray-800 dark:bg-gray-700 rounded-lg p-4 cursor-pointer transition-all duration-200"
             :class="[
               activePreset === preset 
                 ? 'ring-2 ring-blue-500 bg-gray-700 dark:bg-gray-600' 
                 : 'hover:bg-gray-700 dark:hover:bg-gray-600'
             ]"
             @click="applyPreset(preset)">
          <!-- Active Indicator -->
          <div v-if="activePreset === preset" 
               class="absolute -top-1.5 -right-1.5 w-4 h-4 bg-blue-500 rounded-full border-2 border-gray-900">
          </div>
          
          <h4 class="text-sm font-medium text-white mb-1">{{ state.title }}</h4>
          <p class="text-xs text-gray-300 mb-2">{{ state.description }}</p>
          <div class="flex flex-wrap gap-2">
            <span v-for="affect in state.affects" 
                  :key="affect"
                  class="px-2 py-1 text-xs rounded-full bg-gray-600 dark:bg-gray-500 text-gray-200">
              {{ affect }}
            </span>
          </div>
        </div>
      </div>
    </DebugSection>

    <!-- Manual Controls -->
    <DebugSection title="Manual Controls">
      <div class="space-y-4">
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

        <div class="space-y-2">
          <label class="flex items-center gap-2 text-sm text-gray-300">
            <input
              v-model="localWalletData.autoTradingEnabled"
              type="checkbox"
              class="rounded border-gray-700 text-blue-500 focus:ring-blue-500/20"
              @change="updateWalletData"
            />
            Auto Trading Enabled
          </label>
        </div>
      </div>
    </DebugSection>

    <!-- Reset Button -->
    <button
      @click="resetWalletData"
      class="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
    >
      Reset to Default
    </button>
  </div>
</template>