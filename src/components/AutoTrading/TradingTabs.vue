<script setup lang="ts">
import { Cog6ToothIcon } from '@heroicons/vue/24/outline'
import { useI18n } from '@/i18n'

const { t } = useI18n()

const props = defineProps<{
  activeTab: string
}>()

const emit = defineEmits(['update:activeTab', 'openPresets'])
</script>

<template>
  <div class="flex items-center justify-between">
    <div class="flex gap-2">
      <button 
        v-for="tab in ['settings', 'transactions']" 
        :key="tab"
        @click="emit('update:activeTab', tab)"
        class="px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base transition-colors"
        :class="[
          activeTab === tab 
            ? 'bg-blue-600 text-white' 
            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
        ]"
      >
        {{ t(`autoTrading.${tab}`) }}
      </button>
    </div>

    <button 
      v-if="activeTab === 'settings'"
      @click="emit('openPresets')"
      class="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 text-sm sm:text-base text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
    >
      <Cog6ToothIcon class="w-4 h-4 sm:w-5 sm:h-5" />
      <span class="hidden sm:inline">{{ t('autoTrading.presets') }}</span>
      <span class="sm:hidden">Presets</span>
    </button>
  </div>
</template>