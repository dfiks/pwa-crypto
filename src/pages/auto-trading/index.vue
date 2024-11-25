<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from '@/i18n'
import { 
  Cog6ToothIcon,
  ClockIcon
} from '@heroicons/vue/24/outline'
import PageHeader from '@/components/PageHeader.vue'
import DebugPanel from '@/components/Debug/DebugPanel.vue'
import PresetModal from '@/components/AutoTrading/PresetModal.vue'
import WalletSettingsModal from '@/components/AutoTrading/WalletSettingsModal.vue'
import RaydiumWallet from '@/components/AutoTrading/RaydiumWallet.vue'
import TradingTabs from '@/components/AutoTrading/TradingTabs.vue'
import ApiKeyOverlay from '@/components/AutoTrading/ApiKeyOverlay.vue'
import SettingsContent from '@/components/AutoTrading/SettingsContent.vue'
import TransactionHistory from '@/components/AutoTrading/TransactionHistory.vue'
import ChangesBar from '@/components/AutoTrading/ChangesBar.vue'

const { t } = useI18n()
const activeTab = ref('settings')
const showPresetModal = ref(false)
const showWalletSettings = ref(false)
const hasUnsavedChanges = ref(false)
const currentSettings = ref({})
const initialSettings = ref({})

const settingsContentRef = ref()

// Set default wallet data with High Balance preset
const walletData = ref({
  address: 'HN4Aw8pXqEv5Jd7qmkGrBZHn4y9LYGxqEFKBEWVp6H2U',
  balance: 50000,
  change24h: 45.7,
  change7d: 125.4,
  apiKey: 'test-api-key',
  autoTradingEnabled: false
})

const investmentPerToken = ref(1000)

const isApiKeySet = computed(() => !!walletData.value.apiKey)

const applyPreset = (settings: any) => {
  if (!settingsContentRef.value) return
  settingsContentRef.value.applyPreset(settings)
  showPresetModal.value = false
}

const updateApiKey = (apiKey: string) => {
  walletData.value.apiKey = apiKey
  showWalletSettings.value = false
}

const handleSettingsChange = (hasChanges: boolean, current: any, initial: any) => {
  hasUnsavedChanges.value = hasChanges
  currentSettings.value = current || {}
  initialSettings.value = initial || {}
}

const saveChanges = () => {
  settingsContentRef.value?.saveChanges()
  hasUnsavedChanges.value = false
}

const discardChanges = () => {
  settingsContentRef.value?.discardChanges()
  hasUnsavedChanges.value = false
}

const toggleAutoTrading = (enabled: boolean) => {
  walletData.value.autoTradingEnabled = enabled
}

// Apply High Balance preset on mount
onMounted(() => {
  const highBalancePreset = {
    buy: {
      minWallets: 5,
      minFDV: 100000,
      minPurchaseAmount: 1000,
      minLiquidity: 50000,
      maxTopHolders: 10,
      maxTopHoldersPercentage: 50
    },
    sell: {
      targetMultiplier: 2,
      strategies: [{
        id: 1,
        retainPercentage: 50,
        holdingPeriod: 24,
        stopLoss: 20,
        nextMultiplier: 3,
        nextTargetType: 'current'
      }]
    },
    risk: {
      investmentPerToken: 1000
    }
  }

  // Set initial preset
  setTimeout(() => {
    if (settingsContentRef.value) {
      settingsContentRef.value.applyPreset(highBalancePreset)
      settingsContentRef.value.saveInitialValues()
    }
  }, 0)
})
</script>

<template>
  <div class="min-h-screen pb-32">
    <PageHeader 
      :title="t('autoTrading.title')" 
      :wallet-data="walletData"
      :investment-per-token="investmentPerToken"
    />

    <div class="container mx-auto max-w-2xl px-4">
      <div class="relative space-y-6">
        <!-- Raydium Wallet -->
        <div class="relative">
          <RaydiumWallet 
            :data="walletData"
            @settings="showWalletSettings = true"
            @update:auto-trading-enabled="toggleAutoTrading"
          />
          <ApiKeyOverlay 
            v-if="!isApiKeySet"
            @configure="showWalletSettings = true"
          />
        </div>

        <!-- Trading Content -->
        <div class="relative">
          <div class="space-y-6">
            <!-- Tabs -->
            <TradingTabs
              v-model:activeTab="activeTab"
              @openPresets="showPresetModal = true"
            />

            <!-- Settings Content -->
            <div v-if="activeTab === 'settings'">
              <SettingsContent 
                ref="settingsContentRef"
                @change="handleSettingsChange"
              />
            </div>

            <!-- Transaction History -->
            <div v-else>
              <TransactionHistory />
            </div>
          </div>

          <!-- API Key Required Overlay -->
          <ApiKeyOverlay 
            v-if="!isApiKeySet"
            @configure="showWalletSettings = true"
          />
        </div>
      </div>
    </div>

    <!-- Preset Modal -->
    <PresetModal 
      :is-open="showPresetModal"
      @close="showPresetModal = false"
      @select="applyPreset"
    />

    <!-- Wallet Settings Modal -->
    <WalletSettingsModal
      :is-open="showWalletSettings"
      :current-api-key="walletData.apiKey"
      @close="showWalletSettings = false"
      @update="updateApiKey"
    />

    <!-- Changes Bar -->
    <ChangesBar
      :show="hasUnsavedChanges"
      :changes="currentSettings"
      :initial-values="initialSettings"
      @save="saveChanges"
      @discard="discardChanges"
    />

    <!-- Debug Panel -->
    <DebugPanel
      v-model:wallet-data="walletData"
    />
  </div>
</template>