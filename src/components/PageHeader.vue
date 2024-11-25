<script setup lang="ts">
import { ref, computed } from 'vue'
import { ClockIcon, LanguageIcon } from '@heroicons/vue/24/solid'
import ThemeToggle from './ThemeToggle.vue'
import TimeframeSelect from './TimeframeSelect.vue'
import LanguageSelect from './LanguageSelect.vue'
import Alert from './common/Alert.vue'
import { useI18n } from '../i18n'

const props = defineProps<{
  title: string
  showTimeframe?: boolean
  walletData?: {
    balance: number
    apiKey: string
  }
  investmentPerToken?: number
}>()

const { locale, setLocale } = useI18n()
const selectedPeriod = ref('24h')
const showTimeframeSelect = ref(false)
const showLanguageSelect = ref(false)

const timeframes = [
  { value: '1h', label: 'Last Hour' },
  { value: '3h', label: 'Last 3 Hours' },
  { value: '6h', label: 'Last 6 Hours' },
  { value: '12h', label: 'Last 12 Hours' },
  { value: '24h', label: 'Last 24 Hours' },
  { value: '7d', label: 'Last 7 Days' },
  { value: '30d', label: 'Last 30 Days' }
]

const languages = [
  { value: 'en', label: 'English' },
  { value: 'ru', label: 'Русский' }
]

const handlePeriodChange = (period: string) => {
  selectedPeriod.value = period
  showTimeframeSelect.value = false
}

const handleLanguageChange = (lang: string) => {
  setLocale(lang)
  showLanguageSelect.value = false
}

const getTimeframeLabel = () => {
  const timeframe = timeframes.find(t => t.value === selectedPeriod.value)
  return timeframe?.label || ''
}

const alertState = computed(() => {
  if (!props.walletData?.apiKey || !props.investmentPerToken) return null

  const possibleTrades = props.walletData.balance / props.investmentPerToken
  
  if (possibleTrades < 1) {
    return {
      type: 'error' as const,
      message: 'Auto Trading Will Stop',
      description: 'Insufficient balance to continue auto trading. Please add funds to your wallet.'
    }
  } else if (possibleTrades <= 5) {
    return {
      type: 'warning' as const,
      message: 'Low Balance Warning',
      description: `Balance only allows for ${Math.floor(possibleTrades)} more trades. Consider adding funds to maintain trading capacity.`
    }
  }

  return null
})
</script>

<template>
  <div class="p-4 mb-6 space-y-4">
    <!-- Title row with language and theme -->
    <div class="flex justify-between items-center">
      <span class="font-medium text-xl text-gray-900 dark:text-gray-100">{{ title }}</span>
      <div class="flex items-center gap-3">
        <button 
          @click="showLanguageSelect = true"
          class="flex items-center gap-2 bg-white dark:bg-gray-800 rounded-full px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors shadow-sm"
        >
          <LanguageIcon class="w-4 h-4 flex-shrink-0" />
          <span class="truncate">{{ languages.find(l => l.value === locale)?.label }}</span>
        </button>
        <ThemeToggle />
      </div>
    </div>

    <!-- Alert -->
    <Alert
      v-if="alertState && walletData?.apiKey"
      :type="alertState.type"
      :message="alertState.message"
      :description="alertState.description"
    />

    <!-- Timeframe row -->
    <div v-if="showTimeframe" class="flex justify-end">
      <button 
        @click="showTimeframeSelect = true"
        class="flex items-center gap-2 bg-white dark:bg-gray-800 rounded-full px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors shadow-sm"
      >
        <ClockIcon class="w-4 h-4 flex-shrink-0" />
        <span class="whitespace-nowrap">{{ getTimeframeLabel() }}</span>
      </button>
    </div>

    <TimeframeSelect
      v-if="showTimeframe"
      :is-open="showTimeframeSelect"
      @update:is-open="showTimeframeSelect = $event"
      :selected="selectedPeriod"
      :options="timeframes"
      @select="handlePeriodChange"
    />

    <LanguageSelect
      :is-open="showLanguageSelect"
      @update:is-open="showLanguageSelect = $event"
      :selected="locale"
      :options="languages"
      @select="handleLanguageChange"
    />
  </div>
</template>