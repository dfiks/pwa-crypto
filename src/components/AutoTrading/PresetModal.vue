<script setup lang="ts">
import { 
  BoltIcon, 
  ShieldCheckIcon, 
  ScaleIcon 
} from '@heroicons/vue/24/outline'
import Modal from '../common/Modal.vue'

const props = defineProps<{
  isOpen: boolean
  currentSettings?: Record<string, any>
}>()

const emit = defineEmits(['close', 'select'])

const presets = [
  {
    id: 'aggressive',
    name: 'Aggressive',
    description: 'High risk, high reward strategy for maximum potential returns',
    icon: BoltIcon,
    gradient: 'from-red-500 to-orange-500',
    settings: {
      buy: {
        minWallets: 3,
        minFDV: 50000,
        minPurchaseAmount: 500,
        minLiquidity: 25000,
        maxTopHolders: 15,
        maxTopHoldersPercentage: 60
      },
      sell: {
        targetMultiplier: 3,
        strategies: [{
          id: 1,
          retainPercentage: 30,
          holdingPeriod: 12,
          stopLoss: 30,
          nextMultiplier: 5,
          nextTargetType: 'current'
        }]
      },
      risk: {
        investmentPerToken: 2000
      }
    }
  },
  {
    id: 'balanced',
    name: 'Balanced',
    description: 'Moderate approach balancing risk and potential returns',
    icon: ScaleIcon,
    gradient: 'from-blue-500 to-purple-500',
    settings: {
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
  },
  {
    id: 'conservative',
    name: 'Conservative',
    description: 'Lower risk approach focusing on capital preservation',
    icon: ShieldCheckIcon,
    gradient: 'from-green-500 to-emerald-500',
    settings: {
      buy: {
        minWallets: 8,
        minFDV: 200000,
        minPurchaseAmount: 2000,
        minLiquidity: 100000,
        maxTopHolders: 8,
        maxTopHoldersPercentage: 40
      },
      sell: {
        targetMultiplier: 1.5,
        strategies: [{
          id: 1,
          retainPercentage: 70,
          holdingPeriod: 48,
          stopLoss: 15,
          nextMultiplier: 2,
          nextTargetType: 'current'
        }]
      },
      risk: {
        investmentPerToken: 500
      }
    }
  }
]

const selectPreset = (preset: any) => {
  emit('select', preset.settings)
  emit('close')
}
</script>

<template>
  <Modal :is-open="isOpen" title="Trading Strategy Presets" @close="emit('close')">
    <div class="grid gap-3 sm:gap-4">
      <div v-for="preset in presets" 
           :key="preset.id"
           class="relative group cursor-pointer"
           @click="selectPreset(preset)">
        <div class="absolute inset-0 rounded-xl bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300"
             :class="preset.gradient">
        </div>
        
        <div class="relative p-4 sm:p-6 rounded-xl bg-gradient-to-br group-hover:bg-none transition-colors duration-300"
             :class="[
               'border border-gray-200 dark:border-gray-700',
               preset.gradient
             ]">
          <div class="flex items-start gap-3 sm:gap-4">
            <div class="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/20 flex items-center justify-center">
              <component :is="preset.icon" class="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div>
              <h3 class="text-base sm:text-lg font-semibold text-white mb-1">
                {{ preset.name }}
              </h3>
              <p class="text-sm sm:text-base text-white/80">
                {{ preset.description }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Modal>
</template>