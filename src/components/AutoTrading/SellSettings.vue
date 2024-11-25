<script setup lang="ts">
import { ref, watch, defineExpose } from 'vue'
import { 
  ArrowTrendingUpIcon, 
  ArrowTrendingDownIcon,
  ClockIcon,
  ScaleIcon,
  PlusCircleIcon,
  TrashIcon,
  CurrencyDollarIcon,
  ArrowPathIcon
} from '@heroicons/vue/24/solid'
import AutoTradingCard from './AutoTradingCard.vue'
import GroupInput from '../common/GroupInput.vue'
import { useI18n } from '@/i18n'

const { t } = useI18n()

interface Strategy {
  id: number
  retainPercentage: number
  holdingPeriod: number
  stopLoss: number
  nextMultiplier: number
  nextTargetType: 'initial' | 'current'
  showError?: boolean
}

const targetMultiplier = ref(2)
const strategies = ref<Strategy[]>([{
  id: 1,
  retainPercentage: 50,
  holdingPeriod: 24,
  stopLoss: 20,
  nextMultiplier: 3,
  nextTargetType: 'current' // По умолчанию Current Price для первой стратегии
}])

const emit = defineEmits(['change'])

const nextTargetOptions = [
  { 
    value: 'current', 
    label: 'Current Price',
    description: 'Calculate next target based on current token price',
    icon: CurrencyDollarIcon
  },
  { 
    value: 'initial', 
    label: 'Initial Price',
    description: 'Calculate next target based on initial entry price',
    icon: ArrowPathIcon
  }
]

const addStrategy = () => {
  const lastStrategy = strategies.value[strategies.value.length - 1]
  strategies.value.push({
    id: Date.now(),
    retainPercentage: 50,
    holdingPeriod: 24,
    stopLoss: 20,
    nextMultiplier: lastStrategy.nextMultiplier + 1,
    nextTargetType: 'current'
  })
  emit('change')
}

const removeStrategy = (id: number) => {
  strategies.value = strategies.value.filter(strategy => strategy.id !== id)
  emit('change')
}

const validateAndUpdateNextMultiplier = (strategy: Strategy, index: number) => {
  if (strategy.nextTargetType === 'initial' && index > 0) {
    const prevStrategy = strategies.value[index - 1]
    const minValue = prevStrategy.nextMultiplier + 1

    if (strategy.nextMultiplier <= prevStrategy.nextMultiplier) {
      strategy.nextMultiplier = minValue
      strategy.showError = true
    } else {
      strategy.showError = false
    }
  } else {
    strategy.showError = false
  }
}

const updateNextTargetType = (strategy: Strategy, type: 'initial' | 'current') => {
  strategy.nextTargetType = type
  const index = strategies.value.findIndex(s => s.id === strategy.id)
  
  if (type === 'initial' && index > 0) {
    const prevStrategy = strategies.value[index - 1]
    if (strategy.nextMultiplier <= prevStrategy.nextMultiplier) {
      strategy.nextMultiplier = prevStrategy.nextMultiplier + 1
    }
  }
  
  validateAndUpdateNextMultiplier(strategy, index)
  emit('change')
}

const updateNextMultiplier = (strategy: Strategy, value: number) => {
  strategy.nextMultiplier = value
  const index = strategies.value.findIndex(s => s.id === strategy.id)
  validateAndUpdateNextMultiplier(strategy, index)
  emit('change')
}

watch([targetMultiplier, strategies], () => {
  emit('change')
}, { deep: true })

defineExpose({
  targetMultiplier,
  strategies
})
</script>

<template>
  <div class="space-y-6">
    <!-- Target Multiplier -->
    <div class="col-span-full">
      <AutoTradingCard
        v-model="targetMultiplier"
        :title="t('autoTrading.targetMultiplier.title')"
        subtitle="Initial target multiplier for triggering first strategy"
        suffix="x"
        :min="1"
        :step="0.1"
        :icon="ArrowTrendingUpIcon"
        :tooltip="t('autoTrading.targetMultiplier.tooltip')"
      />
    </div>

    <!-- Strategies Section -->
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">
          Selling Strategies
        </h3>
        <button 
          @click="addStrategy"
          class="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
        >
          <PlusCircleIcon class="w-4 h-4 sm:w-5 sm:h-5" />
          <span class="hidden sm:inline">Add Strategy</span>
          <span class="sm:hidden">Add</span>
        </button>
      </div>

      <!-- Strategy Items -->
      <div class="space-y-4">
        <div v-for="(strategy, index) in strategies" 
             :key="strategy.id"
             class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm"
        >
          <div class="flex items-center justify-between mb-4">
            <h4 class="text-sm sm:text-base font-medium text-gray-900 dark:text-gray-100">
              Strategy {{ index + 1 }}
            </h4>
            <button 
              v-if="strategies.length > 1"
              @click="removeStrategy(strategy.id)"
              class="p-1.5 sm:p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
            >
              <TrashIcon class="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <AutoTradingCard
              v-model="strategy.retainPercentage"
              title="Retain Percentage"
              subtitle="Percentage of profits to retain after target"
              suffix="%"
              :min="0"
              :max="100"
              :step="1"
              :icon="ScaleIcon"
              tooltip="Percentage of profits to keep in position after reaching target multiplier"
            />

            <AutoTradingCard
              v-model="strategy.holdingPeriod"
              title="Holding Period"
              subtitle="Time to hold remaining position"
              suffix="h"
              :min="1"
              :step="1"
              :icon="ClockIcon"
              tooltip="How long to hold the remaining position before next evaluation"
            />

            <div class="sm:col-span-2">
              <AutoTradingCard
                v-model="strategy.stopLoss"
                title="Stop Loss"
                subtitle="Stop loss for remaining position"
                suffix="%"
                :min="0"
                :max="100"
                :step="1"
                :icon="ArrowTrendingDownIcon"
                tooltip="Sell remaining position if it drops by this percentage"
              />
            </div>

            <!-- Next Target -->
            <div class="sm:col-span-2">
              <div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
                <div class="flex items-start gap-4 mb-4">
                  <div class="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <ArrowTrendingUpIcon class="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 class="text-base font-medium text-gray-900 dark:text-gray-100">Next Target</h3>
                    <p class="text-sm text-gray-500 dark:text-gray-400">Target multiplier for next phase</p>
                  </div>
                </div>

                <GroupInput
                  v-model="strategy.nextMultiplier"
                  v-model:selectedOption="strategy.nextTargetType"
                  :options="nextTargetOptions"
                  :min="strategy.nextTargetType === 'initial' && index > 0 ? strategies[index - 1].nextMultiplier + 1 : targetMultiplier"
                  :step="0.1"
                  suffix="x"
                  :show-select="true"
                  @update:modelValue="updateNextMultiplier(strategy, $event)"
                  @update:selectedOption="updateNextTargetType(strategy, $event)"
                />

                <!-- Error Message -->
                <p v-if="strategy.showError && strategy.nextTargetType === 'initial' && index > 0" 
                   class="mt-2 text-sm text-red-600 dark:text-red-400">
                  When using Initial Price, next target must be greater than previous strategy's target ({{ strategies[index - 1].nextMultiplier + 1 }}x)
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>