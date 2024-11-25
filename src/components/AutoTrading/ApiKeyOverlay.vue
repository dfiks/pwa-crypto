<script setup lang="ts">
import { KeyIcon } from '@heroicons/vue/24/outline'

const emit = defineEmits(['configure'])
</script>

<template>
  <div class="absolute inset-0 backdrop-blur-sm z-10 rounded-2xl flex items-center justify-center">
    <div class="text-center px-4">
      <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
        <KeyIcon class="w-8 h-8 text-blue-600 dark:text-blue-400" />
      </div>
      <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
        API Key Required
      </h3>
      <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Please configure your Raydium API key to enable auto trading features
      </p>
      <button 
        @click="emit('configure')"
        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Configure API Key
      </button>
    </div>
  </div>
</template>